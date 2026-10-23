import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, subtotal, shipping, tax, total, isFreeShipping, checkoutSimulatedOrder } = useCartWishlist();
  const { membershipTier } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const order = await checkoutSimulatedOrder();
      if (order) {
        navigate(`/orders/${order.id}`);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={32} />}
        title="Your Cart is Empty"
        description="Explore our verified catalog to discover industry-leading hardware and electronics."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-h1">Shopping Cart</h1>
        <p className="text-muted text-sm">
          Review your selected items and proceed to simulated checkout
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left: Cart Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => {
            const product = item.product;
            const lineTotal = product.price * item.quantity;
            const maxStock = product.stockCount ?? 99;

            return (
              <div
                key={product.id}
                className="card"
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  padding: '1.25rem'
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: 'var(--color-surface-2)'
                }}>
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>
                    {product.brand}
                  </span>
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

                  <div className="text-sm font-tabular" style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    ${product.price.toFixed(2)} each
                  </div>
                </div>

                {/* Stepper & Total */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    ${lineTotal.toFixed(2)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        style={{
                          padding: '4px 10px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-text)'
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, Math.min(maxStock, item.quantity + 1))}
                        disabled={item.quantity >= maxStock}
                        style={{
                          padding: '4px 10px',
                          background: 'none',
                          border: 'none',
                          cursor: item.quantity >= maxStock ? 'not-allowed' : 'pointer',
                          color: 'var(--color-text)'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="btn-ghost"
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Card */}
        <div className="card card-elevated" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 className="text-h3">Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Subtotal</span>
              <span className="font-tabular" style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">Shipping</span>
              <span className="font-tabular" style={{ fontWeight: 600, color: isFreeShipping ? 'var(--color-success-text)' : 'inherit' }}>
                {isFreeShipping ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {membershipTier === 'PRIME' && (
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6' }}>
                <Truck size={13} /> Prime Perk: Free 2-Day Delivery Included
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Estimated Tax (8.25%)</span>
              <span className="font-tabular">${tax.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              fontSize: '1.25rem',
              fontWeight: 800
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            loading={checkingOut}
            icon={<ArrowRight size={18} />}
            onClick={handleCheckout}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Place Simulated Order
          </Button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.775rem',
            color: 'var(--color-text-subtle)',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <ShieldCheck size={14} />
            <span>Simulated Hackathon Checkout • No Real Payment Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
