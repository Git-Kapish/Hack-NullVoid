import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useCompare } from '../context/CompareContext';
import { Badge } from './common/Badge';
import { 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  ShieldCheck,
  Moon,
  Sun,
  Package,
  Sliders,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { Logo } from './common/Logo';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, membershipTier } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();
  const { compareCount } = useCompare();

  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shopsmart_theme') || 'dark';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shopsmart_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 60,
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Primary Desktop Navigation - Wrapper Framer style */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link
            to="/products"
            style={{ 
              color: isActive('/products') ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: isActive('/products') ? 600 : 400,
              fontSize: '0.9rem'
            }}
          >
            Catalog
          </Link>

          <Link
            to="/assistant"
            style={{ 
              color: isActive('/assistant') ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: isActive('/assistant') ? 600 : 400,
              fontSize: '0.9rem'
            }}
          >
            Assistant
          </Link>

          <Link
            to="/policies"
            style={{ 
              color: isActive('/policies') ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: isActive('/policies') ? 600 : 400,
              fontSize: '0.9rem'
            }}
          >
            Policies & RAG
          </Link>

          <Link
            to="/orders"
            style={{ 
              color: isActive('/orders') ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: isActive('/orders') ? 600 : 400,
              fontSize: '0.9rem'
            }}
          >
            Orders
          </Link>

          {/* Admin Menu Dropdown */}
          {isAdmin && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={16} color="var(--color-primary)" /> Admin <ChevronDown size={14} />
              </button>

              {adminMenuOpen && (
                <div
                  className="card card-elevated animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '210px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 70
                  }}
                  onMouseLeave={() => setAdminMenuOpen(false)}
                >
                  <Link
                    to="/admin/products"
                    className="btn-ghost"
                    style={{ padding: '6px 10px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <ShoppingBag size={14} /> Product Catalog
                  </Link>
                  <Link
                    to="/admin/audit"
                    className="btn-ghost"
                    style={{ padding: '6px 10px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <ShieldCheck size={14} /> AI Decision Logs
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Action Icons: Theme, Wishlist, Cart, Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="btn-ghost"
            style={{
              position: 'relative',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#EF4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <Link
            to="/cart"
            className="btn-ghost"
            style={{
              position: 'relative',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Clerk Auth Integration */}
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
          <Show when="signed-out">
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Link to="/policies" className="wrapper-pill-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                Contact sales
              </Link>
              <SignInButton mode="modal">
                <button className="wrapper-pill-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.825rem' }}>
                  Log in
                </button>
              </SignInButton>
            </div>
          </Show>

          {/* User Account / Personas Menu */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                <User size={14} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <Badge variant={membershipTier} size="sm">{membershipTier}</Badge>
              </button>

              {userMenuOpen && (
                <div
                  className="card card-elevated animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '230px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 70
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ paddingBottom: '6px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name}</div>
                    <div className="text-xs text-muted font-mono">{user?.email}</div>
                  </div>

                  <Link
                    to="/orders"
                    className="btn-ghost"
                    style={{ padding: '6px 8px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Package size={14} /> Orders & Timeline
                  </Link>

                  <Link
                    to="/support"
                    className="btn-ghost"
                    style={{ padding: '6px 8px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <BookOpen size={14} /> Support Tickets
                  </Link>

                  <Link
                    to="/account/preferences"
                    className="btn-ghost"
                    style={{ padding: '6px 8px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Sliders size={14} /> Shopping Preferences
                  </Link>

                  <Link
                    to="/login"
                    className="btn-ghost"
                    style={{ padding: '6px 8px', borderRadius: '6px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={14} /> Switch Demo Persona
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/login');
                    }}
                    className="btn-ghost"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-danger)',
                      borderTop: '1px solid var(--color-border)',
                      marginTop: '4px'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
