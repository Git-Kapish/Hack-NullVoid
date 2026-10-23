import React, { useState } from 'react';
import { knowledgeApi } from '../api/knowledge';
import AdminKnowledgeTab from '../components/AdminKnowledgeTab';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('ask'); // 'ask' or 'admin'
  const [question, setQuestion] = useState('');
  const [region, setRegion] = useState('US');
  const [membershipTier, setMembershipTier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const demoQuestions = [
    {
      title: 'Opened Laptop Return',
      query: 'What is the return window for an opened laptop and what condition must it be in?',
      region: 'US',
    },
    {
      title: 'Shipping & Delivery',
      query: 'How are shipping estimates calculated and are delivery dates guaranteed?',
      region: 'US',
    },
    {
      title: 'Smartphone Warranty',
      query: 'What does the smartphone limited warranty cover and what are the exclusions?',
      region: 'US',
    },
    {
      title: 'Unanswerable (Safe Abstention)',
      query: 'What exact date will my bank post my refund to my credit card account?',
      region: 'US',
    },
    {
      title: 'UK Regional Shipping',
      query: 'How are shipping estimates calculated under UK delivery policies?',
      region: 'UK',
    },
  ];

  const handleAsk = async (queryText = question, targetRegion = region) => {
    const q = queryText.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await knowledgeApi.askQuestion({
        question: q,
        region: targetRegion,
        membershipTier: membershipTier || null,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to retrieve answer from Knowledge service.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demo) => {
    setQuestion(demo.query);
    setRegion(demo.region);
    handleAsk(demo.query, demo.region);
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case 'HIGH':
        return {
          bg: '#064e3b',
          color: '#34d399',
          border: '#059669',
          label: 'HIGH CONFIDENCE (Strict Grounding)',
        };
      case 'MEDIUM':
        return {
          bg: '#78350f',
          color: '#fcd34d',
          border: '#d97706',
          label: 'MEDIUM CONFIDENCE (Single-Chunk Grounding)',
        };
      case 'LOW':
      default:
        return {
          bg: '#7f1d1d',
          color: '#f87171',
          border: '#dc2626',
          label: 'LOW CONFIDENCE (Safe Abstention)',
        };
    }
  };

  return (
    <div className="knowledge-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', color: '#f8fafc' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #334155', marginBottom: '1rem', fontSize: '0.85rem', color: '#38bdf8' }}>
          <span>🛡️ Official Enterprise Policies</span>
          <span>•</span>
          <span>PgVector Powered</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 0.75rem 0', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Policy & Knowledge Assistant
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
          Answers that show their work — fully grounded with database-verified document title, section, and version citations.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('ask')}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: activeTab === 'ask' ? '1px solid #38bdf8' : '1px solid #334155',
              backgroundColor: activeTab === 'ask' ? '#0369a1' : '#1e293b',
              color: '#fff',
              transition: 'all 0.2s',
            }}
          >
            💬 Ask Policy Question
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: activeTab === 'admin' ? '1px solid #38bdf8' : '1px solid #334155',
              backgroundColor: activeTab === 'admin' ? '#0369a1' : '#1e293b',
              color: '#fff',
              transition: 'all 0.2s',
            }}
          >
            📂 Document Repository & Uploads (Admin)
          </button>
        </div>
      </div>

      {activeTab === 'admin' ? (
        <AdminKnowledgeTab />
      ) : (
        <div>
          {/* Demo Chips Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Try Demo Policy Questions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.6rem' }}>
              {demoQuestions.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoClick(demo)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.backgroundColor = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.backgroundColor = '#1e293b';
                  }}
                >
                  💡 {demo.title}
                </button>
              ))}
            </div>
          </div>

          {/* Search Card & Filters */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask any policy question (e.g., 'What is the return period for an opened laptop?')..."
                  required
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.25rem',
                    fontSize: '1rem',
                    backgroundColor: '#0f172a',
                    border: '1px solid #475569',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '0 1.75rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    minWidth: '120px',
                  }}
                >
                  {loading ? 'Searching...' : 'Ask AI'}
                </button>
              </div>

              {/* Retrieval Metadata Filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span style={{ fontWeight: 600 }}>SQL Filters:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <label>Region:</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    style={{ backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '6px', padding: '0.25rem 0.6rem' }}
                  >
                    <option value="ALL">ALL (Global)</option>
                    <option value="US">US Policies</option>
                    <option value="UK">UK Policies</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <label>Membership Tier:</label>
                  <select
                    value={membershipTier}
                    onChange={(e) => setMembershipTier(e.target.value)}
                    style={{ backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '6px', padding: '0.25rem 0.6rem' }}
                  >
                    <option value="">Any Tier</option>
                    <option value="BASIC">Basic</option>
                    <option value="PRIME">Prime</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px dashed #334155' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⏳</div>
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>Searching Policy Knowledge Vectors...</div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Executing pgvector cosine search and metadata filtering in database.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#450a0a', border: '1px solid #b91c1c', borderRadius: '12px', color: '#fca5a5', marginBottom: '1.5rem' }}>
              <strong>Error querying knowledge assistant:</strong> {error}
            </div>
          )}

          {/* Response Output Card */}
          {result && (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              {/* Header with Confidence Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                  AI Grounded Response
                </span>
                {(() => {
                  const badge = getConfidenceBadge(result.confidence || 'LOW');
                  return (
                    <span
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        padding: '0.35rem 0.85rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              {/* Abstention / Follow-up Alert Banner */}
              {result.followUpRequired && (
                <div style={{ backgroundColor: '#451a03', border: '1px solid #d97706', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#fed7aa', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#fef3c7' }}>Follow-up Required / Unconfirmed Policy</strong>
                    <span style={{ fontSize: '0.85rem' }}>
                      The store policy documents do not contain verifiable facts for this question. The assistant safely abstained rather than guessing or hallucinating details.
                    </span>
                  </div>
                </div>
              )}

              {/* Answer Content */}
              <div style={{ fontSize: '1.15rem', lineHeight: 1.6, color: '#f1f5f9', marginBottom: '2rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
                {result.answer || "The policy documents do not support an answer."}
              </div>

              {/* Sources Attribution */}
              {(() => {
                const verifiedSources = Array.isArray(result.sources) ? result.sources : [];
                return (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                      Verified Citations ({verifiedSources.length} sources):
                    </h4>
                    {verifiedSources.length === 0 ? (
                      <p style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                        No supporting policy document cited (safe abstention outcome).
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {verifiedSources.map((src, i) => (
                          <div
                            key={i}
                            style={{
                              backgroundColor: '#0f172a',
                              border: '1px solid #334155',
                              borderRadius: '8px',
                              padding: '0.6rem 1rem',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <span style={{ color: '#38bdf8' }}>📄</span>
                            <strong style={{ color: '#e2e8f0' }}>{src.document || 'Policy Document'}</strong>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span style={{ color: '#cbd5e1' }}>{src.section || 'General'}</span>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span style={{ color: '#a78bfa', fontWeight: 600 }}>v{src.version || '2026.1'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
