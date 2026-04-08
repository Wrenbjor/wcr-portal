import { Head, Link } from '@inertiajs/react';

const services = [
    {
        icon: '🌐',
        title: 'Web Design',
        desc: 'Custom websites that convert visitors into customers. Mobile-first, fast, and built to rank.',
    },
    {
        icon: '📱',
        title: 'Social Media',
        desc: 'Consistent, on-brand content that keeps your business top-of-mind in the local market.',
    },
    {
        icon: '🤖',
        title: 'AI Voice Agents',
        desc: 'Never miss a call. Our AI answers, qualifies, and books appointments 24/7.',
    },
    {
        icon: '⚡',
        title: 'Automation',
        desc: 'CRM integrations, review follow-ups, and lead nurturing—all on autopilot.',
    },
];

export default function Home() {
    return (
        <>
            <Head title="WCR Studios — Websites for Local Businesses" />
            <div className="min-h-screen bg-[#0f172a] text-white font-sans">
                {/* Nav */}
                <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-[#C9A96E] font-bold text-xl tracking-wide">WCR</span>
                        <span className="text-white font-semibold text-xl">Studios</span>
                    </div>
                    <Link
                        href="/demo"
                        className="bg-[#C9A96E] text-[#0f172a] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8934f] transition-colors text-sm"
                    >
                        See Your Site
                    </Link>
                </nav>

                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
                    <div className="inline-block bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        AI-Powered. Human Quality.
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                        We Build Websites for<br />
                        <span className="text-[#C9A96E]">Local Businesses</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                        Done-for-you websites, social media, and automation for trades, lawyers, and small businesses
                        in South Jersey. Your site is ready — see it now.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/demo"
                            className="bg-[#C9A96E] text-[#0f172a] font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#b8934f] transition-colors"
                        >
                            See Your Site →
                        </Link>
                        <a
                            href="#services"
                            className="border border-slate-600 text-slate-300 font-semibold px-8 py-4 rounded-xl text-lg hover:border-slate-400 hover:text-white transition-colors"
                        >
                            Learn More
                        </a>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="max-w-6xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Everything Your Business Needs
                    </h2>
                    <p className="text-slate-400 text-center mb-12">One partner. Full digital presence.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((s) => (
                            <div
                                key={s.title}
                                className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:border-[#C9A96E]/50 transition-colors"
                            >
                                <div className="text-4xl mb-4">{s.icon}</div>
                                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Preview */}
                <section className="max-w-5xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-slate-400 text-center mb-12">No hidden fees. No long-term contracts.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Starter', setup: 499, monthly: 75, features: ['Website Hosting', 'Up to 5 Dedicated Service Pages', 'Google My Business Setup', 'Full SEO / AEO'] },
                            { name: 'Growth', setup: 999, monthly: 100, features: ['Everything in Starter', 'Google Review Automation', 'Up to 3 Social Media Accounts Connected', 'Monthly Social Content Guidelines Email'], highlight: true },
                            { name: 'Pro', setup: 1999, monthly: 500, features: ['Everything in Growth', 'Priority Support', 'AI Voice Agent (Vapi)', 'Calendar Integration & Auto Booking', '10 Custom Post Scripts / Month'] },
                        ].map((tier) => (
                            <div
                                key={tier.name}
                                className={`rounded-2xl p-6 border ${
                                    tier.highlight
                                        ? 'bg-[#C9A96E]/10 border-[#C9A96E]'
                                        : 'bg-[#1e293b] border-slate-700'
                                }`}
                            >
                                {tier.highlight && (
                                    <div className="text-[#C9A96E] text-xs font-bold uppercase tracking-wider mb-3">Most Popular</div>
                                )}
                                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">${tier.setup}</span>
                                    <span className="text-slate-400 text-sm"> setup</span>
                                    <div className="text-slate-400 text-sm">${tier.monthly}/mo maintenance</div>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {tier.features.map((f) => (
                                        <li key={f} className="text-sm text-slate-300 flex items-center gap-2">
                                            <span className="text-[#C9A96E]">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/demo"
                                    className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                                        tier.highlight
                                            ? 'bg-[#C9A96E] text-[#0f172a] hover:bg-[#b8934f]'
                                            : 'border border-slate-600 text-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-3xl mx-auto px-6 py-20 text-center">
                    <div className="bg-[#1e293b] border border-[#C9A96E]/30 rounded-3xl p-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Your Website Is Already Built
                        </h2>
                        <p className="text-slate-400 mb-8">
                            We've created a custom site for your business. Enter your demo code to see it live.
                        </p>
                        <Link
                            href="/demo"
                            className="bg-[#C9A96E] text-[#0f172a] font-bold px-10 py-4 rounded-xl text-lg hover:bg-[#b8934f] transition-colors inline-block"
                        >
                            See Your Site →
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800 px-6 py-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[#C9A96E] font-bold">WCR</span>
                            <span className="text-white font-semibold">Studios</span>
                        </div>
                        <p className="text-slate-500 text-sm">© 2025 WCR Studios. All rights reserved.</p>
                        <p className="text-slate-500 text-sm">South Jersey's Digital Agency</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
