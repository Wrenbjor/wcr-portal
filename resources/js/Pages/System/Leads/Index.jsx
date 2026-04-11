import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    prospect:  'bg-slate-700 text-slate-300',
    demo_sent: 'bg-blue-900/50 text-blue-300',
    viewed:    'bg-yellow-900/50 text-yellow-300',
    sold:      'bg-green-900/50 text-green-300',
    active:    'bg-emerald-900/50 text-emerald-300',
    suspended: 'bg-red-900/50 text-red-300',
    cancelled: 'bg-slate-800 text-slate-500',
};

const TIER_COLORS = {
    starter: 'text-slate-300',
    growth:  'text-[#C9A96E]',
    pro:     'text-purple-300',
};

function SortIcon({ column, sort, direction }) {
    if (sort !== column) return <span className="ml-1 text-slate-600">↕</span>;
    return <span className="ml-1 text-[#C9A96E]">{direction === 'asc' ? '↑' : '↓'}</span>;
}

export default function Index({ leads, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const sort = filters.sort ?? 'created_at';
    const direction = filters.direction ?? 'desc';

    function applyFilters(overrides = {}) {
        router.get('/system/leads', {
            search: overrides.search ?? search,
            category: overrides.category ?? category,
            status: overrides.status ?? status,
            sort: overrides.sort ?? sort,
            direction: overrides.direction ?? direction,
        }, { preserveState: true, replace: true });
    }

    function handleSort(column) {
        const newDirection = sort === column && direction === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: column, direction: newDirection });
    }

    function SortTh({ column, children, className = '' }) {
        return (
            <th
                className={`text-left px-4 py-3 text-slate-400 font-medium cursor-pointer select-none hover:text-slate-200 transition-colors ${sort === column ? 'text-slate-200' : ''} ${className}`}
                onClick={() => handleSort(column)}
            >
                {children}
                <SortIcon column={column} sort={sort} direction={direction} />
            </th>
        );
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilters();
    }

    return (
        <>
            <Head title="Leads — WCR Studios" />
            <AdminLayout title="Leads">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-60">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search business, city, trade, email…"
                            className="flex-1 bg-[#1e293b] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                        />
                        <button type="submit" className="bg-[#C9A96E] text-[#0f172a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#b8934f]">
                            Search
                        </button>
                    </form>

                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); applyFilters({ category: e.target.value }); }}
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    >
                        <option value="">All Categories</option>
                        <option value="trades">Trades</option>
                        <option value="lawyers">Lawyers</option>
                        <option value="smb">SMB</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    >
                        <option value="">All Statuses</option>
                        <option value="prospect">Prospect</option>
                        <option value="demo_sent">Demo Sent</option>
                        <option value="viewed">Viewed</option>
                        <option value="sold">Sold</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <Link
                        href="#"
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm"
                        onClick={(e) => { e.preventDefault(); router.get('/system/leads', {}, { replace: true }); setSearch(''); setCategory(''); setStatus(''); }}
                    >
                        Clear
                    </Link>
                </div>

                {/* Mobile card list */}
                <div className="space-y-3 md:hidden">
                    {leads.data.map((lead) => (
                        <div
                            key={lead.id}
                            className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-600 transition-colors"
                            onClick={() => router.visit(`/system/leads/${lead.id}`)}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="text-white font-medium text-sm">{lead.business_name}</div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0 ${STATUS_COLORS[lead.status] ?? 'bg-slate-700 text-slate-300'}`}>
                                    {lead.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                <span>{lead.trade_type}</span>
                                <span>{lead.city}</span>
                                <span>{lead.demo_views} views</span>
                                {lead.tier && (
                                    <span className={`capitalize font-medium ${TIER_COLORS[lead.tier]}`}>{lead.tier}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {leads.data.length === 0 && (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">No leads found.</div>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <SortTh column="business_name">Business</SortTh>
                                    <SortTh column="trade_type">Trade</SortTh>
                                    <SortTh column="category" className="hidden lg:table-cell">Category</SortTh>
                                    <SortTh column="city">City</SortTh>
                                    <SortTh column="status">Status</SortTh>
                                    <th
                                        className={`text-right px-4 py-3 text-slate-400 font-medium cursor-pointer select-none hover:text-slate-200 transition-colors hidden lg:table-cell ${sort === 'demo_views' ? 'text-slate-200' : ''}`}
                                        onClick={() => handleSort('demo_views')}
                                    >
                                        Views<SortIcon column="demo_views" sort={sort} direction={direction} />
                                    </th>
                                    <SortTh column="tier" className="hidden lg:table-cell">Tier</SortTh>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.data.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                                        onClick={() => router.visit(`/system/leads/${lead.id}`)}
                                    >
                                        <td className="px-4 py-3 text-white font-medium">{lead.business_name}</td>
                                        <td className="px-4 py-3 text-slate-400">{lead.trade_type}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="capitalize text-slate-400">{lead.category}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{lead.city}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_COLORS[lead.status] ?? 'bg-slate-700 text-slate-300'}`}>
                                                {lead.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-300 hidden lg:table-cell">{lead.demo_views}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            {lead.tier ? (
                                                <span className={`capitalize font-medium text-xs ${TIER_COLORS[lead.tier]}`}>{lead.tier}</span>
                                            ) : (
                                                <span className="text-slate-600">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/system/leads/${lead.id}`}
                                                    className="text-[#C9A96E] hover:underline text-xs"
                                                >
                                                    View
                                                </Link>
                                                <a
                                                    href={`/demo/${lead.demo_code}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-400 hover:text-white text-xs"
                                                >
                                                    Demo
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leads.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No leads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {leads.last_page > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-slate-500 text-sm">
                            {leads.from}–{leads.to} of {leads.total} leads
                        </p>
                        <div className="flex gap-2">
                            {leads.prev_page_url && (
                                <Link href={leads.prev_page_url} className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500">
                                    ← Prev
                                </Link>
                            )}
                            {leads.next_page_url && (
                                <Link href={leads.next_page_url} className="bg-[#1e293b] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:border-slate-500">
                                    Next →
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
