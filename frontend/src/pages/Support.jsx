import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LifeBuoy, Plus, MessageSquare, Send, CheckCircle2, Clock, X } from 'lucide-react';

export function Support() {
  const [searchParams] = useSearchParams();
  const linkedOrder = searchParams.get('order_id') || '';

  const { addToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(!!linkedOrder);

  // New ticket state
  const [subject, setSubject] = useState(linkedOrder ? `Inquiry regarding ${linkedOrder}` : '');
  const [orderId, setOrderId] = useState(linkedOrder);
  const [priority, setPriority] = useState('NORMAL');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      setLoading(true);
      try {
        const data = await api.get('/support/tickets');
        setTickets(data || []);
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const newTicket = await api.post('/support/tickets', {
        subject,
        order_id: orderId || null,
        priority,
        message
      });

      setTickets(prev => [newTicket, ...prev]);
      addToast(`Ticket ${newTicket.ticket_id} submitted successfully!`, 'success');
      setModalOpen(false);
      setSubject('');
      setMessage('');
      setOrderId('');
    } catch (err) {
      addToast('Failed to submit ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-h1">Customer Support Operations</h1>
          <p className="text-muted text-sm">
            Submit questions, order delivery inquiries, or warranty claims
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Open New Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tickets.map(ticket => {
          const isResolved = ticket.status === 'RESOLVED';

          return (
            <div key={ticket.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono text-xs text-muted font-bold">{ticket.ticket_id}</span>
                    {ticket.order_id && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                        Order #{ticket.order_id}
                      </span>
                    )}
                    <span className="text-xs text-muted">
                      {new Date(ticket.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-h3" style={{ marginTop: '4px' }}>{ticket.subject}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Badge variant={isResolved ? 'IN_STOCK' : 'LOW_STOCK'} size="sm">
                    {ticket.status}
                  </Badge>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    Priority: {ticket.priority}
                  </span>
                </div>
              </div>

              {/* Message from customer */}
              <div style={{
                backgroundColor: 'var(--color-surface-2)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                color: 'var(--color-text)'
              }}>
                <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: '2px' }}>Your Inquiry:</div>
                {ticket.message}
              </div>

              {/* Automated Agent / Specialist Reply */}
              {ticket.agent_reply && (
                <div style={{
                  backgroundColor: 'var(--color-ai-surface)',
                  borderLeft: '3px solid var(--color-ai-border)',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 6px 6px 0',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--color-ai-text)', fontWeight: 600, fontSize: '0.8rem' }}>
                    <MessageSquare size={14} /> ShopSmart Support Agent
                  </div>
                  <p style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {ticket.agent_reply}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Ticket Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className="text-h3">Create Support Ticket</h2>
              <button onClick={() => setModalOpen(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Subject
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="E.g., Return query or delivery delay"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Linked Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    className="input font-mono"
                    placeholder="ORD-8492"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Priority
                  </label>
                  <select
                    className="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Detailed Message
                </label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Describe your issue or request in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={submitting} icon={<Send size={14} />}>
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
