import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Profile() {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put('/system/profile', {
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Profile — WCR Studios" />
            <AdminLayout title="Profile">
                <div className="max-w-md">
                    {flash?.success && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-6">Change Password</h2>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={e => setData('current_password', e.target.value)}
                                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A96E]"
                                    autoComplete="current-password"
                                />
                                {errors.current_password && (
                                    <p className="mt-1 text-xs text-red-400">{errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A96E]"
                                    autoComplete="new-password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A96E]"
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-50 text-[#0f172a] font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
                            >
                                {processing ? 'Updating…' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
