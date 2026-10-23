import React from 'react';

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Skeleton height="180px" borderRadius="var(--radius-sm)" />
      <Skeleton width="40%" height="14px" />
      <Skeleton width="90%" height="20px" />
      <Skeleton width="60%" height="16px" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <Skeleton width="35%" height="24px" />
        <Skeleton width="45%" height="32px" borderRadius="var(--radius-sm)" />
      </div>
    </div>
  );
}
