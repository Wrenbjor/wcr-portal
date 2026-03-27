<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalLeads    = Lead::count();
        $demosViewed   = Lead::where('demo_views', '>', 0)->count();
        $sold          = Lead::whereIn('status', ['sold', 'active'])->count();
        $active        = Lead::where('status', 'active')->count();
        $conversion    = $totalLeads > 0 ? round(($sold / $totalLeads) * 100, 1) : 0;

        $mrr = Lead::where('status', 'active')->whereNotNull('tier')->get()->sum(function ($lead) {
            return match ($lead->tier) {
                'starter' => 49,
                'growth'  => 79,
                'pro'     => 149,
                default   => 0,
            };
        });

        $recentActivity = ActivityLog::with('lead')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn($log) => [
                'id'            => $log->id,
                'action'        => $log->action,
                'details'       => $log->details,
                'created_at'    => $log->created_at->diffForHumans(),
                'business_name' => $log->lead?->business_name,
                'lead_id'       => $log->lead_id,
            ]);

        // Views by day (last 30 days)
        $viewsByDay = ActivityLog::where('action', 'demo_viewed')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => ['date' => $row->date, 'count' => $row->count]);

        $salesByCategory = Lead::whereIn('status', ['sold', 'active'])
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return Inertia::render('System/Dashboard', compact(
            'totalLeads', 'demosViewed', 'sold', 'active', 'conversion', 'mrr',
            'recentActivity', 'viewsByDay', 'salesByCategory'
        ));
    }
}
