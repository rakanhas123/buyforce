-- Seed Data for BuyForce Database
-- Updated to match actual database schema

-- Insert Users
INSERT INTO users (full_name, email, phone, password) VALUES
('דוד כהן', 'david.cohen@example.com', '052-1234567', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('שרה לוי', 'sarah.levi@example.com', '052-2345678', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('מיכאל מזרחי', 'michael.mizrahi@example.com', '052-3456789', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('רחל אברהם', 'rachel.avraham@example.com', '052-4567890', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('יוסי כץ', 'yossi.katz@example.com', '052-5678901', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('דנה בן-דוד', 'dana.ben-david@example.com', '052-6789012', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('רון ישראלי', 'ron.israeli@example.com', '052-7890123', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNY1'),
('מאיה שמיר', 'maya.shamir@example.com', '052-8901234', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('אבי כהן', 'avi.cohen@example.com', '052-9012345', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('נועה גרין', 'noa.green@example.com', '053-1234567', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('אלי רוזן', 'eli.rosen@example.com', '053-2345678', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('תמר גולד', 'tamar.gold@example.com', '053-3456789', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('אורי סילבר', 'ori.silver@example.com', '053-4567890', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('שירה דיימונד', 'shira.diamond@example.com', '053-5678901', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('אילן סטון', 'ilan.stone@example.com', '053-6789012', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('גיא ברק', 'guy.barak@example.com', '053-7890123', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('ליאת אבני', 'liat.avni@example.com', '053-8901234', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('עומר שוורץ', 'omer.schwartz@example.com', '053-9012345', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('יעל ברנר', 'yael.berner@example.com', '054-1234567', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1'),
('אסף פרידמן', 'asaf.friedman@example.com', '054-2345678', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('סמארטפונים', 'טלפונים חכמים מכל הסוגים'),
('מחשבים ניידים', 'מחשבים נישאים למשרד ובית'),
('אביזרי אודיו', 'אוזניות, רמקולים ועוד'),
('קונסולות משחק', 'PlayStation, Xbox, Nintendo'),
('מצלמות', 'מצלמות DSLR, רחפנים ומצלמות אקסטרים'),
('אביזרי מחשב', 'עכברים, מקלדות, מסכים'),
('מוצרי חשמל', 'מוצרים חשמליים לבית'),
('אביזרי Apple', 'אביזרים למוצרי Apple'),
('טכנולוגיה לבית חכם', 'מוצרים לאוטומציה ביתית'),
('ספורט וכושר', 'מכשירים לספורט ואימונים');

-- Insert Groups (קבוצות קנייה)
INSERT INTO groups (name, status) VALUES
('iPhone 15 Pro - הזדמנות מטורפת', 'active'),
('MacBook Air M3 - קבוצת רכישה', 'active'),
('AirPods Pro 2 - מבצע חם', 'active'),
('Samsung Galaxy S24 Ultra', 'active'),
('PlayStation 5 - קונסולה', 'active'),
('DJI Mini 4 Pro - רחפן', 'active'),
('iPad Pro 12.9 M2', 'active'),
('Apple Watch Series 9', 'completed'),
('Nintendo Switch OLED', 'completed'),
('Sony WH-1000XM5 - אוזניות', 'completed'),
('GoPro Hero 12', 'cancelled'),
('Dyson V15 - שואב אבק', 'cancelled'),
('Meta Quest 3 - VR', 'active'),
('Dell XPS 15 - מחשב נייד', 'active'),
('Canon EOS R6 Mark II', 'active');

-- Insert Products
INSERT INTO products (name, description, price, stock) VALUES
('iPhone 15 Pro Max 256GB', 'אייפון 15 פרו מקס עם 256GB אחסון, מעבד A17 Pro, מסך 6.7 אינץ Super Retina XDR, מצלמה 48MP', 4999.00, 50),
('iPhone 15 Pro 128GB', 'אייפון 15 פרו עם 128GB אחסון, מעבד A17 Pro, מסך 6.1 אינץ', 4499.00, 30),
('MacBook Air M3 15"', 'מקבוק אייר 15 אינץ עם שבב M3, 16GB RAM, 512GB SSD', 7999.00, 20),
('MacBook Air M3 13"', 'מקבוק אייר 13 אינץ עם שבב M3, 8GB RAM, 256GB SSD', 5999.00, 25),
('MacBook Pro 16" M3 Max', 'מקבוק פרו 16 אינץ עם שבב M3 Max, 36GB RAM, 1TB SSD', 14999.00, 10),
('iPad Pro 12.9" M2', 'אייפד פרו 12.9 אינץ עם שבב M2, 256GB, תמיכה ב-Apple Pencil 2', 5499.00, 15),
('iPad Air 11" M2', 'אייפד אייר 11 אינץ עם שבב M2, 128GB', 3499.00, 30),
('AirPods Pro 2nd Gen', 'אוזניות AirPods Pro דור 2 עם ביטול רעשים אקטיבי משופר', 999.00, 100),
('AirPods Max', 'אוזניות AirPods Max עם ביטול רעשים אקטיבי פרימיום', 2499.00, 20),
('Apple Watch Series 9 45mm', 'שעון חכם Apple Watch Series 9 עם מסך 45mm', 1999.00, 40),
('Apple Watch Ultra 2', 'שעון חכם Apple Watch Ultra 2 לספורט קיצוני', 3999.00, 15),
('Magic Keyboard iPad Pro', 'מקלדת Magic Keyboard לאייפד פרו 12.9"', 1599.00, 25),
('Apple Pencil 2nd Gen', 'עט Apple Pencil דור 2 עם טעינה אלחוטית', 549.00, 50),
('Samsung Galaxy S24 Ultra', 'גלקסי S24 אולטרה עם מסך 6.8 אינץ, מעבד Snapdragon 8 Gen 3', 4799.00, 35),
('Samsung Galaxy S24+', 'גלקסי S24+ עם מסך 6.7 אינץ', 3999.00, 40),
('Samsung Galaxy Buds2 Pro', 'אוזניות Galaxy Buds2 Pro עם ביטול רעשים', 799.00, 60),
('Samsung Galaxy Watch6 Classic', 'שעון חכם Galaxy Watch6 Classic', 1499.00, 30),
('Sony WH-1000XM5', 'אוזניות Sony WH-1000XM5 עם ביטול רעשים מוביל בתעשייה', 1399.00, 45),
('Sony WF-1000XM5', 'אוזניות Sony WF-1000XM5 אלחוטיות אמיתיות', 1099.00, 50),
('Bose QuietComfort Ultra', 'אוזניות Bose QuietComfort Ultra', 1599.00, 35),
('PlayStation 5 Slim', 'קונסולת PlayStation 5 Slim עם 1TB אחסון', 2499.00, 25),
('PlayStation 5 Digital', 'קונסולת PlayStation 5 Digital Edition', 1999.00, 20),
('Xbox Series X', 'קונסולת Xbox Series X עם 1TB', 2299.00, 30),
('Xbox Series S', 'קונסולת Xbox Series S עם 512GB', 1499.00, 40),
('Nintendo Switch OLED', 'קונסולת Nintendo Switch OLED', 1599.00, 35),
('Meta Quest 3 512GB', 'משקפי מציאות מדומה Meta Quest 3 עם 512GB', 2799.00, 20),
('Meta Quest 3 128GB', 'משקפי מציאות מדומה Meta Quest 3 עם 128GB', 2199.00, 25),
('DJI Mini 4 Pro', 'רחפן DJI Mini 4 Pro עם מצלמה 4K', 3999.00, 15),
('DJI Air 3', 'רחפן DJI Air 3 עם מצלמה כפולה', 5499.00, 10),
('GoPro Hero 12 Black', 'מצלמת אקסטרים GoPro Hero 12 Black', 1999.00, 30),
('DJI Osmo Action 4', 'מצלמת אקסטרים DJI Osmo Action 4', 1699.00, 25),
('Canon EOS R6 Mark II', 'מצלמת Canon EOS R6 Mark II ללא עדשה', 12999.00, 8),
('Sony A7 IV', 'מצלמת Sony A7 IV ללא עדשה', 11999.00, 10),
('Canon RF 24-70mm f/2.8', 'עדשת Canon RF 24-70mm f/2.8 L IS USM', 8999.00, 12),
('Sony FE 24-70mm f/2.8 GM II', 'עדשת Sony FE 24-70mm f/2.8 GM II', 9499.00, 10),
('Dell XPS 15 9530', 'מחשב נייד Dell XPS 15 עם Intel i7-13700H, RTX 4060', 8999.00, 15),
('Dell XPS 13 Plus', 'מחשב נייד Dell XPS 13 Plus עם Intel i7, מסך 13.4"', 6999.00, 20),
('LG UltraFine 32UN880', 'מסך LG UltraFine 32" 4K עם זרוע ארגונומית', 3499.00, 18),
('Samsung Odyssey G9', 'מסך גיימינג Samsung Odyssey G9 49" קעור', 5999.00, 8),
('Logitech MX Master 3S', 'עכבר Logitech MX Master 3S אלחוטי', 449.00, 60),
('Logitech MX Keys', 'מקלדת Logitech MX Keys אלחוטית', 549.00, 50),
('Keychron K8 Pro', 'מקלדת מכנית Keychron K8 Pro', 699.00, 40),
('Keychron Q1 Pro', 'מקלדת מכנית Keychron Q1 Pro פרימיום', 999.00, 30),
('Dyson V15 Detect', 'שואב אבק Dyson V15 Detect עם לייזר', 2799.00, 12),
('Dyson Airwrap', 'מעצב שיער Dyson Airwrap מולטי-סטיילר', 2999.00, 10),
('iRobot Roomba j7+', 'שואב רובוטי iRobot Roomba j7+ עם תחנת ריקון', 3299.00, 15),
('Ninja Air Fryer Max', 'מכשיר טיגון Ninja Air Fryer Max 5.5L', 599.00, 40),
('Vitamix A3500', 'בלנדר Vitamix A3500 מקצועי', 2599.00, 18),
('Nespresso Vertuo Next', 'מכונת קפה Nespresso Vertuo Next', 899.00, 35),
('Garmin Fenix 7X', 'שעון ספורט Garmin Fenix 7X עם GPS', 3499.00, 12),
('Wahoo KICKR Smart Trainer', 'מאמן חכם לאופניים Wahoo KICKR', 4999.00, 8),
('Sonos Beam Gen 2', 'סאונדבר Sonos Beam Gen 2', 2299.00, 20),
('Sonos Sub Mini', 'סאבוופר Sonos Sub Mini', 2499.00, 15),
('Philips Hue Play Gradient', 'תאורה חכמה Philips Hue Play Gradient לטלוויזיה', 1299.00, 25),
('Ring Video Doorbell Pro 2', 'פעמון חכם Ring Video Doorbell Pro 2', 1099.00, 30),
('Kindle Paperwhite Signature', 'קורא ספרים אלקטרוני Kindle Paperwhite Signature', 799.00, 45),
('Remarkable 2', 'טאבלט לכתיבה Remarkable 2', 1999.00, 20),
('Anker 757 PowerHouse', 'תחנת כוח נייד Anker 757 PowerHouse 1229Wh', 5999.00, 10),
('Herman Miller Aeron Chair', 'כיסא ארגונומי Herman Miller Aeron', 5999.00, 8),
('Uplift V2 Standing Desk', 'שולחן עמידה Uplift V2 חשמלי', 3999.00, 12),
('BenQ ScreenBar Halo', 'מנורת מסך BenQ ScreenBar Halo', 599.00, 35);

-- Insert some images for products (sample URLs)
INSERT INTO images (product_id, url, alt_text) VALUES
(1, 'https://example.com/iphone15pro-1.jpg', 'iPhone 15 Pro Front'),
(1, 'https://example.com/iphone15pro-2.jpg', 'iPhone 15 Pro Back'),
(2, 'https://example.com/iphone15pro128-1.jpg', 'iPhone 15 Pro 128GB'),
(3, 'https://example.com/macbookair15-1.jpg', 'MacBook Air 15 Open'),
(3, 'https://example.com/macbookair15-2.jpg', 'MacBook Air 15 Closed'),
(4, 'https://example.com/macbookair13-1.jpg', 'MacBook Air 13'),
(5, 'https://example.com/macbookpro16-1.jpg', 'MacBook Pro 16'),
(8, 'https://example.com/airpodspro2-1.jpg', 'AirPods Pro 2'),
(10, 'https://example.com/applewatch9-1.jpg', 'Apple Watch Series 9'),
(14, 'https://example.com/galaxys24ultra-1.jpg', 'Galaxy S24 Ultra'),
(18, 'https://example.com/sony1000xm5-1.jpg', 'Sony WH-1000XM5'),
(21, 'https://example.com/ps5slim-1.jpg', 'PlayStation 5 Slim'),
(23, 'https://example.com/xboxseriesx-1.jpg', 'Xbox Series X'),
(25, 'https://example.com/switcholed-1.jpg', 'Nintendo Switch OLED'),
(26, 'https://example.com/quest3-1.jpg', 'Meta Quest 3'),
(28, 'https://example.com/djimini4-1.jpg', 'DJI Mini 4 Pro'),
(30, 'https://example.com/gopro12-1.jpg', 'GoPro Hero 12'),
(32, 'https://example.com/eosr6ii-1.jpg', 'Canon EOS R6 Mark II'),
(36, 'https://example.com/dellxps15-1.jpg', 'Dell XPS 15'),
(44, 'https://example.com/dysonv15-1.jpg', 'Dyson V15');

-- Insert some specs for products
INSERT INTO specs (product_id, key, value) VALUES
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

-- Insert user-group relationships (who joined which group)
INSERT INTO user_groups (user_id, group_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), -- 5 users in iPhone group
(1, 2), (2, 2), (6, 2), (7, 2), -- 4 users in MacBook group
(3, 3), (4, 3), (5, 3), (8, 3), (9, 3), (10, 3), -- 6 users in AirPods group
(5, 5), (9, 5), (11, 5), (12, 5), -- 4 users in PS5 group
(6, 6), (7, 6), (13, 6), -- 3 users in DJI group
(8, 8), (10, 8), (14, 8), (15, 8), -- 4 users in Apple Watch (completed)
(9, 9), (11, 9), (16, 9), -- 3 users in Nintendo (completed)
(12, 13), (13, 13), -- 2 users in Quest 3
(14, 14), (15, 14); -- 2 users in Dell XPS

-- Insert some orders
INSERT INTO orders (user_id, total_price, status) VALUES
(1, 4999.00, 'completed'),
(2, 7999.00, 'completed'),
(3, 999.00, 'pending'),
(4, 4799.00, 'completed'),
(5, 2499.00, 'processing'),
(6, 3999.00, 'completed'),
(8, 1999.00, 'completed'),
(10, 1999.00, 'completed'),
(9, 1599.00, 'completed'),
(11, 1599.00, 'completed');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 4999.00),  -- David bought iPhone 15 Pro Max
(2, 3, 1, 7999.00),  -- Sarah bought MacBook Air 15
(3, 8, 1, 999.00),   -- Michael pending AirPods Pro
(4, 14, 1, 4799.00), -- Rachel bought Galaxy S24 Ultra
(5, 21, 1, 2499.00), -- Yossi processing PS5
(6, 28, 1, 3999.00), -- Dana bought DJI Mini 4 Pro
(7, 10, 1, 1999.00), -- Maya bought Apple Watch 9
(8, 10, 1, 1999.00), -- Noa bought Apple Watch 9
(9, 25, 1, 1599.00), -- Avi bought Nintendo Switch
(10, 25, 1, 1599.00); -- Eli bought Nintendo Switch

-- Insert admins
INSERT INTO admins (username, password, email) VALUES
('admin', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'admin@buyforce.com'),
('manager', '$2b$10$rF7ZgT9YqC3qZBZkXFYGqeuE3sQ9xJXKJNXYGZVHQqNYGZVHQqNY1', 'manager@buyforce.com');

-- Display summary
SELECT 'Users inserted:' AS summary, COUNT(*)::text AS count FROM users
UNION ALL
SELECT 'Categories inserted:', COUNT(*)::text FROM categories
UNION ALL
SELECT 'Groups inserted:', COUNT(*)::text FROM groups
UNION ALL
SELECT 'Products inserted:', COUNT(*)::text FROM products
UNION ALL
SELECT 'Images inserted:', COUNT(*)::text FROM images
UNION ALL
SELECT 'Specs inserted:', COUNT(*)::text FROM specs
UNION ALL
SELECT 'User-Group relations:', COUNT(*)::text FROM user_groups
UNION ALL
SELECT 'Orders inserted:', COUNT(*)::text FROM orders
UNION ALL
SELECT 'Order items inserted:', COUNT(*)::text FROM order_items
UNION ALL
SELECT 'Admins inserted:', COUNT(*)::text FROM admins;
