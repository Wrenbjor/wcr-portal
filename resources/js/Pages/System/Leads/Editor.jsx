import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Editor({ lead, html: initialHtml }) {
    const [html, setHtml] = useState(initialHtml);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('code');
    const iframeRef = useRef(null);

    // Update preview whenever html changes or tab switches to preview
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();
        }
    }, [html, activeTab]);

    async function save() {
        setSaving(true);
        setError(null);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const res = await fetch(`/system/leads/${lead.id}/site`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ html }),
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d.message ?? 'Save failed');
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Head title={`Edit ${lead.business_name} — WCR Studios`} />
            <AdminLayout title={`Edit: ${lead.business_name}`}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <button
                        onClick={() => router.visit(`/system/leads/${lead.id}`)}
                        className="text-slate-400 hover:text-white text-sm"
                    >
                        ← Back to Lead
                    </button>
                    <div className="ml-auto flex items-center gap-3">
                        {error && <span className="text-red-400 text-sm">{error}</span>}
                        {saved && <span className="text-green-400 text-sm">✓ Saved to GitHub!</span>}
                        <button
                            onClick={save}
                            disabled={saving}
                            className="bg-[#C9A96E] text-[#0f172a] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8934f] disabled:opacity-60 text-sm"
                        >
                            {saving ? 'Pushing…' : '⬆ Push to GitHub'}
                        </button>
                    </div>
                </div>

                {/* Mobile tab switcher */}
                <div className="flex md:hidden gap-1 mb-3 bg-[#1e293b] rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'code' ? 'bg-[#0f172a] text-white' : 'text-slate-400'
                        }`}
                    >
                        Code
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'preview' ? 'bg-[#0f172a] text-white' : 'text-slate-400'
                        }`}
                    >
                        Preview
                    </button>
                </div>

                {/* Split editor — side-by-side on desktop, tabbed on mobile */}
                <div className="flex gap-4 h-[calc(100vh-230px)] md:h-[calc(100vh-180px)]">
                    {/* Code editor */}
                    <div className={`flex-1 flex-col bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden ${
                        activeTab === 'code' ? 'flex' : 'hidden md:flex'
                    }`}>
                        <div className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs font-medium flex items-center justify-between">
                            <span>HTML Editor</span>
                            <span className="text-slate-600">{html.length.toLocaleString()} chars</span>
                        </div>
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="flex-1 bg-transparent text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
                            spellCheck={false}
                        />
                    </div>

                    {/* Live preview */}
                    <div className={`flex-1 flex-col bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden ${
                        activeTab === 'preview' ? 'flex' : 'hidden md:flex'
                    }`}>
                        <div className="px-4 py-2 border-b border-slate-700 text-slate-400 text-xs font-medium">
                            Live Preview
                        </div>
                        <iframe
                            ref={iframeRef}
                            className="flex-1 bg-white"
                            title="Site preview"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
