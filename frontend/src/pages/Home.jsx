import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Lock, 
  RotateCw, 
  Share2, 
  Plus, 
  Mic, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Folder, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  FileText, 
  Database, 
  TrendingUp,
  Cpu,
  ShoppingBag,
  Package,
  Sliders,
  Check
} from 'lucide-react';

import barbaraImg from '../assets/barbara_portrait.jpg';
import leslieImg from '../assets/leslie_portrait.jpg';

export function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(0);
  const [hoveredDay, setHoveredDay] = useState(4); // default Thursday (peak)
  const [testimonyIndex, setTestimonyIndex] = useState(0);
  const [agentInput, setAgentInput] = useState('');

  // Weekly performance chart data (matches Wrapper Framer screenshot)
  const chartDays = [
    { name: 'Mon', valThis: 142, valLast: 128 },
    { name: 'Tue', valThis: 154, valLast: 135 },
    { name: 'Wed', valThis: 168, valLast: 144 },
    { name: 'Thu', valThis: 184, valLast: 150 }, // Peak
    { name: 'Fri', valThis: 162, valLast: 148 },
    { name: 'Sat', valThis: 138, valLast: 130 },
    { name: 'Sun', valThis: 145, valLast: 132 },
  ];

  // FAQ Items matching wrapper.framer.ai
  const faqList = [
    {
      q: 'What is your AI platform?',
      a: 'ShopSmart AI is an autonomous enterprise commerce intelligence suite. It combines deterministic catalog verification, multi-agent automated workflows, and pgvector RAG policy grounding to protect retail margins, streamline inventory, and resolve customer claims.'
    },
    {
      q: 'What can teams use the platform for?',
      a: 'Teams use ShopSmart for real-time order inquiries, automated return authorizations, cross-channel inventory rebalancing, SLA compliance auditing, side-by-side spec comparisons, and instant grounded answers to internal and customer queries.'
    },
    {
      q: 'Is the AI safe for business use?',
      a: 'Yes. Every AI decision is grounded against deterministic database facts and verified policy documents. Candidate products are queried directly from the database rather than hallucinated by language models, and all agent decisions are audited in ai_decision_logs with confidence scores.'
    },
    {
      q: 'Can it connect to our existing tools?',
      a: 'Yes. ShopSmart features over 100+ connectors including Shopify, Stripe, QuickBooks, PostgreSQL, Redis, Slack, Zendesk, SAP, and Google Analytics. Agents read live data and report directly inside your existing workflows.'
    },
    {
      q: 'Can we customize the AI for our business?',
      a: 'Absolutely. You can upload custom PDFs, Markdown, and JSON policy documents into our pgvector RAG ingestion pipeline. The system enforces your specific return windows, tier benefits (Basic, Prime, VIP), and regional warranty clauses automatically.'
    },
    {
      q: 'What is the workspace used for?',
      a: 'The workspace provides your team with a centralized console to monitor agent workflows, inspect reasoning traces, run natural language audits across catalogs, and manage team permissions.'
    },
    {
      q: 'Do you offer implementation support?',
      a: 'Yes. We provide dedicated solutions engineering, custom vector schema migration, security policy reviews, and automated CI/CD evaluation pipelines.'
    },
    {
      q: 'How is this different from a chatbot?',
      a: 'Standard chatbots merely generate probabilistic text. ShopSmart agents execute deterministic tools, pull real-time database records, audit calculations, verify policy grounding, and commit stateful transactions across your tech stack.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '5.5rem', paddingBottom: '4rem' }}>
      
      {/* 1. HERO SECTION (Wrapper Framer exact layout) */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        paddingTop: '2.5rem'
      }}>
        {/* Top Headline + Subtext Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'end',
          gap: '2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Left Column: Big Headline + CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h1 className="text-display" style={{ margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              Unlock your <br />
              enterprise intelligence
            </h1>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link 
                to="/products" 
                className="wrapper-pill-primary" 
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                Sign Up
              </Link>
              <Link 
                to="/policies" 
                className="wrapper-pill-secondary" 
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                Book a demo
              </Link>
            </div>
          </div>

          {/* Right Column: Explanatory Subtext */}
          <div style={{ maxWidth: '440px', justifySelf: 'end' }}>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--color-text-muted)',
              margin: 0
            }}>
              Empowering leading commerce teams with agents that protect margins, audit catalog drift, and enforce grounded policies automatically.
            </p>
          </div>
        </div>

        {/* 2. MASSIVE INTERACTIVE APP WINDOW MOCKUP */}
        <div style={{
          maxWidth: '1180px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-window)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Window Chrome / Titlebar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-2)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)'
          }}>
            {/* macOS Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', width: '80px' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FF5F56', display: 'inline-block' }}></span>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FFBD2E', display: 'inline-block' }}></span>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#27C93F', display: 'inline-block' }}></span>
            </div>

            {/* URL / Location Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '9999px',
              padding: '3px 18px',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              maxWidth: '320px',
              width: '100%'
            }}>
              <Lock size={11} />
              <span style={{ fontFamily: 'var(--font-mono)' }}>shopsmart.ai/workspace</span>
              <RotateCw size={11} style={{ marginLeft: '4px', cursor: 'pointer' }} />
            </div>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '80px', justifyContent: 'flex-end' }}>
              <Share2 size={13} style={{ cursor: 'pointer' }} />
              <Plus size={14} style={{ cursor: 'pointer' }} />
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-text)',
                color: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 600
              }}>W</div>
            </div>
          </div>

          {/* Window Body: Sidebar + Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            minHeight: '520px',
            backgroundColor: 'var(--color-bg)'
          }}>
            {/* Sidebar */}
            <div style={{
              borderRight: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              padding: '1.25rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              fontSize: '0.85rem'
            }}>
              {/* Workspace Switcher */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-2)',
                fontWeight: 500
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></span>
                  Wayne Corp
                </span>
                <ChevronDown size={14} color="var(--color-text-muted)" />
              </div>

              {/* Main Navigation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-surface-2)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  <Plus size={14} /> New Agent Chat
                </div>
                <Link to="/policies" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}>
                  <FileText size={14} /> Library (RAG)
                </Link>
                <Link to="/assistant" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}>
                  <Cpu size={14} /> Plugins & Tools
                </Link>
              </div>

              {/* Projects */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-subtle)', paddingLeft: '8px' }}>
                  Projects
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                  <Folder size={13} /> Ace Chemicals
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                  <Folder size={13} /> Janus Cosmetics
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                  <Folder size={13} /> Stagg Enterprises
                </div>
              </div>

              {/* Recent Chats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-subtle)', paddingLeft: '8px' }}>
                  Chats
                </div>
                <div style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-text)', fontWeight: 500 }}>
                  Analyze the financial...
                </div>
                <div style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Follow Andres The...
                </div>
                <div style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Auto email response
                </div>
                <div style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Catalog audit sync
                </div>
              </div>
            </div>

            {/* Main Chat Viewport */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.75rem',
              gap: '1.5rem',
              backgroundColor: 'var(--color-bg)'
            }}>
              {/* Message Thread */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* User Message Bubble */}
                <div style={{ alignSelf: 'flex-end', maxWidth: '380px' }}>
                  <div style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '0.75rem 1.15rem',
                    fontSize: '0.9rem',
                    color: 'var(--color-text)'
                  }}>
                    How did we close out the week?
                  </div>
                </div>

                {/* Agent Thought Container (Wrapper Framer style) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '640px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366F1' }}></span>
                    Thought for 1s
                  </div>

                  {/* Thought Steps Box */}
                  <div style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '3px', backgroundColor: '#635BFF', color: '#fff', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>S</span>
                      <span>Pulled 412 payments from Stripe</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '3px', backgroundColor: '#2CA01C', color: '#fff', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>qb</span>
                      <span>Read 38 expenses in QuickBooks</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '3px', backgroundColor: '#E37400', color: '#fff', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</span>
                      <span>Checked 9,820 sessions in Google Analytics</span>
                    </div>
                  </div>

                  {/* Agent Response Text */}
                  <div style={{ fontSize: '0.925rem', lineHeight: 1.5, color: 'var(--color-text)' }}>
                    Revenue closed at <strong>$184K</strong>, up 23% on last week. CAC is down to $38.
                  </div>

                  {/* Interactive Revenue Line Chart Card (Matches Wrapper Framer screenshot) */}
                  <div style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    maxWidth: '460px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Revenue this week</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span style={{ fontSize: '1.45rem', fontWeight: 600 }}>$184K</span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            ▲ 23%
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '10px', height: '2px', backgroundColor: '#3B82F6', display: 'inline-block' }}></span> This week
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '10px', height: '2px', borderTop: '2px dashed #9CA3AF', display: 'inline-block' }}></span> Last week
                        </span>
                      </div>
                    </div>

                    {/* SVG Spline Chart with Area Gradient */}
                    <div style={{ position: 'relative', width: '100%', height: '100px' }}>
                      <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Horizontal Gridlines */}
                        <line x1="0" y1="20" x2="400" y2="20" stroke="var(--color-border)" strokeDasharray="3 3" />
                        <line x1="0" y1="60" x2="400" y2="60" stroke="var(--color-border)" strokeDasharray="3 3" />

                        {/* Last Week Dashed Line */}
                        <path
                          d="M 20,80 Q 80,68 140,55 T 260,35 T 380,60"
                          fill="none"
                          stroke="var(--color-text-subtle)"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.6"
                        />

                        {/* This Week Area Fill */}
                        <path
                          d="M 20,70 C 80,65 140,40 200,20 C 260,10 320,80 380,70 L 380,95 L 20,95 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* This Week Solid Blue Curve */}
                        <path
                          d="M 20,70 C 80,65 140,40 200,20 C 260,10 320,80 380,70"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2.5"
                        />

                        {/* Highlight Point for Peak */}
                        <circle cx="200" cy="20" r="4.5" fill="#3B82F6" stroke="var(--color-bg)" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Day Labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {chartDays.map((d, i) => (
                        <span 
                          key={d.name}
                          onClick={() => setHoveredDay(i)}
                          style={{
                            cursor: 'pointer',
                            fontWeight: hoveredDay === i ? 600 : 400,
                            color: hoveredDay === i ? 'var(--color-text)' : 'inherit'
                          }}
                        >
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Agent Input Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '9999px',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <Plus size={16} color="var(--color-text-muted)" style={{ cursor: 'pointer' }} />
                  <input
                    type="text"
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    placeholder="Ask ShopSmart anything..."
                    style={{
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigate('/assistant');
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-surface-2)',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)'
                  }}>
                    Opus 5.5 ▾
                  </span>
                  <Mic size={15} color="var(--color-text-muted)" style={{ cursor: 'pointer' }} />
                  <button
                    onClick={() => navigate('/assistant')}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGO MARQUEE: "Trusted by leading enterprises everywhere" */}
      <section style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        padding: '1rem 0'
      }}>
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 400,
          color: 'var(--color-text-muted)',
          letterSpacing: '-0.01em'
        }}>
          Trusted by leading enterprises everywhere
        </div>

        {/* Minimalist Monochrome Logo Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem 4rem',
          opacity: 0.75
        }}>
          {/* Logo 1: Wayne Corp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.2rem' }}>❖</span> WAYNE CORP
          </div>

          {/* Logo 2: Janus Global */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.1rem' }}>✦</span> JANUS GLOBAL
          </div>

          {/* Logo 3: Stagg Enterprises */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.1rem' }}>▲</span> STAGG ENTERPRISES
          </div>

          {/* Logo 4: LexCorp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.1rem' }}>◆</span> LEXCORP
          </div>

          {/* Logo 5: Cyberdyne */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.1rem' }}>◈</span> CYBERDYNE
          </div>

          {/* Logo 6: Omni Consumer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: '1.1rem' }}>◉</span> OMNI CONSUMER
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC BENTO GRID (Wrapper Framer exact layout) */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* BENTO CARD 1: Wherever the work happens (Split 40/60) */}
        <div className="wrapper-card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3rem',
          padding: '3rem'
        }}>
          {/* Left Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '420px' }}>
            <h2 className="text-h1" style={{ margin: 0, fontWeight: 500 }}>
              Wherever the work happens
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              ShopSmart picks up requests in Slack, answers in chat, and reports back in the tools you already use.
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={() => navigate('/assistant')}
                className="wrapper-pill-primary"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                <MessageSquare size={16} /> Add to Slack
              </button>
            </div>
          </div>

          {/* Right Slack Card Preview (Identical to Wrapper screenshot) */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* User Message in Slack */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#3B82F6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                LF
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>lucius</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>4:52 PM</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  how did we close out the week?
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  <span style={{ color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', padding: '1px 5px', borderRadius: '4px' }}>@shopsmart</span> can you pull the numbers?
                </div>
              </div>
            </div>

            {/* Bot Message in Slack */}
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                ●
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>ShopSmart</span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-surface-2)', padding: '1px 5px', borderRadius: '4px', color: 'var(--color-text-muted)' }}>APP</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>4:53 PM</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  Revenue closed at <strong>$184K</strong>, up 23% on last week. CAC is down to $38.
                </div>

                {/* Used Tools Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#635BFF', color: '#fff', fontSize: '0.55rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>S</span>
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#2CA01C', color: '#fff', fontSize: '0.55rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>qb</span>
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#E37400', color: '#fff', fontSize: '0.55rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</span>
                  <span>Used Stripe, QuickBooks, and Google Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO CARD 2: Answers that show their work (Split 60/40 inverted) */}
        <div className="wrapper-card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3rem',
          padding: '3rem'
        }}>
          {/* Left RAG Grounding Verification Card */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-subtle)' }}>
                RAG Grounding Trace
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                SIMILARITY: 0.92 · HIGH
              </span>
            </div>

            <div style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              color: 'var(--color-text)'
            }}>
              <strong>Q:</strong> "Can a Prime customer return an open-box laptop after 25 days?"
            </div>

            {/* Retrieved Citation */}
            <div style={{
              backgroundColor: 'var(--color-surface-2)',
              borderLeft: '3px solid #3B82F6',
              padding: '0.75rem 1rem',
              borderRadius: '4px',
              fontSize: '0.825rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '3px', fontSize: '0.8rem' }}>
                📄 Return_Policy_v2.md §3.1 (Electronics)
              </div>
              "Prime members receive an extended 30-day return window for opened electronics with zero restocking fees..."
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '4px' }}>
                Doc: Return_Policy_v2.md
              </span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '4px' }}>
                Section: §3.1
              </span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '4px' }}>
                Tier: Prime
              </span>
            </div>
          </div>

          {/* Right Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '420px' }}>
            <h2 className="text-h1" style={{ margin: 0, fontWeight: 500 }}>
              Answers that show their work
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Ask in Slack or ShopSmart and our agents pull live records from Stripe, QuickBooks, and verified RAG policy documents, then chart the answer right in the thread.
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <Link 
                to="/policies" 
                className="wrapper-pill-primary"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                Explore integrations
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BENTO ROW: 2 Columns (100+ plugins & Agents that act for you) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Card 3: Over 100+ plugins */}
          <div className="wrapper-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
            {/* Plugins Icon Constellation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              marginBottom: '2rem'
            }}>
              {['Shopify', 'Stripe', 'QuickBooks', 'Postgres', 'Redis', 'Slack', 'Zendesk', 'SAP', 'GitHub', 'Gemini'].map((name, i) => (
                <div key={name} style={{
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)'
                }}>
                  {name.slice(0, 3)}
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-h2" style={{ margin: '0 0 0.5rem' }}>
                Over 100+ plugins
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Integrate with your team's favorite commerce tools and create workflows that were simply impossible before this.
              </p>
            </div>
          </div>

          {/* Card 4: Agents that act for you */}
          <div className="wrapper-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
            {/* Interactive Simulation Input Pill (Matches Wrapper screenshot) */}
            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                Generate infinite cashflow and deposit to <strong>🏦 Checking ...1923</strong> and then reinvest 50% back into <strong>⚡ Tesla</strong> (make no mistakes)
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.75rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={13} />
                  <span style={{ border: '1px solid var(--color-border)', padding: '2px 6px', borderRadius: '4px' }}>
                    🛡 Full Access
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Opus 5.5 ▾</span>
                  <Mic size={13} />
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowUp size={11} />
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-h2" style={{ margin: '0 0 0.5rem' }}>
                Agents that act for you
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Describe what you need and an agent carries it out across your connected accounts, tools, and data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER STORIES / TESTIMONIALS (Wrapper Framer exact layout with portraits) */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Customer stories
            </div>
            <h2 className="text-display" style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500 }}>
              Hear from the teams <br />
              already running on ShopSmart.
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setTestimonyIndex(t => Math.max(0, t - 1))}
              className="btn-outline" 
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
              aria-label="Previous story"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setTestimonyIndex(t => t + 1)}
              className="btn-outline" 
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
              aria-label="Next story"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 4-Card Bento Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch'
        }}>
          {/* Card 1: Barbara Gordon (Photo Background) */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem',
            backgroundImage: `url(${barbaraImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
              <p style={{ fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.4, margin: '0 0 1.25rem' }}>
                “Every precinct asks ShopSmart in plain English now, and nobody argues about the numbers.”
              </p>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Barbara Gordon</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Head of Data, GCPD</div>
            </div>
          </div>

          {/* Card 2: James Gordon (Clean Quote Card) */}
          <div className="wrapper-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
              “Alerts land before the trouble does, with the likely cause already explained. My team acts instead of digging.”
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1E293B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                JG
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>James Gordon</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Commissioner, GCPD</div>
              </div>
            </div>
          </div>

          {/* Card 3: Vicki Vale (Clean Quote Card) */}
          <div className="wrapper-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
              “ShopSmart traced Janus Cosmetics to fourteen shell entities in an afternoon. That used to take my desk three weeks.”
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                VV
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Vicki Vale</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Editor, Gotham Gazette</div>
              </div>
            </div>
          </div>

          {/* Card 4: Leslie Thompkins (Photo Background) */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem',
            backgroundImage: `url(${leslieImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
              <p style={{ fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.4, margin: '0 0 1.25rem' }}>
                “We started with one data source. Now every department runs on the same agents.”
              </p>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Leslie Thompkins</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Director, Thompkins Clinic</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        paddingTop: '2rem'
      }}>
        {/* Left Sticky Title */}
        <div>
          <h2 className="text-display" style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500 }}>
            Frequently <br />
            asked questions
          </h2>
        </div>

        {/* Right Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqList.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={item.q}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  padding: '1.5rem 0',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveFaq(isOpen ? -1 : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {item.q}
                  </span>
                  <ChevronDown 
                    size={18} 
                    color="var(--color-text-muted)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      flexShrink: 0
                    }}
                  />
                </div>

                {isOpen && (
                  <div className="animate-fade-in" style={{
                    marginTop: '1rem',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)'
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div className="wrapper-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-surface)'
        }}>
          <h2 className="text-display" style={{ margin: 0, fontWeight: 500 }}>
            Ready to deploy enterprise commerce agents?
          </h2>
          <p style={{ maxWidth: '580px', fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
            Get started with grounded RAG policies, deterministic catalog search, and multi-agent workflows in minutes.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/products" className="wrapper-pill-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Get Started Free
            </Link>
            <Link to="/policies" className="wrapper-pill-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Schedule Technical Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
export default Home;
