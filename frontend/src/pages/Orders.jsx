import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Package, Truck, ArrowRight, Calendar } from 'lucide-react';
import { FALLBACK_PRODUCT_IMAGE } from '../utils/productUtils';

export function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await api.get('/orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (!loading && orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={32} />}
        title="No Orders Yet"
        description="Place a simulated order from your shopping cart to experience end-to-end shipment timeline tracking."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
        <h1 className="text-h1">Your Orders & Shipments</h1>
        <p className="text-muted text-sm">
          Track packages and review simulated order status history
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map(order => {
          const isDelivered = order.status === 'DELIVERED';
          const isOut = order.status === 'OUT_FOR_DELIVERY';

          return (
            <div
              key={order.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.5rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {order.order_number}
                  </span>
                  <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge
                    variant={isDelivered ? 'IN_STOCK' : isOut ? 'LOW_STOCK' : 'neutral'}
                    size="md"
                  >
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                  <span className="font-tabular" style={{ fontWeight: 700, fontSize: '1rem' }}>
                    ${order.total_amount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-2)'
                      }}
                      title={item.name}
                    >
                      <img
                        src={item.image || FALLBACK_PRODUCT_IMAGE}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {order.items?.[0]?.name}
                      {order.items?.length > 1 && ` + ${order.items.length - 1} more`}
                    </div>
                    <div className="text-xs text-muted">
                      Tracking: <span className="font-mono">{order.tracking_number}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  icon={<Truck size={14} />}
                >
                  Track Package
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
