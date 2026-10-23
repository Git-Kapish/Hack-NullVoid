import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, BookOpen, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1rem 2rem',
        maxWidth: '840px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div className="badge badge-ai" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', gap: '0.4rem' }}>
          <Sparkles size={14} /> Autonomous E-Commerce Assistant Platform
        </div>
        
        <h1 className="text-display" style={{ letterSpacing: '-0.02em' }}>
          Shop smarter with explainable AI & verified catalog facts
        </h1>

        <p className="text-muted text-body" style={{ fontSize: '1.15rem', maxWidth: '680px' }}>
          Describe what you need in plain English. Get grounded recommendations backed by live inventory, verified policy answers cited directly from source documents, and real-time order tracking.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            <ShoppingBag size={18} /> Browse Catalog
          </Link>
          <Link to="/assistant" className="btn btn-ai" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            <Sparkles size={18} /> Ask AI Assistant
          </Link>
          <Link to="/policies" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            <BookOpen size={18} /> Policy Q&A
          </Link>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        <div className="card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-ai-surface)',
            color: 'var(--color-ai-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Sparkles size={20} />
          </div>
          <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Grounded Recommendations</h3>
          <p className="text-muted text-sm">
            AI interprets your intent, budget, and constraints, ranking real catalog items. Prices and availability are always sourced directly from database records, never hallucinated.
          </p>
        </div>

        <div className="card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-info-bg)',
            color: 'var(--color-info-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <BookOpen size={20} />
          </div>
          <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Policy Answers with Sources</h3>
          <p className="text-muted text-sm">
            Ask any warranty or return question. Our RAG engine searches active policies with PgVector, cites document, section, and version, and safely abstains when evidence is missing.
          </p>
        </div>

        <div className="card">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Truck size={20} />
          </div>
          <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Simulated Tracking & Support</h3>
          <p className="text-muted text-sm">
            Track order delivery milestones in a clean timeline. Need assistance? Authorized AI tools look up orders and open verified support tickets with full audit trails.
          </p>
        </div>
      </section>

      {/* Demo Persona Quick-Switch Note */}
      <section className="card" style={{ backgroundColor: 'var(--color-surface-2)', textAlign: 'center', padding: '1.75rem' }}>
        <h4 className="text-h3" style={{ marginBottom: '0.5rem' }}>Quick Persona Access</h4>
        <p className="text-muted text-sm" style={{ maxWidth: '600px', margin: '0 auto 1.25rem' }}>
          Test the system across all tiers and administrative controls.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-neutral">Admin (Upload & Audit)</span>
          <span className="badge badge-neutral">Basic Tier Customer</span>
          <span className="badge badge-neutral">Prime Tier Customer</span>
          <span className="badge badge-neutral">Premium Tier Customer</span>
        </div>
      </section>
    </div>
  );
}
