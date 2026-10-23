import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Layers, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { Button } from '../common/Button';

export function CompareTray() {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="compare-tray animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} color="var(--color-primary)" />
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
          Compare ({compareItems.length}/4)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {compareItems.map(item => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-surface-2)'
            }}
            title={item.name}
          >
            <img
              src={item.images?.[0]}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => removeFromCompare(item.id)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '16px',
                height: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Remove item"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/compare')}
          disabled={compareItems.length < 2}
          icon={<ArrowRight size={14} />}
        >
          Compare Now
        </Button>
        <button
          onClick={clearCompare}
          className="btn-ghost"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
