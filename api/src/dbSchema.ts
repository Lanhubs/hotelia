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
    room_numbers TEXT DEFAULT '[]',
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

export const CREATE_SERVICE_MENU_TABLE = `
  CREATE TABLE IF NOT EXISTS service_menu (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    description TEXT,
    price_usd REAL NOT NULL DEFAULT 0,
    price_naira REAL,
    prep_time TEXT,
    image TEXT,
    tags TEXT DEFAULT '[]',
    dietary TEXT DEFAULT '[]',
    is_popular INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const SEED_SERVICE_MENU = `
  INSERT OR IGNORE INTO service_menu (
    id, name, category, category_label, description, price_usd, price_naira, prep_time, image, tags, dietary, is_popular
  ) VALUES
    (
      'fnb-1',
      'Wagyu A5 Tenderloin Rossini',
      'fnb',
      'In-Room Gourmet Dining',
      'Seared Japanese Miyazaki Wagyu A5, foie gras, black truffle madeira reduction & potato mousseline.',
      145, 232000,
      '25-30 min',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600&h=400',
      '["Signature","Chef Special","Gluten-Free"]',
      '["Gluten-Free"]',
      1
    ),
    (
      'fnb-2',
      'Butter-Poached Maine Lobster Risotto',
      'fnb',
      'In-Room Gourmet Dining',
      'Fresh Maine lobster tail, carnaroli saffron risotto, sweet pea coulis, citrus butter glaze.',
      88, 140800,
      '20-25 min',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600&h=400',
      '["Seafood","Fresh Catch"]',
      '[]',
      1
    ),
    (
      'fnb-3',
      'Beluga Caviar & House Blinis',
      'fnb',
      'In-Room Gourmet Dining',
      '30g Royal Beluga caviar, buckwheat blinis, organic egg yolks, shallots, crème fraîche, mother-of-pearl spoon.',
      195, 312000,
      '10 min',
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=600&h=400',
      '["Luxury Selection","VIP Choice"]',
      '[]',
      0
    ),
    (
      'fnb-4',
      'Dom Pérignon Vintage Champagne (750ml)',
      'fnb',
      'In-Room Gourmet Dining',
      'Served on ice in silver bucket with crystal flutes & organic strawberries.',
      380, 608000,
      '5 min',
      'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&q=80&w=600&h=400',
      '["Champagne","Bar Reserve"]',
      '[]',
      1
    ),
    (
      'cat-1',
      'Private Ocean Villa BBQ & Grill Master',
      'catering',
      'Event & Balcony Catering',
      'Private chef & butler on your terrace: Tiger prawns, lamb cutlets, grilled artichokes, dessert bar.',
      420, 672000,
      'Scheduled',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600&h=400',
      '["Private Chef","4 Courses","Villa Exclusive"]',
      '[]',
      1
    ),
    (
      'spa-1',
      'Imperial 24K Gold Rejuvenation Facial (90m)',
      'spa',
      'Spa & Wellness Sanctuary',
      'Cellular regeneration with pure 24-karat gold leaf, hyaluronic serum, lifting jade gua sha ritual.',
      240, 384000,
      '90 min',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600&h=400',
      '["Signature Spa","Facial Ritual"]',
      '[]',
      1
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

export const CREATE_EVENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL,
    category TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    timezone TEXT DEFAULT 'Africa/Lagos',
    recurrence_rule TEXT,
    recurrence_end_date TEXT,
    recurrence_exceptions TEXT,
    is_recurring INTEGER DEFAULT 0,
    venue_name TEXT,
    venue_description TEXT,
    max_capacity INTEGER,
    has_tickets INTEGER DEFAULT 0,
    ticket_tiers TEXT,
    rsvp_limit INTEGER,
    booking_opens_at TEXT,
    booking_closes_at TEXT,
    requires_approval INTEGER DEFAULT 0,
    hero_image TEXT,
    gallery TEXT,
    tags TEXT,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    status TEXT DEFAULT 'scheduled',
    contact_email TEXT,
    contact_phone TEXT,
    external_registration_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
  )
`;

export const CREATE_EVENT_BOOKINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS event_bookings (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    occurrence_date TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    guest_count INTEGER DEFAULT 1,
    ticket_tier_id TEXT,
    amount_usd REAL DEFAULT 0,
    amount_naira REAL DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'free',
    payment_reference TEXT,
    payment_method TEXT,
    approved_by TEXT,
    checked_in_at TEXT,
    checked_in_by TEXT,
    special_requests TEXT,
    source TEXT DEFAULT 'website',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_EVENTS_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_date, end_date);
  CREATE INDEX IF NOT EXISTS idx_events_status_published ON events(status, is_published);
  CREATE INDEX IF NOT EXISTS idx_events_recurring ON events(is_recurring);
  CREATE INDEX IF NOT EXISTS idx_event_bookings_event ON event_bookings(event_id);
  CREATE INDEX IF NOT EXISTS idx_event_bookings_date ON event_bookings(occurrence_date);
`;

export const SEED_EVENTS = `
  INSERT OR IGNORE INTO events (
    id, title, slug, description, event_type, category,
    start_date, end_date, start_time, end_time, timezone,
    recurrence_rule, recurrence_end_date, recurrence_exceptions, is_recurring,
    venue_name, venue_description, max_capacity,
    has_tickets, ticket_tiers, rsvp_limit, booking_opens_at, booking_closes_at, requires_approval,
    hero_image, gallery, tags,
    is_featured, is_published, status,
    contact_email, contact_phone, external_registration_url,
    created_at, created_by
  ) VALUES
  (
    'evt-1',
    'New Year''s Eve Gala 2025',
    'new-years-eve-gala-2025',
    'Ring in the new year with an unforgettable night of elegance, entertainment, and celebration at the Grand Ballroom.',
    'gala',
    'Celebration',
    '2025-12-31', '2026-01-01', '20:00', '04:00', 'Africa/Lagos',
    NULL, NULL, '[]', 0,
    'Grand Ballroom', 'Our flagship event space with crystal chandeliers and marble floors', 300,
    1, '[{"id":"tier-1","name":"Standard","price_usd":150,"price_naira":240000,"capacity":200,"description":"Access to main ballroom, welcome drink, midnight toast"}]', 200, '2025-10-01 00:00', '2025-12-30 23:59', 0,
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=600","https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["new-year","gala","black-tie"]',
    1, 1, 'completed',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2025-11-01 10:00:00', 'staff-mgr-1'
  ),
  (
    'evt-2',
    'Valentine''s Couples Dinner',
    'valentines-couples-dinner-2026',
    'An intimate evening of fine dining, live music, and romance in the Courtyard Garden.',
    'party',
    'Social',
    '2026-02-14', '2026-02-14', '19:00', '23:00', 'Africa/Lagos',
    NULL, NULL, '[]', 0,
    'Courtyard Garden', 'Intimate outdoor venue surrounded by lush greenery', 80,
    1, '[{"id":"tier-1","name":"Couple Package","price_usd":200,"price_naira":320000,"capacity":40,"description":"5-course dinner for two, wine pairing, live jazz"}]', 40, '2025-12-01 00:00', '2026-02-13 23:59', 0,
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["valentine","romantic","dinner"]',
    1, 1, 'completed',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2026-01-15 10:00:00', 'staff-mgr-1'
  ),
  (
    'evt-3',
    'Tech Innovation Conference 2026',
    'tech-innovation-conference-2026',
    'Three days of keynotes, workshops, and networking with Africa''s leading tech innovators.',
    'conference',
    'Corporate',
    '2026-03-15', '2026-03-17', '09:00', '17:00', 'Africa/Lagos',
    NULL, NULL, '[]', 0,
    'Grand Ballroom', 'Main conference hall with state-of-the-art AV', 250,
    1, '[{"id":"tier-1","name":"Early Bird","price_usd":300,"price_naira":480000,"capacity":100,"description":"Full 3-day access, meals, conference kit"},{"id":"tier-2","name":"Standard","price_usd":450,"price_naira":720000,"capacity":150,"description":"Full 3-day access, meals, conference kit, networking dinner"}]', 250, '2025-11-01 00:00', '2026-03-10 23:59', 1,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=600","https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["tech","conference","innovation","networking"]',
    1, 1, 'scheduled',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2025-12-01 10:00:00', 'staff-mgr-1'
  ),
  (
    'evt-4',
    'Summer Wedding Showcase',
    'summer-wedding-showcase-2026',
    'Discover the latest wedding trends, meet top vendors, and tour our stunning venues.',
    'wedding',
    'Celebration',
    '2026-06-20', '2026-06-21', '10:00', '18:00', 'Africa/Lagos',
    NULL, NULL, '[]', 0,
    'Grand Ballroom & Courtyard', 'Both indoor and outdoor venues on display', 150,
    0, '[]', 150, '2026-03-01 00:00', '2026-06-18 23:59', 0,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["wedding","showcase","vendors"]',
    1, 1, 'scheduled',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2026-02-01 10:00:00', 'staff-mgr-1'
  ),
  (
    'evt-5',
    'Friday Night Live',
    'friday-night-live',
    'Weekly live music and entertainment every Friday night at the hotel lounge.',
    'party',
    'Social',
    '2026-01-09', '2026-12-25', '20:00', '23:00', 'Africa/Lagos',
    'FREQ=WEEKLY;INTERVAL=1;BYDAY=FR', '2026-12-25', '["2026-04-10","2026-10-02"]', 1,
    'Hotel Lounge', 'Cozy lounge with stage and sound system', 100,
    0, '[]', 100, '2025-12-01 00:00', '2026-12-25 23:59', 0,
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["weekly","live-music","recurring"]',
    0, 1, 'scheduled',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2025-12-01 10:00:00', 'staff-mgr-1'
  ),
  (
    'evt-6',
    'Monthly Business Networking',
    'monthly-business-networking',
    'First Thursday of every month: connect with industry leaders over cocktails.',
    'corporate',
    'Corporate',
    '2026-02-05', '2026-11-05', '18:30', '21:00', 'Africa/Lagos',
    'FREQ=MONTHLY;INTERVAL=1;BYDAY=1TH', '2026-11-05', '[]', 1,
    'Executive Boardroom', 'Private boardroom with premium amenities', 50,
    0, '[]', 50, '2025-12-01 00:00', '2026-11-05 23:59', 0,
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=600',
    '["https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=600"]',
    '["networking","business","monthly"]',
    0, 1, 'scheduled',
    'events@keoexperience.com', '+234 813 014 8920', NULL,
    '2025-12-01 10:00:00', 'staff-mgr-1'
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

export const CREATE_NOTIFICATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('booking', 'payment', 'keycard', 'service', 'housekeeping', 'system')),
    severity TEXT NOT NULL CHECK(severity IN ('info', 'success', 'urgent')),
    title TEXT NOT NULL CHECK(length(title) <= 100),
    message TEXT NOT NULL CHECK(length(message) <= 500),
    meta TEXT,
    read INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT NOT NULL CHECK(source IN ('action', 'inbound')),
    navigate_to TEXT
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
