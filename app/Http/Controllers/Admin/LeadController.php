<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Stripe\Checkout\Session as StripeSession;
use Stripe\StripeClient;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%$search%")
                  ->orWhere('city', 'like', "%$search%")
                  ->orWhere('trade_type', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($trade = $request->query('trade')) {
            $query->where('trade_type', 'like', "%$trade%");
        }

        $sortable  = ['business_name', 'trade_type', 'category', 'city', 'state', 'status', 'demo_views', 'tier', 'created_at'];
        $sort      = in_array($request->query('sort'), $sortable) ? $request->query('sort') : 'created_at';
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $leads = $query->orderBy($sort, $direction)->paginate(50)->withQueryString();

        return Inertia::render('System/Leads/Index', [
            'leads'   => $leads,
            'filters' => $request->only(['search', 'category', 'status', 'trade', 'sort', 'direction']),
        ]);
    }

    public function show(Lead $lead)
    {
        $lead->load('activityLogs');

        return Inertia::render('System/Leads/Show', [
            'lead' => array_merge($lead->toArray(), [
                'activity_logs' => $lead->activityLogs->sortByDesc('created_at')->values()->map(fn($log) => [
                    'id'         => $log->id,
                    'action'     => $log->action,
                    'details'    => $log->details,
                    'created_at' => $log->created_at->format('M j, Y g:i a'),
                ]),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'business_name' => 'required|string',
            'trade_type'    => 'required|string',
            'category'      => 'required|in:trades,lawyers,smb',
            'contact_name'  => 'nullable|string',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string',
            'city'          => 'required|string',
            'state'         => 'nullable|string',
            'repo_name'     => 'required|string',
            'demo_url'      => 'required|url',
            'github_url'    => 'required|url',
            'notes'         => 'nullable|string',
        ]);

        $data['demo_code'] = Lead::generateDemoCode();
        $data['status']    = 'prospect';
        $data['state']     = $data['state'] ?? 'NJ';

        $lead = Lead::create($data);

        return redirect()->route('system.leads.show', $lead);
    }

    public function update(Request $request, Lead $lead)
    {
        $data = $request->validate([
            'business_name' => 'sometimes|string',
            'trade_type'    => 'sometimes|string',
            'category'      => 'sometimes|in:trades,lawyers,smb',
            'contact_name'  => 'nullable|string',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string',
            'city'          => 'sometimes|string',
            'state'         => 'sometimes|string',
            'tier'          => 'nullable|in:starter,growth,pro',
            'status'        => 'sometimes|in:prospect,demo_sent,viewed,sold,active,suspended,cancelled',
            'domain'        => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $old = $lead->status;
        $lead->update($data);

        if (isset($data['status']) && $data['status'] !== $old) {
            $lead->log('status_changed', ['from' => $old, 'to' => $data['status']]);
        }

        return back()->with('success', 'Lead updated.');
    }

    public function editor(Lead $lead)
    {
        // Fetch current HTML from GitHub raw URL
        $html = '';
        try {
            $response = Http::get($lead->demo_url);
            if ($response->ok()) {
                $html = $response->body();
            }
        } catch (\Exception $e) {
            // ignore
        }

        return Inertia::render('System/Leads/Editor', [
            'lead' => $lead->only(['id', 'business_name', 'demo_url', 'repo_name', 'github_url']),
            'html' => $html,
        ]);
    }

    public function saveSite(Request $request, Lead $lead)
    {
        $request->validate(['html' => 'required|string']);

        $token  = config('services.github.token');
        $owner  = config('services.github.owner', 'Wrenbjor');
        $repo   = $lead->repo_name;
        $path   = 'index.html';
        $apiUrl = "https://api.github.com/repos/{$owner}/{$repo}/contents/{$path}";

        // Get current SHA
        $existing = Http::withToken($token)->get($apiUrl);
        $sha      = $existing->ok() ? $existing->json('sha') : null;

        $payload = [
            'message' => 'Update site via WCR portal',
            'content' => base64_encode($request->html),
        ];
        if ($sha) $payload['sha'] = $sha;

        $response = Http::withToken($token)->put($apiUrl, $payload);

        if ($response->failed()) {
            return back()->withErrors(['html' => 'GitHub push failed: ' . $response->body()]);
        }

        $lead->log('site_updated');

        return back()->with('success', 'Site saved to GitHub.');
    }

    public function generateCheckoutLink(Lead $lead)
    {
        $stripe = new StripeClient(config('cashier.secret'));

        $prices = [
            'starter' => ['setup' => env('STRIPE_PRICE_STARTER_SETUP'), 'monthly' => env('STRIPE_PRICE_STARTER_MONTHLY')],
            'growth'  => ['setup' => env('STRIPE_PRICE_GROWTH_SETUP'),  'monthly' => env('STRIPE_PRICE_GROWTH_MONTHLY')],
            'pro'     => ['setup' => env('STRIPE_PRICE_PRO_SETUP'),     'monthly' => env('STRIPE_PRICE_PRO_MONTHLY')],
        ];

        $tier = $lead->tier ?? 'starter';

        $lineItems = [];
        if (!empty($prices[$tier]['setup'])) {
            $lineItems[] = ['price' => $prices[$tier]['setup'], 'quantity' => 1];
        }
        if (!empty($prices[$tier]['monthly'])) {
            $lineItems[] = ['price' => $prices[$tier]['monthly'], 'quantity' => 1];
        }

        if (empty($lineItems)) {
            // Fallback: build inline prices
            $tierData = $lead->tierPrice() ?? ['setup' => 499, 'monthly' => 49];
            $lineItems = [
                [
                    'price_data' => [
                        'currency'     => 'usd',
                        'product_data' => ['name' => "WCR Studios {$tier} Setup"],
                        'unit_amount'  => $tierData['setup'] * 100,
                    ],
                    'quantity' => 1,
                ],
                [
                    'price_data' => [
                        'currency'     => 'usd',
                        'product_data' => ['name' => "WCR Studios {$tier} Monthly"],
                        'recurring'    => ['interval' => 'month'],
                        'unit_amount'  => $tierData['monthly'] * 100,
                    ],
                    'quantity' => 1,
                ],
            ];
        }

        $session = $stripe->checkout->sessions->create([
            'mode'        => 'subscription',
            'line_items'  => $lineItems,
            'success_url' => url('/'),
            'cancel_url'  => url('/'),
            'metadata'    => ['lead_id' => $lead->id],
            'customer_email' => $lead->email,
        ]);

        $lead->log('checkout_link_generated', ['session_id' => $session->id]);

        return response()->json(['url' => $session->url]);
    }
}
