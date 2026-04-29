-- ============================================================
--  Welaund SaaS Laundry System — SEED DATA
--  All passwords: Admin@123
-- ============================================================

-- OPTIONAL: UNCOMMENT THE LINES BELOW TO WIPE THE DATABASE BEFORE SEEDING
-- TRUNCATE payments, order_items, orders, services, customers, staff, laundry_shops, owners, super_admins RESTART IDENTITY CASCADE;

-- 1. SUPER ADMIN (Platform Manager)
INSERT INTO super_admins (username, email, password_hash)
VALUES ('superadmin', 'superadmin@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm')
ON CONFLICT (email) DO NOTHING;

-- 2. OWNERS (One for each shop)
INSERT INTO owners (first_name, last_name, email, password_hash, status) VALUES 
('Maria', 'Santos', 'owner1@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active'),
('John', 'Reyes',   'owner2@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active'),
('Elena', 'Cruz',   'owner3@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active')
ON CONFLICT (email) DO NOTHING;

-- 3. LAUNDRY SHOPS (3 Branches)
INSERT INTO laundry_shops (owner_id, shop_name, address, contact_number, status, gcash_number, gcash_name) 
SELECT id, 'WeLaund Makati', '123 Ayala Ave, Makati', '09170001111', 'active', '09170001111', 'WeLaund Makati' FROM owners WHERE email = 'owner1@welaund.com'
ON CONFLICT DO NOTHING;

INSERT INTO laundry_shops (owner_id, shop_name, address, contact_number, status, gcash_number, gcash_name) 
SELECT id, 'WeLaund Manila', '456 Taft Ave, Manila',  '09170002222', 'active', '09170002222', 'WeLaund Manila' FROM owners WHERE email = 'owner2@welaund.com'
ON CONFLICT DO NOTHING;

INSERT INTO laundry_shops (owner_id, shop_name, address, contact_number, status, gcash_number, gcash_name) 
SELECT id, 'WeLaund QC',     '789 Katipunan, QC',    '09170003333', 'active', '09170003333', 'WeLaund QC'     FROM owners WHERE email = 'owner3@welaund.com'
ON CONFLICT DO NOTHING;

-- 4. STAFF (Assigned to specific shops)
INSERT INTO staff (shop_id, first_name, last_name, email, password_hash, status) 
SELECT id, 'Sarah', 'Makati', 'staff1@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active' FROM laundry_shops WHERE shop_name = 'WeLaund Makati'
ON CONFLICT (email) DO NOTHING;

INSERT INTO staff (shop_id, first_name, last_name, email, password_hash, status) 
SELECT id, 'Mark', 'Manila', 'staff2@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active' FROM laundry_shops WHERE shop_name = 'WeLaund Manila'
ON CONFLICT (email) DO NOTHING;

INSERT INTO staff (shop_id, first_name, last_name, email, password_hash, status) 
SELECT id, 'Lucy', 'QC',     'staff3@welaund.com', '$2y$12$3s1XS.syI/pzjCpAwQd9w.YnAQ7rp0n.gYDL2MPxzvlP2FGZDkzfm', 'active' FROM laundry_shops WHERE shop_name = 'WeLaund QC'
ON CONFLICT (email) DO NOTHING;

-- 5. SERVICES (Shared template)
INSERT INTO services (shop_id, service_name, unit, price_per_unit, status)
SELECT id, 'Wash & Dry (Regular)', 'per_kg', 35.00, 'active' FROM laundry_shops
ON CONFLICT DO NOTHING;
