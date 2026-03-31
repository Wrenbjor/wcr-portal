import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function KpiCard({ label, value, sub, accent }) {
    return (
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 sm:p-6">
            <div className="text-slate-400 text-xs sm:text-sm mb-1">{label}</div>
            <div className={`text-2xl sm:text-3xl font-bold ${accent ? 'text-[#C9A96E]' : 'text-white'}`}>{value}</div>
            {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
        </div>
    );
}

const ACTION_LABELS = {
    demo_viewed:           'Viewed demo',
    demo_loaded:           'Demo loaded',
    status_changed:        'Status updated',
    payment_received:      'Payment received',
    site_updated:          'Site updated',
    checkout_link_generated: 'Checkout link sent',
    subscription_activated: 'Subscription active',
    subscription_cancelled: 'Subscription cancelled',
};

const CATEGORY_COLORS = {
    trades:  'bg-blue-900/40 text-blue-300 border-blue-800',
    lawyers: 'bg-purple-900/40 text-purple-300 border-purple-800',
    smb:     'bg-green-900/40 text-green-300 border-green-800',
};

export default function Dashboard({
    totalLeads, demosViewed, sold, active, conversion, mrr,
    recentActivity, viewsByDay, salesByCategory,
}) {
    const maxViews = Math.max(...(viewsByDay.map(d => d.count)), 1);

    return (
        <>
            <Head title="Dashboard — WCR Studios" />
            <AdminLayout title="Dashboard">
                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <KpiCard label="Total Leads" value={totalLeads} />
                    <KpiCard label="Demos Viewed" value={demosViewed} sub={`${totalLeads > 0 ? Math.round((demosViewed/totalLeads)*100) : 0}% view rate`} />
                    <KpiCard label="Conversion Rate" value={`${conversion}%`} sub={`${sold} sold`} />
                    <KpiCard label="Active Clients" value={active} />
                    <KpiCard label="MRR" value={`$${mrr.toLocaleString()}`} accent />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Views chart */}
                    <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-4">Demo Views (Last 30 Days)</h2>
                        {viewsByDay.length === 0 ? (
                            <div className="text-slate-500 text-sm py-8 text-center">No views yet</div>
                        ) : (
                            <div className="flex items-end gap-1 h-32">
                                {viewsByDay.map((d) => (
                                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div
                                            className="w-full bg-[#C9A96E]/70 rounded-t hover:bg-[#C9A96E] transition-colors"
                                            style={{ height: `${Math.max(4, (d.count / maxViews) * 100)}%` }}
                                            title={`${d.date}: ${d.count}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sales by category */}
                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-4">Sales by Category</h2>
                        <div className="space-y-3">
                            {Object.entries(salesByCategory).length === 0 ? (
                                <div className="text-slate-500 text-sm text-center py-4">No sales yet</div>
                            ) : (
                                Object.entries(salesByCategory).map(([cat, count]) => (
                                    <div key={cat} className="flex items-center justify-between">
                                        <span className={`text-xs font-medium px-2 py-1 rounded border capitalize ${CATEGORY_COLORS[cat] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                            {cat}
                                        </span>
                                        <span className="text-white font-bold">{count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Activity feed */}
                <div className="mt-6 bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                    <h2 className="font-bold text-white mb-4">Recent Activity</h2>
                    {recentActivity.length === 0 ? (
                        <div className="text-slate-500 text-sm text-center py-4">No activity yet</div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((log) => (
                                <div key={log.id} className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-[#C9A96E] shrink-0" />
                                    <span className="text-slate-300 flex-1">
                                        {ACTION_LABELS[log.action] ?? log.action}
                                        {log.business_name && (
                                            <> — <a href={`/system/leads/${log.lead_id}`} className="text-[#C9A96E] hover:underline">{log.business_name}</a></>
                                        )}
                                    </span>
                                    <span className="text-slate-500 text-xs shrink-0">{log.created_at}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}
