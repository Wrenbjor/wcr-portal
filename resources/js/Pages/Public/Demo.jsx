import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const TIERS = [
    {
        key: 'starter',
        name: 'Starter',
        setup: 499,
        monthly: 75,
        features: ['Website Hosting', 'Up to 5 Dedicated Service Pages', 'Google My Business Setup', 'Full SEO / AEO'],
    },
    {
        key: 'growth',
        name: 'Growth',
        setup: 999,
        monthly: 100,
        features: ['Everything in Starter', 'Google Review Automation', 'Up to 3 Social Media Accounts Connected', 'Monthly Social Content Guidelines Email'],
        highlight: true,
    },
    {
        key: 'pro',
        name: 'Pro',
        setup: 1999,
        monthly: 500,
        features: ['Everything in Growth', 'Priority Support', 'AI Voice Agent (Vapi)', 'Calendar Integration & Auto Booking', '10 Custom Post Scripts / Month'],
    },
];

export default function Demo({ lead, error }) {
    const [code, setCode] = useState('');
    const [shelfOpen, setShelfOpen] = useState(true);
    const [loadingTier, setLoadingTier] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!lead && inputRef.current) inputRef.current.focus();
    }, [lead]);

    // Track view via AJAX once iframe loads
    useEffect(() => {
        if (lead?.demo_code) {
            fetch(`/api/demo/view/${lead.demo_code}`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '' } }).catch(() => {});
        }
    }, [lead?.demo_code]);

    function handleCodeSubmit(e) {
        e.preventDefault();
        if (code.trim()) {
            router.visit(`/demo/${code.trim().toUpperCase()}`);
        }
    }

    async function handleGetStarted(tierKey) {
        setLoadingTier(tierKey);
        try {
            const res = await fetch(`/system/leads/${lead.id}/checkout-link`);
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            alert('Unable to generate checkout link. Please contact us.');
        } finally {
            setLoadingTier(null);
        }
    }

    if (!lead) {
        return (
            <>
                <Head title="View Your Demo — WCR Studios" />
                <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4">
                    {/* Logo */}
                    <div className="mb-10 text-center">
                        <a href="/" className="inline-flex items-center gap-2">
                            <span className="text-[#C9A96E] font-bold text-2xl">WCR</span>
                            <span className="text-white font-semibold text-2xl">Studios</span>
                        </a>
                    </div>

                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-bold text-white text-center mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Your Website Awaits
                        </h1>
                        <p className="text-slate-400 text-center mb-8">Enter the demo code we sent you to preview your new site.</p>

                        {error && (
                            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. AB3X7K"
                                maxLength={8}
                                className="bg-[#1e293b] border border-slate-700 text-white placeholder-slate-500 rounded-xl px-5 py-4 text-xl text-center tracking-widest font-mono focus:outline-none focus:border-[#C9A96E] transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!code.trim()}
                                className="bg-[#C9A96E] text-[#0f172a] font-bold py-4 rounded-xl text-lg hover:bg-[#b8934f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                View My Site →
                            </button>
                        </form>

                        <p className="text-slate-600 text-sm text-center mt-6">
                            Don't have a code?{' '}
                            <a href="/" className="text-[#C9A96E] hover:underline">Learn more</a>
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // Demo viewer with iframe + shelf
    // On mobile: shelf is a bottom sheet overlay
    // On desktop: shelf is a right-side panel
    return (
        <>
            <Head title={`${lead.business_name} — WCR Studios Demo`} />
            <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#0f172a]">
                {/* Iframe */}
                <div className="flex-1 relative overflow-hidden">
                    <iframe
                        src={lead.demo_url}
                        className="w-full h-full border-0"
                        title={`${lead.business_name} demo`}
                    />
                </div>

                {/* Mobile: bottom toggle bar (always visible when shelf closed) */}
                <button
                    onClick={() => setShelfOpen(!shelfOpen)}
                    className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#C9A96E] text-[#0f172a] font-bold py-3 text-center shadow-xl"
                    aria-label={shelfOpen ? 'Close pricing' : 'View pricing'}
                >
                    {shelfOpen ? '↓ Close' : '↑ View Pricing Plans'}
                </button>

                {/* Desktop: side toggle handle */}
                <button
                    onClick={() => setShelfOpen(!shelfOpen)}
                    className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#C9A96E] text-[#0f172a] font-bold px-2 py-6 rounded-l-lg shadow-xl hover:bg-[#b8934f] transition-colors"
                    style={{ right: shelfOpen ? '380px' : '0', transition: 'right 0.3s ease' }}
                    aria-label={shelfOpen ? 'Close shelf' : 'Open shelf'}
                >
                    {shelfOpen ? '›' : '‹'}
                </button>

                {/* Mobile overlay */}
                {shelfOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        onClick={() => setShelfOpen(false)}
                    />
                )}

                {/* Shelf — mobile: bottom sheet, desktop: right panel */}
                <div
                    className={`
                        fixed z-50 bg-[#0f172a] border-slate-700 overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out
                        inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t
                        md:inset-x-auto md:top-0 md:right-0 md:h-full md:w-[380px] md:max-h-none md:rounded-t-none md:border-t-0 md:border-l
                        ${shelfOpen
                            ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
                            : 'translate-y-full md:translate-y-0 md:translate-x-full'
                        }
                    `}
                >
                    <div className="p-6 pb-20 md:pb-6">
                        {/* Mobile drag indicator */}
                        <div className="md:hidden flex justify-center mb-4">
                            <div className="w-10 h-1 rounded-full bg-slate-600" />
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[#C9A96E] font-bold text-sm">WCR</span>
                                <span className="text-white font-semibold text-sm">Studios</span>
                            </div>
                            <h2 className="text-white font-bold text-xl leading-snug">{lead.business_name}</h2>
                            <p className="text-[#C9A96E] font-medium text-sm mt-1">Your new website is ready</p>
                            <p className="text-slate-400 text-xs mt-2">
                                Choose a plan below to go live. Your site is already built and waiting.
                            </p>
                        </div>

                        {/* Tier cards */}
                        <div className="space-y-4">
                            {TIERS.map((tier) => (
                                <div
                                    key={tier.key}
                                    className={`rounded-2xl p-5 border ${
                                        tier.highlight
                                            ? 'bg-[#C9A96E]/10 border-[#C9A96E]'
                                            : 'bg-[#1e293b] border-slate-700'
                                    }`}
                                >
                                    {tier.highlight && (
                                        <div className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-wider mb-2">Most Popular</div>
                                    )}
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h3 className="text-white font-bold">{tier.name}</h3>
                                        <div className="text-right">
                                            <span className="text-white font-bold">${tier.setup}</span>
                                            <span className="text-slate-400 text-xs"> setup</span>
                                        </div>
                                    </div>
                                    <div className="text-slate-400 text-xs mb-3">${tier.monthly}/month maintenance</div>
                                    <ul className="space-y-1 mb-4">
                                        {tier.features.map((f) => (
                                            <li key={f} className="text-slate-300 text-xs flex items-center gap-1.5">
                                                <span className="text-[#C9A96E] text-xs">✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleGetStarted(tier.key)}
                                        disabled={loadingTier !== null}
                                        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                                            tier.highlight
                                                ? 'bg-[#C9A96E] text-[#0f172a] hover:bg-[#b8934f]'
                                                : 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white'
                                        } disabled:opacity-60`}
                                    >
                                        {loadingTier === tier.key ? 'Loading…' : 'Get Started'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-xs">Questions? Call us or reply to your demo email.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
