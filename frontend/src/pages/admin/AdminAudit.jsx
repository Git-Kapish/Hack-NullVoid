import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ShieldCheck, Sparkles, Code, Clock, User, Filter, Eye, X } from 'lucide-react';

export function AdminAudit() {
  const [activeTab, setActiveTab] = useState('decisions');
  const [auditLogs, setAuditLogs] = useState([]);
  const [decisionLogs, setDecisionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectItem, setInspectItem] = useState(null);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await api.get('/admin/audit');
        setAuditLogs(data.audit_logs || []);
        setDecisionLogs(data.decision_logs || []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-neutral">Governance & Security</span>
          </div>
          <h1 className="text-h1" style={{ marginTop: '4px' }}>AI Decision & Security Audit Logs</h1>
          <p className="text-muted text-sm">
            Auditable records of all autonomous AI recommendations, shopping interactions, and transactional events
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-surface-2)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setActiveTab('decisions')}
            style={{
              background: activeTab === 'decisions' ? 'var(--color-surface)' : 'none',
              color: activeTab === 'decisions' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'decisions' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            AI Decision Logs
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{
              background: activeTab === 'security' ? 'var(--color-surface)' : 'none',
              color: activeTab === 'security' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'security' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Security Audit Events
          </button>
        </div>
      </div>

      {activeTab === 'decisions' ? (
        /* AI Decision Logs */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {decisionLogs.map(dec => (
            <div key={dec.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-ai-surface-2)',
                    color: 'var(--color-ai-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={14} />
                  </div>
                  <span className="font-mono text-xs font-bold">{dec.request_id}</span>
                  <span className="text-xs text-muted font-tabular">
                    {new Date(dec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>Model: {dec.model}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Tokens: {dec.tokens_used}</span>
                  <Button variant="ghost" size="sm" icon={<Code size={13} />} onClick={() => setInspectItem(dec)}>
                    Raw JSON
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted" style={{ fontWeight: 600 }}>USER PROMPT:</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>"{dec.prompt}"</div>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface-2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: '2px' }}>
                  INTERPRETED REQUIREMENT:
                </div>
                <div style={{ color: 'var(--color-text)' }}>{dec.interpreted_requirement}</div>
              </div>

              <div style={{
                backgroundColor: 'var(--color-ai-surface)',
                borderLeft: '3px solid var(--color-ai-border)',
                padding: '0.85rem',
                borderRadius: '0 6px 6px 0',
                fontSize: '0.85rem'
              }}>
                <div className="text-xs" style={{ fontWeight: 600, color: 'var(--color-ai-text)', marginBottom: '2px' }}>
                  EXPLANATION & VERIFICATION RATIONALE:
                </div>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>{dec.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Security Audit Events */
        <div className="table-container card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource Type</th>
                <th>Resource ID</th>
                <th>Outcome</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-muted">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="font-mono text-xs font-bold">{log.actor}</td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                  </td>
                  <td className="text-xs text-muted">{log.resource_type}</td>
                  <td className="font-mono text-xs">{log.resource_id}</td>
                  <td>
                    <Badge variant={log.outcome === 'SUCCESS' ? 'IN_STOCK' : 'OUT_OF_STOCK'} size="sm">
                      {log.outcome}
                    </Badge>
                  </td>
                  <td className="text-xs" style={{ maxWidth: '280px' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* JSON Inspector Modal */}
      {inspectItem && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={16} /> Raw AI Decision Payload
              </div>
              <button onClick={() => setInspectItem(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <pre
              className="font-mono"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                overflowX: 'auto',
                lineHeight: 1.5,
                color: 'var(--color-text)'
              }}
            >
              {JSON.stringify(inspectItem, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
