import asyncio
import logging
from app.core.database import get_prisma

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

CATEGORIES_DATA = [
    {"name": "Laptops & Computers", "slug": "laptops"},
    {"name": "Audio & Sound", "slug": "audio"},
    {"name": "Smart Wearables", "slug": "wearables"},
    {"name": "Keyboards & Peripherals", "slug": "accessories"},
    {"name": "Smartphones & Mobile", "slug": "smartphones"},
]

PRODUCTS_DATA = [
    # ---------------- Budget Laptops (Under $1000) ----------------
    {
        "sku": "LAP-ACER-ASP5",
        "name": "Acer Aspire 5 Slim Laptop",
        "category_slug": "laptops",
        "brand": "Acer",
        "price": 499.00,
        "rating": 4.5,
        "description": "Affordable performance laptop with 13th Gen Intel Core i5, crisp Full HD IPS display, and all-day battery life for productivity and coding.",
        "images": ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"],
        "stock": 25,
        "specs": {
            "Processor": "Intel Core i5-1335U (10 cores, up to 4.6 GHz)",
            "RAM": "16GB DDR4 3200MHz",
            "Storage": "512GB PCIe NVMe SSD",
            "Display": "15.6-inch Full HD (1920 x 1080) IPS",
            "Battery Life": "Up to 9.5 hours",
            "Weight": "1.7 kg (3.75 lbs)",
            "Warranty": "1 Year Standard"
        }
    },
    {
        "sku": "LAP-LEN-IDEA3",
        "name": "Lenovo IdeaPad Slim 3 15\"",
        "category_slug": "laptops",
        "brand": "Lenovo",
        "price": 599.00,
        "rating": 4.6,
        "description": "Slim and lightweight workhorse laptop powered by AMD Ryzen 5 with rapid charge technology and Dolby Audio.",
        "images": ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"],
        "stock": 18,
        "specs": {
            "Processor": "AMD Ryzen 5 7520U (4 cores / 8 threads)",
            "RAM": "16GB LPDDR5 5500MHz",
            "Storage": "512GB NVMe M.2 SSD",
            "Display": "15.6-inch FHD (1920 x 1080) Touchscreen",
            "Battery Life": "Up to 11 hours",
            "Weight": "1.62 kg (3.57 lbs)",
            "Warranty": "1 Year Depot"
        }
    },
    {
        "sku": "LAP-ASUS-VIVO15",
        "name": "ASUS Vivobook 15 Thin & Light",
        "category_slug": "laptops",
        "brand": "ASUS",
        "price": 649.00,
        "rating": 4.6,
        "description": "Modern compact laptop featuring an anti-glare NanoEdge display, 180-degree lay-flat hinge, and 1TB fast storage.",
        "images": ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"],
        "stock": 14,
        "specs": {
            "Processor": "Intel Core i5-1335U with Iris Xe Graphics",
            "RAM": "16GB DDR4",
            "Storage": "1TB M.2 NVMe PCIe 3.0 SSD",
            "Display": "15.6-inch FHD NanoEdge 60Hz",
            "Battery Life": "Up to 8.5 hours",
            "Weight": "1.7 kg (3.75 lbs)",
            "Warranty": "1 Year Accidental Damage"
        }
    },
    {
        "sku": "LAP-HP-PAV14",
        "name": "HP Pavilion 14 Touchscreen Laptop",
        "category_slug": "laptops",
        "brand": "HP",
        "price": 749.00,
        "rating": 4.7,
        "description": "Premium aluminum finished compact laptop with Intel Core i7 processor, micro-edge touch display, and audio by B&O.",
        "images": ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"],
        "stock": 12,
        "specs": {
            "Processor": "Intel Core i7-1355U (10 cores, up to 5.0 GHz)",
            "RAM": "16GB DDR4 3200MHz",
            "Storage": "512GB PCIe NVMe M.2 SSD",
            "Display": "14-inch Full HD IPS Touchscreen (1920 x 1080)",
            "Battery Life": "Up to 10 hours",
            "Weight": "1.41 kg (3.11 lbs)",
            "Warranty": "1 Year Limited"
        }
    },
    {
        "sku": "LAP-APP-MBA13-M1",
        "name": "Apple MacBook Air 13\" M1",
        "category_slug": "laptops",
        "brand": "Apple",
        "price": 849.00,
        "rating": 4.9,
        "description": "Incredible value ultrabook with groundbreaking Apple Silicon M1 performance, fanless silent operation, and up to 18 hours battery.",
        "images": ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"],
        "stock": 20,
        "specs": {
            "Processor": "Apple M1 (8-core CPU, 7-core GPU, 16-core Neural Engine)",
            "RAM": "8GB Unified Memory",
            "Storage": "256GB Fast SSD",
            "Display": "13.3-inch Retina Display with True Tone (2560 x 1600)",
            "Battery Life": "Up to 18 hours",
            "Weight": "1.29 kg (2.8 lbs)",
            "Warranty": "1 Year Apple Limited"
        }
    },
    # ---------------- Premium Laptops ($1000+) ----------------
    {
        "sku": "LAP-APP-MBA15-M3",
        "name": "Apple MacBook Air 15\" M3",
        "category_slug": "laptops",
        "brand": "Apple",
        "price": 1299.00,
        "rating": 4.9,
        "description": "Strikingly thin design with the lightning-fast M3 chip, up to 18 hours of battery life, and a spacious Liquid Retina display.",
        "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
        "stock": 15,
        "specs": {
            "Processor": "Apple M3 (8-core CPU, 10-core GPU)",
            "RAM": "16GB Unified Memory",
            "Storage": "512GB SSD",
            "Display": "15.3-inch Liquid Retina (2880 x 1864)",
            "Battery Life": "Up to 18 hours",
            "Weight": "1.51 kg (3.3 lbs)",
            "Warranty": "1 Year Limited"
        }
    },
    {
        "sku": "LAP-DELL-XPS14",
        "name": "Dell XPS 14 OLED Laptop",
        "category_slug": "laptops",
        "brand": "Dell",
        "price": 1699.00,
        "rating": 4.6,
        "description": "Machined aluminum chassis, Gorilla Glass 3, powered by Intel Core Ultra 7 with dedicated AI NPU for on-device acceleration.",
        "images": ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"],
        "stock": 9,
        "specs": {
            "Processor": "Intel Core Ultra 7 155H with Intel AI Boost",
            "RAM": "32GB LPDDR5x",
            "Storage": "1TB PCIe 4.0 NVMe SSD",
            "Display": "14.5-inch 3.2K OLED Touch 120Hz",
            "Battery Life": "Up to 12 hours",
            "Weight": "1.68 kg (3.7 lbs)",
            "Warranty": "1 Year Premium Support"
        }
    },
    {
        "sku": "LAP-LEN-X1CARB",
        "name": "Lenovo ThinkPad X1 Carbon Gen 12",
        "category_slug": "laptops",
        "brand": "Lenovo",
        "price": 1899.00,
        "rating": 4.8,
        "description": "Legendary enterprise ultrabook with carbon-fiber reinforced chassis, biometric security, and Intel Evo Edition architecture.",
        "images": ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"],
        "stock": 8,
        "specs": {
            "Processor": "Intel Core Ultra 7 165U vPro",
            "RAM": "32GB LPDDR5x 6400MHz",
            "Storage": "1TB PCIe Gen4 Performance SSD",
            "Display": "14-inch 2.8K OLED Anti-Glare (2880 x 1800)",
            "Battery Life": "Up to 14 hours",
            "Weight": "1.09 kg (2.4 lbs)",
            "Warranty": "3 Years Premier Support"
        }
    },
    # ---------------- Audio & Sound ----------------
    {
        "sku": "AUD-AURA-PRO",
        "name": "Aura Pro Wireless ANC Headphones",
        "category_slug": "audio",
        "brand": "Sony",
        "price": 299.99,
        "rating": 4.8,
        "description": "Flagship wireless noise-cancelling headphones featuring 40mm custom drivers, multipoint pairing, and ultra-plush memory foam.",
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
        "stock": 35,
        "specs": {
            "Battery Life": "Up to 45 hours (ANC off) / 32 hours (ANC on)",
            "Noise Cancellation": "Dual-chip Hybrid Active ANC",
            "Drivers": "40mm Bio-Cellulose Dome",
            "Connectivity": "Bluetooth 5.3 + 3.5mm Aux",
            "Weight": "248g"
        }
    },
    {
        "sku": "AUD-ECHOPULSE-STU",
        "name": "EchoPulse Studio Monitor Headphones",
        "category_slug": "audio",
        "brand": "Sennheiser",
        "price": 189.50,
        "rating": 4.7,
        "description": "Precision tuned closed-back headphones delivering transparent frequency response and expansive soundstage for critical listening.",
        "images": ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"],
        "stock": 20,
        "specs": {
            "Frequency Response": "5Hz - 38,000Hz",
            "Impedance": "48 Ohms",
            "Drivers": "45mm Neodymium Dynamic",
            "Weight": "293g"
        }
    },
    {
        "sku": "AUD-SNDBRZ-TWS",
        "name": "SoundBreeze True Wireless Earbuds",
        "category_slug": "audio",
        "brand": "Bose",
        "price": 129.00,
        "rating": 4.5,
        "description": "Compact IPX7 waterproof true wireless earbuds with transparent spatial audio mode and wireless charging case.",
        "images": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"],
        "stock": 40,
        "specs": {
            "Battery Life": "8 hours (earbuds) + 24 hours (charging case)",
            "Water Resistance": "IPX7 certified",
            "Bluetooth": "5.3 with AAC and aptX"
        }
    },
    {
        "sku": "AUD-BASSWAVE-500",
        "name": "BassWave 500 Portable Speaker",
        "category_slug": "audio",
        "brand": "JBL",
        "price": 79.99,
        "rating": 4.6,
        "description": "Rugged outdoor Bluetooth speaker with 360-degree room-filling acoustic output and 24-hour battery endurance.",
        "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"],
        "stock": 30,
        "specs": {
            "Power Output": "30W RMS",
            "Battery Life": "Up to 24 hours",
            "Waterproof": "IP67 dust & water immersion"
        }
    },
    # ---------------- Wearables ----------------
    {
        "sku": "WEAR-FITTRACK-PRO",
        "name": "FitTrack Pulse Pro Smartwatch",
        "category_slug": "wearables",
        "brand": "Garmin",
        "price": 199.99,
        "rating": 4.6,
        "description": "Comprehensive health tracking smartwatch with ECG monitoring, blood oxygen sensing, and built-in multi-satellite GPS.",
        "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
        "stock": 22,
        "specs": {
            "Display": "1.4-inch AMOLED Always-On (454 x 454)",
            "Battery Life": "Up to 7 days smartwatch mode",
            "Sensors": "Optical Heart Rate, Pulse Ox, ECG, Alt-Barometer",
            "Water Resistance": "5 ATM (50 meters)"
        }
    },
    {
        "sku": "WEAR-APEX-ULTRA",
        "name": "Apex Ultra GPS Adventure Watch",
        "category_slug": "wearables",
        "brand": "Garmin",
        "price": 449.00,
        "rating": 4.9,
        "description": "Grade 5 titanium bezel and scratch-resistant sapphire crystal designed for extreme mountaineering, trail ultra-running, and triathlon.",
        "images": ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"],
        "stock": 10,
        "specs": {
            "Battery Life": "Up to 20 days smartwatch / 60 hours all-system GPS",
            "Bezel Material": "Grade 5 Titanium",
            "Lens": "Sapphire Crystal",
            "Navigation": "Offline Global Topo Maps with Turn-by-Turn"
        }
    },
    # ---------------- Accessories & Peripherals ----------------
    {
        "sku": "ACC-KEYCHRON-Q1",
        "name": "Keychron Q1 Pro Wireless Mechanical Keyboard",
        "category_slug": "accessories",
        "brand": "Keychron",
        "price": 199.00,
        "rating": 4.9,
        "description": "Fully customizable 75% CNC aluminum custom mechanical keyboard with hot-swappable switches, double-gasket design, and wireless Bluetooth 5.1.",
        "images": ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
        "stock": 20,
        "specs": {
            "Switches": "K Pro Mechanical Brown (Tactile Hot-Swappable)",
            "Body Material": "Full CNC Machined Aluminum",
            "Connectivity": "Bluetooth 5.1 + Type-C Wired",
            "Keycaps": "KSA Double-Shot PBT"
        }
    },
    {
        "sku": "ACC-LOGI-MX3S",
        "name": "Logitech MX Master 3S Ergonomic Mouse",
        "category_slug": "accessories",
        "brand": "Logitech",
        "price": 99.99,
        "rating": 4.9,
        "description": "The gold standard productivity mouse with 8K DPI track-on-glass sensor, Quiet Click switches, and MagSpeed electromagnetic scroll wheel.",
        "images": ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80"],
        "stock": 45,
        "specs": {
            "Sensor": "Darkfield 8,000 DPI High Precision",
            "Battery": "Up to 70 days on full charge",
            "Buttons": "7 programmable with gesture control",
            "Connectivity": "Bluetooth Low Energy + Logi Bolt USB"
        }
    },
]

DEMO_USERS_DATA = [
    {
        "id": "user_admin_001",
        "email": "admin@shopsmart.ai",
        "firstName": "Alex",
        "lastName": "Vance",
        "role": "ADMIN",
        "membershipTier": "PREMIUM",
    },
    {
        "id": "user_prime_002",
        "email": "sarah.prime@example.com",
        "firstName": "Sarah",
        "lastName": "Connor",
        "role": "CUSTOMER",
        "membershipTier": "PRIME",
    },
    {
        "id": "user_premium_003",
        "email": "elena.premium@example.com",
        "firstName": "Elena",
        "lastName": "Rostova",
        "role": "CUSTOMER",
        "membershipTier": "PREMIUM",
    },
    {
        "id": "user_basic_004",
        "email": "david.basic@example.com",
        "firstName": "David",
        "lastName": "Kim",
        "role": "CUSTOMER",
        "membershipTier": "BASIC",
    },
]


async def seed():
    db = get_prisma()
    await db.connect()
    logger.info("Connected to Neon PostgreSQL for database seeding...")

    # 1. Seed Categories
    category_map = {}
    for cat_data in CATEGORIES_DATA:
        cat = await db.category.upsert(
            where={"slug": cat_data["slug"]},
            data={
                "create": {"name": cat_data["name"], "slug": cat_data["slug"]},
                "update": {"name": cat_data["name"]},
            },
        )
        category_map[cat_data["slug"]] = cat.id
        logger.info(f"Category: {cat.name} (id={cat.id})")

    # 2. Seed Default Warehouse
    warehouse = await db.warehouse.upsert(
        where={"id": 1},
        data={
            "create": {"id": 1, "name": "Primary Central Hub", "location": "Columbus, OH"},
            "update": {"name": "Primary Central Hub", "location": "Columbus, OH"},
        },
    )
    logger.info(f"Warehouse ready: {warehouse.name}")

    # 3. Seed Products
    for prod in PRODUCTS_DATA:
        cat_id = category_map[prod["category_slug"]]
        product = await db.product.upsert(
            where={"sku": prod["sku"]},
            data={
                "create": {
                    "sku": prod["sku"],
                    "name": prod["name"],
                    "description": prod["description"],
                    "brand": prod["brand"],
                    "categoryId": cat_id,
                    "price": prod["price"],
                    "rating": prod["rating"],
                    "active": True,
                },
                "update": {
                    "name": prod["name"],
                    "description": prod["description"],
                    "brand": prod["brand"],
                    "categoryId": cat_id,
                    "price": prod["price"],
                    "rating": prod["rating"],
                    "active": True,
                },
            },
        )

        # Inventory
        await db.inventory.upsert(
            where={"productId_warehouseId": {"productId": product.id, "warehouseId": warehouse.id}},
            data={
                "create": {
                    "productId": product.id,
                    "warehouseId": warehouse.id,
                    "quantity": prod["stock"],
                },
                "update": {
                    "quantity": prod["stock"],
                },
            },
        )

        # Images
        for idx, img_url in enumerate(prod.get("images", [])):
            await db.productimage.create(
                data={
                    "productId": product.id,
                    "url": img_url,
                    "altText": prod["name"],
                    "sortOrder": idx,
                }
            )

        # Specs
        for key, val in prod.get("specs", {}).items():
            await db.productspec.create(
                data={
                    "productId": product.id,
                    "key": key,
                    "value": str(val),
                }
            )

        logger.info(f"Seeded product: {product.name} (${product.price:.2f})")

    # 4. Seed Demo Personas
    for user_data in DEMO_USERS_DATA:
        await db.user.upsert(
            where={"id": user_data["id"]},
            data={
                "create": user_data,
                "update": {
                    "email": user_data["email"],
                    "firstName": user_data["firstName"],
                    "lastName": user_data["lastName"],
                    "role": user_data["role"],
                    "membershipTier": user_data["membershipTier"],
                },
            },
        )
        logger.info(f"Seeded user: {user_data['firstName']} {user_data['lastName']} ({user_data['role']})")

    total_prods = await db.product.count()
    logger.info(f"Seeding completed successfully! Total products in Neon: {total_prods}")
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(seed())
