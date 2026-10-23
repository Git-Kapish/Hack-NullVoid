import React, { useState, useEffect } from 'react';
import { Sparkles, Database, CheckCircle2 } from 'lucide-react';

export function ThinkingIndicator({ label = 'Agent thinking...' }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { text: 'Interpreting natural-language shopping requirement & constraints...', icon: Sparkles },
    { text: 'Filtering catalog database by price, ratings & live stock...', icon: Database },
    { text: 'Synthesizing explainable recommendation rationale...', icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex(prev => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div
      className="ai-card animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '540px',
        padding: '0.85rem 1.15rem'
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-ai-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-ai-text)',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}
      >
        <CurrentIcon size={16} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-ai-text)' }}>
            Autonomous Agent Reasoning
          </span>
          <span className="text-xs text-muted">• Step {stepIndex + 1}/3</span>
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text)', marginTop: '2px' }}>
          {steps[stepIndex].text}
        </div>
      </div>
    </div>
  );
}
