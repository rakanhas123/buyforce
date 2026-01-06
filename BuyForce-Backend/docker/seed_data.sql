-- Seed Data for BuyForce Database
-- Run this script to populate the database with sample data

-- Clear existing data (optional - uncomment if you want to start fresh)
-- TRUNCATE TABLE wishlist_items CASCADE;
-- TRUNCATE TABLE groups CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- Insert Users
-- Password for all users: 'Password123!' (hashed with bcrypt)
INSERT INTO users (id, email, "passwordHash", "fullName", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'david.cohen@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'דוד כהן', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'sarah.levi@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'שרה לוי', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'michael.mizrahi@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'מיכאל מזרחי', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'rachel.avraham@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'רחל אברהם', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'yossi.katz@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'יוסי כץ', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'dana.ben-david@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'דנה בן-דוד', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'ron.israeli@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'רון ישראלי', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'maya.shamir@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'מאיה שמיר', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'avi.cohen@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'אבי כהן', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'noa.green@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'נועה גרין', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'eli.rosen@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'אלי רוזן', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'tamar.gold@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'תמר גולד', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'ori.silver@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'אורי סילבר', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'shira.diamond@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'שירה דיימונד', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'ilan.stone@example.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'אילן סטון', NOW(), NOW());

-- Insert Groups (קבוצות קנייה)
INSERT INTO groups (id, name, "minParticipants", "joinedCount", progress, status, "endsAt", "notified70", "notified95", "notifiedLast12h", "createdAt", "updatedAt") VALUES
-- Active groups (OPEN)
('650e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro - הזדמנות מטורפת', 50, 42, 84.0, 'OPEN', NOW() + INTERVAL '3 days', true, false, false, NOW() - INTERVAL '2 days', NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'MacBook Air M3 - קבוצת רכישה', 30, 28, 93.3, 'OPEN', NOW() + INTERVAL '1 day', true, true, false, NOW() - INTERVAL '5 days', NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'AirPods Pro 2 - מבצע חם', 100, 67, 67.0, 'OPEN', NOW() + INTERVAL '5 days', false, false, false, NOW() - INTERVAL '1 day', NOW()),
('650e8400-e29b-41d4-a716-446655440004', 'Samsung Galaxy S24 Ultra', 40, 25, 62.5, 'OPEN', NOW() + INTERVAL '4 days', false, false, false, NOW() - INTERVAL '3 days', NOW()),
('650e8400-e29b-41d4-a716-446655440005', 'PlayStation 5 - קונסולה', 60, 45, 75.0, 'OPEN', NOW() + INTERVAL '2 days', true, false, false, NOW() - INTERVAL '4 days', NOW()),
('650e8400-e29b-41d4-a716-446655440006', 'DJI Mini 4 Pro - רחפן', 25, 18, 72.0, 'OPEN', NOW() + INTERVAL '6 days', true, false, false, NOW() - INTERVAL '2 days', NOW()),
('650e8400-e29b-41d4-a716-446655440007', 'iPad Pro 12.9 M2', 35, 30, 85.7, 'OPEN', NOW() + INTERVAL '2 days', true, false, false, NOW() - INTERVAL '6 days', NOW()),

-- Completed groups (CLOSED)
('650e8400-e29b-41d4-a716-446655440008', 'Apple Watch Series 9', 50, 50, 100.0, 'CLOSED', NOW() - INTERVAL '1 day', true, true, true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
('650e8400-e29b-41d4-a716-446655440009', 'Nintendo Switch OLED', 40, 40, 100.0, 'CLOSED', NOW() - INTERVAL '2 days', true, true, true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days'),
('650e8400-e29b-41d4-a716-446655440010', 'Sony WH-1000XM5 - אוזניות', 80, 80, 100.0, 'CLOSED', NOW() - INTERVAL '3 days', true, true, true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'),

-- Cancelled/Expired groups
('650e8400-e29b-41d4-a716-446655440011', 'GoPro Hero 12', 30, 12, 40.0, 'CANCELLED', NOW() - INTERVAL '5 days', false, false, false, NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days'),
('650e8400-e29b-41d4-a716-446655440012', 'Dyson V15 - שואב אבק', 45, 20, 44.4, 'CANCELLED', NOW() - INTERVAL '4 days', false, false, false, NOW() - INTERVAL '12 days', NOW() - INTERVAL '4 days'),

-- New groups just opened
('650e8400-e29b-41d4-a716-446655440013', 'Meta Quest 3 - VR', 35, 8, 22.9, 'OPEN', NOW() + INTERVAL '7 days', false, false, false, NOW() - INTERVAL '6 hours', NOW()),
('650e8400-e29b-41d4-a716-446655440014', 'Dell XPS 15 - מחשב נייד', 25, 5, 20.0, 'OPEN', NOW() + INTERVAL '8 days', false, false, false, NOW() - INTERVAL '3 hours', NOW()),
('650e8400-e29b-41d4-a716-446655440015', 'Canon EOS R6 Mark II', 20, 3, 15.0, 'OPEN', NOW() + INTERVAL '10 days', false, false, false, NOW() - INTERVAL '1 hour', NOW());

-- Insert Wishlist Items
INSERT INTO wishlist_items (id, "userId", "productId", "productName", "createdAt", "updatedAt") VALUES
-- User 1 (David Cohen) wishlist
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'PROD-001', 'iPhone 15 Pro Max 256GB', NOW() - INTERVAL '5 days', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'PROD-002', 'AirPods Pro 2nd Generation', NOW() - INTERVAL '4 days', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'PROD-003', 'Apple Watch Ultra 2', NOW() - INTERVAL '3 days', NOW()),

-- User 2 (Sarah Levi) wishlist
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'PROD-004', 'MacBook Pro 16" M3 Max', NOW() - INTERVAL '6 days', NOW()),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'PROD-005', 'iPad Pro 12.9" M2', NOW() - INTERVAL '2 days', NOW()),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'PROD-006', 'Magic Keyboard for iPad Pro', NOW() - INTERVAL '1 day', NOW()),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'PROD-007', 'Apple Pencil 2nd Generation', NOW() - INTERVAL '1 day', NOW()),

-- User 3 (Michael Mizrahi) wishlist
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'PROD-008', 'Samsung Galaxy S24 Ultra', NOW() - INTERVAL '7 days', NOW()),
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'PROD-009', 'Samsung Galaxy Buds2 Pro', NOW() - INTERVAL '5 days', NOW()),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'PROD-010', 'Samsung Galaxy Watch6 Classic', NOW() - INTERVAL '3 days', NOW()),

-- User 4 (Rachel Avraham) wishlist
('750e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'PROD-011', 'Sony WH-1000XM5', NOW() - INTERVAL '4 days', NOW()),
('750e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'PROD-012', 'Bose QuietComfort Ultra', NOW() - INTERVAL '3 days', NOW()),

-- User 5 (Yossi Katz) wishlist
('750e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 'PROD-013', 'PlayStation 5 Slim', NOW() - INTERVAL '8 days', NOW()),
('750e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'PROD-014', 'Xbox Series X', NOW() - INTERVAL '7 days', NOW()),
('750e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', 'PROD-015', 'Nintendo Switch OLED', NOW() - INTERVAL '6 days', NOW()),
('750e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440005', 'PROD-016', 'Meta Quest 3 512GB', NOW() - INTERVAL '2 days', NOW()),

-- User 6 (Dana Ben-David) wishlist
('750e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440006', 'PROD-017', 'DJI Mini 4 Pro', NOW() - INTERVAL '5 days', NOW()),
('750e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440006', 'PROD-018', 'GoPro Hero 12 Black', NOW() - INTERVAL '4 days', NOW()),
('750e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440006', 'PROD-019', 'DJI Osmo Action 4', NOW() - INTERVAL '3 days', NOW()),

-- User 7 (Ron Israeli) wishlist
('750e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440007', 'PROD-020', 'Canon EOS R6 Mark II', NOW() - INTERVAL '9 days', NOW()),
('750e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440007', 'PROD-021', 'Sony A7 IV', NOW() - INTERVAL '8 days', NOW()),
('750e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440007', 'PROD-022', 'Canon RF 24-70mm f/2.8', NOW() - INTERVAL '7 days', NOW()),

-- User 8 (Maya Shamir) wishlist
('750e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440008', 'PROD-023', 'Dyson V15 Detect', NOW() - INTERVAL '6 days', NOW()),
('750e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440008', 'PROD-024', 'iRobot Roomba j7+', NOW() - INTERVAL '5 days', NOW()),
('750e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440008', 'PROD-025', 'Ninja Air Fryer Max', NOW() - INTERVAL '4 days', NOW()),

-- User 9 (Avi Cohen) wishlist
('750e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440009', 'PROD-026', 'Dell XPS 15 9530', NOW() - INTERVAL '10 days', NOW()),
('750e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440009', 'PROD-027', 'LG UltraFine 32UN880', NOW() - INTERVAL '9 days', NOW()),
('750e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440009', 'PROD-028', 'Logitech MX Master 3S', NOW() - INTERVAL '8 days', NOW()),
('750e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440009', 'PROD-029', 'Keychron K8 Pro', NOW() - INTERVAL '7 days', NOW()),

-- User 10 (Noa Green) wishlist
('750e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', 'PROD-030', 'Kindle Paperwhite Signature', NOW() - INTERVAL '5 days', NOW()),
('750e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', 'PROD-031', 'Remarkable 2', NOW() - INTERVAL '4 days', NOW()),

-- User 11 (Eli Rosen) wishlist
('750e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', 'PROD-032', 'Garmin Fenix 7X', NOW() - INTERVAL '6 days', NOW()),
('750e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440011', 'PROD-033', 'Wahoo KICKR Smart Trainer', NOW() - INTERVAL '5 days', NOW()),

-- User 12 (Tamar Gold) wishlist
('750e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440012', 'PROD-034', 'Sonos Beam Gen 2', NOW() - INTERVAL '7 days', NOW()),
('750e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440012', 'PROD-035', 'Sonos Sub Mini', NOW() - INTERVAL '6 days', NOW()),
('750e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440012', 'PROD-036', 'Philips Hue Play Gradient', NOW() - INTERVAL '5 days', NOW()),

-- User 13 (Ori Silver) wishlist
('750e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440013', 'PROD-037', 'Tesla Model 3 Accessories Kit', NOW() - INTERVAL '8 days', NOW()),
('750e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440013', 'PROD-038', 'Anker 757 PowerHouse', NOW() - INTERVAL '7 days', NOW()),

-- User 14 (Shira Diamond) wishlist
('750e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440014', 'PROD-039', 'Nespresso Vertuo Next', NOW() - INTERVAL '4 days', NOW()),
('750e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440014', 'PROD-040', 'Vitamix A3500', NOW() - INTERVAL '3 days', NOW()),

-- User 15 (Ilan Stone) wishlist
('750e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440015', 'PROD-041', 'Herman Miller Aeron Chair', NOW() - INTERVAL '9 days', NOW()),
('750e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440015', 'PROD-042', 'Uplift V2 Standing Desk', NOW() - INTERVAL '8 days', NOW()),
('750e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440015', 'PROD-043', 'BenQ ScreenBar Halo', NOW() - INTERVAL '7 days', NOW());

-- Display summary
SELECT 'Users inserted:' AS summary, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Groups inserted:', COUNT(*) FROM groups
UNION ALL
SELECT 'Wishlist items inserted:', COUNT(*) FROM wishlist_items;
