import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { DEMO_PERSONAS } from '../data/mockData';
import { ShieldCheck, Sparkles, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('david.basic@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('expired') === 'true';

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.access_token, res.user);
      addToast(`Logged in as ${res.user.name} (${res.user.role})`, 'success');
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = async (persona) => {
    setEmail(persona.email);
    setPassword('demoPass123!');
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email: persona.email, password: 'demoPass123!' });
      login(res.access_token, res.user);
      addToast(`Switched persona to ${res.user.name}`, 'success');
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Persona switch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '920px',
      margin: '2rem auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '2rem',
      alignItems: 'stretch'
    }}>
      {/* Left Info Column */}
      <div className="card" style={{
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem'
      }}>
        <div>
          <div className="badge badge-ai" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> Hackathon Live Demo Ready
          </div>

          <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>
            Quick-Fill Persona Switcher
          </h2>

          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Switch roles and membership tiers with a single click to test role-based access control, tiered return policies, and simulated shipping perks.
          </p>

          {/* Persona Buttons List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DEMO_PERSONAS.map(p => {
              const isAdmin = p.role === 'ADMIN';
              return (
                <div
                  key={p.email}
                  onClick={() => handleSelectPersona(p)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface-elevated)',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{p.name}</strong>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {isAdmin && <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>ADMIN</span>}
                      <Badge variant={p.membership_tier} size="sm">{p.membership_tier}</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted font-mono">{p.email}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{p.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          JWT Stateless Auth with object-level ownership enforcement.
        </div>
      </div>

      {/* Right Login Card */}
      <div className="card card-elevated" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>Sign In</h2>
        <p className="text-sm text-muted" style={{ marginBottom: '1.5rem' }}>
          Enter your credentials or pick a demo persona from the left.
        </p>

        {sessionExpired && (
          <div style={{
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning-text)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            Your session expired or was unauthorized. Please sign in again.
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger-text)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.25rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.25rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<ArrowRight size={16} />}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Authenticate & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
