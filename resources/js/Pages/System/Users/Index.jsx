import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const ROLE_COLORS = {
    admin: 'bg-purple-900/50 text-purple-300',
    sales: 'bg-blue-900/50 text-blue-300',
};

export default function Index({ users, flash }) {
    function handleDelete(user) {
        if (! confirm(`Delete ${user.name}? This cannot be undone.`)) return;
        router.delete(`/system/users/${user.id}`);
    }

    return (
        <>
            <Head title="Users — WCR Studios" />
            <AdminLayout title="Users">
                {flash?.success && (
                    <div className="mb-4 px-4 py-2 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-400 text-sm">{users.length} user{users.length !== 1 ? 's' : ''}</p>
                    <Link
                        href="/system/users/create"
                        className="bg-[#C9A96E] text-[#0f172a] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#b8934f]"
                    >
                        + Add User
                    </Link>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Role</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Joined</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${ROLE_COLORS[user.role] ?? 'bg-slate-700 text-slate-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{user.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/system/users/${user.id}/edit`}
                                                className="text-[#C9A96E] hover:underline text-xs"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-400 hover:text-red-300 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
        </>
    );
}
