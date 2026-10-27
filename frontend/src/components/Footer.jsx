import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, ShieldCheck, Sparkles, Terminal, Activity } from 'lucide-react';
import { Logo } from './common/Logo';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: '4rem 1.5rem 2.5rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '3.5rem'
      }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          justifyContent: 'space-between'
        }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
            <Logo size="md" />

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              margin: 0
            }}>
              Autonomous multi-agent commerce intelligence with verified catalog reasoning and grounded RAG policies.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              width: 'fit-content'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981'
              }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                All AI Agents Operational
              </span>
            </div>
          </div>

          {/* Navigate Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Navigate
            </span>
            <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Home</Link>
            <Link to="/products" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Catalog Explorer</Link>
            <Link to="/assistant" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Autonomous Assistant</Link>
            <Link to="/policies" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Policies & RAG</Link>
            <Link to="/orders" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Order Tracking</Link>
            <Link to="/compare" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Side-by-Side Compare</Link>
          </div>

          {/* Compare Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Compare
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>vs ChatGPT</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>vs Claude 3.7</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>vs Gemini Flash</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>vs Perplexity</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>vs Grokbot</span>
          </div>

          {/* Engage Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Engage
            </span>
            <a 
              href="https://github.com/Git-Kapish/Hack-NullVoid" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              GitHub <ArrowUpRight size={13} />
            </a>
            <Link to="/support" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Customer Support</Link>
            <Link to="/admin/audit" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Audit Logs</Link>
            <Link to="/admin/knowledge" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Knowledge Ingestion</Link>
            <a 
              href="mailto:contact@shopsmart.ai" 
              style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '0.875rem', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              hello@shopsmart.ai <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.825rem',
          color: 'var(--color-text-subtle)'
        }}>
          <div>
            © 2026 ShopSmart AI • Built for Hack-NullVoid • React 19 + FastAPI + pgvector
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/policies" style={{ color: 'var(--color-text-muted)' }}>Privacy Policy</Link>
            <Link to="/policies" style={{ color: 'var(--color-text-muted)' }}>Terms of Service</Link>
            <Link to="/policies" style={{ color: 'var(--color-text-muted)' }}>RAG Grounding Specs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
