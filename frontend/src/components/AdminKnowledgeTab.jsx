import React, { useState, useEffect } from 'react';
import { knowledgeApi } from '../api/knowledge';

export default function AdminKnowledgeTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('2026.1');
  const [docType, setDocType] = useState('MARKDOWN');
  const [region, setRegion] = useState('ALL');
  const [category, setCategory] = useState('General');
  const [membershipTier, setMembershipTier] = useState('ALL');
  const [file, setFile] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await knowledgeApi.listDocuments(0, 100);
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await knowledgeApi.seedCorpus();
      setSuccess(`Corpus seeded successfully: ${res.seeded_count} documents ingested, ${res.skipped_count} existing versions skipped.`);
      await fetchDocs();
    } catch (err) {
      setError(err.message || 'Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload (PDF, Markdown, or JSON).');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('version', version);
    formData.append('document_type', docType);
    formData.append('region', region);
    formData.append('category', category);
    formData.append('membership_tier', membershipTier === 'ALL' ? '' : membershipTier);

    try {
      const res = await knowledgeApi.uploadDocument(formData);
      setSuccess(`Document "${res.title}" v${res.version} published with ${res.chunkCount} vector chunks!`);
      setTitle('');
      setFile(null);
      // Reset file input element
      const fileInput = document.getElementById('knowledge-file-input');
      if (fileInput) fileInput.value = '';
      await fetchDocs();
    } catch (err) {
      if (err.status === 409) {
        setError(`Conflict (409): Version "${version}" of "${title}" already exists. Published versions are immutable. Please increment the version.`);
      } else {
        setError(err.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-knowledge-container" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Approved Document Repository</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Manage immutable enterprise policy versions and vector embeddings.
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: seeding ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {seeding ? '⚡ Seeding Corpus...' : '⚡ Seed Default 89-Policy Corpus'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#f0fdf4', border: '1px solid #4ade80', color: '#166534', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <strong>Success: </strong> {success}
        </div>
      )}

      {/* Upload Form Card */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: '1rem', color: '#f8fafc' }}>
          Publish New Policy Document
        </h3>
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Electronics Warranty Policy"
                required
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Version * (e.g. 2026.1)</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="2026.1"
                required
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Document Format *</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value="MARKDOWN">Markdown (.md)</option>
                <option value="PDF">PDF (.pdf)</option>
                <option value="JSON">JSON (.json)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Target Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value="ALL">ALL (Global)</option>
                <option value="US">US</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Returns, Warranties, Shipping"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Membership Tier</label>
              <select
                value={membershipTier}
                onChange={(e) => setMembershipTier(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value="ALL">ALL (All Customers)</option>
                <option value="BASIC">BASIC</option>
                <option value="PRIME">PRIME</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Select File (max 2MB) *</label>
            <input
              id="knowledge-file-input"
              type="file"
              accept=".md,.markdown,.pdf,.json"
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
              style={{ color: '#94a3b8', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Parsing & Chunking Document...' : 'Publish & Ingest Document'}
          </button>
        </form>
      </div>

      {/* Document Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', color: '#f8fafc' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.8rem 1rem' }}>Title</th>
              <th style={{ padding: '0.8rem 1rem' }}>Version</th>
              <th style={{ padding: '0.8rem 1rem' }}>Type</th>
              <th style={{ padding: '0.8rem 1rem' }}>Region</th>
              <th style={{ padding: '0.8rem 1rem' }}>Category</th>
              <th style={{ padding: '0.8rem 1rem' }}>Tier</th>
              <th style={{ padding: '0.8rem 1rem' }}>Status</th>
              <th style={{ padding: '0.8rem 1rem' }}>Chunks</th>
              <th style={{ padding: '0.8rem 1rem' }}>Effective</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading documents...</td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No documents published yet. Click "Seed Default 89-Policy Corpus" above to load the store policies!
                </td>
              </tr>
            ) : (
              documents.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{d.title}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#38bdf8' }}>v{d.version}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#334155', borderRadius: '4px', fontSize: '0.75rem' }}>{d.documentType}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>{d.region}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#cbd5e1' }}>{d.category}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{d.membershipTier || 'ALL'}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: d.status === 'PUBLISHED' || d.status === 'APPROVED' ? '#065f46' : '#7f1d1d',
                      color: d.status === 'PUBLISHED' || d.status === 'APPROVED' ? '#34d399' : '#f87171',
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#a78bfa' }}>{d.chunkCount}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#94a3b8', fontSize: '0.8rem' }}>{d.effectiveDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
