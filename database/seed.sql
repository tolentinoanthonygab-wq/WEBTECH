-- ============================================================
--  WeLaund — Full Seed Data (All 4 Roles)
--  Run this AFTER database_schema.sql
-- ============================================================
--
--  ALL TEST ACCOUNTS SUMMARY:
--  ┌─────────────┬──────────────────────────────┬──────────────┐
--  │ Role        │ Email                        │ Password     │
--  ├─────────────┼──────────────────────────────┼──────────────┤
--  │ Super Admin │ superadmin@welaund.com       │ Admin@123    │
--  │ Owner       │ owner@welaund.com            │ Owner@123    │
--  │ Staff       │ staff@welaund.com            │ Staff@123    │
--  │ Customer    │ customer@welaund.com         │ Customer@123 │
--  └─────────────┴──────────────────────────────┴──────────────┘
--
--  Login URL: http://localhost/newWeb/backend/public/index.php
-- ============================================================

-- ============================================================
--  1. SUPER ADMIN
--  Email    : superadmin@welaund.com
--  Password : Admin@123
-- ============================================================
INSERT INTO super_admins (username, email, password_hash, status)
VALUES (
    'superadmin',
    'superadmin@welaund.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Admin@123
    'active'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
--  2. OWNER
--  Email    : owner@welaund.com
--  Password : Owner@123
-- ============================================================
INSERT INTO owners (
    first_name, last_name, email, password_hash,
    contact_number, address, status,
    created_by
)
VALUES (
    'Maria',
    'Santos',
    'owner@welaund.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Owner@123
    '09171234567',
    '123 Rizal St, Manila',
    'active',
    (SELECT id FROM super_admins WHERE email = 'superadmin@welaund.com' LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
--  3. LAUNDRY SHOP (linked to Owner)
-- ============================================================
INSERT INTO laundry_shops (
    owner_id, shop_name, address, contact_number,
    email, gcash_name, gcash_number,
    operating_hours, status,
    created_by
)
VALUES (
    (SELECT id FROM owners WHERE email = 'owner@welaund.com' LIMIT 1),
    'WeLaund Makati Branch',
    '456 Ayala Ave, Makati City',
    '02-8123-4567',
    'makati@welaund.com',
    'Maria Santos',
    '09171234567',
    'Mon-Sat 8AM-6PM',
    'active',
    (SELECT id FROM super_admins WHERE email = 'superadmin@welaund.com' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- ============================================================
--  4. STAFF
--  Email    : staff@welaund.com
--  Password : Staff@123
-- ============================================================
INSERT INTO staff (
    shop_id, first_name, last_name, role,
    email, password_hash, contact_number, status,
    created_by
)
VALUES (
    (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
    'Juan',
    'Dela Cruz',
    'admin',
    'staff@welaund.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Staff@123
    '09181234567',
    'active',
    (SELECT id FROM owners WHERE email = 'owner@welaund.com' LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
--  5. CUSTOMER
--  Email    : customer@welaund.com
--  Password : Customer@123
--  Status   : Approved (so login works immediately)
-- ============================================================
INSERT INTO customers (
    shop_id, first_name, last_name,
    email, password_hash,
    contact_number, address, status
)
VALUES (
    (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
    'Ana',
    'Reyes',
    'customer@welaund.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Customer@123
    '09191234567',
    '789 Taft Ave, Manila',
    'Approved'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
--  6. SAMPLE SERVICES (for the shop)
-- ============================================================
INSERT INTO services (shop_id, service_name, unit, price_per_unit, category, status)
VALUES
    (
        (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
        'Wash & Dry', 'per_kg', 65.00, 'Basic', 'active'
    ),
    (
        (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
        'Wash, Dry & Fold', 'per_kg', 85.00, 'Premium', 'active'
    ),
    (
        (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
        'Dry Clean', 'per_piece', 150.00, 'Special', 'active'
    ),
    (
        (SELECT id FROM laundry_shops WHERE email = 'makati@welaund.com' LIMIT 1),
        'Iron Only', 'per_piece', 25.00, 'Basic', 'active'
    )
ON CONFLICT DO NOTHING;

-- ============================================================
--  VERIFY: Run these SELECT statements to confirm seed worked
-- ============================================================
-- SELECT username, email, status FROM super_admins;
-- SELECT first_name, last_name, email, status FROM owners;
-- SELECT shop_name, address, status FROM laundry_shops;
-- SELECT first_name, last_name, email, role, status FROM staff;
-- SELECT first_name, last_name, email, status FROM customers;
-- SELECT service_name, unit, price_per_unit, status FROM services;
