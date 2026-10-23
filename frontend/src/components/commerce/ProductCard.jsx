import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, CheckSquare, Square } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useCompare } from '../../context/CompareContext';

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const { toggleCompare, isComparing } = useCompare();

  const isFavorite = isWishlisted(product.id);
  const inComparison = isComparing(product.id);
  const isOutOfStock = product.availability === 'OUT_OF_STOCK';

  const handleCardClick = (e) => {
    // Navigate only if not clicking interactive buttons
    if (!e.target.closest('button') && !e.target.closest('.action-control')) {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <div
      className="card card-elevated"
      onClick={handleCardClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        padding: '0.85rem',
        overflow: 'hidden'
      }}
    >
      {/* Thumbnail + Wishlist & Compare Quick Toggles */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%', // 4:3 Aspect Ratio
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface-2)',
        marginBottom: '0.75rem'
      }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Wishlist Button */}
        <button
          className="action-control"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: isFavorite ? '#EF4444' : 'var(--color-text-muted)'
          }}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isFavorite ? '#EF4444' : 'none'} />
        </button>

        {/* Quick Compare Toggle */}
        <button
          className="action-control"
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: inComparison ? 'var(--color-primary)' : 'var(--color-surface)',
            color: inComparison ? '#fff' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            fontSize: '0.7rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {inComparison ? <CheckSquare size={12} /> : <Square size={12} />}
          Compare
        </button>
      </div>

      {/* Info Section */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand}
          </span>
          <Badge variant={product.availability} size="sm">
            {product.availability}
          </Badge>
        </div>

        <h3
          className="text-body"
          style={{
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <Star size={14} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        {/* Price & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--color-text-subtle)' }}>
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button
            className={`btn btn-sm ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            style={{ gap: '4px' }}
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
