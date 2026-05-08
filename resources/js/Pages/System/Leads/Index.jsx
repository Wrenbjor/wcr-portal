import { Head, Link, router, useForm } from '@inertiajs/react';
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

const CONTACT_STATUS_COLORS = {
    not_contacted: 'bg-slate-700 text-slate-400',
    attempted:     'bg-orange-900/50 text-orange-300',
    contacted:     'bg-blue-900/50 text-blue-300',
    follow_up:     'bg-yellow-900/50 text-yellow-300',
    won:           'bg-emerald-900/50 text-emerald-300',
    passed:        'bg-slate-800 text-slate-500',
};

const CONTACT_STATUS_LABELS = {
    not_contacted: 'Not Contacted',
    attempted:     'Attempted',
    contacted:     'Contacted',
    follow_up:     'Follow Up',
    won:           'Won',
    passed:        'Passed',
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

export default function Index({ leads, filters, users }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [contactStatus, setContactStatus] = useState(filters.contact_status ?? '');
    const [assignedTo, setAssignedTo] = useState(filters.assigned_to ?? '');
    const [showNewLead, setShowNewLead] = useState(false);
    const sort = filters.sort ?? 'created_at';
    const direction = filters.direction ?? 'desc';

    const newLead = useForm({
        business_name: '',
        github_url:    '',
        trade_type:    '',
        category:      'smb',
        contact_name:  '',
        email:         '',
        phone:         '',
        city:          '',
        state:         'NJ',
        notes:         '',
    });

    function submitNewLead(e) {
        e.preventDefault();
        newLead.post('/system/leads', {
            onSuccess: () => {
                newLead.reset();
                setShowNewLead(false);
            },
        });
    }

    function applyFilters(overrides = {}) {
        router.get('/system/leads', {
            search:         overrides.search         ?? search,
            category:       overrides.category       ?? category,
            status:         overrides.status         ?? status,
            contact_status: overrides.contact_status ?? contactStatus,
            assigned_to:    overrides.assigned_to    ?? assignedTo,
            sort:           overrides.sort           ?? sort,
            direction:      overrides.direction      ?? direction,
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

    function handleClearFilters(e) {
        e.preventDefault();
        setSearch('');
        setCategory('');
        setStatus('');
        setContactStatus('');
        setAssignedTo('');
        router.get('/system/leads', {}, { replace: true });
    }

    function updateContactStatus(lead, value) {
        router.put(`/system/leads/${lead.id}`, { contact_status: value }, { preserveState: true, preserveScroll: true });
    }

    function updateAssignedTo(lead, value) {
        router.put(`/system/leads/${lead.id}`, { assigned_to: value || null }, { preserveState: true, preserveScroll: true });
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

                    <select
                        value={contactStatus}
                        onChange={(e) => { setContactStatus(e.target.value); applyFilters({ contact_status: e.target.value }); }}
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    >
                        <option value="">All Contact</option>
                        <option value="not_contacted">Not Contacted</option>
                        <option value="attempted">Attempted</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="won">Won</option>
                        <option value="passed">Passed</option>
                    </select>

                    <select
                        value={assignedTo}
                        onChange={(e) => { setAssignedTo(e.target.value); applyFilters({ assigned_to: e.target.value }); }}
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    >
                        <option value="">All Reps</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>

                    <Link
                        href="#"
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </Link>

                    <a
                        href="/system/leads/export"
                        className="bg-[#1e293b] border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                    >
                        Export CSV
                    </a>

                    <button
                        type="button"
                        onClick={() => setShowNewLead(true)}
                        className="bg-[#C9A96E] text-[#0f172a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#b8934f] whitespace-nowrap"
                    >
                        + New Lead
                    </button>
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
                            <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${CONTACT_STATUS_COLORS[lead.contact_status] ?? 'bg-slate-700 text-slate-400'}`}>
                                    {CONTACT_STATUS_LABELS[lead.contact_status] ?? lead.contact_status}
                                </span>
                                {lead.assigned_user && (
                                    <span className="text-xs text-slate-500">{lead.assigned_user.name}</span>
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
                                    <SortTh column="city">City</SortTh>
                                    <SortTh column="status">Status</SortTh>
                                    <SortTh column="contact_status">Contact</SortTh>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium hidden xl:table-cell">Assigned To</th>
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
                                        <td className="px-4 py-3 text-slate-400">{lead.city}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_COLORS[lead.status] ?? 'bg-slate-700 text-slate-300'}`}>
                                                {lead.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={lead.contact_status ?? 'not_contacted'}
                                                onChange={(e) => updateContactStatus(lead, e.target.value)}
                                                className={`rounded px-2 py-0.5 text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C9A96E] ${CONTACT_STATUS_COLORS[lead.contact_status] ?? 'bg-slate-700 text-slate-400'}`}
                                            >
                                                <option value="not_contacted">Not Contacted</option>
                                                <option value="attempted">Attempted</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="follow_up">Follow Up</option>
                                                <option value="won">Won</option>
                                                <option value="passed">Passed</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 hidden xl:table-cell" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={lead.assigned_to ?? ''}
                                                onChange={(e) => updateAssignedTo(lead, e.target.value)}
                                                className="bg-transparent text-slate-400 text-xs border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C9A96E] rounded"
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map((u) => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
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
                                        <td colSpan={9} className="px-4 py-8 text-center text-slate-500">No leads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* New Lead modal */}
                {showNewLead && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto"
                        onClick={() => setShowNewLead(false)}
                    >
                        <div
                            className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-2xl my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={submitNewLead} className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-white font-bold text-lg">Add New Lead</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewLead(false)}
                                        className="text-slate-400 hover:text-white text-xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-400 text-xs mb-1">
                                            Business Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newLead.data.business_name}
                                            onChange={(e) => newLead.setData('business_name', e.target.value)}
                                            required
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                        {newLead.errors.business_name && (
                                            <p className="text-red-400 text-xs mt-1">{newLead.errors.business_name}</p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-400 text-xs mb-1">
                                            GitHub Repo URL <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={newLead.data.github_url}
                                            onChange={(e) => newLead.setData('github_url', e.target.value)}
                                            required
                                            placeholder="https://github.com/Wrenbjor/repo-name"
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                        {newLead.errors.github_url && (
                                            <p className="text-red-400 text-xs mt-1">{newLead.errors.github_url}</p>
                                        )}
                                        <p className="text-slate-500 text-xs mt-1">
                                            Demo URL will be derived automatically from the repo.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">Category</label>
                                        <select
                                            value={newLead.data.category}
                                            onChange={(e) => newLead.setData('category', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        >
                                            <option value="smb">SMB</option>
                                            <option value="trades">Trades</option>
                                            <option value="lawyers">Lawyers</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">Trade Type</label>
                                        <input
                                            type="text"
                                            value={newLead.data.trade_type}
                                            onChange={(e) => newLead.setData('trade_type', e.target.value)}
                                            placeholder="e.g. Plumbing"
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">Contact Name</label>
                                        <input
                                            type="text"
                                            value={newLead.data.contact_name}
                                            onChange={(e) => newLead.setData('contact_name', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={newLead.data.phone}
                                            onChange={(e) => newLead.setData('phone', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-400 text-xs mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={newLead.data.email}
                                            onChange={(e) => newLead.setData('email', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                        {newLead.errors.email && (
                                            <p className="text-red-400 text-xs mt-1">{newLead.errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">City</label>
                                        <input
                                            type="text"
                                            value={newLead.data.city}
                                            onChange={(e) => newLead.setData('city', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs mb-1">State</label>
                                        <input
                                            type="text"
                                            value={newLead.data.state}
                                            onChange={(e) => newLead.setData('state', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-400 text-xs mb-1">Notes</label>
                                        <textarea
                                            value={newLead.data.notes}
                                            onChange={(e) => newLead.setData('notes', e.target.value)}
                                            className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E] min-h-20 resize-y"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewLead(false)}
                                        className="bg-[#0f172a] border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={newLead.processing}
                                        className="bg-[#C9A96E] text-[#0f172a] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8934f] disabled:opacity-60 text-sm"
                                    >
                                        {newLead.processing ? 'Creating…' : 'Create Lead'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
