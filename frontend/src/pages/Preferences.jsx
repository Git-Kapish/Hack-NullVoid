import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CATEGORIES } from '../data/mockData';
import { Sliders, Save, Bell, ShieldCheck, User } from 'lucide-react';

export function Preferences() {
  const { user, membershipTier } = useAuth();
  const { addToast } = useToast();

  const [selectedCats, setSelectedCats] = useState(['audio', 'laptops']);
  const [budgetLimit, setBudgetLimit] = useState(600);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (catId) => {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Customer preferences updated successfully!', 'success');
    }, 400);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
        <h1 className="text-h1">Customer Preferences</h1>
        <p className="text-muted text-sm">
          Customize your shopping interests and AI recommendation preferences
        </p>
      </div>

      {/* Account Info Pill */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.name || 'Customer'}</div>
            <div className="text-xs text-muted font-mono">{user?.email || 'customer@example.com'}</div>
          </div>
        </div>

        <Badge variant={membershipTier} size="md">
          {membershipTier} Member
        </Badge>
      </div>

      <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Preferred Categories */}
        <div>
          <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Preferred Categories</h3>
          <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
            AI will prioritize recommendations in these categories when no explicit preference is stated.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {CATEGORIES.map(cat => {
              const active = selectedCats.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: '0.75rem 1rem',
                    border: active ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: active ? 'var(--color-surface-2)' : 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: active ? 600 : 400, fontSize: '0.875rem' }}>{cat.name}</span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {}}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Default Budget Ceiling */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="text-h3">Default Budget Ceiling</h3>
            <span className="font-tabular" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              ${budgetLimit}
            </span>
          </div>
          <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
            Sets the standard budget cap applied during open-ended AI shopping queries.
          </p>

          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
            <span>$100</span>
            <span>$1,000</span>
            <span>$2,000</span>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Notifications & Alerts</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Real-time Delivery Milestones</div>
                <div className="text-xs text-muted">Receive simulated shipping updates when your packages move.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI-Curated Price Drop Alerts</div>
                <div className="text-xs text-muted">Notify me when items in my wishlist drop in price.</div>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
