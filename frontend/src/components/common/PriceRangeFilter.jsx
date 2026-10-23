import React, { useState, useEffect } from 'react';

export function PriceRangeFilter({ min = 0, max = 2000, currentMin, currentMax, onChange }) {
  const [minVal, setMinVal] = useState(currentMin ?? min);
  const [maxVal, setMaxVal] = useState(currentMax ?? max);
  const [error, setError] = useState('');

  useEffect(() => {
    setMinVal(currentMin ?? min);
  }, [currentMin, min]);

  useEffect(() => {
    setMaxVal(currentMax ?? max);
  }, [currentMax, max]);

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    setMinVal(val);
    if (val > maxVal) {
      setError('Min price cannot exceed max price');
    } else {
      setError('');
      onChange({ min: val, max: maxVal });
    }
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    setMaxVal(val);
    if (minVal > val) {
      setError('Min price cannot exceed max price');
    } else {
      setError('');
      onChange({ min: minVal, max: val });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '2px' }}>Min ($)</label>
          <input
            type="number"
            className="input"
            value={minVal}
            min={min}
            max={max}
            onChange={handleMinChange}
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
          />
        </div>
        <span className="text-muted" style={{ marginTop: '1rem' }}>–</span>
        <div style={{ flex: 1 }}>
          <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '2px' }}>Max ($)</label>
          <input
            type="number"
            className="input"
            value={maxVal}
            min={min}
            max={max}
            onChange={handleMaxChange}
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={25}
        value={maxVal}
        onChange={handleMaxChange}
        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
      />

      {error && (
        <span className="text-xs" style={{ color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}
