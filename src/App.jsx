import React, { useEffect, useRef, useState } from 'react';
import UploadZone from './components/UploadZone.jsx';
import AuditSection from './components/AuditSection.jsx';
import AuditList from './components/AuditList.jsx';
import ShareBar from './components/ShareBar.jsx';
import LoadingAnimation from './components/LoadingAnimation.jsx';
import ChatAssist from './components/ChatAssist.jsx';
import { uploadFile, parseContract } from './services/API.js';
import { loadHistory, upsertDoc } from './services/storage.js';

function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [showAudit, setShowAudit] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => { loadHistory(); }, []);

  const handleFileSelected = async (file) => {
    setError('');
    setSummary(null);
    setLoading(true);
    try {
      const uploadRes = await uploadFile(file);
      const fileRef = uploadRes?.file_path || uploadRes?.fileUrl || uploadRes?.id || uploadRes?.path || file.name;
      let parsed = uploadRes?.summary ? uploadRes : null;
      if (!parsed) parsed = await parseContract(fileRef);

      const s = parsed?.summary || parsed?.data || parsed || [];
      setSummary(s);

      const doc = { id: makeId(), name: file.name, fileRef, summary: s, uploadedAt: new Date().toISOString() };
      upsertDoc(doc);
      setCurrentDoc(doc);

      setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (e) {
      console.error(e);
      setError('Failed to upload or parse the file.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromAudit = (doc) => {
    setCurrentDoc(doc);
    setSummary(doc.summary);
    setShowAudit(false);
    setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">S32 Insights Portal</h1>
        <button onClick={() => setShowAudit((s) => !s)} className="px-3 py-2 text-sm rounded border hover:bg-gray-50">
          {showAudit ? 'Close Audit' : 'Open Audit'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {!summary && (
            <UploadZone onSelectFile={handleFileSelected} disabled={loading} />
          )}

          {loading && (<LoadingAnimation />)}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
          )}

          {summary && (
            <div ref={summaryRef} className="mt-8">
              <ShareBar targetRef={summaryRef} doc={currentDoc} />
              <AuditSection ref={summaryRef} summary={summary} onReset={() => setSummary(null)} />
              <ChatAssist summary={summary} docKey={currentDoc?.id || 'current'} />
            </div>
          )}
        </div>

        <aside className="md:col-span-1">
          {showAudit && (
            <AuditList onSelect={handleSelectFromAudit} />
          )}
        </aside>
      </div>
    </div>
  );
}
