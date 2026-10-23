import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useCompare } from '../context/CompareContext';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '../utils/productUtils';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const { toggleCompare, isComparing } = useCompare();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', padding: '2rem 0' }}>
        <Skeleton height="400px" borderRadius="var(--radius-md)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton width="30%" height="20px" />
          <Skeleton width="80%" height="36px" />
          <Skeleton width="40%" height="28px" />
          <Skeleton height="100px" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Product not found</h3>
        <Button variant="secondary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  const isFavorite = isWishlisted(product.id);
  const inComparison = isComparing(product.id);
  const isOutOfStock = product.availability === 'OUT_OF_STOCK';

  const handleAskAiAboutProduct = () => {
    navigate(`/assistant?prompt=${encodeURIComponent(`Tell me about the ${product.name} and how its specs compare to alternatives under $${Math.ceil(product.price * 1.2)}`)}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-muted">/</span>
        <Link to="/products" className="text-muted">Catalog</Link>
        <span className="text-muted">/</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Two-Column View */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            width: '100%',
            paddingTop: '75%',
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)'
          }}>
            <img
              src={getProductImage(product, selectedImage)}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {product.images.map((img, idx) => {
                const thumbUrl = typeof img === 'object' && img?.url ? img.url : (typeof img === 'string' ? img : FALLBACK_PRODUCT_IMAGE);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                    }}
                  >
                    <img
                      src={thumbUrl}
                      alt="thumbnail"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted font-mono" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {product.brand} • SKU #{product.id}
            </span>
            <Badge variant={product.availability} size="md">
              {product.availability}
            </Badge>
          </div>

          <h1 className="text-h1" style={{ lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{product.rating}</span>
            <span className="text-muted">({product.reviewCount} customer reviews)</span>
          </div>

          {/* Price Box */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            padding: '1rem 0',
            borderBlock: '1px solid var(--color-border)'
          }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '1.15rem', textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>
              Stock: <strong>{product.stockCount} units</strong> available
            </span>
          </div>

          <p className="text-body text-muted" style={{ lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Purchase Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Quantity Stepper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  padding: '8px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)'
                }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: 600, fontSize: '0.9rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stockCount || 99, q + 1))}
                style={{
                  padding: '8px 14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)'
                }}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, quantity)}
              icon={<ShoppingCart size={18} />}
              style={{ flex: 1 }}
            >
              {isOutOfStock ? 'Currently Out of Stock' : `Add ${quantity} to Cart`}
            </Button>

            <button
              onClick={() => toggleWishlist(product)}
              className="card"
              style={{
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isFavorite ? '#EF4444' : 'var(--color-text-muted)'
              }}
              title={isFavorite ? 'Saved in wishlist' : 'Save to wishlist'}
            >
              <Heart size={20} fill={isFavorite ? '#EF4444' : 'none'} />
            </button>

            <button
              onClick={() => toggleCompare(product)}
              className="card"
              style={{
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: inComparison ? 'var(--color-primary)' : 'var(--color-text-muted)'
              }}
              title="Compare with other items"
            >
              <Layers size={20} />
            </button>
          </div>

          {/* AI Contextual Shortcut Banner */}
          <div
            className="ai-card"
            style={{
              padding: '0.9rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              cursor: 'pointer'
            }}
            onClick={handleAskAiAboutProduct}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Ask ShopSmart AI About This Product</div>
                <div className="text-xs" style={{ opacity: 0.85 }}>Compare with competitors, check compatibility & warranty</div>
              </div>
            </div>
            <Button variant="ai" size="sm">
              Ask AI
            </Button>
          </div>
        </div>
      </div>

      {/* Details & Specs Tabs */}
      <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'specs' ? 700 : 500,
              color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              borderBottom: activeTab === 'specs' ? '2px solid var(--color-primary)' : 'none',
              paddingBottom: '6px'
            }}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'policies' ? 700 : 500,
              color: activeTab === 'policies' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              borderBottom: activeTab === 'policies' ? '2px solid var(--color-primary)' : 'none',
              paddingBottom: '6px'
            }}
          >
            Shipping & Return Coverage
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="table-container">
            <table>
              <tbody>
                {product.specs && Object.entries(product.specs).map(([specKey, specVal]) => (
                  <tr key={specKey}>
                    <td style={{ fontWeight: 600, width: '35%', color: 'var(--color-text-muted)' }}>{specKey}</td>
                    <td style={{ fontWeight: 500 }}>{specVal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Truck size={18} color="var(--color-primary)" style={{ marginTop: '2px' }} />
              <div>
                <strong>Dispatch & Delivery Speeds:</strong>
                <p className="text-sm text-muted">
                  Free 2-day delivery guaranteed for Prime members. Orders placed before 2:00 PM local time ship same-day.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <ShieldCheck size={18} color="var(--color-primary)" style={{ marginTop: '2px' }} />
              <div>
                <strong>30-Day Hassle-Free Returns (Policy v2.1):</strong>
                <p className="text-sm text-muted">
                  Eligible for prepaid return label or courier doorstep pickup for Premium VIP members. 1-Year hardware warranty included.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
