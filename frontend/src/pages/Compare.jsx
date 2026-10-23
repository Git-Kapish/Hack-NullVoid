import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Layers, X, ShoppingCart, Plus, Check, ArrowLeft } from 'lucide-react';
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '../utils/productUtils';

export function Compare() {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCartWishlist();

  const [highlightDifferences, setHighlightDifferences] = useState(false);

  if (compareItems.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={32} />}
        title="No Products in Comparison"
        description="Select 2 to 4 items from the catalog or product details to compare their technical specifications side-by-side."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  // Extract all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap(p => (p.specs ? Object.keys(p.specs) : [])))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-h1">Product Comparison Matrix</h1>
            <p className="text-muted text-sm">
              Comparing {compareItems.length} of max 4 products
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span>Highlight Differences</span>
          </label>

          {compareItems.length < 4 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => navigate('/products')}
            >
              Add Product
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="table-container card" style={{ padding: '0', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '220px', minWidth: '180px', verticalAlign: 'top', backgroundColor: 'var(--color-surface)' }}>
                Specification
              </th>
              {compareItems.map(product => (
                <th
                  key={product.id}
                  style={{
                    minWidth: '220px',
                    verticalAlign: 'top',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '1px solid var(--color-border)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Badge variant={product.availability} size="sm">
                        {product.availability}
                      </Badge>
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="btn-ghost"
                        style={{ padding: '2px', cursor: 'pointer' }}
                        title="Remove from comparison"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: 'var(--color-text)',
                        lineHeight: 1.3
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      ${product.price.toFixed(2)}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ShoppingCart size={14} />}
                      disabled={product.availability === 'OUT_OF_STOCK'}
                      onClick={() => addToCart(product, 1)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Spec Rows */}
            <tr>
              <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Brand</td>
              {compareItems.map(p => (
                <td key={p.id} style={{ borderLeft: '1px solid var(--color-border)' }}>
                  {p.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Rating</td>
              {compareItems.map(p => (
                <td key={p.id} style={{ borderLeft: '1px solid var(--color-border)' }}>
                  ★ {p.rating} ({p.reviewCount} reviews)
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Stock Status</td>
              {compareItems.map(p => (
                <td key={p.id} style={{ borderLeft: '1px solid var(--color-border)' }}>
                  <Badge variant={p.availability} size="sm">{p.availability}</Badge> ({p.stockCount} units)
                </td>
              ))}
            </tr>

            {/* Dynamic Technical Specs */}
            {allSpecKeys.map(key => {
              const values = compareItems.map(p => p.specs?.[key] || '—');
              const isDifferent = new Set(values).size > 1;

              if (highlightDifferences && !isDifferent) {
                return null;
              }

              return (
                <tr
                  key={key}
                  style={{
                    backgroundColor: isDifferent && highlightDifferences ? 'var(--color-ai-surface)' : 'transparent'
                  }}
                >
                  <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    {key}
                  </td>
                  {compareItems.map(p => (
                    <td
                      key={p.id}
                      style={{
                        borderLeft: '1px solid var(--color-border)',
                        fontWeight: isDifferent ? 600 : 400
                      }}
                    >
                      {p.specs?.[key] || '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
