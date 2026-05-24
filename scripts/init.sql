-- ============================================================
-- BuildMart AI — Database Init Script
-- Runs automatically on first Docker startup
-- ============================================================

CREATE DATABASE IF NOT EXISTS buildmart_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE buildmart_db;

-- ── Seed demo users ──
-- Password for all demo accounts: Demo@1234
-- BCrypt hash (cost 12) of "Demo@1234":
-- $2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO

INSERT IGNORE INTO users
  (email, password, first_name, last_name, phone, role, email_verified, active, created_at, updated_at)
VALUES
  -- Admin
  ('admin@buildmart.ai',
   '$2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO',
   'BuildMart', 'Admin', '9000000001', 'ADMIN', 1, 1, NOW(), NOW()),
  -- Demo Customer
  ('customer@demo.com',
   '$2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO',
   'Rajesh', 'Kumar', '9876543210', 'CUSTOMER', 1, 1, NOW(), NOW()),
  -- Demo Vendor
  ('vendor@demo.com',
   '$2a$12$LcV8n4jQFZ8P9kX7mN2d2.8TJxGJ9vRWnHfNGdKdGe5yNMGpkixcO',
   'Sharma', 'Traders', '9876543211', 'VENDOR', 1, 1, NOW(), NOW());

-- ── Seed demo vendor profile ──
-- (user_id = 3 = vendor@demo.com)
INSERT IGNORE INTO vendors
  (user_id, business_name, gst_number, city, state, pincode,
   latitude, longitude, delivery_radius_km, verification_status,
   rating, total_ratings, created_at, updated_at)
VALUES
  (3, 'Sharma Traders', '09AABCU9603R1ZA', 'Lucknow', 'Uttar Pradesh', '226001',
   26.8467, 80.9462, 50, 'VERIFIED', 4.5, 128, NOW(), NOW());

-- ── Seed demo products ──
INSERT IGNORE INTO products
  (vendor_id, name, description, brand, category, base_price, current_price,
   unit, stock_quantity, in_stock, active, rating, total_ratings, created_at, updated_at)
VALUES
  (1, 'UltraTech OPC Cement 50kg',
   'Premium OPC 53 Grade cement. Ideal for RCC, masonry and plastering. Meets IS 269:2015.',
   'UltraTech', 'CEMENT', 375.00, 380.00, 'bag', 500, 1, 1, 4.5, 128, NOW(), NOW()),

  (1, 'Red Clay Bricks - Standard (per 1000)',
   'High quality traditional red clay bricks. Size: 9x4x3 inches. Suitable for load-bearing walls.',
   'Local Kiln', 'BRICKS', 7000.00, 7500.00, '1000 pcs', 50000, 1, 1, 4.3, 89, NOW(), NOW()),

  (1, 'River Sand Grade A',
   'Clean washed river sand. Free from silt and clay. Ideal for concrete and plastering.',
   NULL, 'SAND', 1100.00, 1200.00, 'cubic meter', 800, 1, 1, 4.7, 312, NOW(), NOW()),

  (1, 'TMT Steel Bars 12mm Fe500 (per ton)',
   'High tensile TMT bars. Corrosion resistant. BIS certified. Used in RCC structures.',
   'TATA Steel', 'IRON_RODS', 60000.00, 62000.00, 'ton', 50, 1, 1, 4.8, 189, NOW(), NOW()),

  (1, 'Vitrified Floor Tiles 600x600mm',
   'Premium vitrified tiles. Anti-skid surface. Suitable for floors and walls.',
   'Kajaria', 'TILES', 38.00, 42.00, 'sq ft', 5000, 1, 1, 4.6, 290, NOW(), NOW()),

  (1, 'M-Sand (Manufactured Sand)',
   'Crushed stone sand as per IS 383. Consistent grading. Eco-friendly alternative to river sand.',
   NULL, 'SAND', 900.00, 950.00, 'cubic meter', 400, 1, 1, 4.4, 156, NOW(), NOW()),

  (1, 'ACC Gold Cement 50kg',
   'Premium PPC cement. Better workability and durability. Ideal for plastering and masonry.',
   'ACC', 'CEMENT', 360.00, 365.00, 'bag', 200, 1, 1, 4.3, 67, NOW(), NOW()),

  (1, '20mm Crushed Granite Aggregate',
   'Graded granite aggregate for concrete. Free from impurities. As per IS 383.',
   NULL, 'AGGREGATE', 1000.00, 1100.00, 'ton', 200, 1, 1, 4.3, 78, NOW(), NOW());

-- ── Seed wallets for demo users ──
INSERT IGNORE INTO wallets (user_id, balance) VALUES (1, 0.00), (2, 500.00), (3, 0.00);

-- ── Seed demo coupon ──
INSERT IGNORE INTO coupons
  (code, description, discount_type, discount_value, max_discount,
   min_order_amount, usage_limit, used_count, expires_at, active, created_at)
VALUES
  ('WELCOME10', 'Welcome discount - 10% off your first order',
   'PERCENTAGE', 10.00, 500.00, 1000.00, 1000, 0,
   DATE_ADD(NOW(), INTERVAL 1 YEAR), 1, NOW()),

  ('FLAT200', 'Flat ₹200 off on orders above ₹5000',
   'FIXED', 200.00, 200.00, 5000.00, 500, 0,
   DATE_ADD(NOW(), INTERVAL 6 MONTH), 1, NOW());
