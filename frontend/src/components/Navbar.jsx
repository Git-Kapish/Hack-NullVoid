import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';

export function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const { user, isAuthenticated, isAdmin, logout, membershipTier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text)' }}>ShopSmart</span>
            <span style={{ 
              marginLeft: '4px', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              backgroundColor: 'var(--color-ai-surface)', 
              color: 'var(--color-ai-text)', 
              padding: '2px 6px', 
              borderRadius: '999px',
              border: '1px solid var(--color-ai-border)'
            }}>AI</span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/products" style={{ 
            color: isActive('/products') ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: isActive('/products') ? 600 : 500,
            fontSize: '0.9rem'
          }}>
            Shop
          </Link>
          <Link to="/compare" style={{ 
            color: isActive('/compare') ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: isActive('/compare') ? 600 : 500,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Layers size={16} /> Compare
          </Link>
          <Link to="/assistant" style={{ 
            color: isActive('/assistant') ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: isActive('/assistant') ? 600 : 500,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} /> Ask AI
          </Link>
          <Link to="/policies" style={{ 
            color: isActive('/policies') ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: isActive('/policies') ? 600 : 500,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <BookOpen size={16} /> Policies
          </Link>

          {/* Admin Navigation (Role-aware) */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--color-border)' }}>
              <Link to="/admin/knowledge" style={{ 
                color: isActive('/admin/knowledge') ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={14} /> Admin Knowledge
              </Link>
              <Link to="/admin/audit" style={{ 
                color: isActive('/admin/audit') ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                Audit
              </Link>
            </div>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/wishlist" title="Wishlist" style={{ position: 'relative', color: 'var(--color-text-muted)' }}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    padding: '1px 5px',
                    fontWeight: 700
                  }}>{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" title="Cart" style={{ position: 'relative', color: 'var(--color-text-muted)' }}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    padding: '1px 5px',
                    fontWeight: 700
                  }}>{cartCount}</span>
                )}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <Link to="/orders" className="btn btn-outline btn-sm">
                  Orders
                </Link>
                <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                  {membershipTier.toLowerCase()}
                </span>
                <button 
                  onClick={logout} 
                  className="btn btn-secondary btn-sm"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
