import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Show, SignInButton, SignUpButton, UserButton, SignIn, SignUp } from '@clerk/react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';

// Placeholder screen for routes to be built in subsequent blocks
function PlaceholderPage({ title, description }) {
  return (
    <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '600px', margin: '3rem auto' }}>
      <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>{title}</h2>
      <p className="text-muted text-body" style={{ marginBottom: '1.5rem' }}>{description}</p>
      <a href="/" className="btn btn-secondary">Return Home</a>
    </div>
  );
}

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
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Main Navigation Header with integrated Clerk Auth state */}
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/*" element={<AuthPage mode="sign-in" />} />
              <Route path="/sign-up/*" element={<AuthPage mode="sign-up" />} />
              <Route path="/products" element={<PlaceholderPage title="Product Catalog" description="Catalog with search, filtering, and pagination." />} />
              <Route path="/products/:id" element={<PlaceholderPage title="Product Details" description="Product specs, images, and live inventory status." />} />
              <Route path="/compare" element={<PlaceholderPage title="Product Comparison" description="Side-by-side spec comparison matrix." />} />
              <Route path="/cart" element={<PlaceholderPage title="Cart" description="Cart items with quantity edits and checkout." />} />
              <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" description="Saved items and price drop alerts." />} />
              <Route path="/orders" element={<PlaceholderPage title="Orders" description="Simulated order tracking and timeline." />} />
              <Route path="/orders/:id" element={<PlaceholderPage title="Order Detail" description="Detailed order timeline and support tools." />} />
              <Route path="/support" element={<PlaceholderPage title="Support" description="Ticket management and customer care." />} />
              <Route path="/assistant" element={<PlaceholderPage title="AI Shopping Assistant" description="Grounded recommendations powered by Gemini 3.8 Flash." />} />
              <Route path="/policies" element={<PlaceholderPage title="Policy Q&A" description="RAG knowledge assistant." />} />
              <Route path="/admin/knowledge" element={<PlaceholderPage title="Admin Knowledge" description="Document ingestion and version management." />} />
              <Route path="/admin/audit" element={<PlaceholderPage title="Admin Audit" description="Audit events and AI decision logs." />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

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
    </AuthProvider>
  );
}

export default App;
