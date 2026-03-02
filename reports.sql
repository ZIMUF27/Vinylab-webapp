-- VinylLab Admin & Report Queries

-- 1. Create/Update Admin Account
INSERT INTO "User" (id, name, email, phone, password_hash, role, created_at)
VALUES (
  gen_random_uuid(), 
  'Dev Admin', 
  'dev@vinylab.com', 
  '0800000000', 
  '$2a$10$32zGEAsbKLXbbq9G3uoyh.vMgQ064svgG1XlNphHo4F7G9MeeQopm', -- Dev@Admin2026
  'admin', 
  NOW()
) 
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- UPDATE test@gmail.com to admin
UPDATE "User" SET role = 'admin' WHERE email = 'test@gmail.com';


-- 2. Daily Sales (Revenue from completed payments today)
SELECT SUM(amount) as daily_revenue 
FROM "Payment" 
WHERE payment_status = 'completed' 
AND payment_time >= CURRENT_DATE;

-- 3. Monthly Sales (Revenue this month)
SELECT SUM(amount) as monthly_revenue 
FROM "Payment" 
WHERE payment_status = 'completed' 
AND payment_time >= date_trunc('month', CURRENT_DATE);

-- 4. Yearly Sales (Revenue this year)
SELECT SUM(amount) as yearly_revenue 
FROM "Payment" 
WHERE payment_status = 'completed' 
AND payment_time >= date_trunc('year', CURRENT_DATE);

-- 5. Total Revenue
SELECT SUM(amount) as total_revenue 
FROM "Payment" 
WHERE payment_status = 'completed';

-- 6. Customer List with Order Counts
SELECT 
    u.id, 
    u.name, 
    u.email, 
    u.phone, 
    u.created_at,
    COUNT(d.id) as total_designs,
    COUNT(o.id) as total_orders
FROM "User" u
LEFT JOIN "Design" d ON u.id = d.user_id
LEFT JOIN "Order" o ON d.id = o.design_id
WHERE u.role = 'customer'
GROUP BY u.id
ORDER BY u.created_at DESC;

-- 7. Update Order Status (Example: Update a specific order to 'printing' or 'shipped')
-- UPDATE "Order" SET status = 'printing' WHERE id = 'ORDER_ID_HERE';
