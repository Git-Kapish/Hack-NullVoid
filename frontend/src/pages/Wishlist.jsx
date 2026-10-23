import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={32} />}
        title="Your Wishlist is Empty"
        description="Save your favorite hardware items to track their availability and easily add them to your cart later."
        actionLabel="Explore Catalog"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
        <h1 className="text-h1">Saved Items</h1>
        <p className="text-muted text-sm">
          You have {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved in your wishlist
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {wishlist.map(product => {
          const isOutOfStock = product.availability === 'OUT_OF_STOCK';

          return (
            <div
              key={product.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1rem',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{
                  width: '100%',
                  paddingTop: '65%',
                  position: 'relative',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-2)',
                  marginBottom: '0.75rem'
                }}>
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#EF4444'
                    }}
                    title="Remove from saved items"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>{product.brand}</span>
                  <Badge variant={product.availability} size="sm">{product.availability}</Badge>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {product.name}
                </Link>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border)'
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  ${product.price.toFixed(2)}
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, 1)}
                  icon={<ShoppingCart size={14} />}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
