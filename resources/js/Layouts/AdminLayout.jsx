import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const navItems = [
    { href: '/system/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/system/leads', label: 'Leads', icon: '👥' },
    { href: '/system/profile', label: 'Profile', icon: '👤' },
];

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [children]);

    function logout(e) {
        e.preventDefault();
        router.post('/system/logout');
    }

    const sidebarContent = (
        <>
            <div className="px-5 py-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="text-[#C9A96E] font-bold text-lg">WCR</span>
                    <span className="text-white font-semibold text-lg">Studios</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">Admin Portal</div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-colors w-full"
                >
                    <span>🚪</span> Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — desktop: static, mobile: slide-over */}
            <aside className="hidden lg:flex w-56 bg-[#0a0f1e] border-r border-slate-800 flex-col shrink-0">
                {sidebarContent}
            </aside>
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0f1e] border-r border-slate-800 flex flex-col transform transition-transform duration-200 ease-in-out lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-400 hover:text-white"
                        aria-label="Open menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {title && <h1 className="font-bold text-lg text-white">{title}</h1>}
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
