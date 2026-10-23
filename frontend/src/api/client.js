import { 
  PRODUCTS, 
  CATEGORIES, 
  SAMPLE_ORDERS, 
  SAMPLE_TICKETS, 
  SAMPLE_AUDIT_LOGS, 
  SAMPLE_AI_DECISION_LOGS,
  DEMO_PERSONAS
} from '../data/mockData';

const BASE_URL = '/api/v1';

// Mutable in-memory stores for simulated mutations
let mockProducts = [...PRODUCTS];
let mockOrders = [...SAMPLE_ORDERS];
let mockTickets = [...SAMPLE_TICKETS];
let mockAuditLogs = [...SAMPLE_AUDIT_LOGS];

// Simulated AI Shopping Decision Generator
function handleMockAiRecommendations(prompt, budget) {
  const pLower = (prompt || '').toLowerCase();
  let matched = mockProducts;
  
  if (pLower.includes('headphone') || pLower.includes('audio') || pLower.includes('noise')) {
    matched = matched.filter(p => p.category === 'audio');
  } else if (pLower.includes('laptop') || pLower.includes('macbook') || pLower.includes('computer')) {
    matched = matched.filter(p => p.category === 'laptops');
  } else if (pLower.includes('watch') || pLower.includes('wearable')) {
    matched = matched.filter(p => p.category === 'wearables');
  } else if (pLower.includes('mouse') || pLower.includes('keyboard')) {
    matched = matched.filter(p => p.category === 'accessories');
  }

  // Budget filter
  const effectiveBudget = budget || (pLower.match(/\$([0-9]+)/) ? parseInt(pLower.match(/\$([0-9]+)/)[1], 10) : 500);
  if (effectiveBudget) {
    matched = matched.filter(p => p.price <= effectiveBudget);
  }

  // If no items match, take top 2 items from audio/accessories
  if (matched.length === 0) {
    matched = mockProducts.slice(0, 2);
  }

  const recommendations = matched.slice(0, 3).map(p => ({
    productId: p.id,
    productName: p.name,
    reason: `Matches criteria with ${p.rating}★ rating, ${p.availability === 'IN_STOCK' ? 'in stock' : 'limited availability'}, and priced at $${p.price.toFixed(2)}.`,
    availability: p.availability,
    product: p
  }));

  return {
    interpretedRequirement: `Grounded search for: "${prompt}". Constraint: Under $${effectiveBudget} with high user rating and verified catalog availability.`,
    budget: effectiveBudget,
    recommendations,
    clarifyingQuestion: recommendations.length > 1 ? 'Would you prefer prioritizing longer battery endurance or maximum portability?' : null
  };
}

// Fallback Mock Dispatcher
function fallbackMockHandler(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const urlObj = new URL(endpoint.startsWith('http') ? endpoint : `http://localhost${endpoint}`);
  const pathname = urlObj.pathname.replace(/^\/api\/v1/, '');
  const params = urlObj.searchParams;

  // Catalog endpoints
  if (pathname === '/products' && method === 'GET') {
    let list = [...mockProducts];
    const q = params.get('query');
    const cat = params.get('category');
    const brand = params.get('brand');
    const minP = parseFloat(params.get('minPrice')) || 0;
    const maxP = parseFloat(params.get('maxPrice')) || Infinity;
    const sort = params.get('sort') || 'featured';

    if (q) {
      const qLower = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(qLower) || p.description.toLowerCase().includes(qLower) || p.brand.toLowerCase().includes(qLower));
    }
    if (cat && cat !== 'all') {
      list = list.filter(p => p.category === cat);
    }
    if (brand && brand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    list = list.filter(p => p.price >= minP && p.price <= maxP);

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    const page = parseInt(params.get('page') || '1', 10);
    const size = parseInt(params.get('size') || '12', 10);
    const total = list.length;
    const totalPages = Math.ceil(total / size) || 1;
    const offset = (page - 1) * size;
    const items = list.slice(offset, offset + size);

    return {
      items,
      total,
      page,
      size,
      totalPages
    };
  }

  if (pathname.startsWith('/products/') && method === 'GET') {
    const id = pathname.replace('/products/', '');
    const p = mockProducts.find(item => item.id === id);
    if (!p) throw new Error('Product not found');
    return p;
  }

  if (pathname === '/categories' && method === 'GET') {
    return CATEGORIES;
  }

  if (pathname === '/products/compare' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const ids = body.product_ids || [];
    const products = mockProducts.filter(p => ids.includes(p.id));
    return {
      products,
      specs_matrix: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        availability: p.availability,
        specs: p.specs
      }))
    };
  }

  // Auth endpoints
  if (pathname === '/auth/login' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const email = body.email || 'david.basic@example.com';
    const persona = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase()) || {
      email,
      name: email.split('@')[0],
      role: 'CUSTOMER',
      membership_tier: 'BASIC'
    };
    return {
      access_token: `mock-jwt-token-${Date.now()}`,
      token_type: 'bearer',
      user: persona
    };
  }

  if (pathname === '/auth/me' && method === 'GET') {
    const saved = localStorage.getItem('shopsmart_user');
    return saved ? JSON.parse(saved) : DEMO_PERSONAS[3];
  }

  // Orders endpoints
  if (pathname === '/orders' && method === 'GET') {
    return mockOrders;
  }

  if (pathname.startsWith('/orders/') && method === 'GET') {
    const id = pathname.replace('/orders/', '');
    const order = mockOrders.find(o => o.id === id || o.order_number === id);
    if (!order) throw new Error('Order not found');
    return order;
  }

  if (pathname === '/orders/simulate' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      order_number: `ORD-${orderId.split('-')[1]}`,
      created_at: new Date().toISOString(),
      status: 'PROCESSING',
      total_amount: body.total_amount || 299.99,
      item_count: (body.items || []).length || 1,
      items: body.items || [],
      tracking_number: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}-US`,
      carrier: 'Priority Express (Simulated)',
      estimated_delivery: '2-3 Business Days',
      timeline: [
        {
          stage: 'PROCESSING',
          label: 'Order Processing',
          description: 'Payment verified and warehouse packing dispatched.',
          location: 'ShopSmart Fulfillment Hub',
          timestamp: new Date().toISOString(),
          completed: true,
          current: true
        },
        {
          stage: 'PLACED',
          label: 'Order Placed',
          description: 'Order created by customer.',
          location: 'ShopSmart AI Platform',
          timestamp: new Date().toISOString(),
          completed: true
        }
      ]
    };
    mockOrders = [newOrder, ...mockOrders];
    return newOrder;
  }

  // Support Tickets
  if (pathname === '/support/tickets' && method === 'GET') {
    return mockTickets;
  }

  if (pathname === '/support/tickets' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const tckId = `tck-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      id: tckId,
      ticket_id: `TCK-${tckId.split('-')[1]}`,
      subject: body.subject || 'Support Inquiry',
      order_id: body.order_id || null,
      status: 'OPEN',
      priority: body.priority || 'NORMAL',
      created_at: new Date().toISOString(),
      message: body.message || '',
      agent_reply: 'Your request has been received. Our automated agent has verified your account and will follow up shortly.'
    };
    mockTickets = [newTicket, ...mockTickets];
    return newTicket;
  }

  // AI Recommendations
  if (pathname === '/ai/recommendations' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    return handleMockAiRecommendations(body.prompt, body.budget);
  }

  // Admin Endpoints
  if (pathname === '/admin/products' && method === 'GET') {
    return mockProducts;
  }

  if (pathname === '/admin/products' && method === 'POST') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const newProd = {
      ...body,
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewCount: 0
    };
    mockProducts = [newProd, ...mockProducts];
    return newProd;
  }

  if (pathname.startsWith('/admin/products/') && method === 'PATCH') {
    const id = pathname.replace('/admin/products/', '');
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProducts[idx] = { ...mockProducts[idx], ...body };
      return mockProducts[idx];
    }
    throw new Error('Product not found');
  }

  if (pathname === '/admin/audit' && method === 'GET') {
    return {
      audit_logs: mockAuditLogs,
      decision_logs: SAMPLE_AI_DECISION_LOGS
    };
  }

  // Default fallback
  return { status: 'ok', message: 'Simulated response' };
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('shopsmart_token');
  const headers = { ...options.headers };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  // Attempt real backend with a 1500ms timeout; if it fails or returns 404/500, fallback to mock data
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem('shopsmart_token');
      localStorage.removeItem('shopsmart_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    if (!response.ok) {
      if (response.status === 404 || response.status >= 500) {
        return fallbackMockHandler(endpoint, options);
      }
      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.message || data?.detail || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    return fallbackMockHandler(endpoint, options);
  }
}

export const api = {
  get: (endpoint, params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(url, { method: 'GET' });
  },

  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  upload: (endpoint, formData) => request(endpoint, {
    method: 'POST',
    body: formData,
  }),
};
