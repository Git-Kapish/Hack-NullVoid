import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('audio');
  const [openFaq, setOpenFaq] = useState(0);

  const faqItems = [
    {
      q: 'What is the return window for Prime and Premium members?',
      a: 'Basic customers have 14 days, Prime members receive 30 days, and Premium VIP members enjoy 60 days with free doorstep courier pickup.'
    },
    {
      q: 'How does ShopSmart AI prevent hallucinated prices and stock?',
      a: 'AI recommendations are constrained strictly to database records. The LLM extracts shopping intent and constraints, and candidate products are queried deterministically from our verified catalog.'
    },
    {
      q: 'Does standard warranty cover accidental hardware damage?',
      a: 'Standard 1-year warranty covers manufacturing defects. However, Premium VIP tier members automatically receive 1 complimentary accidental damage incident replacement within 12 months.'
    },
    {
      q: 'How fast is delivery for Prime orders?',
      a: 'Orders placed before 2:00 PM local time qualify for guaranteed free 2-day delivery for Prime members, and same-day priority dispatch for Premium members.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3.5rem 1rem 1rem',
        maxWidth: '880px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative'
      }}>
        {/* Glowing Announcement Pill */}
        <div
          className="badge badge-ai"
          style={{
            fontSize: '0.85rem',
            padding: '0.4rem 0.95rem',
            gap: '0.45rem',
            boxShadow: '0 0 16px var(--color-ai-glow)'
          }}
        >
          <Sparkles size={15} />
          <span>Enterprise Autonomous Shopping Platform</span>
        </div>

        <h1 className="text-display">
          Find the right product. <br />
          <span style={{
            background: 'var(--gradient-ai)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Grounded in verified catalog facts.
          </span>
        </h1>

        <p className="text-muted text-body" style={{ fontSize: '1.15rem', maxWidth: '640px', lineHeight: 1.6 }}>
          Describe what you need in plain English. Get grounded recommendations backed by live inventory, side-by-side spec comparisons, and real-time simulated order tracking.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="primary"
            size="lg"
            icon={<ShoppingBag size={18} />}
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>

          <Button
            variant="ai"
            size="lg"
            icon={<Sparkles size={18} />}
            onClick={() => navigate('/assistant')}
          >
            Ask ShopSmart AI
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={<Layers size={18} />}
            onClick={() => navigate('/compare')}
          >
            Compare Products
          </Button>
        </div>
      </section>

      {/* Interactive Agent Mockup (Wrapper.framer.ai inspired) */}
      <section style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        <div className="card glass-card" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          {/* Mockup Window Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              <span className="text-xs text-muted" style={{ marginLeft: '8px', fontWeight: 600 }}>
                ShopSmart AI Agent Preview
              </span>
            </div>

            {/* Demo Tabs */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-surface)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setActiveTab('audio')}
                style={{
                  background: activeTab === 'audio' ? 'var(--color-primary)' : 'none',
                  color: activeTab === 'audio' ? '#fff' : 'var(--color-text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Audio Assistant Demo
              </button>
              <button
                onClick={() => setActiveTab('laptops')}
                style={{
                  background: activeTab === 'laptops' ? 'var(--color-primary)' : 'none',
                  color: activeTab === 'laptops' ? '#fff' : 'var(--color-text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Laptop Assistant Demo
              </button>
            </div>
          </div>

          {/* Mockup Window Body */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)' }}>
            {activeTab === 'audio' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="message-bubble message-user" style={{ fontSize: '0.9rem' }}>
                    "I want wireless noise canceling headphones under $350 with great battery life"
                  </div>
                </div>

                <div className="ai-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Catalog Grounded Response</span>
                    </div>
                    <Badge variant="IN_STOCK" size="sm">Verified Stock</Badge>
                  </div>

                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    Interpreted requirement: Wireless over-ear headphones with ANC and ≥30h battery under $350. Sourced 2 verified products matching current inventory:
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                    <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.85rem' }}>Sony WH-1000XM5</strong>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>$349.99</span>
                      </div>
                      <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                        Industry-leading ANC with 30h battery. Exactly hits your $350 ceiling.
                      </p>
                    </div>

                    <div className="card" style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.85rem' }}>Sennheiser Momentum 4</strong>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>$279.95</span>
                      </div>
                      <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                        Massive 60h battery life with adaptive ANC, well under budget.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="message-bubble message-user" style={{ fontSize: '0.9rem' }}>
                    "Find a thin and powerful laptop with at least 16GB RAM for under $1400"
                  </div>
                </div>

                <div className="ai-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Catalog Grounded Response</span>
                    </div>
                    <Badge variant="IN_STOCK" size="sm">Verified Stock</Badge>
                  </div>

                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    Interpreted requirement: Ultrabook form factor, 16GB+ unified RAM, budget ceiling $1,400. Sourced 1 optimal match:
                  </p>

                  <div className="card" style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.9rem' }}>Apple MacBook Air 15" M3</strong>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>$1,299.00</span>
                    </div>
                    <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                      16GB Unified Memory, Apple M3 8-core CPU / 10-core GPU, up to 18h battery life, and 15.3" Liquid Retina display.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section style={{ textAlign: 'center' }}>
        <p className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          Grounded In Inventory From Leading Hardware Brands
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2.5rem',
          alignItems: 'center',
          opacity: 0.75
        }}>
          {['SONY', 'APPLE', 'BOSE', 'SENNHEISER', 'DELL', 'LENOVO', 'GARMIN', 'LOGITECH', 'KEYCHRON'].map(brand => (
            <span
              key={brand}
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)'
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 3 Bento Pillar Cards */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="text-h2">Designed For Certainty, Grounded In Reality</h2>
          <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>
            Where LLM reasoning meets verifiable enterprise data integrity.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-ai-surface-2)',
              color: 'var(--color-ai-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} />
            </div>
            <h3 className="text-h3">Grounded Recommendations</h3>
            <p className="text-sm text-muted">
              AI interprets natural constraints, extracting intent and budgets. Prices and availability are always verified against real catalog records, never hallucinated.
            </p>
            <Link to="/assistant" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
              Launch Assistant <ChevronRight size={14} />
            </Link>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-info-bg)',
              color: 'var(--color-info-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} />
            </div>
            <h3 className="text-h3">Side-by-Side Comparison</h3>
            <p className="text-sm text-muted">
              Pin up to 4 items in a sticky compare tray to evaluate detailed technical specifications with an instant difference highlighting filter.
            </p>
            <Link to="/compare" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
              Open Comparison Matrix <ChevronRight size={14} />
            </Link>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} />
            </div>
            <h3 className="text-h3">End-to-End Order Tracking</h3>
            <p className="text-sm text-muted">
              Simulate cart checkout and trace orders across automated fulfillment milestones: Placed, Processing, Shipped, Out for Delivery, and Delivered.
            </p>
            <Link to="/orders" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
              View Orders <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-h2">Explore Curated Categories</h2>
            <p className="text-muted text-sm">Verified inventory ready for rapid dispatch.</p>
          </div>
          <Link to="/products" style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Catalog <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { id: 'audio', name: 'Audio & Sound', count: '4 Items', desc: 'Active noise cancellation & studio monitors' },
            { id: 'laptops', name: 'Laptops & Computers', count: '3 Items', desc: 'Apple M3 silicon & Intel AI NPUs' },
            { id: 'wearables', name: 'Smart Wearables', count: '3 Items', desc: 'Titanium chassis & GPS sport watches' },
            { id: 'accessories', name: 'Keyboards & Peripherals', count: '4 Items', desc: 'Precision 8K mice & mechanical switches' }
          ].map(cat => (
            <div
              key={cat.id}
              className="card"
              onClick={() => navigate(`/products?category=${cat.id}`)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                padding: '1.25rem'
              }}
            >
              <span className="text-xs text-muted font-mono">{cat.count}</span>
              <h4 className="text-h3" style={{ fontSize: '1.05rem' }}>{cat.name}</h4>
              <p className="text-xs text-muted">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Policy FAQ Accordion */}
      <section style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="text-h2">Frequently Asked Questions</h2>
          <p className="text-muted text-sm">Customer return windows, warranty terms, and shipping policies.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card"
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                style={{ cursor: 'pointer', padding: '1rem 1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.q}</span>
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>

                {isOpen && (
                  <p className="text-sm text-muted animate-fade-in" style={{ marginTop: '0.75rem', lineHeight: 1.5 }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '3rem',
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingBag size={20} color="var(--color-primary)" />
              ShopSmart AI
            </div>
            <p className="text-xs text-muted" style={{ marginTop: '0.5rem', lineHeight: 1.5 }}>
              Autonomous e-commerce assistant platform combining catalog search, explainable AI recommendations, and real-time shipment tracking.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Catalog</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Link to="/products?category=audio" className="text-muted">Audio & Headphones</Link>
              <Link to="/products?category=laptops" className="text-muted">Laptops & Workstations</Link>
              <Link to="/products?category=wearables" className="text-muted">Wearables</Link>
              <Link to="/compare" className="text-muted">Product Comparison</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>AI & Governance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Link to="/assistant" className="text-muted">Shopping Assistant</Link>
              <Link to="/admin/audit" className="text-muted">AI Decision Auditing</Link>
              <Link to="/support" className="text-muted">Support Operations</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Account</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Link to="/login" className="text-muted">Persona Switcher / Login</Link>
              <Link to="/orders" className="text-muted">Track Orders</Link>
              <Link to="/cart" className="text-muted">Cart & Checkout</Link>
              <Link to="/account/preferences" className="text-muted">Shopping Preferences</Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-text-subtle)'
        }}>
          <div>© 2026 ShopSmart AI • Hack-NullVoid • Modular Monolith Implementation</div>
          <div>React 19 + FastAPI + PgVector Architecture</div>
        </div>
      </footer>
    </div>
  );
}
