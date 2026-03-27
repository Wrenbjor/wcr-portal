<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Public/Home');
    }

    public function demo(Request $request)
    {
        $code = $request->query('code');
        if ($code) {
            return $this->showDemo($code);
        }
        return Inertia::render('Public/Demo', ['lead' => null, 'error' => null]);
    }

    public function showDemo(string $code)
    {
        $lead = Lead::where('demo_code', strtoupper($code))->first();

        if (!$lead) {
            return Inertia::render('Public/Demo', [
                'lead' => null,
                'error' => 'Demo code not found. Please check and try again.',
            ]);
        }

        $lead->increment('demo_views');
        $lead->update(['last_viewed_at' => now()]);

        if ($lead->status === 'demo_sent') {
            $lead->update(['status' => 'viewed']);
        }

        $lead->log('demo_viewed', ['ip' => request()->ip()]);

        return Inertia::render('Public/Demo', [
            'lead' => [
                'id'            => $lead->id,
                'business_name' => $lead->business_name,
                'demo_url'      => $lead->demo_url,
                'demo_code'     => $lead->demo_code,
                'tier'          => $lead->tier,
            ],
            'error' => null,
        ]);
    }

    public function trackView(string $code)
    {
        $lead = Lead::where('demo_code', strtoupper($code))->first();
        if ($lead) {
            $lead->log('demo_loaded');
        }
        return response()->json(['ok' => true]);
    }
}
