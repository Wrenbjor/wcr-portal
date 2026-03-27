import { Link, router } from '@inertiajs/react';

const navItems = [
    { href: '/system/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/system/leads', label: 'Leads', icon: '👥' },
];

export default function AdminLayout({ children, title }) {
    function logout(e) {
        e.preventDefault();
        router.post('/system/logout');
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            {/* Sidebar */}
            <aside className="w-56 bg-[#0a0f1e] border-r border-slate-800 flex flex-col shrink-0">
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
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {title && (
                    <header className="border-b border-slate-800 px-6 py-4">
                        <h1 className="font-bold text-lg text-white">{title}</h1>
                    </header>
                )}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
