-- ============================================
-- HOTEL MANAGEMENT SAAS - COMPLETE MIGRATION
-- ============================================
-- Created: 2024-01-01
-- Purpose: Multi-tenant Hotel PMS SaaS
-- Notes: No triggers/functions included
-- ============================================

-- ============================================
-- 1. SAAS TENANT MANAGEMENT TABLES
-- ============================================

-- ORGANIZATIONS (Parent companies)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    company_email VARCHAR(100),
    company_phone VARCHAR(20),
    billing_address TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_status VARCHAR(20) DEFAULT 'active',
    max_properties INTEGER DEFAULT 1,
    max_users INTEGER DEFAULT 5,
    trial_ends_at TIMESTAMPTZ,
    billing_cycle_start DATE,
    billing_cycle_end DATE,
    stripe_customer_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS (Billing plans)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    per_property_fee DECIMAL(10,2) DEFAULT 0,
    per_user_fee DECIMAL(10,2) DEFAULT 0,
    transaction_fee_percent DECIMAL(5,2) DEFAULT 0,
    max_properties INTEGER DEFAULT 1,
    max_users INTEGER DEFAULT 5,
    max_api_calls INTEGER DEFAULT 10000,
    current_period_start DATE,
    current_period_end DATE,
    stripe_subscription_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES (Individual hotels)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(3) DEFAULT 'USD',
    property_type VARCHAR(50),
    star_rating INTEGER,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORGANIZATION SETTINGS
CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50) DEFAULT 'string',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, setting_key)
);

-- PROPERTY SETTINGS
CREATE TABLE property_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50) DEFAULT 'string',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, setting_key)
);

-- DEPARTMENTS
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    manager_id UUID, -- Will reference users table
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- LICENSE KEYS (API keys)
CREATE TABLE license_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    api_key VARCHAR(100) NOT NULL UNIQUE,
    api_secret_hash VARCHAR(255),
    name VARCHAR(100),
    permissions JSONB DEFAULT '[]',
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USERS & ACCESS CONTROL
-- ============================================

-- USERS (Global user accounts)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    
    -- Multi-tenancy scopes
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    
    -- User metadata
    avatar_url TEXT,
    locale VARCHAR(10) DEFAULT 'en-US',
    timezone VARCHAR(50),
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('global', 'organization', 'property')),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    is_system_role BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERMISSIONS
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER ROLES (Many-to-many)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- ROLE PERMISSIONS (Many-to-many)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- SESSIONS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INVENTORY / ROOMS
-- ============================================

-- FLOORS
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, floor_number)
);

-- ROOM TYPES
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER DEFAULT 2,
    default_adults INTEGER DEFAULT 2,
    default_children INTEGER DEFAULT 0,
    amenities JSONB DEFAULT '[]',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- ROOMS
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_number VARCHAR(10) NOT NULL,
    floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'dirty', 'maintenance', 'out_of_order')),
    current_reservation_id UUID, -- Will reference reservations table
    features JSONB DEFAULT '{}',
    last_cleaned TIMESTAMPTZ,
    next_maintenance DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

-- ROOM STATUS LOGS
CREATE TABLE room_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROOM AMENITIES
CREATE TABLE room_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    icon VARCHAR(50),
    is_chargeable BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- ============================================
-- 4. GUESTS & RESERVATIONS
-- ============================================

-- GUESTS (SaaS-wide profile)
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    country_code VARCHAR(3),
    date_of_birth DATE,
    loyalty_number VARCHAR(50) UNIQUE,
    loyalty_tier VARCHAR(20) DEFAULT 'standard',
    total_points BIGINT DEFAULT 0,
    marketing_consent BOOLEAN DEFAULT false,
    data_sharing_consent BOOLEAN DEFAULT false,
    data_retention_until DATE,
    anonymized BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUEST PROPERTY LINKS (Property-specific guest data)
CREATE TABLE guest_property_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    local_guest_id VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    notes TEXT,
    vip_status BOOLEAN DEFAULT false,
    blacklist_reason TEXT,
    last_stay_date DATE,
    total_stays INTEGER DEFAULT 0,
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_id, property_id)
);

-- COMPANIES (Corporate accounts)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    company_code VARCHAR(50) NOT NULL,
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    billing_address TEXT,
    credit_limit DECIMAL(10,2),
    payment_terms VARCHAR(50),
    tax_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, company_code)
);

-- RESERVATIONS
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL, -- Denormalized for performance
    reservation_number VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'direct',
    channel VARCHAR(50),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('tentative', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    rate_plan_id UUID, -- Will reference rate_plans table
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    actual_check_in TIMESTAMPTZ,
    actual_check_out TIMESTAMPTZ,
    number_of_guests INTEGER DEFAULT 1,
    number_of_rooms INTEGER DEFAULT 1,
    adult_count INTEGER DEFAULT 1,
    child_count INTEGER DEFAULT 0,
    special_requests TEXT,
    market_segment VARCHAR(50),
    total_amount DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    deposit_paid DECIMAL(10,2) DEFAULT 0,
    cancellation_policy JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, reservation_number)
);

-- RESERVATION GUESTS (Many-to-many)
CREATE TABLE reservation_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reservation_id, guest_id)
);

-- RESERVATION HISTORY (Audit trail)
CREATE TABLE reservation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES users(id),
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUEST PREFERENCES (Property-specific)
CREATE TABLE guest_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_property_link_id UUID NOT NULL REFERENCES guest_property_links(id) ON DELETE CASCADE,
    preference_type VARCHAR(50) NOT NULL,
    preference_value TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_property_link_id, preference_type, preference_value)
);

-- GUEST DOCUMENTS
CREATE TABLE guest_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    issuing_country VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    front_image_url TEXT,
    back_image_url TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_id, document_type, document_number)
);

-- GUEST VEHICLES
CREATE TABLE guest_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    license_plate VARCHAR(50) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(license_plate)
);

-- WAITLIST
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'converted', 'cancelled')),
    priority INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. BILLING & FINANCE
-- ============================================

-- RATE PLANS
CREATE TABLE rate_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    base_rate DECIMAL(10,2) NOT NULL,
    min_stay INTEGER DEFAULT 1,
    max_stay INTEGER,
    cancellation_hours INTEGER DEFAULT 24,
    is_public BOOLEAN DEFAULT true,
    restrictions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- RATE SEASONS
CREATE TABLE rate_seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    multiplier DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, name)
);

-- CHARGE CATEGORIES
CREATE TABLE charge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    default_amount DECIMAL(10,2),
    taxable BOOLEAN DEFAULT true,
    tax_category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- CHARGES
CREATE TABLE charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL, -- Denormalized for security
    organization_id UUID NOT NULL, -- Denormalized for security
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    charge_category_id UUID REFERENCES charge_categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    posted_by UUID REFERENCES users(id),
    reversed BOOLEAN DEFAULT false,
    reversal_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENT METHODS
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    processing_fee_percent DECIMAL(5,2) DEFAULT 0,
    processing_fee_fixed DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    authorization_code VARCHAR(100),
    card_last_four VARCHAR(4),
    allocation JSONB DEFAULT '{}',
    notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TAXES
CREATE TABLE taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    tax_type VARCHAR(50) NOT NULL CHECK (tax_type IN ('percentage', 'fixed')),
    applies_to JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, code)
);

-- TAX EXEMPTIONS
CREATE TABLE tax_exemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    exemption_type VARCHAR(50) NOT NULL,
    certificate_number VARCHAR(100),
    certificate_image_url TEXT,
    valid_from DATE NOT NULL,
    valid_until DATE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_id, property_id, exemption_type)
);

-- INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_total DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    pdf_url TEXT,
    emailed_to VARCHAR(100),
    emailed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICE ITEMS
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    charge_id UUID REFERENCES charges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. OPERATIONS & STAFF
-- ============================================

-- SHIFTS
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shift_type VARCHAR(20) NOT NULL CHECK (shift_type IN ('morning', 'evening', 'night', 'custom')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HOUSEKEEPING TASKS
CREATE TABLE housekeeping_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('clean', 'inspect', 'maintenance', 'deep_clean')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    scheduled_time TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASK LOGS
CREATE TABLE task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES housekeeping_tasks(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES users(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOST & FOUND
CREATE TABLE lost_found (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    location_found VARCHAR(200),
    found_date DATE NOT NULL,
    found_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'disposed')),
    claimed_by UUID REFERENCES guests(id),
    claimed_date DATE,
    storage_location VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INCIDENTS
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    incident_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    reported_by UUID REFERENCES users(id),
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution TEXT,
    involved_guests UUID[] DEFAULT '{}',
    involved_staff UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. INTEGRATIONS & SYSTEM
-- ============================================

-- INTEGRATIONS
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
    config JSONB NOT NULL,
    last_sync_at TIMESTAMPTZ,
    sync_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, integration_type, provider)
);

-- WEBHOOKS
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    events JSONB NOT NULL,
    secret_token VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    last_response_status INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SYSTEM SETTINGS
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. USAGE METRICS (for billing)
-- ============================================

CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    reservations_count INTEGER DEFAULT 0,
    checkins_count INTEGER DEFAULT 0,
    checkouts_count INTEGER DEFAULT 0,
    api_calls_count INTEGER DEFAULT 0,
    storage_mb DECIMAL(10,2) DEFAULT 0,
    base_charge DECIMAL(10,2) DEFAULT 0,
    overage_charge DECIMAL(10,2) DEFAULT 0,
    total_charge DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, property_id, metric_date)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Organizations
CREATE INDEX idx_organizations_subscription_status ON organizations(subscription_status);
CREATE INDEX idx_organizations_stripe_customer ON organizations(stripe_customer_id);

-- Properties
CREATE INDEX idx_properties_organization ON properties(organization_id);
CREATE INDEX idx_properties_code ON properties(code);

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id, property_id, is_active);
CREATE INDEX idx_users_last_login ON users(last_login_at DESC);

-- Rooms
CREATE INDEX idx_rooms_property_status ON rooms(property_id, status);
CREATE INDEX idx_rooms_room_number ON rooms(property_id, room_number);
CREATE INDEX idx_rooms_current_reservation ON rooms(current_reservation_id) WHERE current_reservation_id IS NOT NULL;

-- Reservations
CREATE INDEX idx_reservations_property_status ON reservations(property_id, status);
CREATE INDEX idx_reservations_check_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_reservation_number ON reservations(property_id, reservation_number);
CREATE INDEX idx_reservations_organization ON reservations(organization_id, created_at DESC);
CREATE INDEX idx_reservations_room_date ON reservations(room_id, check_in_date) WHERE room_id IS NOT NULL;

-- Guests
CREATE INDEX idx_guests_email_lower ON guests(LOWER(email));
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_loyalty ON guests(loyalty_number) WHERE loyalty_number IS NOT NULL;

-- Guest Property Links
CREATE INDEX idx_guest_property_links_guest ON guest_property_links(guest_id);
CREATE INDEX idx_guest_property_links_property ON guest_property_links(property_id);
CREATE INDEX idx_guest_property_vip ON guest_property_links(vip_status) WHERE vip_status = true;

-- Charges
CREATE INDEX idx_charges_reservation ON charges(reservation_id);
CREATE INDEX idx_charges_posted_at ON charges(posted_at DESC);
CREATE INDEX idx_charges_tenant ON charges(organization_id, property_id, created_at DESC);

-- Payments
CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_processed_at ON payments(processed_at DESC);

-- Audit Logs
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_organization ON audit_logs(organization_id, created_at DESC);

-- Usage Metrics
CREATE INDEX idx_usage_metrics_date ON usage_metrics(metric_date DESC);
CREATE INDEX idx_usage_metrics_organization ON usage_metrics(organization_id, metric_date DESC);

-- ============================================
-- FOREIGN KEY CONSTRAINTS (for denormalized columns)
-- ============================================

-- Add foreign keys for denormalized columns in reservations
ALTER TABLE reservations ADD CONSTRAINT fk_reservations_organization 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add foreign keys for denormalized columns in charges
ALTER TABLE charges ADD CONSTRAINT fk_charges_property 
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE charges ADD CONSTRAINT fk_charges_organization 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Add foreign key for rooms current_reservation_id
ALTER TABLE rooms ADD CONSTRAINT fk_rooms_current_reservation 
    FOREIGN KEY (current_reservation_id) REFERENCES reservations(id) ON DELETE SET NULL;

-- Add foreign key for reservations rate_plan_id
ALTER TABLE reservations ADD CONSTRAINT fk_reservations_rate_plan 
    FOREIGN KEY (rate_plan_id) REFERENCES rate_plans(id) ON DELETE SET NULL;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE organizations IS 'Parent companies/hotel chains using the SaaS';
COMMENT ON TABLE properties IS 'Individual hotel properties belonging to organizations';
COMMENT ON TABLE users IS 'Global user accounts with multi-tenant access';
COMMENT ON TABLE guests IS 'SaaS-wide guest profiles shared across properties';
COMMENT ON TABLE reservations IS 'Hotel bookings - core of the system';
COMMENT ON TABLE charges IS 'Folio charges for reservations';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail for compliance';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
