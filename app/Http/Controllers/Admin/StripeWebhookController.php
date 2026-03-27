<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret  = config('cashier.webhook.secret');
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        $data = $event->data->object;

        switch ($event->type) {
            case 'checkout.session.completed':
                $leadId = $data->metadata->lead_id ?? null;
                if ($leadId) {
                    $lead = Lead::find($leadId);
                    if ($lead) {
                        $lead->update([
                            'status'                 => 'sold',
                            'stripe_customer_id'     => $data->customer,
                            'stripe_subscription_id' => $data->subscription,
                        ]);
                        $lead->log('payment_received', [
                            'session_id'  => $data->id,
                            'customer_id' => $data->customer,
                        ]);
                    }
                }
                break;

            case 'customer.subscription.deleted':
                $lead = Lead::where('stripe_subscription_id', $data->id)->first();
                if ($lead) {
                    $lead->update(['status' => 'cancelled']);
                    $lead->log('subscription_cancelled');
                }
                break;

            case 'customer.subscription.updated':
                $lead = Lead::where('stripe_subscription_id', $data->id)->first();
                if ($lead && $data->status === 'active') {
                    $lead->update(['status' => 'active']);
                    $lead->log('subscription_activated');
                }
                break;
        }

        return response()->json(['received' => true]);
    }
}
