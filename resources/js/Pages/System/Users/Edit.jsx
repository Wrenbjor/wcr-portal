import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ user, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(`/system/users/${user.id}`);
    }

    return (
        <>
            <Head title={`Edit ${user.name} — WCR Studios`} />
            <AdminLayout title="Edit User">
                <div className="max-w-lg">
                    {flash?.success && (
                        <div className="mb-4 px-4 py-2 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 space-y-5">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-700 text-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                            >
                                <option value="sales">Sales</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">
                                New Password <span className="text-slate-600">(leave blank to keep current)</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#C9A96E] text-[#0f172a] font-semibold px-5 py-2 rounded-lg text-sm hover:bg-[#b8934f] disabled:opacity-50"
                            >
                                {processing ? 'Saving…' : 'Save Changes'}
                            </button>
                            <Link href="/system/users" className="text-slate-400 hover:text-white text-sm">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}
