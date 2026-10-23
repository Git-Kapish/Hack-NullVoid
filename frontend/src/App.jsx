import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Show, SignInButton, SignUpButton, UserButton, SignIn, SignUp } from '@clerk/react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { CompareProvider } from './context/CompareContext';

// Components
import { Navbar } from './components/Navbar';
import { CompareTray } from './components/commerce/CompareTray';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Compare } from './pages/Compare';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Assistant } from './pages/Assistant';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Support } from './pages/Support';
import { Preferences } from './pages/Preferences';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminAudit } from './pages/admin/AdminAudit';
import KnowledgePage from './pages/KnowledgePage';

// Dedicated Clerk Authentication Page
function AuthPage({ mode = 'sign-in' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh', padding: '2rem 1rem' }}>
      {mode === 'sign-up' ? (
        <SignUp routing="path" path="/sign-up" signInUrl="/login" />
      ) : (
        <SignIn routing="path" path="/login" signUpUrl="/sign-up" />
      )}
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartWishlistProvider>
          <CompareProvider>
            <BrowserRouter>
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
                    <Route path="/clerk-login/*" element={<AuthPage mode="sign-in" />} />
                    <Route path="/products" element={<Catalog />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/account/preferences" element={<Preferences />} />

                    {/* Policy & Knowledge Assistant (RAG) */}
                    <Route path="/policies" element={<KnowledgePage />} />
                    <Route path="/knowledge" element={<KnowledgePage />} />
                    <Route path="/admin/knowledge" element={<KnowledgePage />} />

                    {/* Admin routes */}
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/audit" element={<AdminAudit />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <CompareTray />

                <footer style={{
                  borderTop: '1px solid var(--color-border)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.85rem'
                }}>
                  ShopSmart AI • Hackathon Modular Monolith • React 19 + FastAPI + PgVector
                </footer>
              </div>
            </BrowserRouter>
          </CompareProvider>
        </CartWishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
