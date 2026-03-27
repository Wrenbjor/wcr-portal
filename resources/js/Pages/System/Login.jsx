import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/system/login', { onFinish: () => reset('password') });
    }

    return (
        <>
            <Head title="WCR Studios — Admin Login" />
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-[#C9A96E] font-bold text-2xl">WCR</span>
                            <span className="text-white font-semibold text-2xl">Studios</span>
                        </div>
                        <p className="text-slate-400 text-sm">Admin Portal</p>
                    </div>

                    {status && (
                        <div className="mb-4 bg-green-900/40 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm text-center">
                            {status}
                        </div>
                    )}

                    <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8">
                        <h1 className="text-white font-bold text-xl mb-6">Sign In</h1>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                                    autoFocus
                                    autoComplete="email"
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors"
                                    autoComplete="current-password"
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="accent-[#C9A96E]"
                                />
                                Remember me
                            </label>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#C9A96E] text-[#0f172a] font-bold py-3 rounded-lg hover:bg-[#b8934f] transition-colors disabled:opacity-60"
                            >
                                {processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
