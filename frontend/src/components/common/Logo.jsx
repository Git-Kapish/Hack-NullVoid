import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ShopSmart AI Brand Logo Component
 * Combines a clean architectural shopping tote silhouette with an inner glowing AI neural spark.
 */
export function Logo({ size = 'md', showBadge = true, to = '/' }) {
  const dimensions = {
    sm: { iconSize: 24, fontSize: '1rem', badgeSize: '0.65rem' },
    md: { iconSize: 30, fontSize: '1.2rem', badgeSize: '0.72rem' },
    lg: { iconSize: 38, fontSize: '1.5rem', badgeSize: '0.8rem' }
  }[size] || { iconSize: 30, fontSize: '1.2rem', badgeSize: '0.72rem' };

  const content = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      {/* Brand Icon SVG */}
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.28))' }}
      >
        <defs>
          <linearGradient id="ssAiGradient" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="ssSparkleGradient" x1="12" y1="12" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
        </defs>

        {/* Shopping Bag Outer Frame */}
        <rect
          x="4"
          y="10"
          width="28"
          height="22"
          rx="6"
          fill="url(#ssAiGradient)"
        />

        {/* Bag Handle */}
        <path
          d="M12 11V7C12 4.79086 13.7909 3 16 3H20C22.2091 3 24 4.79086 24 7V11"
          stroke="url(#ssAiGradient)"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Inner AI Neural Spark Core */}
        <path
          d="M18 14.5C18 18 14.5 19.5 14.5 21C18 21 19.5 24.5 21 24.5C21 21 24.5 19.5 24.5 18C21 18 19.5 14.5 18 14.5Z"
          fill="url(#ssSparkleGradient)"
        />

        {/* Small AI Neural Accent Nodes */}
        <circle cx="11" cy="18" r="1.5" fill="#FFFFFF" fillOpacity="0.85" />
        <circle cx="25" cy="24" r="1.5" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>

      {/* Brand Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', userSelect: 'none' }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: dimensions.fontSize,
            color: 'var(--color-text)',
            letterSpacing: '-0.035em',
            lineHeight: 1
          }}
        >
          ShopSmart
        </span>

        {showBadge && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.14) 0%, rgba(124, 58, 237, 0.18) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              color: 'var(--color-ai-text)',
              fontSize: dimensions.badgeSize,
              fontWeight: 700,
              letterSpacing: '0.04em',
              lineHeight: 1
            }}
          >
            AI
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {content}
      </Link>
    );
  }

  return content;
}
