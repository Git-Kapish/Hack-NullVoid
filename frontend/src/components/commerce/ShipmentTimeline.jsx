import React from 'react';
import { Check, Clock, Truck, Package, ShieldCheck, MapPin } from 'lucide-react';

export function ShipmentTimeline({ timeline = [], trackingNumber, carrier, estimatedDelivery }) {
  const getStageIcon = (stage, completed) => {
    if (completed) return <Check size={12} />;
    switch (stage) {
      case 'DELIVERED': return <ShieldCheck size={12} />;
      case 'OUT_FOR_DELIVERY':
      case 'SHIPPED': return <Truck size={12} />;
      case 'PROCESSING': return <Package size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="text-h3">Shipment Progress</h3>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Simulated Tracking</span>
          </div>
          <div className="text-sm text-muted" style={{ marginTop: '4px' }}>
            Carrier: <strong>{carrier || 'Express Logistics'}</strong> • Tracking: <span className="font-mono">{trackingNumber || 'TRK-SIMULATED'}</span>
          </div>
        </div>

        {estimatedDelivery && (
          <div style={{ textAlign: 'right' }}>
            <div className="text-xs text-muted">Estimated Delivery</div>
            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{estimatedDelivery}</div>
          </div>
        )}
      </div>

      <div className="timeline">
        {timeline.map((event, index) => {
          const isCompleted = event.completed;
          const isCurrent = event.current;

          return (
            <div key={index} className="timeline-item">
              <div className={`timeline-marker ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                {getStageIcon(event.stage, isCompleted)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: isCurrent ? 700 : 600, color: isCurrent ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {event.label}
                  </span>
                  {event.timestamp && (
                    <span className="text-xs text-muted font-tabular">
                      {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="badge badge-ai" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      Active Milestone
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted" style={{ marginTop: '2px' }}>
                  {event.description}
                </p>

                {event.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
