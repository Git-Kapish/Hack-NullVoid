export const DEMO_PERSONAS = [
  {
    email: 'admin@shopsmart.ai',
    name: 'Alex Vance (Admin)',
    role: 'ADMIN',
    membership_tier: 'PREMIUM',
    description: 'System Administrator with catalog inventory and AI decision log auditing access'
  },
  {
    email: 'sarah.prime@example.com',
    name: 'Sarah Connor',
    role: 'CUSTOMER',
    membership_tier: 'PRIME',
    description: 'Prime member with 30-day returns and free 2-day shipping'
  },
  {
    email: 'elena.premium@example.com',
    name: 'Elena Rostova',
    role: 'CUSTOMER',
    membership_tier: 'PREMIUM',
    description: 'VIP Premium tier with 60-day doorstep return pickup and same-day delivery'
  },
  {
    email: 'david.basic@example.com',
    name: 'David Kim',
    role: 'CUSTOMER',
    membership_tier: 'BASIC',
    description: 'Standard customer with 14-day return window'
  }
];

export const CATEGORIES = [
  { id: 'audio', name: 'Audio & Sound', count: 4, icon: 'Headphones' },
  { id: 'laptops', name: 'Laptops & Computers', count: 3, icon: 'Laptop' },
  { id: 'wearables', name: 'Smart Wearables', count: 3, icon: 'Watch' },
  { id: 'accessories', name: 'Keyboards & Peripherals', count: 4, icon: 'Keyboard' }
];

export const PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'audio',
    brand: 'Sony',
    price: 349.99,
    originalPrice: 399.99,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 1420,
    availability: 'IN_STOCK',
    stockCount: 42,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    description: 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound clarity and crystal clear hands-free calling.',
    specs: {
      'Battery Life': '30 Hours (ANC on)',
      'Noise Canceling': 'Dual Processors V1 + QN1',
      'Weight': '250g',
      'Bluetooth': 'v5.2 (LDAC, AAC, SBC)',
      'Fast Charging': '3 min charge = 3 hours playback',
      'Warranty': '1 Year Manufacturer'
    }
  },
  {
    id: 'prod-002',
    name: 'Bose QuietComfort Ultra Headphones',
    category: 'audio',
    brand: 'Bose',
    price: 429.00,
    originalPrice: 429.00,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 890,
    availability: 'IN_STOCK',
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    description: 'Breakthrough spatial audio with CustomTune sound calibration tailored to your ear canal shape and world-class quiet modes.',
    specs: {
      'Battery Life': '24 Hours',
      'Noise Canceling': 'CustomTune Active Noise Canceling',
      'Weight': '252g',
      'Bluetooth': 'v5.3 with multipoint',
      'Fast Charging': '15 min charge = 2 hours playback',
      'Warranty': '1 Year Manufacturer'
    }
  },
  {
    id: 'prod-003',
    name: 'Apple AirPods Max (USB-C)',
    category: 'audio',
    brand: 'Apple',
    price: 549.00,
    originalPrice: 549.00,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 2310,
    availability: 'LOW_STOCK',
    stockCount: 4,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
    ],
    description: 'Computational audio with Apple-designed dynamic drivers, memory foam ear cushions, and seamless switching across iOS and macOS.',
    specs: {
      'Battery Life': '20 Hours (ANC + Spatial Audio)',
      'Noise Canceling': 'Active Noise Cancellation with Transparency mode',
      'Weight': '384.8g',
      'Bluetooth': 'v5.0 with Apple H1 headphone chip (each cup)',
      'Fast Charging': '5 min charge = 1.5 hours playback',
      'Warranty': '1 Year AppleCare eligible'
    }
  },
  {
    id: 'prod-004',
    name: 'Sennheiser Momentum 4 Wireless',
    category: 'audio',
    brand: 'Sennheiser',
    price: 279.95,
    originalPrice: 379.95,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 640,
    availability: 'IN_STOCK',
    stockCount: 25,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
    ],
    description: 'Unmatched 60-hour battery life with audiophile-inspired 42mm transducer system and adaptive noise cancellation.',
    specs: {
      'Battery Life': '60 Hours',
      'Noise Canceling': 'Adaptive Hybrid ANC',
      'Weight': '293g',
      'Bluetooth': 'v5.2 (aptX Adaptive, AAC)',
      'Fast Charging': '10 min charge = 6 hours playback',
      'Warranty': '2 Years International'
    }
  },
  {
    id: 'prod-005',
    name: 'Apple MacBook Air 15" M3',
    category: 'laptops',
    brand: 'Apple',
    price: 1299.00,
    originalPrice: 1299.00,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 1120,
    availability: 'IN_STOCK',
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
    ],
    description: 'Strikingly thin design with the lightning-fast M3 chip, up to 18 hours of battery life, and a spacious Liquid Retina display.',
    specs: {
      'Processor': 'Apple M3 (8-core CPU, 10-core GPU)',
      'RAM': '16GB Unified Memory',
      'Storage': '512GB SSD',
      'Display': '15.3-inch Liquid Retina (2880 x 1864)',
      'Battery Life': 'Up to 18 hours',
      'Weight': '1.51 kg (3.3 lbs)',
      'Warranty': '1 Year Limited'
    }
  },
  {
    id: 'prod-006',
    name: 'Dell XPS 14 OLED Laptop',
    category: 'laptops',
    brand: 'Dell',
    price: 1699.00,
    originalPrice: 1849.00,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 430,
    availability: 'IN_STOCK',
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'
    ],
    description: 'Crafted with machined aluminum and Gorilla Glass 3, powered by Intel Core Ultra 7 with dedicated AI NPU for on-device acceleration.',
    specs: {
      'Processor': 'Intel Core Ultra 7 155H with Intel AI Boost',
      'RAM': '32GB LPDDR5x',
      'Storage': '1TB PCIe 4.0 NVMe SSD',
      'Display': '14.5-inch 3.2K OLED Touch 120Hz',
      'Battery Life': 'Up to 12 hours',
      'Weight': '1.68 kg (3.7 lbs)',
      'Warranty': '1 Year Premium Support'
    }
  },
  {
    id: 'prod-007',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    category: 'laptops',
    brand: 'Lenovo',
    price: 1899.00,
    originalPrice: 2099.00,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 520,
    availability: 'OUT_OF_STOCK',
    stockCount: 0,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
    ],
    description: 'The definitive business ultrabook. Lightweight carbon-fiber chassis, legendary ergonomic keyboard, and enterprise-grade security.',
    specs: {
      'Processor': 'Intel Core Ultra 7 165U vPro',
      'RAM': '32GB LPDDR5x',
      'Storage': '1TB SSD OPAL2.0',
      'Display': '14-inch 2.8K OLED Anti-Glare',
      'Battery Life': 'Up to 14 hours',
      'Weight': '1.09 kg (2.4 lbs)',
      'Warranty': '3 Years Onsite Next Business Day'
    }
  },
  {
    id: 'prod-008',
    name: 'Apple Watch Ultra 2 (Titanium)',
    category: 'wearables',
    brand: 'Apple',
    price: 799.00,
    originalPrice: 799.00,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 3100,
    availability: 'IN_STOCK',
    stockCount: 22,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    ],
    description: 'Rugged titanium case, precision dual-frequency GPS, up to 36 hours battery life, and diving depth gauge certified to 40 meters.',
    specs: {
      'Case Material': 'Aerospace-Grade Titanium (49mm)',
      'Battery Life': '36 Hours (up to 72 hrs Low Power)',
      'Display': 'Always-On Retina 3000 nits peak',
      'Water Resistance': '100m water resistant, EN13319 dive certified',
      'Sensors': 'ECG, Blood Oxygen, Temp, Dual GPS',
      'Warranty': '1 Year Limited'
    }
  },
  {
    id: 'prod-009',
    name: 'Garmin Fenix 7 Pro Sapphire Solar',
    category: 'wearables',
    brand: 'Garmin',
    price: 799.99,
    originalPrice: 899.99,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 1250,
    availability: 'IN_STOCK',
    stockCount: 11,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
    ],
    description: 'Ultimate multisport GPS smartwatch with solar charging lens, built-in LED flashlight, and comprehensive endurance metrics.',
    specs: {
      'Case Material': 'Titanium with Sapphire Solar Lens (47mm)',
      'Battery Life': 'Up to 22 days in smartwatch mode with solar',
      'Display': 'Sunlight-visible transflective memory-in-pixel',
      'Water Resistance': '10 ATM (100 meters)',
      'Sensors': 'Multi-band GNSS, SatIQ, Elevate v5 Heart Rate',
      'Warranty': '2 Years Garmin Care'
    }
  },
  {
    id: 'prod-010',
    name: 'Samsung Galaxy Watch 6 Classic',
    category: 'wearables',
    brand: 'Samsung',
    price: 329.99,
    originalPrice: 399.99,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 970,
    availability: 'LOW_STOCK',
    stockCount: 3,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
    ],
    description: 'Timeless stainless steel design with the iconic physical rotating bezel and advanced sleep coaching analytics.',
    specs: {
      'Case Material': 'Stainless Steel (47mm)',
      'Battery Life': 'Up to 40 hours',
      'Display': 'Super AMOLED Sapphire Crystal',
      'Water Resistance': '5ATM + IP68 + MIL-STD-810H',
      'Sensors': 'BioActive Sensor (ECG, BIA, Optical Heart Rate)',
      'Warranty': '1 Year Limited'
    }
  },
  {
    id: 'prod-011',
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'accessories',
    brand: 'Logitech',
    price: 99.99,
    originalPrice: 99.99,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 5400,
    availability: 'IN_STOCK',
    stockCount: 65,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'
    ],
    description: 'Quiet Click technology with 90% less click noise, MagSpeed electromagnetic scrolling wheel (1,000 lines per second), and 8K DPI sensor on glass.',
    specs: {
      'Sensor': 'Darkfield high precision (8000 DPI)',
      'Battery Life': 'Up to 70 days on full charge',
      'Connectivity': 'Bluetooth Low Energy & Logi Bolt USB',
      'Custom Buttons': '7 programmable buttons with app profiles',
      'Weight': '141g',
      'Warranty': '1 Year Hardware'
    }
  },
  {
    id: 'prod-012',
    name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    category: 'accessories',
    brand: 'Keychron',
    price: 199.00,
    originalPrice: 219.00,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 680,
    availability: 'IN_STOCK',
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
    ],
    description: 'QMK/VIA wireless custom mechanical keyboard with CNC machined aluminum body, double-gasket design, and hot-swappable switches.',
    specs: {
      'Layout': '75% Layout (81 keys + rotary knob)',
      'Switches': 'Keychron K Pro Red (Pre-lubed, Hot-swappable)',
      'Connectivity': 'Bluetooth 5.1 & Type-C wired (1000Hz polling)',
      'Keycaps': 'Double-shot PBT OSA profile',
      'Weight': '1.74 kg (solid CNC aluminum)',
      'Warranty': '1 Year Manufacturer'
    }
  }
];

export const SAMPLE_ORDERS = [
  {
    id: 'ord-8492',
    order_number: 'ORD-8492',
    created_at: '2026-10-21T09:30:00Z',
    status: 'DELIVERED',
    total_amount: 349.99,
    item_count: 1,
    items: [
      {
        product_id: 'prod-001',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 349.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      }
    ],
    tracking_number: 'TRK-98327189-US',
    carrier: 'Express Logistics (Simulated)',
    estimated_delivery: '2026-10-23',
    timeline: [
      {
        stage: 'DELIVERED',
        label: 'Delivered',
        description: 'Package delivered at front porch. Sign-off recorded.',
        location: 'Seattle, WA',
        timestamp: '2026-10-23T11:42:00Z',
        completed: true
      },
      {
        stage: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'Courier out on morning delivery route.',
        location: 'Seattle Hub, WA',
        timestamp: '2026-10-23T07:15:00Z',
        completed: true
      },
      {
        stage: 'SHIPPED',
        label: 'In Transit',
        description: 'Departed regional sorting facility.',
        location: 'Portland Sorting Center, OR',
        timestamp: '2026-10-22T16:20:00Z',
        completed: true
      },
      {
        stage: 'PROCESSING',
        label: 'Package Picked & Packed',
        description: 'Inventory verified and boxed in sustainable packaging.',
        location: 'Fulfillment Center #4, OR',
        timestamp: '2026-10-21T14:10:00Z',
        completed: true
      },
      {
        stage: 'PLACED',
        label: 'Order Placed',
        description: 'Payment authorized and order confirmed.',
        location: 'ShopSmart AI Platform',
        timestamp: '2026-10-21T09:30:00Z',
        completed: true
      }
    ]
  },
  {
    id: 'ord-7190',
    order_number: 'ORD-7190',
    created_at: '2026-10-22T15:10:00Z',
    status: 'OUT_FOR_DELIVERY',
    total_amount: 1299.00,
    item_count: 1,
    items: [
      {
        product_id: 'prod-005',
        name: 'Apple MacBook Air 15" M3',
        price: 1299.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
      }
    ],
    tracking_number: 'TRK-54819203-US',
    carrier: 'Priority Air (Simulated)',
    estimated_delivery: 'Today by 5:00 PM',
    timeline: [
      {
        stage: 'DELIVERED',
        label: 'Delivered',
        description: 'Estimated arrival today by 5:00 PM',
        location: 'San Francisco, CA',
        timestamp: null,
        completed: false
      },
      {
        stage: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'Driver is on the way (8 stops away)',
        location: 'SF Downtown Depot, CA',
        timestamp: '2026-10-23T08:30:00Z',
        completed: true,
        current: true
      },
      {
        stage: 'SHIPPED',
        label: 'Departed Facility',
        description: 'Arrived at local destination hub.',
        location: 'Oakland Air Hub, CA',
        timestamp: '2026-10-22T23:45:00Z',
        completed: true
      },
      {
        stage: 'PLACED',
        label: 'Order Placed',
        description: 'Order confirmed under Prime Free 2-Day Delivery.',
        location: 'ShopSmart AI Platform',
        timestamp: '2026-10-22T15:10:00Z',
        completed: true
      }
    ]
  },
  {
    id: 'ord-6021',
    order_number: 'ORD-6021',
    created_at: '2026-10-23T10:15:00Z',
    status: 'PROCESSING',
    total_amount: 99.99,
    item_count: 1,
    items: [
      {
        product_id: 'prod-011',
        name: 'Logitech MX Master 3S Wireless Mouse',
        price: 99.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'
      }
    ],
    tracking_number: 'TRK-PENDING-US',
    carrier: 'Express Ground (Simulated)',
    estimated_delivery: '2026-10-25',
    timeline: [
      {
        stage: 'PROCESSING',
        label: 'Processing Order',
        description: 'Warehouse allocating inventory for dispatch.',
        location: 'Reno Fulfillment Center, NV',
        timestamp: '2026-10-23T10:20:00Z',
        completed: true,
        current: true
      },
      {
        stage: 'PLACED',
        label: 'Order Confirmed',
        description: 'Order successfully placed.',
        location: 'ShopSmart AI Platform',
        timestamp: '2026-10-23T10:15:00Z',
        completed: true
      }
    ]
  }
];

export const SAMPLE_TICKETS = [
  {
    id: 'tck-001',
    ticket_id: 'TCK-301',
    subject: 'Return window query for Sony WH-1000XM5',
    order_id: 'ORD-8492',
    status: 'RESOLVED',
    priority: 'NORMAL',
    created_at: '2026-10-21T18:20:00Z',
    message: 'Could you please confirm if Prime members receive 30 days to initiate a return?',
    agent_reply: 'Yes, absolutely. Under Return Policy v2.1 (Section: Return Windows), Prime members enjoy a full 30-day window from the delivery date.'
  },
  {
    id: 'tck-002',
    ticket_id: 'TCK-302',
    subject: 'Expedited shipping tracking check',
    order_id: 'ORD-7190',
    status: 'OPEN',
    priority: 'HIGH',
    created_at: '2026-10-23T09:12:00Z',
    message: 'Checking if my MacBook Air M3 will definitely arrive before 5:00 PM today.',
    agent_reply: 'Your order is currently out for delivery on truck #42. The estimated delivery window is 2:30 PM - 4:15 PM today.'
  }
];

export const SAMPLE_AUDIT_LOGS = [
  {
    id: 'aud-001',
    timestamp: '2026-10-23T14:48:12Z',
    actor: 'sarah.prime@example.com',
    action: 'AI_RECOMMENDATION_QUERY',
    resource_type: 'AI_ORCHESTRATOR',
    resource_id: 'req-89a1f0',
    outcome: 'SUCCESS',
    details: 'Extracted budget: $350. Retrieved 3 candidate audio products. Filtered out-of-stock.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-23T14:42:05Z',
    actor: 'elena.premium@example.com',
    action: 'AI_RECOMMENDATION_QUERY',
    resource_type: 'AI_ORCHESTRATOR',
    resource_id: 'req-77b312',
    outcome: 'SUCCESS',
    details: 'Extracted budget: $1400. Evaluated 3 candidate laptops. Selected MacBook Air M3.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-23T14:30:19Z',
    actor: 'admin@shopsmart.ai',
    action: 'CATALOG_PRODUCT_UPDATE',
    resource_type: 'PRODUCT',
    resource_id: 'prod-003',
    outcome: 'SUCCESS',
    details: 'Updated stock count for Apple AirPods Max from 5 to 4 (LOW_STOCK).'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-23T14:15:30Z',
    actor: 'david.basic@example.com',
    action: 'ORDER_SIMULATION_CREATE',
    resource_type: 'ORDER',
    resource_id: 'ORD-6021',
    outcome: 'SUCCESS',
    details: 'Created simulated order for Logitech MX Master 3S. Total: $99.99.'
  }
];

export const SAMPLE_AI_DECISION_LOGS = [
  {
    id: 'dec-001',
    timestamp: '2026-10-23T14:48:12Z',
    request_id: 'req-89a1f0',
    prompt: 'I want wireless noise canceling headphones under $350 with great battery life',
    interpreted_requirement: 'Wireless over-ear headphones with active noise cancellation and >= 30h battery under $350',
    budget_limit: 350,
    model: 'gemini-2.5-flash',
    tokens_used: 342,
    candidates_evaluated: 4,
    recommended_product_ids: ['prod-001', 'prod-004'],
    explanation: 'Sony WH-1000XM5 matches exact price cap ($349.99) and 30h battery. Sennheiser Momentum 4 offers 60h battery at $279.95. AirPods Max ($549) excluded due to exceeding budget.'
  },
  {
    id: 'dec-002',
    timestamp: '2026-10-23T14:42:05Z',
    request_id: 'req-77b312',
    prompt: 'Find a thin and powerful laptop with at least 16GB RAM for under $1400',
    interpreted_requirement: 'Laptop with ≥16GB RAM, lightweight portability, under $1400',
    model: 'gemini-2.5-flash',
    tokens_used: 285,
    budget_limit: 1400,
    candidates_evaluated: 3,
    recommended_product_ids: ['prod-005'],
    explanation: 'MacBook Air 15" M3 matched at $1,299 with 16GB unified memory and 1.51kg weight. Dell XPS 14 ($1699) and ThinkPad X1 ($1899) were excluded due to exceeding budget.'
  }
];
