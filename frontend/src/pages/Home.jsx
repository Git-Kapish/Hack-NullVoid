import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { ProductCard } from '../components/commerce/ProductCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Laptop, 
  Watch, 
  Keyboard, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Percent, 
  Star,
  Zap
} from 'lucide-react';
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '../utils/productUtils';
import { useCartWishlist } from '../context/CartWishlistContext';

export function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCartWishlist();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recommendedCategory, setRecommendedCategory] = useState('all');
  const [searchPrompt, setSearchPrompt] = useState('');

  // Live Flash Deal Countdown Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Live Catalog Products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await api.get('/products', { size: 16 });
        const items = res?.items || res?.products || [];
        setProducts(items);
      } catch (err) {
        console.error('Failed to load products for home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Hero Carousel Slides
  const heroSlides = [
    {
      id: 1,
      badge: 'Smart Tech Fest • Limited Time Deals',
      badgeVariant: 'prime',
      title: 'M3 MacBooks & Next-Gen Ultrabooks',
      subtitle: 'Experience groundbreaking efficiency with up to 35% off high-performance laptops. Verified catalog pricing with instant price-match assurance.',
      tagline: 'Up to $250 Off + Free 2-Day Delivery',
      actionText: 'Shop Laptops',
      link: '/products?category=laptops',
      bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(79, 70, 229, 0.16) 50%, rgba(124, 58, 237, 0.1) 100%)',
      accentColor: '#3B82F6',
      featuredImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      specs: ['Apple M3 Silicon', '18h Battery Life', 'Liquid Retina']
    },
    {
      id: 2,
      badge: 'Acoustic Excellence • Flagship Audio',
      badgeVariant: 'ai',
      title: 'Sony WH-1000XM5 & Studio Headphones',
      subtitle: 'Industry-leading noise cancellation engineered with dual AI audio processors for crystal clear acoustics and studio-grade immersion.',
      tagline: 'Save $50 • Prime Exclusive Price',
      actionText: 'Explore Audio',
      link: '/products?category=audio',
      bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.14) 0%, rgba(168, 85, 247, 0.16) 50%, rgba(236, 72, 153, 0.08) 100%)',
      accentColor: '#8B5CF6',
      featuredImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      specs: ['Dual Processor V1', '30hr Battery', 'Adaptive ANC']
    },
    {
      id: 3,
      badge: 'ShopSmart AI Shopping Concierge',
      badgeVariant: 'ai',
      title: 'Tell Us What You Need. We Find It.',
      subtitle: 'Looking for a programming laptop under $1000, or silent mechanical keyboards? Our catalog-grounded AI finds authentic options in seconds.',
      tagline: 'Grounded against live inventory & real specs',
      actionText: 'Launch Assistant',
      link: '/assistant',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.15) 50%, rgba(59, 130, 246, 0.08) 100%)',
      accentColor: '#10B981',
      featuredImg: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      specs: ['Natural Language', 'Zero Hallucinations', 'Live Inventory']
    }
  ];

  // Auto-advance Carousel every 6 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  // Categories with counts and icons
  const categories = [
    { id: 'all', name: 'All Departments', icon: ShoppingBag, link: '/products' },
    { id: 'laptops', name: 'Laptops & Computers', icon: Laptop, link: '/products?category=laptops' },
    { id: 'audio', name: 'Audio & Sound', icon: Headphones, link: '/products?category=audio' },
    { id: 'wearables', name: 'Smart Wearables', icon: Watch, link: '/products?category=wearables' },
    { id: 'accessories', name: 'Keyboards & Peripherals', icon: Keyboard, link: '/products?category=accessories' }
  ];

  // Preset Conversational Shopping Prompt Chips
  const aiPromptChips = [
    { label: '💻 Best laptop under $1000', query: 'suggest a laptop under $1000' },
    { label: '🎧 Noise-cancelling headphones for flights', query: 'noise cancelling headphones for travel' },
    { label: '⌨️ Silent mechanical keyboard for Mac', query: 'mechanical keyboard with Mac support' },
    { label: '⌚ Outdoor fitness watch with GPS', query: 'smartwatch with GPS and heart rate' },
    { label: '🖱️ Ergonomic mouse for long work hours', query: 'ergonomic productivity mouse' }
  ];

  const handleAskAssistant = (query) => {
    navigate(`/assistant?prompt=${encodeURIComponent(query)}`);
  };

  // Filter recommendations
  const filteredRecommendations = products.filter(p => {
    if (recommendedCategory === 'all') return true;
    return p.category === recommendedCategory;
  }).slice(0, 8);

  // Flash deals (curated 4 featured items with discount calculations)
  const flashDeals = products.slice(0, 4).map((item, idx) => {
    const discountPercentages = [25, 20, 18, 15];
    const discountPct = discountPercentages[idx % discountPercentages.length];
    const originalPrice = parseFloat((item.price * (1 + discountPct / 100)).toFixed(2));
    const claimedPcts = [78, 64, 82, 45];
    return {
      ...item,
      discountPct,
      originalPrice,
      claimedPct: claimedPcts[idx % claimedPcts.length]
    };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* 1. Category Quick-Navigation Strip (Flipkart & Amazon style) */}
      <section style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
        <div className="category-strip">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = recommendedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setRecommendedCategory(cat.id);
                  if (cat.id !== 'all') {
                    // Smooth visual category filter
                  }
                }}
                className={`category-pill ${isActive ? 'active' : ''}`}
                style={{
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)'
                }}
              >
                <Icon size={16} />
                <span>{cat.name}</span>
              </button>
            );
          })}

          <Link
            to="/products"
            className="category-pill"
            style={{ marginLeft: 'auto', backgroundColor: 'var(--color-surface-2)', fontWeight: 600 }}
          >
            <span>Full Catalog (16 Items)</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 2. Hero Interactive Deals Carousel (Amazon Hero Banner style) */}
      <section className="hero-carousel-container">
        {heroSlides.map((slide, idx) => {
          if (idx !== currentSlide) return null;
          return (
            <div
              key={slide.id}
              className="hero-slide animate-fade-in"
              style={{
                background: slide.bgGradient
              }}
            >
              {/* Left Column: Text & CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '620px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={slide.badgeVariant} size="sm">
                    <Sparkles size={12} /> {slide.badge}
                  </Badge>
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    • Verified In Stock
                  </span>
                </div>

                <h1 style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  color: 'var(--color-text)'
                }}>
                  {slide.title}
                </h1>

                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  color: 'var(--color-text-muted)',
                  margin: 0
                }}>
                  {slide.subtitle}
                </p>

                {/* Specs Pill List */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.25rem 0' }}>
                  {slide.specs.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(slide.link)}
                    icon={<ArrowRight size={16} />}
                  >
                    {slide.actionText}
                  </Button>

                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: slide.accentColor }}>
                    {slide.tagline}
                  </span>
                </div>
              </div>

              {/* Right Column: Featured Image with Soft Glass Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                height: '240px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'var(--color-surface)',
                marginTop: '1.5rem',
                flexShrink: 0
              }}>
                <img
                  src={slide.featuredImg}
                  alt={slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap size={12} color="#FBBF24" /> Special Deal
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Slide Indicators */}
        <div className="hero-carousel-dots">
          {heroSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlide(dotIdx)}
              className={`carousel-dot ${dotIdx === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Slide Controls */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 5
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 5
          }}
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </section>

      {/* 3. "Today's Flash Deals" (Amazon / Flipkart Lightning Deals) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Today's Flash Deals
              </h2>
              <span className="text-xs text-muted">Limited quantity lightning offers updated hourly</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600 }}>ENDS IN:</span>
            <div className="deal-timer-box">
              <Clock size={13} color="#EF4444" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <Link
              to="/products"
              style={{
                marginLeft: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-primary)'
              }}
            >
              See All Deals →
            </Link>
          </div>
        </div>

        {/* 4 Flash Deal Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.25rem'
        }}>
          {loading ? (
            [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            flashDeals.map((deal) => (
            <div
              key={deal.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {/* Image & Discount Badge */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '70%',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-2)'
              }}>
                <img
                  src={getProductImage(deal)}
                  alt={deal.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                  <span className="deal-discount-badge">
                    <Percent size={11} /> {deal.discountPct}% OFF
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>
                  {deal.brand}
                </span>
                <Link
                  to={`/products/${deal.id}`}
                  style={{
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    lineHeight: 1.35,
                    color: 'var(--color-text)',
                    height: '2.6em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {deal.name}
                </Link>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                  <Star size={13} fill="#FBBF24" color="#FBBF24" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{deal.rating || 4.8}</span>
                  <span className="text-xs text-muted">({deal.reviewCount || 340})</span>
                </div>

                {/* Price Block */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span className="font-tabular" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>
                    ${deal.price.toFixed(2)}
                  </span>
                  <span className="font-tabular text-xs" style={{ textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Claim Meter */}
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                    <span>Claimed: {deal.claimedPct}%</span>
                    <span>Only few left</span>
                  </div>
                  <div className="stock-meter-track">
                    <div className="stock-meter-fill" style={{ width: `${deal.claimedPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => addToCart(deal)}
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Add to Cart
              </Button>
            </div>
          )))}
        </div>
      </section>

      {/* 4. Interactive "Ask ShopSmart AI" Shopping Concierge Spotlight */}
      <section className="ai-spotlight-card">
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(124, 58, 237, 0.14)',
              color: '#7C3AED',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              ✨ SHOPSMART AI COPILOT
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            Smart Shopping Assistance, Grounded in Real Hardware
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.55,
            margin: 0
          }}>
            Ask naturally in plain English. Our multi-agent system filters verified catalog items, checks warranty policies, and validates price constraints without hallucinations.
          </p>

          {/* Prompt Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchPrompt.trim()) handleAskAssistant(searchPrompt.trim());
            }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '640px',
              margin: '0.5rem auto 0',
              backgroundColor: 'var(--color-surface)',
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border-strong)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--color-ai-text)' }}>
              <Sparkles size={18} />
            </div>
            <input
              type="text"
              placeholder="e.g. Suggest a MacBook for coding under $1300..."
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Ask AI
            </Button>
          </form>

          {/* Clickable Preset Intent Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            {aiPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-chip-prompt"
                onClick={() => handleAskAssistant(chip.query)}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "Recommended For You" (AI-Curated Catalog Products) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.85rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Recommended For You
              </h2>
              <Badge variant="ai" size="sm">
                <Sparkles size={11} /> AI Grounded
              </Badge>
            </div>
            <span className="text-xs text-muted">
              Personalized based on active inventory, hardware specifications, and customer ratings
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['all', 'laptops', 'audio', 'accessories'].map(catId => (
              <button
                key={catId}
                onClick={() => setRecommendedCategory(catId)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: recommendedCategory === catId ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: recommendedCategory === catId ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: recommendedCategory === catId ? 'var(--color-on-primary)' : 'var(--color-text)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {catId === 'all' ? 'All Picks' : catId}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid-catalog">
          {loading ? (
            [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            filteredRecommendations.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/products')}
            icon={<ArrowRight size={16} />}
          >
            Explore All 16 Hardware Products in Catalog
          </Button>
        </div>
      </section>

      {/* 6. Customer Trust & Confidence Proposition Bar (Amazon / Flipkart standard) */}
      <section style={{ marginTop: '1rem' }}>
        <div className="trust-grid">
          <div className="trust-item">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Truck size={22} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Fast 2-Day Delivery</div>
              <div className="text-xs text-muted">Free automated dispatch on Prime tier orders</div>
            </div>
          </div>

          <div className="trust-item">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RotateCcw size={22} color="#10B981" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>30-to-60 Day Returns</div>
              <div className="text-xs text-muted">Doorstep pickup with verified RAG claim checks</div>
            </div>
          </div>

          <div className="trust-item">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={22} color="#8B5CF6" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>100% Authentic Specs</div>
              <div className="text-xs text-muted">Direct manufacturer serials and verified warranties</div>
            </div>
          </div>

          <div className="trust-item">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={22} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Decision Transparency</div>
              <div className="text-xs text-muted">Audited recommendations with side-by-side matrices</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
