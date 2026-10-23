import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ProductCard } from '../components/commerce/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { PriceRangeFilter } from '../components/common/PriceRangeFilter';
import { Button } from '../components/common/Button';
import { CATEGORIES } from '../data/mockData';
import { Search, SlidersHorizontal, RotateCcw, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brands = ['Sony', 'Apple', 'Bose', 'Sennheiser', 'Dell', 'Lenovo', 'Garmin', 'Logitech', 'Keychron'];

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const params = {
          query: searchQuery,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          brand: selectedBrand !== 'all' ? selectedBrand : undefined,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 2500 ? maxPrice : undefined,
          sort: sortBy,
          page,
          size: 12
        };

        const res = await api.get('/products', params);
        let items = res.items || [];
        if (inStockOnly) {
          items = items.filter(p => p.availability === 'IN_STOCK');
        }
        setProducts(items);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || items.length);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, page, inStockOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice(0);
    setMaxPrice(2500);
    setInStockOnly(false);
    setSortBy('featured');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || minPrice > 0 || maxPrice < 2500 || inStockOnly;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Search Bar */}
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
          <h1 className="text-h1">Product Catalog</h1>
          <p className="text-muted text-sm">
            Showing {products.length} of {totalCount} verified catalog items
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search products, specs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          </div>

          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <Button
            variant="secondary"
            className="hidden-on-desktop"
            icon={<SlidersHorizontal size={16} />}
            onClick={() => setMobileFilterOpen(true)}
            style={{ display: 'none' }} // media query will show on mobile
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Filter Sidebar */}
        <aside
          className="card"
          style={{
            width: '260px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={15} /> Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Category
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => { setSelectedCategory('all'); setPage(1); }}
                style={{
                  textAlign: 'left',
                  background: selectedCategory === 'all' ? 'var(--color-surface-2)' : 'none',
                  color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text)',
                  border: 'none',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === 'all' ? 600 : 400,
                  cursor: 'pointer'
                }}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  style={{
                    textAlign: 'left',
                    background: selectedCategory === cat.id ? 'var(--color-surface-2)' : 'none',
                    color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-text)',
                    border: 'none',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === cat.id ? 600 : 400,
                    cursor: 'pointer'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Price Range
            </div>
            <PriceRangeFilter
              min={0}
              max={2500}
              currentMin={minPrice}
              currentMax={maxPrice}
              onChange={({ min, max }) => {
                setMinPrice(min);
                setMaxPrice(max);
                setPage(1);
              }}
            />
          </div>

          {/* Brand Filter */}
          <div>
            <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Brand
            </div>
            <select
              className="select"
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Stock Availability Toggle */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Products Grid */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div className="grid-catalog">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="No Products Found"
              description="No catalog items matched your active search or filters. Try adjusting price caps or search query."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid-catalog">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    icon={<ChevronLeft size={14} />}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-tabular text-muted">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    icon={<ChevronRight size={14} />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
