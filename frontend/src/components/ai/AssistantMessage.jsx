import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingCart, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useCartWishlist } from '../../context/CartWishlistContext';

export function AssistantMessage({ data }) {
  const { addToCart } = useCartWishlist();

  if (!data) return null;

  return (
    <div
      className="message-bubble message-ai animate-fade-in"
      style={{
        maxWidth: '850px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid var(--color-ai-border)',
        backgroundColor: 'var(--color-surface)'
      }}
    >
      {/* AI Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-ai-surface-2)',
              color: 'var(--color-ai-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={14} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-ai-text)' }}>
            ShopSmart AI • Catalog Grounded
          </span>
        </div>

        {data.budget && (
          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
            Budget constraint: <strong>${data.budget}</strong>
          </span>
        )}
      </div>

      {/* Interpreted Requirement */}
      {data.interpretedRequirement && (
        <div
          style={{
            backgroundColor: 'var(--color-ai-surface)',
            borderLeft: '3px solid var(--color-ai-border)',
            padding: '0.65rem 0.85rem',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.875rem',
            color: 'var(--color-text)'
          }}
        >
          <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: '2px' }}>
            INTERPRETED REQUIREMENT
          </div>
          {data.interpretedRequirement}
        </div>
      )}

      {/* Recommendations Cards */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Grounded Recommendations ({data.recommendations.length})
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem'
          }}>
            {data.recommendations.map(rec => {
              const product = rec.product;
              return (
                <div
                  key={rec.productId}
                  className="card"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '0.85rem',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span className="text-xs text-muted">{product?.brand}</span>
                      <Badge variant={rec.availability} size="sm">
                        {rec.availability}
                      </Badge>
                    </div>

                    <Link
                      to={`/products/${rec.productId}`}
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--color-text)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {rec.productName}
                    </Link>

                    {/* AI Reasoning Callout */}
                    <p className="text-xs text-muted" style={{
                      backgroundColor: 'var(--color-surface-2)',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      "{rec.reason}"
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                      ${product?.price ? product.price.toFixed(2) : ''}
                    </span>

                    {product && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(product, 1)}
                        style={{ gap: '4px' }}
                      >
                        <ShoppingCart size={13} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clarifying Question */}
      {data.clarifyingQuestion && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface-2)',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <HelpCircle size={16} color="var(--color-primary)" />
          <span>
            <strong>Follow-up suggestion:</strong> {data.clarifyingQuestion}
          </span>
        </div>
      )}
    </div>
  );
}
