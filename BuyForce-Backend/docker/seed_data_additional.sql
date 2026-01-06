-- Additional data to complete the seed
-- This fixes the missing columns based on actual schema

-- Update categories (they already exist, just missing description field which doesn't exist in schema)
-- Categories are already inserted with name only

-- Insert images with correct column names
INSERT INTO images (product_id, image_url, is_main) VALUES
(1, 'https://example.com/iphone15pro-1.jpg', true),
(1, 'https://example.com/iphone15pro-2.jpg', false),
(2, 'https://example.com/iphone15pro128-1.jpg', true),
(3, 'https://example.com/macbookair15-1.jpg', true),
(3, 'https://example.com/macbookair15-2.jpg', false),
(4, 'https://example.com/macbookair13-1.jpg', true),
(5, 'https://example.com/macbookpro16-1.jpg', true),
(8, 'https://example.com/airpodspro2-1.jpg', true),
(10, 'https://example.com/applewatch9-1.jpg', true),
(14, 'https://example.com/galaxys24ultra-1.jpg', true),
(18, 'https://example.com/sony1000xm5-1.jpg', true),
(21, 'https://example.com/ps5slim-1.jpg', true),
(23, 'https://example.com/xboxseriesx-1.jpg', true),
(25, 'https://example.com/switcholed-1.jpg', true),
(26, 'https://example.com/quest3-1.jpg', true),
(28, 'https://example.com/djimini4-1.jpg', true),
(30, 'https://example.com/gopro12-1.jpg', true),
(32, 'https://example.com/eosr6ii-1.jpg', true),
(36, 'https://example.com/dellxps15-1.jpg', true),
(44, 'https://example.com/dysonv15-1.jpg', true);

-- Insert specs with correct column names (spec_key, spec_value)
INSERT INTO specs (product_id, spec_key, spec_value) VALUES
(1, 'מעבד', 'Apple A17 Pro'),
(1, 'זכרון', '8GB'),
(1, 'אחסון', '256GB'),
(1, 'מסך', '6.7" Super Retina XDR'),
(1, 'מצלמה', '48MP Main + 12MP Ultra Wide + 12MP Telephoto'),
(3, 'מעבד', 'Apple M3'),
(3, 'זכרון', '16GB'),
(3, 'אחסון', '512GB SSD'),
(3, 'מסך', '15.3" Liquid Retina'),
(3, 'משקל', '1.51 ק"ג'),
(8, 'סוג', 'אוזניות In-Ear אלחוטיות'),
(8, 'ביטול רעשים', 'Active Noise Cancellation'),
(8, 'עמידות', 'IPX4'),
(8, 'סוללה', 'עד 6 שעות'),
(14, 'מעבד', 'Snapdragon 8 Gen 3'),
(14, 'זכרון', '12GB'),
(14, 'אחסון', '256GB'),
(14, 'מסך', '6.8" Dynamic AMOLED 2X'),
(14, 'מצלמה', '200MP Main'),
(18, 'סוג', 'אוזניות Over-Ear'),
(18, 'ביטול רעשים', 'Industry-leading ANC'),
(18, 'סוללה', 'עד 30 שעות'),
(21, 'אחסון', '1TB'),
(21, 'רזולוציה', 'עד 4K 120fps'),
(21, 'מעבד', 'Custom AMD Zen 2'),
(28, 'משקל', '249g'),
(28, 'מצלמה', '4K/60fps'),
(28, 'זמן טיסה', 'עד 34 דקות'),
(32, 'רזולוציה', '24.2 MP'),
(32, 'וידאו', '4K 60fps'),
(32, 'ISO', '100-102,400'),
(36, 'מעבד', 'Intel Core i7-13700H'),
(36, 'זכרון', '16GB DDR5'),
(36, 'אחסון', '512GB NVMe SSD'),
(36, 'כרטיס מסך', 'NVIDIA RTX 4060');

-- Insert admins with correct column names (no username field)
INSERT INTO admins (email, password, role) VALUES
('manager@buyforce.com', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'admin');

-- Display updated summary
SELECT 'Total Users:' AS summary, COUNT(*)::text AS count FROM users
UNION ALL
SELECT 'Total Categories:', COUNT(*)::text FROM categories
UNION ALL
SELECT 'Total Groups:', COUNT(*)::text FROM groups
UNION ALL
SELECT 'Total Products:', COUNT(*)::text FROM products
UNION ALL
SELECT 'Total Images:', COUNT(*)::text FROM images
UNION ALL
SELECT 'Total Specs:', COUNT(*)::text FROM specs
UNION ALL
SELECT 'Total User-Group relations:', COUNT(*)::text FROM user_groups
UNION ALL
SELECT 'Total Orders:', COUNT(*)::text FROM orders
UNION ALL
SELECT 'Total Order items:', COUNT(*)::text FROM order_items
UNION ALL
SELECT 'Total Admins:', COUNT(*)::text FROM admins;
