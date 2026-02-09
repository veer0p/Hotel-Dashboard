-- ============================================
-- SEED DATA MIGRATION
-- ============================================
-- Created: 2025-02-09
-- Purpose: Populate the database with realistic testing data

-- 1. ORGANIZATIONS
INSERT INTO organizations (id, name, company_email, subscription_tier, billing_cycle_start)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Antigravity Hotels Group', 'atodariyaveer1331@gamil.com', 'premium', '2026-01-01');

-- 2. PROPERTIES
INSERT INTO properties (id, organization_id, name, code, city, country, currency)
VALUES ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'The Grand Antigravity Resort', 'GAR-DEL', 'New Delhi', 'India', 'INR');

-- 3. ROOM TYPES
INSERT INTO room_types (id, property_id, name, code, base_price, max_occupancy)
VALUES 
('110e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Standard Room', 'STD', 3500.00, 2),
('110e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Deluxe Room', 'DLX', 5500.00, 2),
('110e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Executive Suite', 'SUI', 12500.00, 4);

-- 4. FLOORS
INSERT INTO floors (id, property_id, floor_number, name)
VALUES 
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 1, 'First Floor'),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 2, 'Second Floor'),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 3, 'Third Floor');

-- 5. ROOMS
-- Floor 1: Standard Rooms
INSERT INTO rooms (property_id, room_number, room_type_id, status)
VALUES 
('770e8400-e29b-41d4-a716-446655440001', '101', '110e8400-e29b-41d4-a716-446655440001', 'vacant'),
('770e8400-e29b-41d4-a716-446655440001', '102', '110e8400-e29b-41d4-a716-446655440001', 'occupied'),
('770e8400-e29b-41d4-a716-446655440001', '103', '110e8400-e29b-41d4-a716-446655440001', 'dirty'),
('770e8400-e29b-41d4-a716-446655440001', '104', '110e8400-e29b-41d4-a716-446655440001', 'vacant'),
('770e8400-e29b-41d4-a716-446655440001', '105', '110e8400-e29b-41d4-a716-446655440001', 'maintenance');

-- Floor 2: Deluxe Rooms
INSERT INTO rooms (property_id, room_number, room_type_id, status)
VALUES 
('770e8400-e29b-41d4-a716-446655440001', '201', '110e8400-e29b-41d4-a716-446655440002', 'vacant'),
('770e8400-e29b-41d4-a716-446655440001', '202', '110e8400-e29b-41d4-a716-446655440002', 'occupied'),
('770e8400-e29b-41d4-a716-446655440001', '203', '110e8400-e29b-41d4-a716-446655440002', 'vacant'),
('770e8400-e29b-41d4-a716-446655440001', '204', '110e8400-e29b-41d4-a716-446655440002', 'dirty');

-- Floor 3: Suites
INSERT INTO rooms (property_id, room_number, room_type_id, status)
VALUES 
('770e8400-e29b-41d4-a716-446655440001', '301', '110e8400-e29b-41d4-a716-446655440003', 'occupied'),
('770e8400-e29b-41d4-a716-446655440001', '302', '110e8400-e29b-41d4-a716-446655440003', 'vacant');

-- 6. GUESTS
INSERT INTO guests (id, first_name, last_name, email, phone, loyalty_tier)
VALUES 
('a00e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Chen', 'sarah.chen@example.com', '+91 9876543210', 'gold'),
('a00e8400-e29b-41d4-a716-446655440002', 'Alex', 'Patel', 'alex.patel@example.com', '+91 9876543211', 'silver'),
('a00e8400-e29b-41d4-a716-446655440003', 'John', 'Doe', 'john.doe@example.com', '+91 9876543212', 'standard'),
('a00e8400-e29b-41d4-a716-446655440004', 'Raj', 'Malhotra', 'raj.m@example.com', '+91 9876543213', 'platinum'),
('a00e8400-e29b-41d4-a716-446655440005', 'Priya', 'Sharma', 'priya.s@example.com', '+91 9876543214', 'gold');

-- 7. GUEST PROPERTY LINKS
INSERT INTO guest_property_links (guest_id, property_id, vip_status, total_stays, lifetime_value)
VALUES 
('a00e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', true, 5, 25000.00),
('a00e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', false, 2, 8500.00),
('a00e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', false, 1, 3500.00);

-- 8. RESERVATIONS
-- Past Reservation
INSERT INTO reservations (id, property_id, organization_id, reservation_number, status, check_in_date, check_out_date, number_of_guests, total_amount)
VALUES 
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'RES-10001', 'checked_out', '2026-01-10', '2026-01-15', 2, 17500.00);

-- Current Stay
INSERT INTO reservations (id, property_id, organization_id, reservation_number, status, check_in_date, check_out_date, number_of_guests, total_amount, room_id)
VALUES 
('b10e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'RES-10002', 'checked_in', '2026-02-08', '2026-02-12', 2, 22000.00, (SELECT id FROM rooms WHERE room_number = '202' LIMIT 1));

-- Future Reservation
INSERT INTO reservations (id, property_id, organization_id, reservation_number, status, check_in_date, check_out_date, number_of_guests, total_amount)
VALUES 
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'RES-10003', 'confirmed', '2026-02-15', '2026-02-18', 1, 10500.00);

-- 9. CHARGE CATEGORIES
INSERT INTO charge_categories (id, property_id, name, code, default_amount)
VALUES 
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'Room Rent', 'ROOM', 0.00),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'Breakfast', 'BFAST', 500.00),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'Mini Bar', 'BAR', 0.00);

-- 10. PAYMENT METHODS
INSERT INTO payment_methods (id, property_id, name, code)
VALUES 
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'Cash', 'CASH'),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'Credit Card', 'CC'),
(gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'UPI', 'UPI');
