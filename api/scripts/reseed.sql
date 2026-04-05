-- Clear tables
TRUNCATE products, warehouse_logs RESTART IDENTITY CASCADE;

-- Ensure category exists
INSERT INTO categories (name, slug) 
SELECT 'Test Electronics', 'test-electronics'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'test-electronics');

-- Insert 5 products
INSERT INTO products (name, description, price, "categoryId", "isActive", "isFeatured", "isDeleted", variants, attributes, tags, "createdAt", "updatedAt")
VALUES 
('Product 1', 'Desc 1', 100.00, (SELECT id FROM categories WHERE slug = 'test-electronics' LIMIT 1), true, false, false, '{}', '{}', '{}', '2026-04-05 12:00:00', '2026-04-05 12:00:00'),
('Product 2', 'Desc 2', 200.00, (SELECT id FROM categories WHERE slug = 'test-electronics' LIMIT 1), true, false, false, '{}', '{}', '{}', '2026-04-05 12:00:00', '2026-04-05 12:00:00'),
('Product 3', 'Desc 3', 300.00, (SELECT id FROM categories WHERE slug = 'test-electronics' LIMIT 1), true, false, false, '{}', '{}', '{}', '2026-04-05 12:00:00', '2026-04-05 12:00:00'),
('Product 4', 'Desc 4', 400.00, (SELECT id FROM categories WHERE slug = 'test-electronics' LIMIT 1), true, false, false, '{}', '{}', '{}', '2026-04-05 12:00:00', '2026-04-05 12:00:00'),
('Product 5', 'Desc 5', 500.00, (SELECT id FROM categories WHERE slug = 'test-electronics' LIMIT 1), true, false, false, '{}', '{}', '{}', '2026-04-05 12:00:00', '2026-04-05 12:00:00');

-- Insert stocks (This matches the spent calculation)
INSERT INTO product_stocks ("productId", stock)
SELECT id, CASE 
    WHEN name = 'Product 1' THEN 10 
    WHEN name = 'Product 2' THEN 5
    WHEN name = 'Product 3' THEN 2
    WHEN name = 'Product 4' THEN 1
    WHEN name = 'Product 5' THEN 4
END
FROM products 
WHERE name LIKE 'Product %';

-- Insert warehouse log for today
INSERT INTO warehouse_logs ("recordDate", "productCount", "totalAmount", note, "createdAt", "updatedAt")
VALUES ('2026-04-05', 100, 10000.00, 'Test Budget for Verification', '2026-04-05 12:00:00', '2026-04-05 12:00:00');
