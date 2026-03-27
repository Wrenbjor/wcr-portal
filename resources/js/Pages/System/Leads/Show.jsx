import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_OPTIONS = ['prospect', 'demo_sent', 'viewed', 'sold', 'active', 'suspended', 'cancelled'];
const TIER_OPTIONS   = ['starter', 'growth', 'pro'];

const STATUS_COLORS = {
    prospect:  'bg-slate-700 text-slate-300',
    demo_sent: 'bg-blue-900/50 text-blue-300',
    viewed:    'bg-yellow-900/50 text-yellow-300',
    sold:      'bg-green-900/50 text-green-300',
    active:    'bg-emerald-900/50 text-emerald-300',
    suspended: 'bg-red-900/50 text-red-300',
    cancelled: 'bg-slate-800 text-slate-500',
};

const ACTION_LABELS = {
    demo_viewed:             '👁  Viewed demo',
    demo_loaded:             '📄 Demo loaded',
    status_changed:          '🔄 Status changed',
    payment_received:        '💳 Payment received',
    site_updated:            '🌐 Site updated',
    checkout_link_generated: '🔗 Checkout link generated',
    subscription_activated:  '✅ Subscription activated',
    subscription_cancelled:  '❌ Subscription cancelled',
};

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-slate-400 text-xs mb-1">{label}</label>
            {children}
        </div>
    );
}

export default function Show({ lead }) {
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        business_name: lead.business_name,
        trade_type:    lead.trade_type,
        category:      lead.category,
        contact_name:  lead.contact_name ?? '',
        email:         lead.email ?? '',
        phone:         lead.phone ?? '',
        city:          lead.city,
        state:         lead.state,
        tier:          lead.tier ?? '',
        status:        lead.status,
        domain:        lead.domain ?? '',
        notes:         lead.notes ?? '',
    });

    function save(e) {
        e.preventDefault();
        put(`/system/leads/${lead.id}`);
    }

    async function copyDemoLink() {
        const url = `${window.location.origin}/demo/${lead.demo_code}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function getCheckoutLink() {
        setCheckoutLoading(true);
        try {
            const res = await fetch(`/system/leads/${lead.id}/checkout-link`);
            const d = await res.json();
            if (d.url) {
                await navigator.clipboard.writeText(d.url);
                alert('Checkout link copied to clipboard!');
            }
        } catch {
            alert('Failed to generate checkout link.');
        } finally {
            setCheckoutLoading(false);
        }
    }

    const inputCls = 'w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]';
    const selectCls = inputCls;

    return (
        <>
            <Head title={`${lead.business_name} — WCR Studios`} />
            <AdminLayout title={lead.business_name}>
                {/* Back */}
                <div className="mb-4">
                    <button onClick={() => router.visit('/system/leads')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
                        ← Back to Leads
                    </button>
                </div>

                {/* Header row */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[lead.status]}`}>
                        {lead.status.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500 text-sm">Demo code: <code className="text-[#C9A96E] font-mono">{lead.demo_code}</code></span>
                    <span className="text-slate-500 text-sm">{lead.demo_views} views</span>

                    <div className="ml-auto flex gap-2 flex-wrap">
                        <button onClick={copyDemoLink} className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 hover:text-white transition-colors">
                            {copied ? '✓ Copied!' : '🔗 Copy Demo Link'}
                        </button>
                        <button
                            onClick={getCheckoutLink}
                            disabled={checkoutLoading}
                            className="bg-[#C9A96E] text-[#0f172a] font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-[#b8934f] disabled:opacity-60"
                        >
                            {checkoutLoading ? 'Loading…' : '💳 Checkout Link'}
                        </button>
                        <a
                            href={`/system/leads/${lead.id}/editor`}
                            className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 hover:text-white transition-colors"
                        >
                            ✏️ Edit Site
                        </a>
                        <a
                            href={`/demo/${lead.demo_code}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 hover:text-white transition-colors"
                        >
                            👁 Preview
                        </a>
                        <a
                            href={lead.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 hover:text-white transition-colors"
                        >
                            🐙 GitHub
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Edit form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={save} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 space-y-4">
                            <h2 className="font-bold text-white mb-2">Lead Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Business Name">
                                    <input className={inputCls} value={data.business_name} onChange={e => setData('business_name', e.target.value)} />
                                </Field>
                                <Field label="Trade Type">
                                    <input className={inputCls} value={data.trade_type} onChange={e => setData('trade_type', e.target.value)} />
                                </Field>
                                <Field label="Category">
                                    <select className={selectCls} value={data.category} onChange={e => setData('category', e.target.value)}>
                                        <option value="trades">Trades</option>
                                        <option value="lawyers">Lawyers</option>
                                        <option value="smb">SMB</option>
                                    </select>
                                </Field>
                                <Field label="Status">
                                    <select className={selectCls} value={data.status} onChange={e => setData('status', e.target.value)}>
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                    </select>
                                </Field>
                                <Field label="Contact Name">
                                    <input className={inputCls} value={data.contact_name} onChange={e => setData('contact_name', e.target.value)} />
                                </Field>
                                <Field label="Email">
                                    <input className={inputCls} type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                </Field>
                                <Field label="Phone">
                                    <input className={inputCls} value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                </Field>
                                <Field label="City">
                                    <input className={inputCls} value={data.city} onChange={e => setData('city', e.target.value)} />
                                </Field>
                                <Field label="State">
                                    <input className={inputCls} value={data.state} onChange={e => setData('state', e.target.value)} />
                                </Field>
                                <Field label="Tier">
                                    <select className={selectCls} value={data.tier} onChange={e => setData('tier', e.target.value)}>
                                        <option value="">No tier</option>
                                        {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </Field>
                                <Field label="Domain">
                                    <input className={inputCls} value={data.domain} onChange={e => setData('domain', e.target.value)} placeholder="e.g. example.com" />
                                </Field>
                            </div>
                            <Field label="Notes">
                                <textarea
                                    className={`${inputCls} min-h-24 resize-y`}
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Internal notes…"
                                />
                            </Field>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#C9A96E] text-[#0f172a] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8934f] disabled:opacity-60 text-sm"
                                >
                                    {processing ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>

                        {/* Links */}
                        <div className="mt-4 bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                            <h2 className="font-bold text-white mb-3">Links</h2>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-slate-400">Demo URL: </span>
                                    <a href={lead.demo_url} target="_blank" rel="noreferrer" className="text-[#C9A96E] hover:underline break-all">{lead.demo_url}</a>
                                </div>
                                <div>
                                    <span className="text-slate-400">GitHub: </span>
                                    <a href={lead.github_url} target="_blank" rel="noreferrer" className="text-[#C9A96E] hover:underline break-all">{lead.github_url}</a>
                                </div>
                                {lead.stripe_customer_id && (
                                    <div>
                                        <span className="text-slate-400">Stripe Customer: </span>
                                        <span className="text-slate-300 font-mono text-xs">{lead.stripe_customer_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity log */}
                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-4">Activity Log</h2>
                        {lead.activity_logs.length === 0 ? (
                            <div className="text-slate-500 text-sm text-center py-4">No activity yet</div>
                        ) : (
                            <div className="space-y-4">
                                {lead.activity_logs.map((log) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                                        <div>
                                            <div className="text-slate-300 text-sm">{ACTION_LABELS[log.action] ?? log.action}</div>
                                            {log.details && (
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {log.details.from && log.details.to && `${log.details.from} → ${log.details.to}`}
                                                    {log.details.ip && `IP: ${log.details.ip}`}
                                                </div>
                                            )}
                                            <div className="text-slate-600 text-xs mt-0.5">{log.created_at}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
