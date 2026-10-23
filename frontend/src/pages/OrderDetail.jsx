import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ShipmentTimeline } from '../components/commerce/ShipmentTimeline';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ArrowLeft, LifeBuoy, Package } from 'lucide-react';

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        Loading order shipment timeline...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Order not found</h3>
        <Button variant="secondary" onClick={() => navigate('/orders')} style={{ marginTop: '1rem' }}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigate('/orders')}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
          >
            <ArrowLeft size={16} /> Orders
          </button>
          <div>
            <h1 className="text-h1">{order.order_number}</h1>
            <p className="text-muted text-sm">
              Placed on {new Date(order.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<LifeBuoy size={14} />}
          onClick={() => navigate(`/support?order_id=${order.order_number}`)}
        >
          Need Help With This Order?
        </Button>
      </div>

      {/* Shipment Items List */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Package Contents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: idx < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--color-surface-2)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <Link to={`/products/${item.product_id}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {item.name}
                  </Link>
                  <div className="text-xs text-muted">Quantity: {item.quantity}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700 }} className="font-tabular">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Milestone Timeline */}
      <ShipmentTimeline
        timeline={order.timeline}
        trackingNumber={order.tracking_number}
        carrier={order.carrier}
        estimatedDelivery={order.estimated_delivery}
      />
    </div>
  );
}
