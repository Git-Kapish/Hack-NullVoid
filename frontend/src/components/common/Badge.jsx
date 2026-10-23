import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ShieldCheck, Clock } from 'lucide-react';

export function Badge({ 
  children, 
  variant = 'neutral', 
  icon = true, 
  size = 'md',
  style = {} 
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'IN_STOCK':
      case 'in-stock':
      case 'success':
        return 'badge-in-stock';
      case 'LOW_STOCK':
      case 'low-stock':
      case 'warning':
        return 'badge-low-stock';
      case 'OUT_OF_STOCK':
      case 'out-of-stock':
      case 'danger':
        return 'badge-out-of-stock';
      case 'ai':
        return 'badge-ai';
      case 'PRIME':
      case 'prime':
        return 'badge-prime';
      case 'PREMIUM':
      case 'premium':
        return 'badge-premium';
      default:
        return 'badge-neutral';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'sm' ? 12 : 14;

    switch (variant) {
      case 'IN_STOCK':
      case 'in-stock':
      case 'success':
        return <CheckCircle2 size={iconSize} />;
      case 'LOW_STOCK':
      case 'low-stock':
      case 'warning':
        return <AlertTriangle size={iconSize} />;
      case 'OUT_OF_STOCK':
      case 'out-of-stock':
      case 'danger':
        return <XCircle size={iconSize} />;
      case 'ai':
        return <Sparkles size={iconSize} />;
      case 'PRIME':
      case 'prime':
      case 'PREMIUM':
      case 'premium':
        return <ShieldCheck size={iconSize} />;
      default:
        return null;
    }
  };

  const formatText = (text) => {
    if (typeof text !== 'string') return text;
    if (text === 'IN_STOCK') return 'In Stock';
    if (text === 'LOW_STOCK') return 'Low Stock';
    if (text === 'OUT_OF_STOCK') return 'Out of Stock';
    return text;
  };

  return (
    <span 
      className={`badge ${getVariantClass()}`}
      style={{
        padding: size === 'sm' ? '0.15rem 0.45rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        ...style
      }}
    >
      {renderIcon()}
      <span>{formatText(children)}</span>
    </span>
  );
}
