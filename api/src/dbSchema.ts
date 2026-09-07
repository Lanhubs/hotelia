export const CREATE_EXTENSIONS = `-- Extensions not needed in SQLite`;

export const CREATE_ROOMS_TABLE = `
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    overview TEXT,
    price_per_night REAL NOT NULL,
    price_naira_per_night REAL NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    bed_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    floor TEXT NOT NULL,
    units INTEGER NOT NULL DEFAULT 1,
    image TEXT,
    gallery TEXT,
    video_url TEXT,
    amenities TEXT,
    features TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_BOOKINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    reference TEXT UNIQUE NOT NULL,
    folio_number TEXT UNIQUE,
    channel TEXT NOT NULL,
    channel_category TEXT NOT NULL,
    channel_label TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_avatar TEXT,
    vip_tier TEXT NOT NULL DEFAULT 'Standard',
    nationality TEXT,
    id_type TEXT,
    id_number TEXT,
    special_requests TEXT,
    room_id TEXT REFERENCES rooms(id),
    room_name TEXT NOT NULL,
    room_slug TEXT NOT NULL,
    room_category TEXT NOT NULL,
    room_number TEXT,
    floor INTEGER,
    hero_image TEXT,
    tagline TEXT,
    check_in_date TEXT NOT NULL,
    check_in_time TEXT NOT NULL DEFAULT '14:00',
    check_out_date TEXT NOT NULL,
    check_out_time TEXT NOT NULL DEFAULT '11:00',
    nights INTEGER NOT NULL,
    adults INTEGER NOT NULL DEFAULT 2,
    children INTEGER NOT NULL DEFAULT 0,
    rate_per_night REAL NOT NULL,
    room_total REAL NOT NULL,
    tax_amount REAL NOT NULL,
    service_fee REAL NOT NULL DEFAULT 15.00,
    addons_total REAL NOT NULL DEFAULT 0,
    discount_amount REAL NOT NULL DEFAULT 0,
    total_amount REAL NOT NULL,
    amount_paid REAL NOT NULL DEFAULT 0,
    balance_due REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    payment_method TEXT NOT NULL,
    transaction_ref TEXT,
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    handled_by TEXT,
    keycard_status TEXT DEFAULT 'Not Issued',
    card_uid TEXT,
    issued_at DATETIME,
    issued_by TEXT,
    paid_at DATETIME,
    cancelled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_SERVICE_ORDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS service_orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    booking_id TEXT REFERENCES bookings(id),
    guest_name TEXT NOT NULL,
    guest_avatar TEXT,
    vip_tier TEXT NOT NULL,
    room_number TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Received',
    priority TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    assigned_staff TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount REAL NOT NULL,
    total_amount_usd REAL NOT NULL,
    is_billed_to_folio INTEGER DEFAULT 1,
    folio_id TEXT,
    dietary_allergens TEXT,
    order_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  )
`;

export const CREATE_STAFF_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS staff_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    staff_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    role_title TEXT,
    avatar_url TEXT,
    department TEXT,
    hotel_branch TEXT,
    shift TEXT,
    terminal_id TEXT,
    permissions TEXT,
    password_hash TEXT NOT NULL,
    pin_hash TEXT,
    last_login DATETIME,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS hotel_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    property_name TEXT DEFAULT 'KeoExperience Luxury Hotel & Suites',
    star_rating INTEGER DEFAULT 5,
    tagline TEXT DEFAULT 'Luxury oceanfront sanctuary with infinity plunge suites',
    address TEXT DEFAULT 'Plot 1421, Victoria Island Promenade, Lagos, Nigeria',
    phone TEXT DEFAULT '+234 1 890 2341',
    email TEXT DEFAULT 'reception@KeoExperience.luxury',
    license_number TEXT DEFAULT 'HOTEL-LIC-2026-9021',
    check_in_time TEXT DEFAULT '15:00',
    check_out_time TEXT DEFAULT '11:00',
    grace_period_mins INTEGER DEFAULT 30,
    early_check_in_fee_pct REAL DEFAULT 25.00,
    late_check_out_fee_hr REAL DEFAULT 50.00,
    auto_release_unpaid_hrs INTEGER DEFAULT 2,
    base_currency TEXT DEFAULT 'USD ($)',
    currency_multiplier REAL DEFAULT 1600.00,
    vat_tax_rate_pct REAL DEFAULT 7.50,
    service_charge_pct REAL DEFAULT 10.00,
    tourism_levy_per_night REAL DEFAULT 5.00,
    auto_invoice_receipts INTEGER DEFAULT 1,
    keycard_frequency TEXT DEFAULT '13.56MHz (Mifare Classic / DESFire)',
    keycard_expiration_padding_hrs INTEGER DEFAULT 2,
    keycard_auto_invalidate INTEGER DEFAULT 1,
    encoder_ip_port TEXT DEFAULT '192.168.1.150:8080',
    enable_sms_welcome INTEGER DEFAULT 1,
    enable_email_folio INTEGER DEFAULT 1,
    low_inventory_threshold INTEGER DEFAULT 15,
    night_audit_auto_time TEXT DEFAULT '02:00',
    paystack_public_key TEXT DEFAULT 'pk_live_************************',
    stripe_public_key TEXT DEFAULT 'pk_live_************************',
    ota_channel_manager_token TEXT DEFAULT 'TOKEN-OTA-SYNC-9021',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const SEED_STAFF_USERS = `
  INSERT OR IGNORE INTO staff_users (
    id, name, email, staff_id, role, role_title, avatar_url,
    department, hotel_branch, shift, terminal_id,
    permissions, password_hash, phone, is_active
  ) VALUES
  (
    'staff-mgr-1',
    'Marcus Vance',
    'marcus.vance@keoexperience.com',
    'STAFF-MGR-001',
    'manager',
    'General Manager & Director',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    'Executive Management',
    'KEO Experience Hotel & Suites',
    'General Oversight (Day)',
    'EXEC-STATION-01',
    '["all","revenue_audit","staff_management","pricing_control","system_config","reservations_full"]',
    '$2b$10$placeholder_gm_hash',
    '+234 813 014 8920',
    1
  ),
  (
    'staff-rec-1',
    'Elena Rostova',
    'elena.rostova@keoexperience.com',
    'STAFF-REC-104',
    'receptionist',
    'Front Desk Lead & Concierge',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    'Front Office & Guest Services',
    'KEO Experience Hotel & Suites',
    'Morning Shift (06:00 - 14:00)',
    'TERMINAL-FD-02',
    '["check_in_out","walk_in_reservations","keycard_coding","folio_management","guest_lookup"]',
    '$2b$10$placeholder_fd_hash',
    '+234 813 014 8921',
    1
  )
`;

export const CREATE_PAYMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_reference TEXT NOT NULL REFERENCES bookings(reference) ON DELETE CASCADE,
    paystack_reference TEXT UNIQUE,
    idempotency_key TEXT UNIQUE,
    amount REAL NOT NULL,
    amount_kobo INTEGER NOT NULL,
    method TEXT NOT NULL,
    gateway TEXT NOT NULL DEFAULT 'paystack',
    status TEXT NOT NULL DEFAULT 'pending',
    authorization_url TEXT,
    access_code TEXT,
    transfer_bank_name TEXT,
    transfer_account_name TEXT,
    transfer_account_number TEXT,
    transfer_expires_at DATETIME,
    paystack_response TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_EXTRAS_TABLE = `
  CREATE TABLE IF NOT EXISTS extras (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    price_naira REAL NOT NULL,
    per_night INTEGER DEFAULT 0,
    icon TEXT DEFAULT 'star',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_IDEMPOTENCY_TABLE = `
  CREATE TABLE IF NOT EXISTS idempotency_keys (
    key TEXT PRIMARY KEY,
    response TEXT NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 200,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const SEED_EXTRAS = `
  INSERT OR IGNORE INTO extras (id, slug, name, description, price, price_naira, per_night, icon) VALUES
    ('extra-1', 'airport-transfer', 'Airport Transfer', 'Private chauffeured return transfer from MMIA', 120, 192000, 0, 'car'),
    ('extra-2', 'breakfast', 'Daily Breakfast', 'Full English & continental breakfast for 2', 35, 56000, 1, 'coffee'),
    ('extra-3', 'spa-access', 'Spa & Wellness Access', 'Full access to spa facilities, sauna & plunge pool', 80, 128000, 0, 'sparkles'),
    ('extra-4', 'champagne-welcome', 'Champagne Welcome', 'Moët & Chandon on arrival with fresh fruit platter', 65, 104000, 0, 'wine'),
    ('extra-5', 'late-checkout', 'Late Check-out', 'Extend your departure time to 16:00', 50, 80000, 0, 'clock'),
    ('extra-6', 'butler-service', 'Butler Service', 'Dedicated 24/7 personal butler for your stay', 150, 240000, 1, 'bell')
`;
