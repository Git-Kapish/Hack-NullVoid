import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PlaceholderPage title="Login" description="Login page with quick-fill personas will be implemented in Block 1." />} />
              <Route path="/products" element={<PlaceholderPage title="Product Catalog" description="Catalog with search, filtering, and pagination will be implemented in Block 1." />} />
              <Route path="/products/:id" element={<PlaceholderPage title="Product Details" description="Product specs, images, and live inventory status will be implemented in Block 1." />} />
              <Route path="/compare" element={<PlaceholderPage title="Product Comparison" description="Side-by-side spec comparison matrix will be implemented in Block 1." />} />
              <Route path="/cart" element={<PlaceholderPage title="Cart" description="Cart items with quantity edits and checkout will be implemented in Block 2." />} />
              <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" description="Saved items will be implemented in Block 2." />} />
              <Route path="/orders" element={<PlaceholderPage title="Orders" description="Simulated order tracking and timeline will be implemented in Block 2." />} />
              <Route path="/orders/:id" element={<PlaceholderPage title="Order Detail" description="Detailed order timeline and support tools will be implemented in Block 2." />} />
              <Route path="/support" element={<PlaceholderPage title="Support" description="Ticket management will be implemented in Block 2." />} />
              <Route path="/assistant" element={<PlaceholderPage title="AI Shopping Assistant" description="Grounded recommendations will be implemented in Block 3." />} />
              <Route path="/policies" element={<PlaceholderPage title="Policy Q&A" description="RAG knowledge assistant will be implemented in Block 4." />} />
              <Route path="/admin/knowledge" element={<PlaceholderPage title="Admin Knowledge" description="Document ingestion and version management will be implemented in Block 4." />} />
              <Route path="/admin/audit" element={<PlaceholderPage title="Admin Audit" description="Audit events and AI decision logs will be implemented in Block 6." />} />
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
