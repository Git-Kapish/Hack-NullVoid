import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus, Edit2, Check, X, Search, ShieldCheck } from 'lucide-react';
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '../../utils/productUtils';

export function AdminProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // New product state
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('audio');
  const [newPrice, setNewPrice] = useState(199.99);
  const [newStock, setNewStock] = useState(20);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await api.get('/admin/products');
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stockCount);
  };

  const handleSaveEdit = async (id) => {
    try {
      const derivedAvailability = editStock > 10 ? 'IN_STOCK' : editStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';
      const updated = await api.patch(`/admin/products/${id}`, {
        price: Number(editPrice),
        stockCount: Number(editStock),
        availability: derivedAvailability
      });

      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      addToast('Product inventory updated!', 'success');
      setEditingId(null);
    } catch (err) {
      addToast('Failed to update product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const derivedAvailability = newStock > 10 ? 'IN_STOCK' : newStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';
      const created = await api.post('/admin/products', {
        name: newName,
        brand: newBrand,
        category: newCategory,
        price: Number(newPrice),
        stockCount: Number(newStock),
        availability: derivedAvailability,
        description: newDesc,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        currency: 'USD'
      });

      setProducts(prev => [created, ...prev]);
      addToast(`Product ${created.name} added to catalog!`, 'success');
      setModalOpen(false);
      setNewName('');
      setNewBrand('');
      setNewDesc('');
    } catch (err) {
      addToast('Failed to create product', 'error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-neutral">Admin Console</span>
          </div>
          <h1 className="text-h1" style={{ marginTop: '4px' }}>Catalog Product Management</h1>
          <p className="text-muted text-sm">
            Control live inventory counts, pricing adjustments, and product specifications
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Add New Product
        </Button>
      </div>

      {/* Table */}
      <div className="table-container card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Item</th>
              <th>Product Name</th>
              <th>Brand / Category</th>
              <th>Price ($)</th>
              <th>Stock Units</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const isEditing = editingId === p.id;

              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--color-surface-2)' }}>
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>
                    <span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>{p.brand}</span> • <span style={{ textTransform: 'capitalize' }}>{p.category}</span>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="input"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '90px', padding: '2px 6px' }}
                      />
                    ) : (
                      <span className="font-tabular font-bold">${p.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="input"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={{ width: '70px', padding: '2px 6px' }}
                      />
                    ) : (
                      <span className="font-tabular">{p.stockCount}</span>
                    )}
                  </td>
                  <td>
                    <Badge variant={p.availability} size="sm">{p.availability}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="primary" size="sm" onClick={() => handleSaveEdit(p.id)} icon={<Check size={12} />}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} icon={<X size={12} />}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => handleStartEdit(p)} icon={<Edit2 size={12} />}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className="text-h3">Add Catalog Product</h2>
              <button onClick={() => setModalOpen(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Product Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="E.g., Bose QuietComfort Ultra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="E.g., Bose"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    className="select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="audio">Audio & Sound</option>
                    <option value="laptops">Laptops & Computers</option>
                    <option value="wearables">Smart Wearables</option>
                    <option value="accessories">Keyboards & Peripherals</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Product Description
                </label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Enter marketing copy and technical highlights..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
