// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = import.meta.require;

// src/config.ts
var config;
var init_config = __esm(() => {
  config = {
    port: Number(Bun.env.PORT) || 3000,
    db: {
      host: Bun.env.DB_HOST || "localhost",
      port: Number(Bun.env.DB_PORT) || 5432,
      user: Bun.env.DB_USER || "keo",
      password: Bun.env.DB_PASSWORD || "keo123",
      database: Bun.env.DB_NAME || "keo_hotel",
      connectionString: Bun.env.CONNECTION_STRING
    },
    jwtSecret: Bun.env.JWT_SECRET || "your-secret-key-change-in-production",
    taxRate: 0.075,
    serviceCharge: 0.1,
    depositRate: 0.25,
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    paystackSecretKey: Bun.env.PAYSTACK_SECRET_KEY || "",
    paystackBaseUrl: "https://api.paystack.co",
    cloudinary: {
      cloudName: Bun.env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: Bun.env.CLOUDINARY_API_KEY || "",
      apiSecret: Bun.env.CLOUDINARY_API_SECRET || ""
    },
    frontendUrl: Bun.env.FRONTEND_URL || "http://localhost:5173"
  };
});

// src/sqliteAdapter.ts
import { Database as BunSqlite } from "bun:sqlite";
function convertPgSqlToSqlite(sql) {
  let paramIndex = 1;
  let sqliteSql = sql.replace(/\$\d+/g, () => "?");
  sqliteSql = sqliteSql.replace(/\bILIKE\b/gi, "LIKE");
  sqliteSql = sqliteSql.replace(/\bNOW\(\)/gi, "CURRENT_TIMESTAMP");
  sqliteSql = sqliteSql.replace(/ON CONFLICT \([^)]+\) DO NOTHING/gi, "OR IGNORE");
  sqliteSql = sqliteSql.replace(/ON CONFLICT DO NOTHING/gi, "OR IGNORE");
  return sqliteSql;
}
function createSqliteDatabase(filename = ":memory:") {
  const db = new BunSqlite(filename);
  db.run("PRAGMA foreign_keys = ON;");
  return {
    async query(text, params = []) {
      const sql = convertPgSqlToSqlite(text);
      try {
        const sanitizedParams = params.map((p) => {
          if (Array.isArray(p) || p && typeof p === "object" && !(p instanceof Date)) {
            return JSON.stringify(p);
          }
          return p;
        });
        const trimmed = sql.trim().toUpperCase();
        if (trimmed.startsWith("SELECT") || trimmed.includes("RETURNING")) {
          const stmt = db.prepare(sql);
          const rows = stmt.all(...sanitizedParams);
          return { rows };
        } else {
          const stmt = db.prepare(sql);
          const info = stmt.run(...sanitizedParams);
          return { rows: [] };
        }
      } catch (err) {
        console.error("SQLite query error:", err.message, "SQL:", sql, "Params:", params);
        throw err;
      }
    },
    async queryOne(text, params = []) {
      const sql = convertPgSqlToSqlite(text);
      try {
        const sanitizedParams = params.map((p) => {
          if (Array.isArray(p) || p && typeof p === "object" && !(p instanceof Date)) {
            return JSON.stringify(p);
          }
          return p;
        });
        const trimmed = sql.trim().toUpperCase();
        if (trimmed.startsWith("INSERT") || trimmed.startsWith("UPDATE") || trimmed.startsWith("DELETE")) {
          if (sql.includes("RETURNING")) {
            const stmt2 = db.prepare(sql);
            const row2 = stmt2.get(...sanitizedParams);
            return row2 || null;
          } else {
            const stmt2 = db.prepare(sql);
            stmt2.run(...sanitizedParams);
            return null;
          }
        }
        const stmt = db.prepare(sql);
        const row = stmt.get(...sanitizedParams);
        return row || null;
      } catch (err) {
        console.error("SQLite queryOne error:", err.message, "SQL:", sql, "Params:", params);
        throw err;
      }
    },
    async transaction(fn) {
      db.run("BEGIN TRANSACTION");
      try {
        const result = await fn(this);
        db.run("COMMIT");
        return result;
      } catch (err) {
        db.run("ROLLBACK");
        throw err;
      }
    },
    close() {
      db.close();
    }
  };
}
var init_sqliteAdapter = () => {};

// src/dbSchema.ts
var CREATE_ROOMS_TABLE = `
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
`, CREATE_BOOKINGS_TABLE = `
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
`, CREATE_SERVICE_ORDERS_TABLE = `
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
`, CREATE_STAFF_USERS_TABLE = `
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
`, CREATE_SETTINGS_TABLE = `
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
`, CREATE_PAYMENTS_TABLE = `
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
`, CREATE_EXTRAS_TABLE = `
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
`, CREATE_IDEMPOTENCY_TABLE = `
  CREATE TABLE IF NOT EXISTS idempotency_keys (
    key TEXT PRIMARY KEY,
    response TEXT NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 200,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, SEED_EXTRAS = `
  INSERT OR IGNORE INTO extras (id, slug, name, description, price, price_naira, per_night, icon) VALUES
    ('extra-1', 'airport-transfer', 'Airport Transfer', 'Private chauffeured return transfer from MMIA', 120, 192000, 0, 'car'),
    ('extra-2', 'breakfast', 'Daily Breakfast', 'Full English & continental breakfast for 2', 35, 56000, 1, 'coffee'),
    ('extra-3', 'spa-access', 'Spa & Wellness Access', 'Full access to spa facilities, sauna & plunge pool', 80, 128000, 0, 'sparkles'),
    ('extra-4', 'champagne-welcome', 'Champagne Welcome', 'Mo\xEBt & Chandon on arrival with fresh fruit platter', 65, 104000, 0, 'wine'),
    ('extra-5', 'late-checkout', 'Late Check-out', 'Extend your departure time to 16:00', 50, 80000, 0, 'clock'),
    ('extra-6', 'butler-service', 'Butler Service', 'Dedicated 24/7 personal butler for your stay', 150, 240000, 1, 'bell')
`;

// src/database.ts
var exports_database = {};
__export(exports_database, {
  initDatabase: () => initDatabase,
  getDatabase: () => getDatabase
});
var {SQL } = globalThis.Bun;
function getDatabase() {
  if (!client) {
    const driver = Bun.env.DB_DRIVER || "sqlite";
    if (driver === "postgres" && config.db.connectionString) {
      console.log("Connecting to PostgreSQL database...");
      const pool = new SQL(config.db.connectionString);
      client = {
        query: (text, params) => pool.unsafe(text, params),
        queryOne: async (text, params) => {
          const result = await pool.unsafe(text, params);
          return result?.rows ? result.rows[0] || null : null;
        },
        transaction: async (fn) => {
          const connection = await pool.connect();
          try {
            await connection.unsafe("BEGIN");
            const result = await fn(connection);
            await connection.unsafe("COMMIT");
            return result;
          } catch (error) {
            await connection.unsafe("ROLLBACK");
            throw error;
          }
        },
        close: () => pool.end()
      };
    } else {
      console.log("Using SQLite database (Bun native driver)...");
      const dbPath = Bun.env.SQLITE_DB_PATH || "keo_hotel.sqlite";
      client = createSqliteDatabase(dbPath);
    }
  }
  return client;
}
async function seedStaffUsers(db) {
  const staffData = [
    {
      id: "staff-mgr-001",
      name: "Marcus Vance",
      email: "marcus.vance@keoexperience.com",
      staffId: "STAFF-MGR-001",
      role: "manager",
      roleTitle: "General Manager & Director",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      department: "Executive Management",
      hotelBranch: "KEO Experience Hotel & Suites",
      shift: "General Oversight (Day)",
      terminalId: "EXEC-STATION-01",
      permissions: ["all", "revenue_audit", "staff_management", "pricing_control", "system_config", "reservations_full"],
      password: "KeoGM@2026!",
      pin: "1234",
      phone: "+234 813 014 8920"
    },
    {
      id: "staff-rec-104",
      name: "Elena Rostova",
      email: "elena.rostova@keoexperience.com",
      staffId: "STAFF-REC-104",
      role: "receptionist",
      roleTitle: "Front Desk Lead & Concierge",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
      department: "Front Office & Guest Services",
      hotelBranch: "KEO Experience Hotel & Suites",
      shift: "Morning Shift (06:00 - 14:00)",
      terminalId: "TERMINAL-FD-02",
      permissions: ["check_in_out", "walk_in_reservations", "keycard_coding", "folio_management", "guest_lookup"],
      password: "KeoFD@2026!",
      pin: "5678",
      phone: "+234 813 014 8921"
    }
  ];
  for (const staff of staffData) {
    const passwordHash = Bun.password.hashSync(staff.password);
    const pinHash = Bun.password.hashSync(staff.pin);
    await db.query(`INSERT OR IGNORE INTO staff_users (
        id, name, email, staff_id, role, role_title, avatar_url,
        department, hotel_branch, shift, terminal_id,
        permissions, password_hash, pin_hash, phone, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,1)`, [
      staff.id,
      staff.name,
      staff.email,
      staff.staffId,
      staff.role,
      staff.roleTitle,
      staff.avatarUrl,
      staff.department,
      staff.hotelBranch,
      staff.shift,
      staff.terminalId,
      JSON.stringify(staff.permissions),
      passwordHash,
      pinHash,
      staff.phone
    ]);
  }
}
async function seedDefaultRooms(db) {
  const defaultRooms = [
    {
      id: "room-exec-01",
      slug: "presidential-ocean-suite",
      name: "Presidential Ocean Suite",
      category: "Presidential Suite",
      tagline: "Panoramic Atlantic views, private infinity splash pool & dedicated butler",
      description: "The pinnacle of Nigerian luxury hospitality. Our Presidential Suite occupies the top floor with 270-degree floor-to-ceiling glass wrapping the Atlantic coastline.",
      overview: "Spanning over 180 sqm, featuring a private plunge pool, master king bedroom, dining room for 8, and dedicated security entrance.",
      price_per_night: 850,
      price_naira_per_night: 1360000,
      capacity: 4,
      bed_type: "Grand King Bed",
      size: 180,
      floor: "Penthouse (12th)",
      units: 1,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900"
      ]),
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-suite-bedroom-41551-large.mp4",
      amenities: JSON.stringify(["Private Infinity Pool", "24/7 Butler Service", "Executive Lounge Access", "Helipad Transfer", "Jacuzzi Bath"]),
      features: JSON.stringify(["24/7 Butler Service", "Private Terrace & Plunge Pool", "Bang & Olufsen Sound System"])
    },
    {
      id: "room-exec-02",
      slug: "diplomatic-king-suite",
      name: "Diplomatic King Suite",
      category: "Executive Suite",
      tagline: "Refined oceanfront elegance tailored for dignitaries & C-suite executives",
      description: "Designed for high-level business executives and diplomats seeking supreme privacy, seamless security, and unmatched comfort.",
      overview: "Expansive 110 sqm suite featuring a private meeting salon, ergonomically engineered workspace, and lavish marble bath.",
      price_per_night: 480,
      price_naira_per_night: 768000,
      capacity: 2,
      bed_type: "King Bed",
      size: 110,
      floor: "9th - 11th Floor",
      units: 3,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1600&h=900",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1600&h=900"
      ]),
      video_url: null,
      amenities: JSON.stringify(["Executive Workspace", "High-speed Wi-Fi", "Complimentary Airport Transfer", "Nespresso Station"]),
      features: JSON.stringify(["Executive Meeting Desk", "Herm\xE8s Toiletries", "Walk-in Closet"])
    },
    {
      id: "room-deluxe-01",
      slug: "deluxe-atlantic-room",
      name: "Deluxe Atlantic Room",
      category: "Deluxe Room",
      tagline: "Modern luxury with private balcony overlooking Victoria Island oceanfront",
      description: "Bright, sleek, and immaculately detailed with natural mahogany accents, premium linens, and floor-to-ceiling balcony views.",
      overview: "Comfortable 55 sqm luxury room with plush seating area, smart home automated controls, and rainfall shower.",
      price_per_night: 280,
      price_naira_per_night: 448000,
      capacity: 2,
      bed_type: "King Bed / Twin",
      size: 55,
      floor: "4th - 8th Floor",
      units: 10,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900"
      ]),
      video_url: null,
      amenities: JSON.stringify(["Ocean View Balcony", "Smart TV", "Rainfall Shower", "24/7 Room Service"]),
      features: JSON.stringify(["Private Balcony", "Smart Room Control", "Mini Bar"])
    }
  ];
  for (const r of defaultRooms) {
    await db.query(`INSERT OR IGNORE INTO rooms (
        id, slug, name, category, tagline, description, overview,
        price_per_night, price_naira_per_night, capacity, bed_type, size, floor, units,
        image, gallery, video_url, amenities, features, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,1)`, [
      r.id,
      r.slug,
      r.name,
      r.category,
      r.tagline,
      r.description,
      r.overview,
      r.price_per_night,
      r.price_naira_per_night,
      r.capacity,
      r.bed_type,
      r.size,
      r.floor,
      r.units,
      r.image,
      r.gallery,
      r.video_url,
      r.amenities,
      r.features
    ]);
  }
}
async function initDatabase() {
  try {
    const db = getDatabase();
    await db.query(CREATE_ROOMS_TABLE);
    await db.query(CREATE_BOOKINGS_TABLE);
    await db.query(CREATE_SERVICE_ORDERS_TABLE);
    await db.query(CREATE_STAFF_USERS_TABLE);
    await db.query(CREATE_SETTINGS_TABLE);
    await db.query(CREATE_PAYMENTS_TABLE);
    await db.query(CREATE_EXTRAS_TABLE);
    await db.query(CREATE_IDEMPOTENCY_TABLE);
    await seedStaffUsers(db);
    await seedDefaultRooms(db);
    await db.query(SEED_EXTRAS);
    console.log("Database schema and seed data initialized successfully.");
  } catch (error) {
    console.warn("Database initialization warning:", error);
  }
}
var client = null;
var init_database = __esm(() => {
  init_config();
  init_sqliteAdapter();
  initDatabase();
});

// src/utils.ts
function generateReference(prefix = "KEO") {
  const n = Math.floor(1e5 + Math.random() * 900000);
  return `${prefix}-${n}`;
}
function generateFolioNumber() {
  const year = new Date().getFullYear();
  const n = Math.floor(1e5 + Math.random() * 900000);
  return `FOL-${year}-${n}`;
}
function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
async function verifyPassword(password, hash) {
  try {
    return await Bun.password.verify(password, hash);
  } catch {
    return false;
  }
}

// src/repositories/bookingRepository.ts
class BookingRepository {
  async findBookings(filters) {
    const db = getDatabase();
    let query = `
      SELECT id, reference, folio_number, channel, channel_category, channel_label, 
             status, guest_name, guest_email, guest_phone, guest_avatar, vip_tier,
             room_name, room_number, floor, hero_image, tagline, check_in_date, check_out_date,
             nights, adults, children, rate_per_night, total_amount, amount_paid, balance_due,
             currency, payment_status, payment_method, transaction_ref, booked_at, handled_by,
             keycard_status, card_uid, issued_at, issued_by, paid_at, cancelled_at,
             created_at, updated_at
      FROM bookings
      WHERE 1=1
    `;
    const params = [];
    if (filters.channelCategory && filters.channelCategory !== "all") {
      query += ` AND channel_category = $${params.length + 1}`;
      params.push(filters.channelCategory);
    }
    if (filters.status && filters.status !== "all") {
      query += ` AND status = $${params.length + 1}`;
      params.push(filters.status);
    }
    if (filters.searchQuery) {
      query += ` AND (guest_name ILIKE $${params.length + 1} OR reference ILIKE $${params.length + 1} OR folio_number ILIKE $${params.length + 1})`;
      params.push(`%${filters.searchQuery}%`);
    }
    query += ` ORDER BY booked_at DESC`;
    const result = await db.query(query, params);
    return result.rows;
  }
  async findBookingById(id) {
    const db = getDatabase();
    const booking = await db.queryOne("SELECT * FROM bookings WHERE id = $1", [id]);
    return booking;
  }
  async createBooking(data) {
    const db = getDatabase();
    const id = data.id || `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const booking = await db.queryOne(`INSERT INTO bookings (
        id, reference, folio_number, channel, channel_category, channel_label,
        guest_name, guest_email, guest_phone, guest_avatar, vip_tier, nationality, id_type, id_number, special_requests,
        room_id, room_name, room_slug, room_category, room_number, floor, hero_image, tagline,
        check_in_date, check_in_time, check_out_date, check_out_time,
        nights, adults, children,
        rate_per_night, room_total, tax_amount, service_fee, addons_total, discount_amount,
        total_amount, amount_paid, balance_due, currency, payment_status, payment_method, transaction_ref,
        handled_by, keycard_status, card_uid, issued_at, issued_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48
      ) RETURNING *`, [
      id,
      data.reference,
      data.folioNumber,
      data.channel,
      data.channelCategory,
      data.channelLabel,
      data.guestName,
      data.guestEmail,
      data.guestPhone,
      data.guestAvatar,
      data.vipTier,
      data.nationality,
      data.idType,
      data.idNumber,
      data.specialRequests,
      data.roomId,
      data.roomName,
      data.roomSlug,
      data.roomCategory,
      data.roomNumber,
      data.floor,
      data.heroImage,
      data.tagline,
      data.checkInDate,
      data.checkInTime,
      data.checkOutDate,
      data.checkOutTime,
      data.nights,
      data.adults,
      data.children,
      data.ratePerNight,
      data.roomTotal,
      data.taxAmount,
      data.serviceFee,
      data.addonsTotal,
      data.discountAmount,
      data.totalAmount,
      data.amountPaid,
      data.balanceDue,
      data.currency,
      data.paymentStatus,
      data.paymentMethod,
      data.transactionRef,
      data.handledBy,
      data.keycardStatus,
      data.cardUid,
      data.issuedAt,
      data.issuedBy
    ]);
    return booking;
  }
  async updateBookingStatus(id, status) {
    const db = getDatabase();
    const booking = await db.queryOne(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    return booking;
  }
  async recordPayment(id, amount, paymentStatus) {
    const db = getDatabase();
    const booking = await db.queryOne(`UPDATE bookings 
       SET amount_paid = amount_paid + $1, 
           balance_due = total_amount - (amount_paid + $1),
           payment_status = $2,
           paid_at = NOW()
       WHERE id = $3 RETURNING *`, [amount, paymentStatus, id]);
    return booking;
  }
  async issueKeycard(id, cardUid, issuedBy) {
    const db = getDatabase();
    const booking = await db.queryOne(`UPDATE bookings 
       SET keycard_status = 'Active', card_uid = $1, issued_at = NOW(), issued_by = $2
       WHERE id = $3 RETURNING *`, [cardUid, issuedBy, id]);
    return booking;
  }
}
var bookingRepository_default;
var init_bookingRepository = __esm(() => {
  init_database();
  bookingRepository_default = new BookingRepository;
});

// src/services/bookingService.ts
var exports_bookingService = {};
__export(exports_bookingService, {
  default: () => bookingService_default
});

class BookingService {
  async getBookings(filters) {
    return await bookingRepository_default.findBookings(filters);
  }
  async getBookingById(id) {
    return await bookingRepository_default.findBookingById(id);
  }
  async updateBookingStatus(id, status) {
    return await bookingRepository_default.updateBookingStatus(id, status);
  }
  async recordPayment(id, amount, paymentStatus) {
    return await bookingRepository_default.recordPayment(id, amount, paymentStatus);
  }
  async issueKeycard(id, cardUid, issuedBy) {
    return await bookingRepository_default.issueKeycard(id, cardUid, issuedBy);
  }
  async createPublicBooking(payload, idempotencyKey) {
    const db = getDatabase();
    if (idempotencyKey) {
      const ik = await db.queryOne(`SELECT response FROM idempotency_keys WHERE key = $1`, [idempotencyKey]);
      if (ik) {
        const ref = ik.response?.reference;
        const existing = ref ? await db.queryOne(`SELECT * FROM bookings WHERE reference = $1`, [ref]) : null;
        if (existing)
          return this.formatBooking(existing, payload.extras);
      }
    }
    const nights = calculateNights(payload.search.checkIn, payload.search.checkOut);
    const rateNGN = payload.room.pricePerNight * CURRENCY_RATE;
    const roomTotal = rateNGN * nights * payload.search.rooms;
    const extrasTotal = payload.extras.reduce((s, e) => s + e.price * (e.perNight ? nights : 1), 0);
    const subtotal = roomTotal + extrasTotal;
    const taxAmount = subtotal * config.taxRate;
    const serviceCharge = subtotal * config.serviceCharge;
    const totalAmount = subtotal + taxAmount + serviceCharge;
    const reference = generateReference("KEO");
    const folioNumber = generateFolioNumber();
    const booking = await db.queryOne(`INSERT INTO bookings (
        reference, folio_number, channel, channel_category, channel_label,
        guest_name, guest_email, guest_phone, special_requests, vip_tier,
        room_id, room_name, room_slug, room_category, hero_image,
        check_in_date, check_out_date, nights, adults, children,
        rate_per_night, room_total, tax_amount, service_fee, addons_total,
        discount_amount, total_amount, amount_paid, balance_due,
        currency, payment_status, payment_method
      ) VALUES (
        $1,$2,'Online Booking','online','Direct Website',
        $3,$4,$5,$6,'Standard',
        $7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,
        0,$22,0,$22,'NGN','pending',null
      ) RETURNING *`, [
      reference,
      folioNumber,
      payload.guest.fullName,
      payload.guest.email,
      payload.guest.phone,
      payload.guest.specialRequest,
      payload.room.id,
      payload.room.name,
      payload.room.slug,
      payload.room.category,
      payload.room.image,
      payload.search.checkIn,
      payload.search.checkOut,
      nights,
      payload.search.adults,
      payload.search.children,
      rateNGN,
      roomTotal,
      taxAmount,
      serviceCharge,
      extrasTotal,
      totalAmount
    ]);
    if (idempotencyKey) {
      await db.query(`INSERT INTO idempotency_keys (key, response, status_code) VALUES ($1,$2::jsonb,201) ON CONFLICT (key) DO NOTHING`, [idempotencyKey, JSON.stringify({ reference })]);
    }
    return this.formatBooking(booking, payload.extras);
  }
  async lookupBooking(reference, email) {
    const db = getDatabase();
    let q = `SELECT * FROM bookings WHERE reference = $1`;
    const params = [reference];
    if (email) {
      q += ` AND guest_email ILIKE $2`;
      params.push(email);
    }
    const row = await db.queryOne(q, params);
    return row ? this.formatBooking(row, []) : null;
  }
  async cancelBooking(reference) {
    const db = getDatabase();
    const row = await db.queryOne(`UPDATE bookings SET status='Cancelled', cancelled_at=NOW()
       WHERE reference=$1 AND status!='Cancelled' RETURNING *`, [reference]);
    return row ? this.formatBooking(row, []) : null;
  }
  formatBooking(row, extras) {
    const totalAmount = Number(row.total_amount);
    return {
      id: row.id,
      reference: row.reference,
      guest: { fullName: row.guest_name, email: row.guest_email, phone: row.guest_phone, specialRequest: row.special_requests ?? "" },
      room: { id: row.room_id, name: row.room_name, slug: row.room_slug, category: row.room_category, image: row.hero_image },
      stay: { checkIn: row.check_in_date, checkOut: row.check_out_date, nights: row.nights, adults: row.adults, children: row.children, rooms: 1 },
      extras,
      financials: {
        nights: row.nights,
        roomTotal: Number(row.room_total),
        extrasTotal: Number(row.addons_total),
        taxAmount: Number(row.tax_amount),
        totalAmount,
        amountPaid: Number(row.amount_paid),
        balanceDue: Number(row.balance_due),
        depositAmount: Math.round(totalAmount * 0.25),
        currency: "NGN"
      },
      status: row.status,
      paymentMethod: row.payment_method,
      paymentState: row.payment_status?.toLowerCase() ?? "pending",
      depositPaid: Number(row.amount_paid) > 0,
      createdAt: row.created_at
    };
  }
}
var CURRENCY_RATE = 1600, bookingService_default;
var init_bookingService = __esm(() => {
  init_database();
  init_config();
  init_bookingRepository();
  bookingService_default = new BookingService;
});

// node_modules/lodash/lodash.js
var require_lodash = __commonJS((exports, module) => {
  (function() {
    var undefined2;
    var VERSION = "4.18.1";
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = "__lodash_placeholder__";
    var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
    var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [
      ["ary", WRAP_ARY_FLAG],
      ["bind", WRAP_BIND_FLAG],
      ["bindKey", WRAP_BIND_KEY_FLAG],
      ["curry", WRAP_CURRY_FLAG],
      ["curryRight", WRAP_CURRY_RIGHT_FLAG],
      ["flip", WRAP_FLIP_FLAG],
      ["partial", WRAP_PARTIAL_FLAG],
      ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
      ["rearg", WRAP_REARG_FLAG]
    ];
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrimStart = /^\s+/;
    var reWhitespace = /\s/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
    var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
      rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
      rsUpper + "+" + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      "\xC0": "A",
      "\xC1": "A",
      "\xC2": "A",
      "\xC3": "A",
      "\xC4": "A",
      "\xC5": "A",
      "\xE0": "a",
      "\xE1": "a",
      "\xE2": "a",
      "\xE3": "a",
      "\xE4": "a",
      "\xE5": "a",
      "\xC7": "C",
      "\xE7": "c",
      "\xD0": "D",
      "\xF0": "d",
      "\xC8": "E",
      "\xC9": "E",
      "\xCA": "E",
      "\xCB": "E",
      "\xE8": "e",
      "\xE9": "e",
      "\xEA": "e",
      "\xEB": "e",
      "\xCC": "I",
      "\xCD": "I",
      "\xCE": "I",
      "\xCF": "I",
      "\xEC": "i",
      "\xED": "i",
      "\xEE": "i",
      "\xEF": "i",
      "\xD1": "N",
      "\xF1": "n",
      "\xD2": "O",
      "\xD3": "O",
      "\xD4": "O",
      "\xD5": "O",
      "\xD6": "O",
      "\xD8": "O",
      "\xF2": "o",
      "\xF3": "o",
      "\xF4": "o",
      "\xF5": "o",
      "\xF6": "o",
      "\xF8": "o",
      "\xD9": "U",
      "\xDA": "U",
      "\xDB": "U",
      "\xDC": "U",
      "\xF9": "u",
      "\xFA": "u",
      "\xFB": "u",
      "\xFC": "u",
      "\xDD": "Y",
      "\xFD": "y",
      "\xFF": "y",
      "\xC6": "Ae",
      "\xE6": "ae",
      "\xDE": "Th",
      "\xFE": "th",
      "\xDF": "ss",
      "\u0100": "A",
      "\u0102": "A",
      "\u0104": "A",
      "\u0101": "a",
      "\u0103": "a",
      "\u0105": "a",
      "\u0106": "C",
      "\u0108": "C",
      "\u010A": "C",
      "\u010C": "C",
      "\u0107": "c",
      "\u0109": "c",
      "\u010B": "c",
      "\u010D": "c",
      "\u010E": "D",
      "\u0110": "D",
      "\u010F": "d",
      "\u0111": "d",
      "\u0112": "E",
      "\u0114": "E",
      "\u0116": "E",
      "\u0118": "E",
      "\u011A": "E",
      "\u0113": "e",
      "\u0115": "e",
      "\u0117": "e",
      "\u0119": "e",
      "\u011B": "e",
      "\u011C": "G",
      "\u011E": "G",
      "\u0120": "G",
      "\u0122": "G",
      "\u011D": "g",
      "\u011F": "g",
      "\u0121": "g",
      "\u0123": "g",
      "\u0124": "H",
      "\u0126": "H",
      "\u0125": "h",
      "\u0127": "h",
      "\u0128": "I",
      "\u012A": "I",
      "\u012C": "I",
      "\u012E": "I",
      "\u0130": "I",
      "\u0129": "i",
      "\u012B": "i",
      "\u012D": "i",
      "\u012F": "i",
      "\u0131": "i",
      "\u0134": "J",
      "\u0135": "j",
      "\u0136": "K",
      "\u0137": "k",
      "\u0138": "k",
      "\u0139": "L",
      "\u013B": "L",
      "\u013D": "L",
      "\u013F": "L",
      "\u0141": "L",
      "\u013A": "l",
      "\u013C": "l",
      "\u013E": "l",
      "\u0140": "l",
      "\u0142": "l",
      "\u0143": "N",
      "\u0145": "N",
      "\u0147": "N",
      "\u014A": "N",
      "\u0144": "n",
      "\u0146": "n",
      "\u0148": "n",
      "\u014B": "n",
      "\u014C": "O",
      "\u014E": "O",
      "\u0150": "O",
      "\u014D": "o",
      "\u014F": "o",
      "\u0151": "o",
      "\u0154": "R",
      "\u0156": "R",
      "\u0158": "R",
      "\u0155": "r",
      "\u0157": "r",
      "\u0159": "r",
      "\u015A": "S",
      "\u015C": "S",
      "\u015E": "S",
      "\u0160": "S",
      "\u015B": "s",
      "\u015D": "s",
      "\u015F": "s",
      "\u0161": "s",
      "\u0162": "T",
      "\u0164": "T",
      "\u0166": "T",
      "\u0163": "t",
      "\u0165": "t",
      "\u0167": "t",
      "\u0168": "U",
      "\u016A": "U",
      "\u016C": "U",
      "\u016E": "U",
      "\u0170": "U",
      "\u0172": "U",
      "\u0169": "u",
      "\u016B": "u",
      "\u016D": "u",
      "\u016F": "u",
      "\u0171": "u",
      "\u0173": "u",
      "\u0174": "W",
      "\u0175": "w",
      "\u0176": "Y",
      "\u0177": "y",
      "\u0178": "Y",
      "\u0179": "Z",
      "\u017B": "Z",
      "\u017D": "Z",
      "\u017A": "z",
      "\u017C": "z",
      "\u017E": "z",
      "\u0132": "IJ",
      "\u0133": "ij",
      "\u0152": "Oe",
      "\u0153": "oe",
      "\u0149": "'n",
      "\u017F": "s"
    };
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var htmlUnescapes = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    };
    var stringEscapes = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    var freeParseFloat = parseFloat, freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {}
    }();
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }
    function arrayEach(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;
      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEvery(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function(value, key, collection2) {
        if (predicate(value, key, collection2)) {
          result = key;
          return false;
        }
      });
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (comparator(array[index], value)) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined2 : object[key];
      };
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined2 : object[key];
      };
    }
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function(value, index, collection2) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
      });
      return accumulator;
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseSum(array, iteratee) {
      var result, index = -1, length = array.length;
      while (++index < length) {
        var current = iteratee(array[index]);
        if (current !== undefined2) {
          result = result === undefined2 ? current : result + current;
        }
      }
      return result;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseToPairs(object, props) {
      return arrayMap(props, function(key) {
        return [key, object[key]];
      });
    }
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function charsStartIndex(strSymbols, chrSymbols) {
      var index = -1, length = strSymbols.length;
      while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
      return index;
    }
    function charsEndIndex(strSymbols, chrSymbols) {
      var index = strSymbols.length;
      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
      return index;
    }
    function countHolders(array, placeholder) {
      var length = array.length, result = 0;
      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    function escapeStringChar(chr) {
      return "\\" + stringEscapes[chr];
    }
    function getValue(object, key) {
      return object == null ? undefined2 : object[key];
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function iteratorToArray(iterator) {
      var data, result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function replaceHolders(array, placeholder) {
      var index = -1, length = array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (value === placeholder || value === PLACEHOLDER) {
          array[index] = PLACEHOLDER;
          result[resIndex++] = index;
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    function setToPairs(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = [value, value];
      });
      return result;
    }
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function strictLastIndexOf(array, value, fromIndex) {
      var index = fromIndex + 1;
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return index;
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function trimmedEndIndex(string) {
      var index = string.length;
      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var runInContext = function runInContext(context) {
      context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
      var { Array: Array2, Date: Date2, Error: Error2, Function: Function2, Math: Math2, Object: Object2, RegExp: RegExp2, String: String2, TypeError: TypeError2 } = context;
      var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
      var coreJsData = context["__core-js_shared__"];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var idCounter = 0;
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var nativeObjectToString = objectProto.toString;
      var objectCtorString = funcToString.call(Object2);
      var oldDash = root._;
      var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
      var defineProperty = function() {
        try {
          var func = getNative(Object2, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {}
      }();
      var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
      var { ceil: nativeCeil, floor: nativeFloor } = Math2, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
      var DataView2 = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
      var metaMap = WeakMap2 && new WeakMap2;
      var realNames = {};
      var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
      var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
      function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty.call(value, "__wrapped__")) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }
      var baseCreate = function() {
        function object() {}
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result2 = new object;
          object.prototype = undefined2;
          return result2;
        };
      }();
      function baseLodash() {}
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined2;
      }
      lodash.templateSettings = {
        escape: reEscape,
        evaluate: reEvaluate,
        interpolate: reInterpolate,
        variable: "",
        imports: {
          _: lodash
        }
      };
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }
      function lazyClone() {
        var result2 = new LazyWrapper(this.__wrapped__);
        result2.__actions__ = copyArray(this.__actions__);
        result2.__dir__ = this.__dir__;
        result2.__filtered__ = this.__filtered__;
        result2.__iteratees__ = copyArray(this.__iteratees__);
        result2.__takeCount__ = this.__takeCount__;
        result2.__views__ = copyArray(this.__views__);
        return result2;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result2 = new LazyWrapper(this);
          result2.__dir__ = -1;
          result2.__filtered__ = true;
        } else {
          result2 = this.clone();
          result2.__dir__ *= -1;
        }
        return result2;
      }
      function lazyValue() {
        var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result2 = [];
        outer:
          while (length-- && resIndex < takeCount) {
            index += dir;
            var iterIndex = -1, value = array[index];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
              if (type == LAZY_MAP_FLAG) {
                value = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result2[resIndex++] = value;
          }
        return result2;
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result2 = this.has(key) && delete this.__data__[key];
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED ? undefined2 : result2;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined2;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? undefined2 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          hash: new Hash,
          map: new (Map2 || ListCache),
          string: new Hash
        };
      }
      function mapCacheDelete(key) {
        var result2 = getMapData(this, key)["delete"](key);
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size2 = data.size;
        data.set(key, value);
        this.size += data.size == size2 ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values2) {
        var index = -1, length = values2 == null ? 0 : values2.length;
        this.__data__ = new MapCache;
        while (++index < length) {
          this.add(values2[index]);
        }
      }
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache;
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result2 = data["delete"](key);
        this.size = data.size;
        return result2;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined2;
      }
      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }
      function assignMergeValue(object, key, value) {
        if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAggregator(collection, setter, iteratee2, accumulator) {
        baseEach(collection, function(value, key, collection2) {
          setter(accumulator, value, iteratee2(value), collection2);
        });
        return accumulator;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        } else {
          object[key] = value;
        }
      }
      function baseAt(object, paths) {
        var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
        while (++index < length) {
          result2[index] = skip ? undefined2 : get(object, paths[index]);
        }
        return result2;
      }
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined2) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined2) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
        if (customizer) {
          result2 = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result2 !== undefined2) {
          return result2;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result2 = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result2);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result2 = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result2 = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack);
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result2);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key2) {
            result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined2 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result2;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function(object) {
          return baseConformsTo(object, source, props);
        };
      }
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (length--) {
          var key = props[length], predicate = source[key], value = object[key];
          if (value === undefined2 && !(key in object) || !predicate(value)) {
            return false;
          }
        }
        return true;
      }
      function baseDelay(func, wait, args) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return setTimeout2(function() {
          func.apply(undefined2, args);
        }, wait);
      }
      function baseDifference(array, values2, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
        if (!length) {
          return result2;
        }
        if (iteratee2) {
          values2 = arrayMap(values2, baseUnary(iteratee2));
        }
        if (comparator) {
          includes2 = arrayIncludesWith;
          isCommon = false;
        } else if (values2.length >= LARGE_ARRAY_SIZE) {
          includes2 = cacheHas;
          isCommon = false;
          values2 = new SetCache(values2);
        }
        outer:
          while (++index < length) {
            var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values2[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result2.push(value);
            } else if (!includes2(values2, computed, comparator)) {
              result2.push(value);
            }
          }
        return result2;
      }
      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      function baseEvery(collection, predicate) {
        var result2 = true;
        baseEach(collection, function(value, index, collection2) {
          result2 = !!predicate(value, index, collection2);
          return result2;
        });
        return result2;
      }
      function baseExtremum(array, iteratee2, comparator) {
        var index = -1, length = array.length;
        while (++index < length) {
          var value = array[index], current = iteratee2(value);
          if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current, result2 = value;
          }
        }
        return result2;
      }
      function baseFill(array, value, start, end) {
        var length = array.length;
        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === undefined2 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array[start++] = value;
        }
        return array;
      }
      function baseFilter(collection, predicate) {
        var result2 = [];
        baseEach(collection, function(value, index, collection2) {
          if (predicate(value, index, collection2)) {
            result2.push(value);
          }
        });
        return result2;
      }
      function baseFlatten(array, depth, predicate, isStrict, result2) {
        var index = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result2 || (result2 = []);
        while (++index < length) {
          var value = array[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result2);
            } else {
              arrayPush(result2, value);
            }
          } else if (!isStrict) {
            result2[result2.length] = value;
          }
        }
        return result2;
      }
      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);
      function baseForOwn(object, iteratee2) {
        return object && baseFor(object, iteratee2, keys);
      }
      function baseForOwnRight(object, iteratee2) {
        return object && baseForRight(object, iteratee2, keys);
      }
      function baseFunctions(object, props) {
        return arrayFilter(props, function(key) {
          return isFunction(object[key]);
        });
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : undefined2;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result2 = keysFunc(object);
        return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
      }
      function baseGetTag(value) {
        if (value == null) {
          return value === undefined2 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
      }
      function baseGt(value, other) {
        return value > other;
      }
      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }
      function baseHasIn(object, key) {
        return object != null && key in Object2(object);
      }
      function baseInRange(number, start, end) {
        return number >= nativeMin(start, end) && number < nativeMax(start, end);
      }
      function baseIntersection(arrays, iteratee2, comparator) {
        var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee2) {
            array = arrayMap(array, baseUnary(iteratee2));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
        }
        array = arrays[0];
        var index = -1, seen = caches[0];
        outer:
          while (++index < length && result2.length < maxLength) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseInverter(object, setter, iteratee2, accumulator) {
        baseForOwn(object, function(value, key, object2) {
          setter(accumulator, iteratee2(value), key, object2);
        });
        return accumulator;
      }
      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined2 : apply(func, object, args);
      }
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }
      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }
      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack);
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack);
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack);
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag;
      }
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length, length = index, noCustomizer = !customizer;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (index--) {
          var data = matchData[index];
          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0], objValue = object[key], srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === undefined2 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack;
            if (customizer) {
              var result2 = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
              return false;
            }
          }
        }
        return true;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag;
      }
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseIteratee(value) {
        if (typeof value == "function") {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == "object") {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result2 = [];
        for (var key in Object2(object)) {
          if (hasOwnProperty.call(object, key) && key != "constructor") {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result2 = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseLt(value, other) {
        return value < other;
      }
      function baseMap(collection, iteratee2) {
        var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value, key, collection2) {
          result2[++index] = iteratee2(value, key, collection2);
        });
        return result2;
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack || (stack = new Stack);
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
            if (newValue === undefined2) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
        var isCommon = newValue === undefined2;
        if (isCommon) {
          var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack["delete"](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseNth(array, n) {
        var length = array.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined2;
      }
      function baseOrderBy(collection, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function(iteratee2) {
            if (isArray(iteratee2)) {
              return function(value) {
                return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
              };
            }
            return iteratee2;
          });
        } else {
          iteratees = [identity];
        }
        var index = -1;
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        var result2 = baseMap(collection, function(value, key, collection2) {
          var criteria = arrayMap(iteratees, function(iteratee2) {
            return iteratee2(value);
          });
          return { criteria, index: ++index, value };
        });
        return baseSortBy(result2, function(object, other) {
          return compareMultiple(object, other, orders);
        });
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path) {
          return hasIn(object, path);
        });
      }
      function basePickBy(object, paths, predicate) {
        var index = -1, length = paths.length, result2 = {};
        while (++index < length) {
          var path = paths[index], value = baseGet(object, path);
          if (predicate(value, path)) {
            baseSet(result2, castPath(path, object), value);
          }
        }
        return result2;
      }
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }
      function basePullAll(array, values2, iteratee2, comparator) {
        var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
        if (array === values2) {
          values2 = copyArray(values2);
        }
        if (iteratee2) {
          seen = arrayMap(array, baseUnary(iteratee2));
        }
        while (++index < length) {
          var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
          while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0, lastIndex = length - 1;
        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (isIndex(index)) {
              splice.call(array, index, 1);
            } else {
              baseUnset(array, index);
            }
          }
        }
        return array;
      }
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }
      function baseRange(start, end, step, fromRight) {
        var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
        while (length--) {
          result2[fromRight ? length : ++index] = start;
          start += step;
        }
        return result2;
      }
      function baseRepeat(string, n) {
        var result2 = "";
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result2;
        }
        do {
          if (n % 2) {
            result2 += string;
          }
          n = nativeFloor(n / 2);
          if (n) {
            string += string;
          }
        } while (n);
        return result2;
      }
      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + "");
      }
      function baseSample(collection) {
        return arraySample(values(collection));
      }
      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index < length) {
          var key = toKey(path[index]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined2;
            if (newValue === undefined2) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      var baseSetData = !metaMap ? identity : function(func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function(func, string) {
        return defineProperty(func, "toString", {
          configurable: true,
          enumerable: false,
          value: constant(string),
          writable: true
        });
      };
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }
      function baseSlice(array, start, end) {
        var index = -1, length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result2 = Array2(length);
        while (++index < length) {
          result2[index] = array[index + start];
        }
        return result2;
      }
      function baseSome(collection, predicate) {
        var result2;
        baseEach(collection, function(value, index, collection2) {
          result2 = predicate(value, index, collection2);
          return !result2;
        });
        return !!result2;
      }
      function baseSortedIndex(array, value, retHighest) {
        var low = 0, high = array == null ? low : array.length;
        if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1, computed = array[mid];
            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value, identity, retHighest);
      }
      function baseSortedIndexBy(array, value, iteratee2, retHighest) {
        var low = 0, high = array == null ? 0 : array.length;
        if (high === 0) {
          return 0;
        }
        value = iteratee2(value);
        var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }
      function baseSortedUniq(array, iteratee2) {
        var index = -1, length = array.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result2[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result2;
      }
      function baseToNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        return +value;
      }
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
      }
      function baseUniq(array, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
        if (comparator) {
          isCommon = false;
          includes2 = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set2 = iteratee2 ? null : createSet(array);
          if (set2) {
            return setToArray(set2);
          }
          isCommon = false;
          includes2 = cacheHas;
          seen = new SetCache;
        } else {
          seen = iteratee2 ? [] : result2;
        }
        outer:
          while (++index < length) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee2) {
                seen.push(computed);
              }
              result2.push(value);
            } else if (!includes2(seen, computed, comparator)) {
              if (seen !== result2) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseUnset(object, path) {
        path = castPath(path, object);
        var index = -1, length = path.length;
        if (!length) {
          return true;
        }
        while (++index < length) {
          var key = toKey(path[index]);
          if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) {
            return false;
          }
          if ((key === "constructor" || key === "prototype") && index < length - 1) {
            return false;
          }
        }
        var obj = parent(object, path);
        return obj == null || delete obj[toKey(last(path))];
      }
      function baseUpdate(object, path, updater, customizer) {
        return baseSet(object, path, updater(baseGet(object, path)), customizer);
      }
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length, index = fromRight ? length : -1;
        while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
        return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
      }
      function baseWrapperValue(value, actions) {
        var result2 = value;
        if (result2 instanceof LazyWrapper) {
          result2 = result2.value();
        }
        return arrayReduce(actions, function(result3, action) {
          return action.func.apply(action.thisArg, arrayPush([result3], action.args));
        }, result2);
      }
      function baseXor(arrays, iteratee2, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index = -1, result2 = Array2(length);
        while (++index < length) {
          var array = arrays[index], othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index) {
              result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
      }
      function baseZipObject(props, values2, assignFunc) {
        var index = -1, length = props.length, valsLength = values2.length, result2 = {};
        while (++index < length) {
          var value = index < valsLength ? values2[index] : undefined2;
          assignFunc(result2, props[index], value);
        }
        return result2;
      }
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }
      function castFunction(value) {
        return typeof value == "function" ? value : identity;
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      var castRest = baseRest;
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined2 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      var clearTimeout = ctxClearTimeout || function(id) {
        return root.clearTimeout(id);
      };
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result2);
        return result2;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
        return result2;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneRegExp(regexp) {
        var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result2.lastIndex = regexp.lastIndex;
        return result2;
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
          var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object, other, orders) {
        var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
        while (++index < length) {
          var result2 = compareAscending(objCriteria[index], othCriteria[index]);
          if (result2) {
            if (index >= ordersLength) {
              return result2;
            }
            var order2 = orders[index];
            return result2 * (order2 == "desc" ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result2[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result2[leftIndex++] = args[argsIndex++];
        }
        return result2;
      }
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result2[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result2[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result2;
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array2(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
          if (newValue === undefined2) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function createAggregator(setter, initializer) {
        return function(collection, iteratee2) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
        };
      }
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined2 : customizer;
            length = 1;
          }
          object = Object2(object);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object, source, index, customizer);
            }
          }
          return object;
        });
      }
      function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee2) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee2);
          }
          var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
          while (fromRight ? index-- : ++index < length) {
            if (iteratee2(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee2, keysFunc) {
          var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index];
            if (iteratee2(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
        };
      }
      function createCtor(Ctor) {
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor;
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
          return isObject(result2) ? result2 : thisBinding;
        };
      }
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
          while (index--) {
            args[index] = arguments[index];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
          }
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }
        return wrapper;
      }
      function createFind(findIndexFunc) {
        return function(collection, predicate, fromIndex) {
          var iterable = Object2(collection);
          if (!isArrayLike(collection)) {
            var iteratee2 = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function(key) {
              return iteratee2(iterable[key], key, iterable);
            };
          }
          var index = findIndexFunc(collection, predicate, fromIndex);
          return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
        };
      }
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index--) {
            var func = funcs[index];
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == "wrapper") {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index = wrapper ? index : length;
          while (++index < length) {
            func = funcs[index];
            var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }
          return function() {
            var args = arguments, value = args[0];
            if (wrapper && args.length == 1 && isArray(value)) {
              return wrapper.plant(value).value();
            }
            var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
            while (++index2 < length) {
              result2 = funcs[index2].call(this, result2);
            }
            return result2;
          };
        });
      }
      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index = length;
          while (index--) {
            args[index] = arguments[index];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
          }
          var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary2 < length) {
            args.length = ary2;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createInverter(setter, toIteratee) {
        return function(object, iteratee2) {
          return baseInverter(object, setter, toIteratee(iteratee2), {});
        };
      }
      function createMathOperation(operator, defaultValue) {
        return function(value, other) {
          var result2;
          if (value === undefined2 && other === undefined2) {
            return defaultValue;
          }
          if (value !== undefined2) {
            result2 = value;
          }
          if (other !== undefined2) {
            if (result2 === undefined2) {
              return other;
            }
            if (typeof value == "string" || typeof other == "string") {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result2 = operator(value, other);
          }
          return result2;
        };
      }
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee2) {
              return apply(iteratee2, thisArg, args);
            });
          });
        });
      }
      function createPadding(length, chars) {
        chars = chars === undefined2 ? " " : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
      }
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      function createRange(fromRight) {
        return function(start, end, step) {
          if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
            end = step = undefined2;
          }
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }
      function createRelationalOperation(operator) {
        return function(value, other) {
          if (!(typeof value == "string" && typeof other == "string")) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }
      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [
          func,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary2,
          arity
        ];
        var result2 = wrapFunc.apply(undefined2, newData);
        if (isLaziable(func)) {
          setData(result2, newData);
        }
        result2.placeholder = placeholder;
        return setWrapToString(result2, func, bitmask);
      }
      function createRound(methodName) {
        var func = Math2[methodName];
        return function(number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
            pair = (toString(value) + "e").split("e");
            return +(pair[0] + "e" + (+pair[1] - precision));
          }
          return func(number);
        };
      }
      var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values2) {
        return new Set2(values2);
      };
      function createToPairs(keysFunc) {
        return function(object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }
      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined2;
        }
        ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
        arity = arity === undefined2 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials, holdersRight = holders;
          partials = holders = undefined2;
        }
        var data = isBindKey ? undefined2 : getData(func);
        var newData = [
          func,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary2,
          arity
        ];
        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result2 = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result2 = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result2 = createPartial(func, bitmask, thisArg, partials);
        } else {
          result2 = createHybrid.apply(undefined2, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result2, newData), func, bitmask);
      }
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          return srcValue;
        }
        return objValue;
      }
      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
          stack["delete"](srcValue);
        }
        return objValue;
      }
      function customOmitClone(value) {
        return isPlainObject(value) ? undefined2 : value;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache : undefined2;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== undefined2) {
            if (compared) {
              continue;
            }
            result2 = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result2 = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result2 = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result2;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result2;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result2 = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result2 = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result2 && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && (("constructor" in object) && ("constructor" in other)) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result2 = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result2;
      }
      function flatRest(func) {
        return setToString(overRest(func, undefined2, flatten), func + "");
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var getData = !metaMap ? noop : function(func) {
        return metaMap.get(func);
      };
      function getFuncName(func) {
        var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
        while (length--) {
          var data = array[length], otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result2;
      }
      function getHolder(func) {
        var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
        return object.placeholder;
      }
      function getIteratee() {
        var result2 = lodash.iteratee || iteratee;
        result2 = result2 === iteratee ? baseIteratee : result2;
        return arguments.length ? result2(arguments[0], arguments[1]) : result2;
      }
      function getMapData(map2, key) {
        var data = map2.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getMatchData(object) {
        var result2 = keys(object), length = result2.length;
        while (length--) {
          var key = result2[length], value = object[key];
          result2[length] = [key, value, isStrictComparable(value)];
        }
        return result2;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined2;
      }
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = undefined2;
          var unmasked = true;
        } catch (e) {}
        var result2 = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result2;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object2(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result2 = [];
        while (object) {
          arrayPush(result2, getSymbols(object));
          object = getPrototype(object);
        }
        return result2;
      };
      var getTag = baseGetTag;
      if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2) != setTag || WeakMap2 && getTag(new WeakMap2) != weakMapTag) {
        getTag = function(value) {
          var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result2;
        };
      }
      function getView(start, end, transforms) {
        var index = -1, length = transforms.length;
        while (++index < length) {
          var data = transforms[index], size2 = data.size;
          switch (data.type) {
            case "drop":
              start += size2;
              break;
            case "dropRight":
              end -= size2;
              break;
            case "take":
              end = nativeMin(end, start + size2);
              break;
            case "takeRight":
              start = nativeMax(start, end - size2);
              break;
          }
        }
        return { start, end };
      }
      function getWrapDetails(source) {
        var match2 = source.match(reWrapDetails);
        return match2 ? match2[1].split(reSplitDetails) : [];
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index = -1, length = path.length, result2 = false;
        while (++index < length) {
          var key = toKey(path[index]);
          if (!(result2 = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result2 || ++index != length) {
          return result2;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }
      function initCloneArray(array) {
        var length = array.length, result2 = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
          result2.index = array.index;
          result2.input = array.input;
        }
        return result2;
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return new Ctor;
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return new Ctor;
          case symbolTag:
            return cloneSymbol(object);
        }
      }
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
        details = details.join(length > 2 ? ", " : " ");
        return source.replace(reWrapComment, `{
/* [wrapped with ` + details + `] */
`);
      }
      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && (index in object)) {
          return eq(object[index], value);
        }
        return false;
      }
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isLaziable(func) {
        var funcName = getFuncName(func), other = lodash[funcName];
        if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var isMaskable = coreJsData ? isFunction : stubFalse;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
        return value === proto;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== undefined2 || (key in Object2(object)));
        };
      }
      function memoizeCapped(func) {
        var result2 = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result2.cache;
        return result2;
      }
      function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value = source[7];
        if (value) {
          data[7] = value;
        }
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      function nativeKeysIn(object) {
        var result2 = [];
        if (object != null) {
          for (var key in Object2(object)) {
            result2.push(key);
          }
        }
        return result2;
      }
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      function overRest(func, start, transform2) {
        start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array2(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform2(array);
          return apply(func, this, otherArgs);
        };
      }
      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }
      function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
        while (length--) {
          var index = indexes[length];
          array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
        }
        return array;
      }
      function safeGet(object, key) {
        if (key === "constructor" && typeof object[key] === "function") {
          return;
        }
        if (key == "__proto__") {
          return;
        }
        return object[key];
      }
      var setData = shortOut(baseSetData);
      var setTimeout2 = ctxSetTimeout || function(func, wait) {
        return root.setTimeout(func, wait);
      };
      var setToString = shortOut(baseSetToString);
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + "";
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined2, arguments);
        };
      }
      function shuffleSelf(array, size2) {
        var index = -1, length = array.length, lastIndex = length - 1;
        size2 = size2 === undefined2 ? length : size2;
        while (++index < size2) {
          var rand = baseRandom(index, lastIndex), value = array[rand];
          array[rand] = array[index];
          array[index] = value;
        }
        array.length = size2;
        return array;
      }
      var stringToPath = memoizeCapped(function(string) {
        var result2 = [];
        if (string.charCodeAt(0) === 46) {
          result2.push("");
        }
        string.replace(rePropName, function(match2, number, quote, subString) {
          result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
        });
        return result2;
      });
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {}
          try {
            return func + "";
          } catch (e) {}
        }
        return "";
      }
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair) {
          var value = "_." + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result2.__actions__ = copyArray(wrapper.__actions__);
        result2.__index__ = wrapper.__index__;
        result2.__values__ = wrapper.__values__;
        return result2;
      }
      function chunk(array, size2, guard) {
        if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
          size2 = 1;
        } else {
          size2 = nativeMax(toInteger(size2), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size2 < 1) {
          return [];
        }
        var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
        while (index < length) {
          result2[resIndex++] = baseSlice(array, index, index += size2);
        }
        return result2;
      }
      function compact(array) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array[index];
          if (value) {
            result2[resIndex++] = value;
          }
        }
        return result2;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array2(length - 1), array = arguments[0], index = length;
        while (index--) {
          args[index - 1] = arguments[index];
        }
        return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }
      var difference = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function(array, values2) {
        var iteratee2 = last(values2);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
      });
      var differenceWith = baseRest(function(array, values2) {
        var comparator = last(values2);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined2;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
      });
      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }
      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }
      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
          start = 0;
          end = length;
        }
        return baseFill(array, value, start, end);
      }
      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index);
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        if (fromIndex !== undefined2) {
          index = toInteger(fromIndex);
          index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index, true);
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined2 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }
      function fromPairs(pairs) {
        var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
        while (++index < length) {
          var pair = pairs[index];
          baseAssignValue(result2, pair[0], pair[1]);
        }
        return result2;
      }
      function head(array) {
        return array && array.length ? array[0] : undefined2;
      }
      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseIndexOf(array, value, index);
      }
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        if (iteratee2 === last(mapped)) {
          iteratee2 = undefined2;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
      });
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
      });
      function join(array, separator) {
        return array == null ? "" : nativeJoin.call(array, separator);
      }
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined2;
      }
      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length;
        if (fromIndex !== undefined2) {
          index = toInteger(fromIndex);
          index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
      }
      function nth(array, n) {
        return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
      }
      var pull = baseRest(pullAll);
      function pullAll(array, values2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
      }
      function pullAllBy(array, values2, iteratee2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
      }
      function pullAllWith(array, values2, comparator) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
      }
      var pullAt = flatRest(function(array, indexes) {
        var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
        basePullAt(array, arrayMap(indexes, function(index) {
          return isIndex(index, length) ? +index : index;
        }).sort(compareAscending));
        return result2;
      });
      function remove(array, predicate) {
        var result2 = [];
        if (!(array && array.length)) {
          return result2;
        }
        var index = -1, indexes = [], length = array.length;
        predicate = getIteratee(predicate, 3);
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result2.push(value);
            indexes.push(index);
          }
        }
        basePullAt(array, indexes);
        return result2;
      }
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }
      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined2 ? length : toInteger(end);
        }
        return baseSlice(array, start, end);
      }
      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }
      function sortedIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
      }
      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value);
          if (index < length && eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }
      function sortedLastIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
      }
      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value, true) - 1;
          if (eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }
      function sortedUniqBy(array, iteratee2) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }
      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }
      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
      });
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
      });
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }
      function uniqBy(array, iteratee2) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function uniqWith(array, comparator) {
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return array && array.length ? baseUniq(array, undefined2, comparator) : [];
      }
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index) {
          return arrayMap(array, baseProperty(index));
        });
      }
      function unzipWith(array, iteratee2) {
        if (!(array && array.length)) {
          return [];
        }
        var result2 = unzip(array);
        if (iteratee2 == null) {
          return result2;
        }
        return arrayMap(result2, function(group) {
          return apply(iteratee2, undefined2, group);
        });
      }
      var without = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
      });
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
      });
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
      });
      var zip = baseRest(unzip);
      function zipObject(props, values2) {
        return baseZipObject(props || [], values2 || [], assignValue);
      }
      function zipObjectDeep(props, values2) {
        return baseZipObject(props || [], values2 || [], baseSet);
      }
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
        iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
        return unzipWith(arrays, iteratee2);
      });
      function chain(value) {
        var result2 = lodash(value);
        result2.__chain__ = true;
        return result2;
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      function thru(value, interceptor) {
        return interceptor(value);
      }
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
          return baseAt(object, paths);
        };
        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          func: thru,
          args: [interceptor],
          thisArg: undefined2
        });
        return new LodashWrapper(value, this.__chain__).thru(function(array) {
          if (length && !array.length) {
            array.push(undefined2);
          }
          return array;
        });
      });
      function wrapperChain() {
        return chain(this);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function wrapperNext() {
        if (this.__values__ === undefined2) {
          this.__values__ = toArray(this.value());
        }
        var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
        return { done, value };
      }
      function wrapperToIterator() {
        return this;
      }
      function wrapperPlant(value) {
        var result2, parent2 = this;
        while (parent2 instanceof baseLodash) {
          var clone2 = wrapperClone(parent2);
          clone2.__index__ = 0;
          clone2.__values__ = undefined2;
          if (result2) {
            previous.__wrapped__ = clone2;
          } else {
            result2 = clone2;
          }
          var previous = clone2;
          parent2 = parent2.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result2;
      }
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            func: thru,
            args: [reverse],
            thisArg: undefined2
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      var countBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty.call(result2, key)) {
          ++result2[key];
        } else {
          baseAssignValue(result2, key, 1);
        }
      });
      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined2;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }
      var find = createFind(findIndex);
      var findLast = createFind(findLastIndex);
      function flatMap(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), 1);
      }
      function flatMapDeep(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), INFINITY);
      }
      function flatMapDepth(collection, iteratee2, depth) {
        depth = depth === undefined2 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee2), depth);
      }
      function forEach(collection, iteratee2) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function forEachRight(collection, iteratee2) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee2, 3));
      }
      var groupBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty.call(result2, key)) {
          result2[key].push(value);
        } else {
          baseAssignValue(result2, key, [value]);
        }
      });
      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }
      var invokeMap = baseRest(function(collection, path, args) {
        var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value) {
          result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
        });
        return result2;
      });
      var keyBy = createAggregator(function(result2, value, key) {
        baseAssignValue(result2, key, value);
      });
      function map(collection, iteratee2) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? undefined2 : orders;
        if (!isArray(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection, iteratees, orders);
      }
      var partition = createAggregator(function(result2, value, key) {
        result2[key ? 0 : 1].push(value);
      }, function() {
        return [[], []];
      });
      function reduce(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
      }
      function reduceRight(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
      }
      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }
      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }
      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }
      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }
      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined2;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      var sortBy = baseRest(function(collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });
      var now = ctxNow || function() {
        return root.Date.now();
      };
      function after(n, func) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function ary(func, n, guard) {
        n = guard ? undefined2 : n;
        n = func && n == null ? func.length : n;
        return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
      }
      function before(n, func) {
        var result2;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n > 0) {
            result2 = func.apply(this, arguments);
          }
          if (n <= 1) {
            func = undefined2;
          }
          return result2;
        };
      }
      var bind = baseRest(function(func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function(object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });
      function curry(func, arity, guard) {
        arity = guard ? undefined2 : arity;
        var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
        result2.placeholder = curry.placeholder;
        return result2;
      }
      function curryRight(func, arity, guard) {
        arity = guard ? undefined2 : arity;
        var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
        result2.placeholder = curryRight.placeholder;
        return result2;
      }
      function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time2) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = undefined2;
          lastInvokeTime = time2;
          result2 = func.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time2) {
          lastInvokeTime = time2;
          timerId = setTimeout2(timerExpired, wait);
          return leading ? invokeFunc(time2) : result2;
        }
        function remainingWait(time2) {
          var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time2) {
          var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime;
          return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time2 = now();
          if (shouldInvoke(time2)) {
            return trailingEdge(time2);
          }
          timerId = setTimeout2(timerExpired, remainingWait(time2));
        }
        function trailingEdge(time2) {
          timerId = undefined2;
          if (trailing && lastArgs) {
            return invokeFunc(time2);
          }
          lastArgs = lastThis = undefined2;
          return result2;
        }
        function cancel() {
          if (timerId !== undefined2) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined2;
        }
        function flush() {
          return timerId === undefined2 ? result2 : trailingEdge(now());
        }
        function debounced() {
          var time2 = now(), isInvoking = shouldInvoke(time2);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time2;
          if (isInvoking) {
            if (timerId === undefined2) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout2(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined2) {
            timerId = setTimeout2(timerExpired, wait);
          }
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      var defer = baseRest(function(func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function(func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func.apply(this, args);
          memoized.cache = cache.set(key, result2) || cache;
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache);
        return memoized;
      }
      memoize.Cache = MapCache;
      function negate(predicate) {
        if (typeof predicate != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function once(func) {
        return before(2, func);
      }
      var overArgs = castRest(function(func, transforms) {
        transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index = -1, length = nativeMin(args.length, funcsLength);
          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }
          return apply(func, this, args);
        });
      });
      var partial = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
      });
      var partialRight = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
      });
      var rearg = flatRest(function(func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
      });
      function rest(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start === undefined2 ? start : toInteger(start);
        return baseRest(func, start);
      }
      function spread(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function(args) {
          var array = args[start], otherArgs = castSlice(args, 0, start);
          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }
      function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          leading,
          maxWait: wait,
          trailing
        });
      }
      function unary(func) {
        return ary(func, 1);
      }
      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray(value) ? value : [value];
      }
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }
      function cloneWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function(value, other) {
        return value >= other;
      });
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      var isArray = Array2.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      function isElement(value) {
        return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
      }
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
          return !value.length;
        }
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty.call(value, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        var result2 = customizer ? customizer(value, other) : undefined2;
        return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
      }
      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
      }
      function isFinite(value) {
        return typeof value == "number" && nativeIsFinite(value);
      }
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isInteger(value) {
        return typeof value == "number" && value == toInteger(value);
      }
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }
      function isNaN2(value) {
        return isNumber(value) && value != +value;
      }
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error2(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }
      function isNull(value) {
        return value === null;
      }
      function isNil(value) {
        return value == null;
      }
      function isNumber(value) {
        return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
      }
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
      }
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      function isString(value) {
        return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function isUndefined(value) {
        return value === undefined2;
      }
      function isWeakMap(value) {
        return isObjectLike(value) && getTag(value) == weakMapTag;
      }
      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }
      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function(value, other) {
        return value <= other;
      });
      function toArray(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }
        var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value);
      }
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function toInteger(value) {
        var result2 = toFinite(value), remainder = result2 % 1;
        return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
      }
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      var assign = createAssigner(function(object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);
      function create(prototype, properties) {
        var result2 = baseCreate(prototype);
        return properties == null ? result2 : baseAssign(result2, properties);
      }
      var defaults = baseRest(function(object, sources) {
        object = Object2(object);
        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined2;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];
            if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              object[key] = source[key];
            }
          }
        }
        return object;
      });
      var defaultsDeep = baseRest(function(args) {
        args.push(undefined2, customDefaultsMerge);
        return apply(mergeWith, undefined2, args);
      });
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }
      function forIn(object, iteratee2) {
        return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forInRight(object, iteratee2) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forOwn(object, iteratee2) {
        return object && baseForOwn(object, getIteratee(iteratee2, 3));
      }
      function forOwnRight(object, iteratee2) {
        return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
      }
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }
      function get(object, path, defaultValue) {
        var result2 = object == null ? undefined2 : baseGet(object, path);
        return result2 === undefined2 ? defaultValue : result2;
      }
      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var invert = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString.call(value);
        }
        result2[value] = key;
      }, constant(identity));
      var invertBy = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString.call(value);
        }
        if (hasOwnProperty.call(result2, value)) {
          result2[value].push(key);
        } else {
          result2[value] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      function mapKeys(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, iteratee2(value, key, object2), value);
        });
        return result2;
      }
      function mapValues(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, key, iteratee2(value, key, object2));
        });
        return result2;
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function(object, paths) {
        var result2 = {};
        if (object == null) {
          return result2;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result2);
        if (isDeep) {
          result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result2, paths[length]);
        }
        return result2;
      });
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object), function(prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function(value, path) {
          return predicate(value, path[0]);
        });
      }
      function result(object, path, defaultValue) {
        path = castPath(path, object);
        var index = -1, length = path.length;
        if (!length) {
          length = 1;
          object = undefined2;
        }
        while (++index < length) {
          var value = object == null ? undefined2 : object[toKey(path[index])];
          if (value === undefined2) {
            index = length;
            value = defaultValue;
          }
          object = isFunction(value) ? value.call(object) : value;
        }
        return object;
      }
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }
      function setWith(object, path, value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return object == null ? object : baseSet(object, path, value, customizer);
      }
      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);
      function transform(object, iteratee2, accumulator) {
        var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee2 = getIteratee(iteratee2, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
          return iteratee2(accumulator, value, index, object2);
        });
        return accumulator;
      }
      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }
      function update(object, path, updater) {
        return object == null ? object : baseUpdate(object, path, castFunction(updater));
      }
      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
      }
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }
      function clamp(number, lower, upper) {
        if (upper === undefined2) {
          upper = lower;
          lower = undefined2;
        }
        if (upper !== undefined2) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined2) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      function inRange(number, start, end) {
        start = toFinite(start);
        if (end === undefined2) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start, end);
      }
      function random(lower, upper, floating) {
        if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined2;
        }
        if (floating === undefined2) {
          if (typeof upper == "boolean") {
            floating = upper;
            upper = undefined2;
          } else if (typeof lower == "boolean") {
            floating = lower;
            lower = undefined2;
          }
        }
        if (lower === undefined2 && upper === undefined2) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined2) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var camelCase = createCompounder(function(result2, word, index) {
        word = word.toLowerCase();
        return result2 + (index ? capitalize(word) : word);
      });
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }
      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
      }
      function endsWith(string, target, position) {
        string = toString(string);
        target = baseToString(target);
        var length = string.length;
        position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }
      function escape(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }
      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
      }
      var kebabCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "-" : "") + word.toLowerCase();
      });
      var lowerCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst("toLowerCase");
      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }
      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }
      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }
      function parseInt2(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
      }
      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString(string), n);
      }
      function replace() {
        var args = arguments, string = toString(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }
      var snakeCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "_" : "") + word.toLowerCase();
      });
      function split(string, separator, limit) {
        if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
          separator = limit = undefined2;
        }
        limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString(string);
        if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
          separator = baseToString(separator);
          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator, limit);
      }
      var startCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + upperFirst(word);
      });
      function startsWith(string, target, position) {
        string = toString(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target = baseToString(target);
        return string.slice(position, position + target.length) == target;
      }
      function template(string, options, guard) {
        var settings = lodash.templateSettings;
        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined2;
        }
        string = toString(string);
        options = assignWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        arrayEach(importsKeys, function(key) {
          if (reForbiddenIdentifierChars.test(key)) {
            throw new Error2(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
          }
        });
        var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
        var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
        var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + `
`;
        string.replace(reDelimiters, function(match2, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += `' +
__e(` + escapeValue + `) +
'`;
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += `';
` + evaluateValue + `;
__p += '`;
          }
          if (interpolateValue) {
            source += `' +
((__t = (` + interpolateValue + `)) == null ? '' : __t) +
'`;
          }
          index = offset + match2.length;
          return match2;
        });
        source += `';
`;
        var variable = hasOwnProperty.call(options, "variable") && options.variable;
        if (!variable) {
          source = `with (obj) {
` + source + `
}
`;
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
        source = "function(" + (variable || "obj") + `) {
` + (variable ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? `, __j = Array.prototype.join;
` + `function print() { __p += __j.call(arguments, '') }
` : `;
`) + source + `return __p
}`;
        var result2 = attempt(function() {
          return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
        });
        result2.source = source;
        if (isError(result2)) {
          throw result2;
        }
        return result2;
      }
      function toLower(value) {
        return toString(value).toLowerCase();
      }
      function toUpper(value) {
        return toString(value).toUpperCase();
      }
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return baseTrim(string);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join("");
      }
      function trimEnd(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return string.slice(0, trimmedEndIndex(string) + 1);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join("");
      }
      function trimStart(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return string.replace(reTrimStart, "");
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join("");
      }
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
        if (isObject(options)) {
          var separator = "separator" in options ? options.separator : separator;
          length = "length" in options ? toInteger(options.length) : length;
          omission = "omission" in options ? baseToString(options.omission) : omission;
        }
        string = toString(string);
        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
        if (separator === undefined2) {
          return result2 + omission;
        }
        if (strSymbols) {
          end += result2.length - end;
        }
        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match2, substring = result2;
            if (!separator.global) {
              separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
            }
            separator.lastIndex = 0;
            while (match2 = separator.exec(substring)) {
              var newEnd = match2.index;
            }
            result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator), end) != end) {
          var index = result2.lastIndexOf(separator);
          if (index > -1) {
            result2 = result2.slice(0, index);
          }
        }
        return result2 + omission;
      }
      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }
      var upperCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toUpperCase();
      });
      var upperFirst = createCaseFirst("toUpperCase");
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined2 : pattern;
        if (pattern === undefined2) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var attempt = baseRest(function(func, args) {
        try {
          return apply(func, undefined2, args);
        } catch (e) {
          return isError(e) ? e : new Error2(e);
        }
      });
      var bindAll = flatRest(function(object, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap(pairs, function(pair) {
          if (typeof pair[1] != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function(args) {
          var index = -1;
          while (++index < length) {
            var pair = pairs[index];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }
      var flow = createFlow();
      var flowRight = createFlow(true);
      function identity(value) {
        return value;
      }
      function iteratee(func) {
        return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
      }
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }
      var method = baseRest(function(path, args) {
        return function(object) {
          return baseInvoke(object, path, args);
        };
      });
      var methodOf = baseRest(function(object, args) {
        return function(path) {
          return baseInvoke(object, path, args);
        };
      });
      function mixin(object, source, options) {
        var props = keys(source), methodNames = baseFunctions(source, props);
        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain2 = !(isObject(options) && ("chain" in options)) || !!options.chain, isFunc = isFunction(object);
        arrayEach(methodNames, function(methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain2 || chainAll) {
                var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                actions.push({ func, args: arguments, thisArg: object });
                result2.__chain__ = chainAll;
                return result2;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }
      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }
        return this;
      }
      function noop() {}
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function(args) {
          return baseNth(args, n);
        });
      }
      var over = createOver(arrayMap);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function propertyOf(object) {
        return function(path) {
          return object == null ? undefined2 : baseGet(object, path);
        };
      }
      var range = createRange();
      var rangeRight = createRange(true);
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return "";
      }
      function stubTrue() {
        return true;
      }
      function times(n, iteratee2) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }
        var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
        iteratee2 = getIteratee(iteratee2);
        n -= MAX_ARRAY_LENGTH;
        var result2 = baseTimes(length, iteratee2);
        while (++index < n) {
          iteratee2(index);
        }
        return result2;
      }
      function toPath(value) {
        if (isArray(value)) {
          return arrayMap(value, toKey);
        }
        return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
      }
      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString(prefix) + id;
      }
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound("ceil");
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound("floor");
      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
      }
      function maxBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
      }
      function mean(array) {
        return baseMean(array, identity);
      }
      function meanBy(array, iteratee2) {
        return baseMean(array, getIteratee(iteratee2, 2));
      }
      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
      }
      function minBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
      }
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound("round");
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      function sumBy(array, iteratee2) {
        return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
      }
      lodash.after = after;
      lodash.ary = ary;
      lodash.assign = assign;
      lodash.assignIn = assignIn;
      lodash.assignInWith = assignInWith;
      lodash.assignWith = assignWith;
      lodash.at = at;
      lodash.before = before;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.castArray = castArray;
      lodash.chain = chain;
      lodash.chunk = chunk;
      lodash.compact = compact;
      lodash.concat = concat;
      lodash.cond = cond;
      lodash.conforms = conforms;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.curry = curry;
      lodash.curryRight = curryRight;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defaultsDeep = defaultsDeep;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.differenceBy = differenceBy;
      lodash.differenceWith = differenceWith;
      lodash.drop = drop;
      lodash.dropRight = dropRight;
      lodash.dropRightWhile = dropRightWhile;
      lodash.dropWhile = dropWhile;
      lodash.fill = fill;
      lodash.filter = filter;
      lodash.flatMap = flatMap;
      lodash.flatMapDeep = flatMapDeep;
      lodash.flatMapDepth = flatMapDepth;
      lodash.flatten = flatten;
      lodash.flattenDeep = flattenDeep;
      lodash.flattenDepth = flattenDepth;
      lodash.flip = flip;
      lodash.flow = flow;
      lodash.flowRight = flowRight;
      lodash.fromPairs = fromPairs;
      lodash.functions = functions;
      lodash.functionsIn = functionsIn;
      lodash.groupBy = groupBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.intersectionBy = intersectionBy;
      lodash.intersectionWith = intersectionWith;
      lodash.invert = invert;
      lodash.invertBy = invertBy;
      lodash.invokeMap = invokeMap;
      lodash.iteratee = iteratee;
      lodash.keyBy = keyBy;
      lodash.keys = keys;
      lodash.keysIn = keysIn;
      lodash.map = map;
      lodash.mapKeys = mapKeys;
      lodash.mapValues = mapValues;
      lodash.matches = matches;
      lodash.matchesProperty = matchesProperty;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.mergeWith = mergeWith;
      lodash.method = method;
      lodash.methodOf = methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = nthArg;
      lodash.omit = omit;
      lodash.omitBy = omitBy;
      lodash.once = once;
      lodash.orderBy = orderBy;
      lodash.over = over;
      lodash.overArgs = overArgs;
      lodash.overEvery = overEvery;
      lodash.overSome = overSome;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.partition = partition;
      lodash.pick = pick;
      lodash.pickBy = pickBy;
      lodash.property = property;
      lodash.propertyOf = propertyOf;
      lodash.pull = pull;
      lodash.pullAll = pullAll;
      lodash.pullAllBy = pullAllBy;
      lodash.pullAllWith = pullAllWith;
      lodash.pullAt = pullAt;
      lodash.range = range;
      lodash.rangeRight = rangeRight;
      lodash.rearg = rearg;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.reverse = reverse;
      lodash.sampleSize = sampleSize;
      lodash.set = set;
      lodash.setWith = setWith;
      lodash.shuffle = shuffle;
      lodash.slice = slice;
      lodash.sortBy = sortBy;
      lodash.sortedUniq = sortedUniq;
      lodash.sortedUniqBy = sortedUniqBy;
      lodash.split = split;
      lodash.spread = spread;
      lodash.tail = tail;
      lodash.take = take;
      lodash.takeRight = takeRight;
      lodash.takeRightWhile = takeRightWhile;
      lodash.takeWhile = takeWhile;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.thru = thru;
      lodash.toArray = toArray;
      lodash.toPairs = toPairs;
      lodash.toPairsIn = toPairsIn;
      lodash.toPath = toPath;
      lodash.toPlainObject = toPlainObject;
      lodash.transform = transform;
      lodash.unary = unary;
      lodash.union = union;
      lodash.unionBy = unionBy;
      lodash.unionWith = unionWith;
      lodash.uniq = uniq;
      lodash.uniqBy = uniqBy;
      lodash.uniqWith = uniqWith;
      lodash.unset = unset;
      lodash.unzip = unzip;
      lodash.unzipWith = unzipWith;
      lodash.update = update;
      lodash.updateWith = updateWith;
      lodash.values = values;
      lodash.valuesIn = valuesIn;
      lodash.without = without;
      lodash.words = words;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.xorBy = xorBy;
      lodash.xorWith = xorWith;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.zipObjectDeep = zipObjectDeep;
      lodash.zipWith = zipWith;
      lodash.entries = toPairs;
      lodash.entriesIn = toPairsIn;
      lodash.extend = assignIn;
      lodash.extendWith = assignInWith;
      mixin(lodash, lodash);
      lodash.add = add;
      lodash.attempt = attempt;
      lodash.camelCase = camelCase;
      lodash.capitalize = capitalize;
      lodash.ceil = ceil;
      lodash.clamp = clamp;
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.cloneDeepWith = cloneDeepWith;
      lodash.cloneWith = cloneWith;
      lodash.conformsTo = conformsTo;
      lodash.deburr = deburr;
      lodash.defaultTo = defaultTo;
      lodash.divide = divide;
      lodash.endsWith = endsWith;
      lodash.eq = eq;
      lodash.escape = escape;
      lodash.escapeRegExp = escapeRegExp;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.floor = floor;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.get = get;
      lodash.gt = gt;
      lodash.gte = gte;
      lodash.has = has;
      lodash.hasIn = hasIn;
      lodash.head = head;
      lodash.identity = identity;
      lodash.includes = includes;
      lodash.indexOf = indexOf;
      lodash.inRange = inRange;
      lodash.invoke = invoke;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isArrayBuffer = isArrayBuffer;
      lodash.isArrayLike = isArrayLike;
      lodash.isArrayLikeObject = isArrayLikeObject;
      lodash.isBoolean = isBoolean;
      lodash.isBuffer = isBuffer;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual;
      lodash.isEqualWith = isEqualWith;
      lodash.isError = isError;
      lodash.isFinite = isFinite;
      lodash.isFunction = isFunction;
      lodash.isInteger = isInteger;
      lodash.isLength = isLength;
      lodash.isMap = isMap;
      lodash.isMatch = isMatch;
      lodash.isMatchWith = isMatchWith;
      lodash.isNaN = isNaN2;
      lodash.isNative = isNative;
      lodash.isNil = isNil;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isObjectLike = isObjectLike;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isSafeInteger = isSafeInteger;
      lodash.isSet = isSet;
      lodash.isString = isString;
      lodash.isSymbol = isSymbol;
      lodash.isTypedArray = isTypedArray;
      lodash.isUndefined = isUndefined;
      lodash.isWeakMap = isWeakMap;
      lodash.isWeakSet = isWeakSet;
      lodash.join = join;
      lodash.kebabCase = kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = lastIndexOf;
      lodash.lowerCase = lowerCase;
      lodash.lowerFirst = lowerFirst;
      lodash.lt = lt;
      lodash.lte = lte;
      lodash.max = max;
      lodash.maxBy = maxBy;
      lodash.mean = mean;
      lodash.meanBy = meanBy;
      lodash.min = min;
      lodash.minBy = minBy;
      lodash.stubArray = stubArray;
      lodash.stubFalse = stubFalse;
      lodash.stubObject = stubObject;
      lodash.stubString = stubString;
      lodash.stubTrue = stubTrue;
      lodash.multiply = multiply;
      lodash.nth = nth;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.pad = pad;
      lodash.padEnd = padEnd;
      lodash.padStart = padStart;
      lodash.parseInt = parseInt2;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.repeat = repeat;
      lodash.replace = replace;
      lodash.result = result;
      lodash.round = round;
      lodash.runInContext = runInContext;
      lodash.sample = sample;
      lodash.size = size;
      lodash.snakeCase = snakeCase;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.sortedIndexBy = sortedIndexBy;
      lodash.sortedIndexOf = sortedIndexOf;
      lodash.sortedLastIndex = sortedLastIndex;
      lodash.sortedLastIndexBy = sortedLastIndexBy;
      lodash.sortedLastIndexOf = sortedLastIndexOf;
      lodash.startCase = startCase;
      lodash.startsWith = startsWith;
      lodash.subtract = subtract;
      lodash.sum = sum;
      lodash.sumBy = sumBy;
      lodash.template = template;
      lodash.times = times;
      lodash.toFinite = toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = toLength;
      lodash.toLower = toLower;
      lodash.toNumber = toNumber;
      lodash.toSafeInteger = toSafeInteger;
      lodash.toString = toString;
      lodash.toUpper = toUpper;
      lodash.trim = trim;
      lodash.trimEnd = trimEnd;
      lodash.trimStart = trimStart;
      lodash.truncate = truncate;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.upperCase = upperCase;
      lodash.upperFirst = upperFirst;
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.first = head;
      mixin(lodash, function() {
        var source = {};
        baseForOwn(lodash, function(func, methodName) {
          if (!hasOwnProperty.call(lodash.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), { chain: false });
      lodash.VERSION = VERSION;
      arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
        lodash[methodName].placeholder = lodash;
      });
      arrayEach(["drop", "take"], function(methodName, index) {
        LazyWrapper.prototype[methodName] = function(n) {
          n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
          var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
          if (result2.__filtered__) {
            result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
          } else {
            result2.__views__.push({
              size: nativeMin(n, MAX_ARRAY_LENGTH),
              type: methodName + (result2.__dir__ < 0 ? "Right" : "")
            });
          }
          return result2;
        };
        LazyWrapper.prototype[methodName + "Right"] = function(n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
        var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function(iteratee2) {
          var result2 = this.clone();
          result2.__iteratees__.push({
            iteratee: getIteratee(iteratee2, 3),
            type
          });
          result2.__filtered__ = result2.__filtered__ || isFilter;
          return result2;
        };
      });
      arrayEach(["head", "last"], function(methodName, index) {
        var takeName = "take" + (index ? "Right" : "");
        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(["initial", "tail"], function(methodName, index) {
        var dropName = "drop" + (index ? "" : "Right");
        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
        if (typeof path == "function") {
          return new LazyWrapper(this);
        }
        return this.map(function(value) {
          return baseInvoke(value, path, args);
        });
      });
      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function(start, end) {
        start = toInteger(start);
        var result2 = this;
        if (result2.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result2);
        }
        if (start < 0) {
          result2 = result2.takeRight(-start);
        } else if (start) {
          result2 = result2.drop(start);
        }
        if (end !== undefined2) {
          end = toInteger(end);
          result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
        }
        return result2;
      };
      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash.prototype[methodName] = function() {
          var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
          var interceptor = function(value2) {
            var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
            return isTaker && chainAll ? result3[0] : result3;
          };
          if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result2 = func.apply(value, args);
            result2.__actions__.push({ func: thru, args: [interceptor], thisArg: undefined2 });
            return new LodashWrapper(result2, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result2 = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
        };
      });
      arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
        var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray(value) ? value : [], args);
          }
          return this[chainName](function(value2) {
            return func.apply(isArray(value2) ? value2 : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var lodashFunc = lodash[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + "";
          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({ name: methodName, func: lodashFunc });
        }
      });
      realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
        name: "wrapper",
        func: undefined2
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash.prototype.at = wrapperAt;
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.commit = wrapperCommit;
      lodash.prototype.next = wrapperNext;
      lodash.prototype.plant = wrapperPlant;
      lodash.prototype.reverse = wrapperReverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
      lodash.prototype.first = lodash.prototype.head;
      if (symIterator) {
        lodash.prototype[symIterator] = wrapperToIterator;
      }
      return lodash;
    };
    var _ = runInContext();
    if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
      root._ = _;
      define(function() {
        return _;
      });
    } else if (freeModule) {
      (freeModule.exports = _)._ = _;
      freeExports._ = _;
    } else {
      root._ = _;
    }
  }).call(exports);
});

// node_modules/lodash/_freeGlobal.js
var require__freeGlobal = __commonJS((exports, module) => {
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  module.exports = freeGlobal;
});

// node_modules/lodash/_root.js
var require__root = __commonJS((exports, module) => {
  var freeGlobal = require__freeGlobal();
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  module.exports = root;
});

// node_modules/lodash/_Symbol.js
var require__Symbol = __commonJS((exports, module) => {
  var root = require__root();
  var Symbol2 = root.Symbol;
  module.exports = Symbol2;
});

// node_modules/lodash/_getRawTag.js
var require__getRawTag = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  module.exports = getRawTag;
});

// node_modules/lodash/_objectToString.js
var require__objectToString = __commonJS((exports, module) => {
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  module.exports = objectToString;
});

// node_modules/lodash/_baseGetTag.js
var require__baseGetTag = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var getRawTag = require__getRawTag();
  var objectToString = require__objectToString();
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined;
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  module.exports = baseGetTag;
});

// node_modules/lodash/isObject.js
var require_isObject = __commonJS((exports, module) => {
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  module.exports = isObject;
});

// node_modules/lodash/isFunction.js
var require_isFunction = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isObject = require_isObject();
  var asyncTag = "[object AsyncFunction]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  module.exports = isFunction;
});

// node_modules/lodash/_coreJsData.js
var require__coreJsData = __commonJS((exports, module) => {
  var root = require__root();
  var coreJsData = root["__core-js_shared__"];
  module.exports = coreJsData;
});

// node_modules/lodash/_isMasked.js
var require__isMasked = __commonJS((exports, module) => {
  var coreJsData = require__coreJsData();
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  module.exports = isMasked;
});

// node_modules/lodash/_toSource.js
var require__toSource = __commonJS((exports, module) => {
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return func + "";
      } catch (e) {}
    }
    return "";
  }
  module.exports = toSource;
});

// node_modules/lodash/_baseIsNative.js
var require__baseIsNative = __commonJS((exports, module) => {
  var isFunction = require_isFunction();
  var isMasked = require__isMasked();
  var isObject = require_isObject();
  var toSource = require__toSource();
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  module.exports = baseIsNative;
});

// node_modules/lodash/_getValue.js
var require__getValue = __commonJS((exports, module) => {
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  module.exports = getValue;
});

// node_modules/lodash/_getNative.js
var require__getNative = __commonJS((exports, module) => {
  var baseIsNative = require__baseIsNative();
  var getValue = require__getValue();
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  module.exports = getNative;
});

// node_modules/lodash/_defineProperty.js
var require__defineProperty = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {}
  }();
  module.exports = defineProperty;
});

// node_modules/lodash/_baseAssignValue.js
var require__baseAssignValue = __commonJS((exports, module) => {
  var defineProperty = require__defineProperty();
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty) {
      defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      });
    } else {
      object[key] = value;
    }
  }
  module.exports = baseAssignValue;
});

// node_modules/lodash/eq.js
var require_eq = __commonJS((exports, module) => {
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  module.exports = eq;
});

// node_modules/lodash/_assignValue.js
var require__assignValue = __commonJS((exports, module) => {
  var baseAssignValue = require__baseAssignValue();
  var eq = require_eq();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  module.exports = assignValue;
});

// node_modules/lodash/_copyObject.js
var require__copyObject = __commonJS((exports, module) => {
  var assignValue = require__assignValue();
  var baseAssignValue = require__baseAssignValue();
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  module.exports = copyObject;
});

// node_modules/lodash/identity.js
var require_identity = __commonJS((exports, module) => {
  function identity(value) {
    return value;
  }
  module.exports = identity;
});

// node_modules/lodash/_apply.js
var require__apply = __commonJS((exports, module) => {
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  module.exports = apply;
});

// node_modules/lodash/_overRest.js
var require__overRest = __commonJS((exports, module) => {
  var apply = require__apply();
  var nativeMax = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  module.exports = overRest;
});

// node_modules/lodash/constant.js
var require_constant = __commonJS((exports, module) => {
  function constant(value) {
    return function() {
      return value;
    };
  }
  module.exports = constant;
});

// node_modules/lodash/_baseSetToString.js
var require__baseSetToString = __commonJS((exports, module) => {
  var constant = require_constant();
  var defineProperty = require__defineProperty();
  var identity = require_identity();
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, "toString", {
      configurable: true,
      enumerable: false,
      value: constant(string),
      writable: true
    });
  };
  module.exports = baseSetToString;
});

// node_modules/lodash/_shortOut.js
var require__shortOut = __commonJS((exports, module) => {
  var HOT_COUNT = 800;
  var HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }
  module.exports = shortOut;
});

// node_modules/lodash/_setToString.js
var require__setToString = __commonJS((exports, module) => {
  var baseSetToString = require__baseSetToString();
  var shortOut = require__shortOut();
  var setToString = shortOut(baseSetToString);
  module.exports = setToString;
});

// node_modules/lodash/_baseRest.js
var require__baseRest = __commonJS((exports, module) => {
  var identity = require_identity();
  var overRest = require__overRest();
  var setToString = require__setToString();
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + "");
  }
  module.exports = baseRest;
});

// node_modules/lodash/isLength.js
var require_isLength = __commonJS((exports, module) => {
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  module.exports = isLength;
});

// node_modules/lodash/isArrayLike.js
var require_isArrayLike = __commonJS((exports, module) => {
  var isFunction = require_isFunction();
  var isLength = require_isLength();
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  module.exports = isArrayLike;
});

// node_modules/lodash/_isIndex.js
var require__isIndex = __commonJS((exports, module) => {
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  module.exports = isIndex;
});

// node_modules/lodash/_isIterateeCall.js
var require__isIterateeCall = __commonJS((exports, module) => {
  var eq = require_eq();
  var isArrayLike = require_isArrayLike();
  var isIndex = require__isIndex();
  var isObject = require_isObject();
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && (index in object)) {
      return eq(object[index], value);
    }
    return false;
  }
  module.exports = isIterateeCall;
});

// node_modules/lodash/_createAssigner.js
var require__createAssigner = __commonJS((exports, module) => {
  var baseRest = require__baseRest();
  var isIterateeCall = require__isIterateeCall();
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined, guard = length > 2 ? sources[2] : undefined;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  module.exports = createAssigner;
});

// node_modules/lodash/_baseTimes.js
var require__baseTimes = __commonJS((exports, module) => {
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  module.exports = baseTimes;
});

// node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS((exports, module) => {
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  module.exports = isObjectLike;
});

// node_modules/lodash/_baseIsArguments.js
var require__baseIsArguments = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isObjectLike = require_isObjectLike();
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  module.exports = baseIsArguments;
});

// node_modules/lodash/isArguments.js
var require_isArguments = __commonJS((exports, module) => {
  var baseIsArguments = require__baseIsArguments();
  var isObjectLike = require_isObjectLike();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  module.exports = isArguments;
});

// node_modules/lodash/isArray.js
var require_isArray = __commonJS((exports, module) => {
  var isArray = Array.isArray;
  module.exports = isArray;
});

// node_modules/lodash/stubFalse.js
var require_stubFalse = __commonJS((exports, module) => {
  function stubFalse() {
    return false;
  }
  module.exports = stubFalse;
});

// node_modules/lodash/isBuffer.js
var require_isBuffer = __commonJS((exports, module) => {
  var root = require__root();
  var stubFalse = require_stubFalse();
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root.Buffer : undefined;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined;
  var isBuffer = nativeIsBuffer || stubFalse;
  module.exports = isBuffer;
});

// node_modules/lodash/_baseIsTypedArray.js
var require__baseIsTypedArray = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isLength = require_isLength();
  var isObjectLike = require_isObjectLike();
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag = "[object Function]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  module.exports = baseIsTypedArray;
});

// node_modules/lodash/_baseUnary.js
var require__baseUnary = __commonJS((exports, module) => {
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  module.exports = baseUnary;
});

// node_modules/lodash/_nodeUtil.js
var require__nodeUtil = __commonJS((exports, module) => {
  var freeGlobal = require__freeGlobal();
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal.process;
  var nodeUtil = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {}
  }();
  module.exports = nodeUtil;
});

// node_modules/lodash/isTypedArray.js
var require_isTypedArray = __commonJS((exports, module) => {
  var baseIsTypedArray = require__baseIsTypedArray();
  var baseUnary = require__baseUnary();
  var nodeUtil = require__nodeUtil();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  module.exports = isTypedArray;
});

// node_modules/lodash/_arrayLikeKeys.js
var require__arrayLikeKeys = __commonJS((exports, module) => {
  var baseTimes = require__baseTimes();
  var isArguments = require_isArguments();
  var isArray = require_isArray();
  var isBuffer = require_isBuffer();
  var isIndex = require__isIndex();
  var isTypedArray = require_isTypedArray();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  module.exports = arrayLikeKeys;
});

// node_modules/lodash/_isPrototype.js
var require__isPrototype = __commonJS((exports, module) => {
  var objectProto = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  module.exports = isPrototype;
});

// node_modules/lodash/_nativeKeysIn.js
var require__nativeKeysIn = __commonJS((exports, module) => {
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  module.exports = nativeKeysIn;
});

// node_modules/lodash/_baseKeysIn.js
var require__baseKeysIn = __commonJS((exports, module) => {
  var isObject = require_isObject();
  var isPrototype = require__isPrototype();
  var nativeKeysIn = require__nativeKeysIn();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  module.exports = baseKeysIn;
});

// node_modules/lodash/keysIn.js
var require_keysIn = __commonJS((exports, module) => {
  var arrayLikeKeys = require__arrayLikeKeys();
  var baseKeysIn = require__baseKeysIn();
  var isArrayLike = require_isArrayLike();
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  module.exports = keysIn;
});

// node_modules/lodash/assignIn.js
var require_assignIn = __commonJS((exports, module) => {
  var copyObject = require__copyObject();
  var createAssigner = require__createAssigner();
  var keysIn = require_keysIn();
  var assignIn = createAssigner(function(object, source) {
    copyObject(source, keysIn(source), object);
  });
  module.exports = assignIn;
});

// node_modules/lodash/isString.js
var require_isString = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isArray = require_isArray();
  var isObjectLike = require_isObjectLike();
  var stringTag = "[object String]";
  function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
  }
  module.exports = isString;
});

// node_modules/lodash/isUndefined.js
var require_isUndefined = __commonJS((exports, module) => {
  function isUndefined(value) {
    return value === undefined;
  }
  module.exports = isUndefined;
});

// node_modules/lodash/_overArg.js
var require__overArg = __commonJS((exports, module) => {
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  module.exports = overArg;
});

// node_modules/lodash/_nativeKeys.js
var require__nativeKeys = __commonJS((exports, module) => {
  var overArg = require__overArg();
  var nativeKeys = overArg(Object.keys, Object);
  module.exports = nativeKeys;
});

// node_modules/lodash/_baseKeys.js
var require__baseKeys = __commonJS((exports, module) => {
  var isPrototype = require__isPrototype();
  var nativeKeys = require__nativeKeys();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  module.exports = baseKeys;
});

// node_modules/lodash/_DataView.js
var require__DataView = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var root = require__root();
  var DataView2 = getNative(root, "DataView");
  module.exports = DataView2;
});

// node_modules/lodash/_Map.js
var require__Map = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var root = require__root();
  var Map2 = getNative(root, "Map");
  module.exports = Map2;
});

// node_modules/lodash/_Promise.js
var require__Promise = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var root = require__root();
  var Promise2 = getNative(root, "Promise");
  module.exports = Promise2;
});

// node_modules/lodash/_Set.js
var require__Set = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var root = require__root();
  var Set2 = getNative(root, "Set");
  module.exports = Set2;
});

// node_modules/lodash/_WeakMap.js
var require__WeakMap = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var root = require__root();
  var WeakMap2 = getNative(root, "WeakMap");
  module.exports = WeakMap2;
});

// node_modules/lodash/_getTag.js
var require__getTag = __commonJS((exports, module) => {
  var DataView2 = require__DataView();
  var Map2 = require__Map();
  var Promise2 = require__Promise();
  var Set2 = require__Set();
  var WeakMap2 = require__WeakMap();
  var baseGetTag = require__baseGetTag();
  var toSource = require__toSource();
  var mapTag = "[object Map]";
  var objectTag = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag = "[object Set]";
  var weakMapTag = "[object WeakMap]";
  var dataViewTag = "[object DataView]";
  var dataViewCtorString = toSource(DataView2);
  var mapCtorString = toSource(Map2);
  var promiseCtorString = toSource(Promise2);
  var setCtorString = toSource(Set2);
  var weakMapCtorString = toSource(WeakMap2);
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2) != setTag || WeakMap2 && getTag(new WeakMap2) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  module.exports = getTag;
});

// node_modules/lodash/isEmpty.js
var require_isEmpty = __commonJS((exports, module) => {
  var baseKeys = require__baseKeys();
  var getTag = require__getTag();
  var isArguments = require_isArguments();
  var isArray = require_isArray();
  var isArrayLike = require_isArrayLike();
  var isBuffer = require_isBuffer();
  var isPrototype = require__isPrototype();
  var isTypedArray = require_isTypedArray();
  var mapTag = "[object Map]";
  var setTag = "[object Set]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
      return !value.length;
    }
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
    if (isPrototype(value)) {
      return !baseKeys(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  module.exports = isEmpty;
});

// node_modules/cloudinary/lib/utils/entries.js
var require_entries = __commonJS((exports, module) => {
  module.exports = Object.entries ? Object.entries : function(obj) {
    let ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i);
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
  };
});

// node_modules/cloudinary/lib/config.js
var require_config = __commonJS((exports, module) => {
  var extend = require_assignIn();
  var isObject = require_isObject();
  var isString = require_isString();
  var isUndefined = require_isUndefined();
  var isEmpty = require_isEmpty();
  var entries = require_entries();
  var { URL: URL2 } = __require("url");
  var cloudinary_config = undefined;
  function putNestedValue(params, key, value) {
    let chain = key.split(/[\[\]]+/).filter((i) => i.length);
    let outer = params;
    let lastKey = chain.pop();
    for (let j = 0;j < chain.length; j++) {
      let innerKey = chain[j];
      let inner = outer[innerKey];
      if (inner == null) {
        inner = {};
        outer[innerKey] = inner;
      }
      outer = inner;
    }
    outer[lastKey] = value;
    return params;
  }
  function parseCloudinaryConfigFromEnvURL(ENV_STR) {
    let conf = {};
    const uri = new URL2(ENV_STR);
    const auth = uri.username && uri.password ? `${uri.username}:${uri.password}` : uri.username || null;
    if (uri.protocol === "cloudinary:") {
      conf = Object.assign({}, conf, {
        cloud_name: uri.hostname,
        api_key: uri.username || auth && auth.split(":")[0],
        api_secret: uri.password || auth && auth.split(":")[1],
        private_cdn: uri.pathname != null && uri.pathname !== "" && uri.pathname !== "/",
        secure_distribution: uri.pathname && uri.pathname !== "/" ? uri.pathname.substring(1) : undefined
      });
    } else if (uri.protocol === "account:") {
      conf = Object.assign({}, conf, {
        account_id: uri.hostname,
        provisioning_api_key: uri.username || auth && auth.split(":")[0],
        provisioning_api_secret: uri.password || auth && auth.split(":")[1]
      });
    }
    return conf;
  }
  function extendCloudinaryConfigFromQuery(ENV_URL, confToExtend = {}) {
    const url = new URL2(ENV_URL);
    if (url.search) {
      const query = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });
      entries(query).forEach(([key, value]) => putNestedValue(confToExtend, key, value));
    }
  }
  function extendCloudinaryConfig(parsedConfig, confToExtend = {}) {
    entries(parsedConfig).forEach(([key, value]) => {
      if (value !== undefined) {
        confToExtend[key] = value;
      }
    });
    return confToExtend;
  }
  module.exports = function(new_config, new_value) {
    if (cloudinary_config == null || new_config === true) {
      if (cloudinary_config == null) {
        cloudinary_config = {};
      } else {
        Object.keys(cloudinary_config).forEach((key) => delete cloudinary_config[key]);
      }
      let CLOUDINARY_ENV_URL = process.env.CLOUDINARY_URL;
      let CLOUDINARY_ENV_ACCOUNT_URL = process.env.CLOUDINARY_ACCOUNT_URL;
      let CLOUDINARY_API_PROXY = process.env.CLOUDINARY_API_PROXY;
      if (CLOUDINARY_ENV_URL && !CLOUDINARY_ENV_URL.toLowerCase().startsWith("cloudinary://")) {
        throw new Error("Invalid CLOUDINARY_URL protocol. URL should begin with 'cloudinary://'");
      }
      if (CLOUDINARY_ENV_ACCOUNT_URL && !CLOUDINARY_ENV_ACCOUNT_URL.toLowerCase().startsWith("account://")) {
        throw new Error("Invalid CLOUDINARY_ACCOUNT_URL protocol. URL should begin with 'account://'");
      }
      if (!isEmpty(CLOUDINARY_API_PROXY)) {
        extendCloudinaryConfig({ api_proxy: CLOUDINARY_API_PROXY }, cloudinary_config);
      }
      [CLOUDINARY_ENV_URL, CLOUDINARY_ENV_ACCOUNT_URL].forEach((ENV_URL) => {
        if (ENV_URL) {
          let parsedConfig = parseCloudinaryConfigFromEnvURL(ENV_URL);
          extendCloudinaryConfig(parsedConfig, cloudinary_config);
          extendCloudinaryConfigFromQuery(ENV_URL, cloudinary_config);
        }
      });
    }
    if (!isUndefined(new_value)) {
      cloudinary_config[new_config] = new_value;
    } else if (isString(new_config)) {
      return cloudinary_config[new_config];
    } else if (isObject(new_config)) {
      extend(cloudinary_config, new_config);
    }
    return cloudinary_config;
  };
});

// node_modules/lodash/compact.js
var require_compact = __commonJS((exports, module) => {
  function compact(array) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  module.exports = compact;
});

// node_modules/lodash/head.js
var require_head = __commonJS((exports, module) => {
  function head(array) {
    return array && array.length ? array[0] : undefined;
  }
  module.exports = head;
});

// node_modules/lodash/_getPrototype.js
var require__getPrototype = __commonJS((exports, module) => {
  var overArg = require__overArg();
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  module.exports = getPrototype;
});

// node_modules/lodash/isPlainObject.js
var require_isPlainObject = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var getPrototype = require__getPrototype();
  var isObjectLike = require_isObjectLike();
  var objectTag = "[object Object]";
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  module.exports = isPlainObject;
});

// node_modules/lodash/last.js
var require_last = __commonJS((exports, module) => {
  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
  }
  module.exports = last;
});

// node_modules/lodash/_arrayMap.js
var require__arrayMap = __commonJS((exports, module) => {
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  module.exports = arrayMap;
});

// node_modules/lodash/_listCacheClear.js
var require__listCacheClear = __commonJS((exports, module) => {
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  module.exports = listCacheClear;
});

// node_modules/lodash/_assocIndexOf.js
var require__assocIndexOf = __commonJS((exports, module) => {
  var eq = require_eq();
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  module.exports = assocIndexOf;
});

// node_modules/lodash/_listCacheDelete.js
var require__listCacheDelete = __commonJS((exports, module) => {
  var assocIndexOf = require__assocIndexOf();
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  module.exports = listCacheDelete;
});

// node_modules/lodash/_listCacheGet.js
var require__listCacheGet = __commonJS((exports, module) => {
  var assocIndexOf = require__assocIndexOf();
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  module.exports = listCacheGet;
});

// node_modules/lodash/_listCacheHas.js
var require__listCacheHas = __commonJS((exports, module) => {
  var assocIndexOf = require__assocIndexOf();
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  module.exports = listCacheHas;
});

// node_modules/lodash/_listCacheSet.js
var require__listCacheSet = __commonJS((exports, module) => {
  var assocIndexOf = require__assocIndexOf();
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  module.exports = listCacheSet;
});

// node_modules/lodash/_ListCache.js
var require__ListCache = __commonJS((exports, module) => {
  var listCacheClear = require__listCacheClear();
  var listCacheDelete = require__listCacheDelete();
  var listCacheGet = require__listCacheGet();
  var listCacheHas = require__listCacheHas();
  var listCacheSet = require__listCacheSet();
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  module.exports = ListCache;
});

// node_modules/lodash/_stackClear.js
var require__stackClear = __commonJS((exports, module) => {
  var ListCache = require__ListCache();
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }
  module.exports = stackClear;
});

// node_modules/lodash/_stackDelete.js
var require__stackDelete = __commonJS((exports, module) => {
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  module.exports = stackDelete;
});

// node_modules/lodash/_stackGet.js
var require__stackGet = __commonJS((exports, module) => {
  function stackGet(key) {
    return this.__data__.get(key);
  }
  module.exports = stackGet;
});

// node_modules/lodash/_stackHas.js
var require__stackHas = __commonJS((exports, module) => {
  function stackHas(key) {
    return this.__data__.has(key);
  }
  module.exports = stackHas;
});

// node_modules/lodash/_nativeCreate.js
var require__nativeCreate = __commonJS((exports, module) => {
  var getNative = require__getNative();
  var nativeCreate = getNative(Object, "create");
  module.exports = nativeCreate;
});

// node_modules/lodash/_hashClear.js
var require__hashClear = __commonJS((exports, module) => {
  var nativeCreate = require__nativeCreate();
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  module.exports = hashClear;
});

// node_modules/lodash/_hashDelete.js
var require__hashDelete = __commonJS((exports, module) => {
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  module.exports = hashDelete;
});

// node_modules/lodash/_hashGet.js
var require__hashGet = __commonJS((exports, module) => {
  var nativeCreate = require__nativeCreate();
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  module.exports = hashGet;
});

// node_modules/lodash/_hashHas.js
var require__hashHas = __commonJS((exports, module) => {
  var nativeCreate = require__nativeCreate();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }
  module.exports = hashHas;
});

// node_modules/lodash/_hashSet.js
var require__hashSet = __commonJS((exports, module) => {
  var nativeCreate = require__nativeCreate();
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  }
  module.exports = hashSet;
});

// node_modules/lodash/_Hash.js
var require__Hash = __commonJS((exports, module) => {
  var hashClear = require__hashClear();
  var hashDelete = require__hashDelete();
  var hashGet = require__hashGet();
  var hashHas = require__hashHas();
  var hashSet = require__hashSet();
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  module.exports = Hash;
});

// node_modules/lodash/_mapCacheClear.js
var require__mapCacheClear = __commonJS((exports, module) => {
  var Hash = require__Hash();
  var ListCache = require__ListCache();
  var Map2 = require__Map();
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      hash: new Hash,
      map: new (Map2 || ListCache),
      string: new Hash
    };
  }
  module.exports = mapCacheClear;
});

// node_modules/lodash/_isKeyable.js
var require__isKeyable = __commonJS((exports, module) => {
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  module.exports = isKeyable;
});

// node_modules/lodash/_getMapData.js
var require__getMapData = __commonJS((exports, module) => {
  var isKeyable = require__isKeyable();
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  module.exports = getMapData;
});

// node_modules/lodash/_mapCacheDelete.js
var require__mapCacheDelete = __commonJS((exports, module) => {
  var getMapData = require__getMapData();
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  module.exports = mapCacheDelete;
});

// node_modules/lodash/_mapCacheGet.js
var require__mapCacheGet = __commonJS((exports, module) => {
  var getMapData = require__getMapData();
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  module.exports = mapCacheGet;
});

// node_modules/lodash/_mapCacheHas.js
var require__mapCacheHas = __commonJS((exports, module) => {
  var getMapData = require__getMapData();
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  module.exports = mapCacheHas;
});

// node_modules/lodash/_mapCacheSet.js
var require__mapCacheSet = __commonJS((exports, module) => {
  var getMapData = require__getMapData();
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  module.exports = mapCacheSet;
});

// node_modules/lodash/_MapCache.js
var require__MapCache = __commonJS((exports, module) => {
  var mapCacheClear = require__mapCacheClear();
  var mapCacheDelete = require__mapCacheDelete();
  var mapCacheGet = require__mapCacheGet();
  var mapCacheHas = require__mapCacheHas();
  var mapCacheSet = require__mapCacheSet();
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  module.exports = MapCache;
});

// node_modules/lodash/_stackSet.js
var require__stackSet = __commonJS((exports, module) => {
  var ListCache = require__ListCache();
  var Map2 = require__Map();
  var MapCache = require__MapCache();
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  module.exports = stackSet;
});

// node_modules/lodash/_Stack.js
var require__Stack = __commonJS((exports, module) => {
  var ListCache = require__ListCache();
  var stackClear = require__stackClear();
  var stackDelete = require__stackDelete();
  var stackGet = require__stackGet();
  var stackHas = require__stackHas();
  var stackSet = require__stackSet();
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  module.exports = Stack;
});

// node_modules/lodash/_setCacheAdd.js
var require__setCacheAdd = __commonJS((exports, module) => {
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  module.exports = setCacheAdd;
});

// node_modules/lodash/_setCacheHas.js
var require__setCacheHas = __commonJS((exports, module) => {
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  module.exports = setCacheHas;
});

// node_modules/lodash/_SetCache.js
var require__SetCache = __commonJS((exports, module) => {
  var MapCache = require__MapCache();
  var setCacheAdd = require__setCacheAdd();
  var setCacheHas = require__setCacheHas();
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  module.exports = SetCache;
});

// node_modules/lodash/_arraySome.js
var require__arraySome = __commonJS((exports, module) => {
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  module.exports = arraySome;
});

// node_modules/lodash/_cacheHas.js
var require__cacheHas = __commonJS((exports, module) => {
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  module.exports = cacheHas;
});

// node_modules/lodash/_equalArrays.js
var require__equalArrays = __commonJS((exports, module) => {
  var SetCache = require__SetCache();
  var arraySome = require__arraySome();
  var cacheHas = require__cacheHas();
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache : undefined;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  module.exports = equalArrays;
});

// node_modules/lodash/_Uint8Array.js
var require__Uint8Array = __commonJS((exports, module) => {
  var root = require__root();
  var Uint8Array2 = root.Uint8Array;
  module.exports = Uint8Array2;
});

// node_modules/lodash/_mapToArray.js
var require__mapToArray = __commonJS((exports, module) => {
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  module.exports = mapToArray;
});

// node_modules/lodash/_setToArray.js
var require__setToArray = __commonJS((exports, module) => {
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  module.exports = setToArray;
});

// node_modules/lodash/_equalByTag.js
var require__equalByTag = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var Uint8Array2 = require__Uint8Array();
  var eq = require_eq();
  var equalArrays = require__equalArrays();
  var mapToArray = require__mapToArray();
  var setToArray = require__setToArray();
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var symbolProto = Symbol2 ? Symbol2.prototype : undefined;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  module.exports = equalByTag;
});

// node_modules/lodash/_arrayPush.js
var require__arrayPush = __commonJS((exports, module) => {
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  module.exports = arrayPush;
});

// node_modules/lodash/_baseGetAllKeys.js
var require__baseGetAllKeys = __commonJS((exports, module) => {
  var arrayPush = require__arrayPush();
  var isArray = require_isArray();
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  module.exports = baseGetAllKeys;
});

// node_modules/lodash/_arrayFilter.js
var require__arrayFilter = __commonJS((exports, module) => {
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  module.exports = arrayFilter;
});

// node_modules/lodash/stubArray.js
var require_stubArray = __commonJS((exports, module) => {
  function stubArray() {
    return [];
  }
  module.exports = stubArray;
});

// node_modules/lodash/_getSymbols.js
var require__getSymbols = __commonJS((exports, module) => {
  var arrayFilter = require__arrayFilter();
  var stubArray = require_stubArray();
  var objectProto = Object.prototype;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  module.exports = getSymbols;
});

// node_modules/lodash/keys.js
var require_keys = __commonJS((exports, module) => {
  var arrayLikeKeys = require__arrayLikeKeys();
  var baseKeys = require__baseKeys();
  var isArrayLike = require_isArrayLike();
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  module.exports = keys;
});

// node_modules/lodash/_getAllKeys.js
var require__getAllKeys = __commonJS((exports, module) => {
  var baseGetAllKeys = require__baseGetAllKeys();
  var getSymbols = require__getSymbols();
  var keys = require_keys();
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  module.exports = getAllKeys;
});

// node_modules/lodash/_equalObjects.js
var require__equalObjects = __commonJS((exports, module) => {
  var getAllKeys = require__getAllKeys();
  var COMPARE_PARTIAL_FLAG = 1;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && (("constructor" in object) && ("constructor" in other)) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  module.exports = equalObjects;
});

// node_modules/lodash/_baseIsEqualDeep.js
var require__baseIsEqualDeep = __commonJS((exports, module) => {
  var Stack = require__Stack();
  var equalArrays = require__equalArrays();
  var equalByTag = require__equalByTag();
  var equalObjects = require__equalObjects();
  var getTag = require__getTag();
  var isArray = require_isArray();
  var isBuffer = require_isBuffer();
  var isTypedArray = require_isTypedArray();
  var COMPARE_PARTIAL_FLAG = 1;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack);
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack);
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  module.exports = baseIsEqualDeep;
});

// node_modules/lodash/_baseIsEqual.js
var require__baseIsEqual = __commonJS((exports, module) => {
  var baseIsEqualDeep = require__baseIsEqualDeep();
  var isObjectLike = require_isObjectLike();
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  module.exports = baseIsEqual;
});

// node_modules/lodash/_baseIsMatch.js
var require__baseIsMatch = __commonJS((exports, module) => {
  var Stack = require__Stack();
  var baseIsEqual = require__baseIsEqual();
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  module.exports = baseIsMatch;
});

// node_modules/lodash/_isStrictComparable.js
var require__isStrictComparable = __commonJS((exports, module) => {
  var isObject = require_isObject();
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  module.exports = isStrictComparable;
});

// node_modules/lodash/_getMatchData.js
var require__getMatchData = __commonJS((exports, module) => {
  var isStrictComparable = require__isStrictComparable();
  var keys = require_keys();
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  module.exports = getMatchData;
});

// node_modules/lodash/_matchesStrictComparable.js
var require__matchesStrictComparable = __commonJS((exports, module) => {
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== undefined || (key in Object(object)));
    };
  }
  module.exports = matchesStrictComparable;
});

// node_modules/lodash/_baseMatches.js
var require__baseMatches = __commonJS((exports, module) => {
  var baseIsMatch = require__baseIsMatch();
  var getMatchData = require__getMatchData();
  var matchesStrictComparable = require__matchesStrictComparable();
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  module.exports = baseMatches;
});

// node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isObjectLike = require_isObjectLike();
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  module.exports = isSymbol;
});

// node_modules/lodash/_isKey.js
var require__isKey = __commonJS((exports, module) => {
  var isArray = require_isArray();
  var isSymbol = require_isSymbol();
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  module.exports = isKey;
});

// node_modules/lodash/memoize.js
var require_memoize = __commonJS((exports, module) => {
  var MapCache = require__MapCache();
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }
  memoize.Cache = MapCache;
  module.exports = memoize;
});

// node_modules/lodash/_memoizeCapped.js
var require__memoizeCapped = __commonJS((exports, module) => {
  var memoize = require_memoize();
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  module.exports = memoizeCapped;
});

// node_modules/lodash/_stringToPath.js
var require__stringToPath = __commonJS((exports, module) => {
  var memoizeCapped = require__memoizeCapped();
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match2, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
    });
    return result;
  });
  module.exports = stringToPath;
});

// node_modules/lodash/_baseToString.js
var require__baseToString = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var arrayMap = require__arrayMap();
  var isArray = require_isArray();
  var isSymbol = require_isSymbol();
  var INFINITY = 1 / 0;
  var symbolProto = Symbol2 ? Symbol2.prototype : undefined;
  var symbolToString = symbolProto ? symbolProto.toString : undefined;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  module.exports = baseToString;
});

// node_modules/lodash/toString.js
var require_toString = __commonJS((exports, module) => {
  var baseToString = require__baseToString();
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  module.exports = toString;
});

// node_modules/lodash/_castPath.js
var require__castPath = __commonJS((exports, module) => {
  var isArray = require_isArray();
  var isKey = require__isKey();
  var stringToPath = require__stringToPath();
  var toString = require_toString();
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }
  module.exports = castPath;
});

// node_modules/lodash/_toKey.js
var require__toKey = __commonJS((exports, module) => {
  var isSymbol = require_isSymbol();
  var INFINITY = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  module.exports = toKey;
});

// node_modules/lodash/_baseGet.js
var require__baseGet = __commonJS((exports, module) => {
  var castPath = require__castPath();
  var toKey = require__toKey();
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : undefined;
  }
  module.exports = baseGet;
});

// node_modules/lodash/get.js
var require_get = __commonJS((exports, module) => {
  var baseGet = require__baseGet();
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }
  module.exports = get;
});

// node_modules/lodash/_baseHasIn.js
var require__baseHasIn = __commonJS((exports, module) => {
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  module.exports = baseHasIn;
});

// node_modules/lodash/_hasPath.js
var require__hasPath = __commonJS((exports, module) => {
  var castPath = require__castPath();
  var isArguments = require_isArguments();
  var isArray = require_isArray();
  var isIndex = require__isIndex();
  var isLength = require_isLength();
  var toKey = require__toKey();
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
  }
  module.exports = hasPath;
});

// node_modules/lodash/hasIn.js
var require_hasIn = __commonJS((exports, module) => {
  var baseHasIn = require__baseHasIn();
  var hasPath = require__hasPath();
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  module.exports = hasIn;
});

// node_modules/lodash/_baseMatchesProperty.js
var require__baseMatchesProperty = __commonJS((exports, module) => {
  var baseIsEqual = require__baseIsEqual();
  var get = require_get();
  var hasIn = require_hasIn();
  var isKey = require__isKey();
  var isStrictComparable = require__isStrictComparable();
  var matchesStrictComparable = require__matchesStrictComparable();
  var toKey = require__toKey();
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  module.exports = baseMatchesProperty;
});

// node_modules/lodash/_baseProperty.js
var require__baseProperty = __commonJS((exports, module) => {
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }
  module.exports = baseProperty;
});

// node_modules/lodash/_basePropertyDeep.js
var require__basePropertyDeep = __commonJS((exports, module) => {
  var baseGet = require__baseGet();
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  module.exports = basePropertyDeep;
});

// node_modules/lodash/property.js
var require_property = __commonJS((exports, module) => {
  var baseProperty = require__baseProperty();
  var basePropertyDeep = require__basePropertyDeep();
  var isKey = require__isKey();
  var toKey = require__toKey();
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  module.exports = property;
});

// node_modules/lodash/_baseIteratee.js
var require__baseIteratee = __commonJS((exports, module) => {
  var baseMatches = require__baseMatches();
  var baseMatchesProperty = require__baseMatchesProperty();
  var identity = require_identity();
  var isArray = require_isArray();
  var property = require_property();
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  module.exports = baseIteratee;
});

// node_modules/lodash/_createBaseFor.js
var require__createBaseFor = __commonJS((exports, module) => {
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  module.exports = createBaseFor;
});

// node_modules/lodash/_baseFor.js
var require__baseFor = __commonJS((exports, module) => {
  var createBaseFor = require__createBaseFor();
  var baseFor = createBaseFor();
  module.exports = baseFor;
});

// node_modules/lodash/_baseForOwn.js
var require__baseForOwn = __commonJS((exports, module) => {
  var baseFor = require__baseFor();
  var keys = require_keys();
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  module.exports = baseForOwn;
});

// node_modules/lodash/_createBaseEach.js
var require__createBaseEach = __commonJS((exports, module) => {
  var isArrayLike = require_isArrayLike();
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  module.exports = createBaseEach;
});

// node_modules/lodash/_baseEach.js
var require__baseEach = __commonJS((exports, module) => {
  var baseForOwn = require__baseForOwn();
  var createBaseEach = require__createBaseEach();
  var baseEach = createBaseEach(baseForOwn);
  module.exports = baseEach;
});

// node_modules/lodash/_baseMap.js
var require__baseMap = __commonJS((exports, module) => {
  var baseEach = require__baseEach();
  var isArrayLike = require_isArrayLike();
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  module.exports = baseMap;
});

// node_modules/lodash/map.js
var require_map = __commonJS((exports, module) => {
  var arrayMap = require__arrayMap();
  var baseIteratee = require__baseIteratee();
  var baseMap = require__baseMap();
  var isArray = require_isArray();
  function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee, 3));
  }
  module.exports = map;
});

// node_modules/lodash/_baseSlice.js
var require__baseSlice = __commonJS((exports, module) => {
  function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
  module.exports = baseSlice;
});

// node_modules/lodash/_trimmedEndIndex.js
var require__trimmedEndIndex = __commonJS((exports, module) => {
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }
  module.exports = trimmedEndIndex;
});

// node_modules/lodash/_baseTrim.js
var require__baseTrim = __commonJS((exports, module) => {
  var trimmedEndIndex = require__trimmedEndIndex();
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  module.exports = baseTrim;
});

// node_modules/lodash/toNumber.js
var require_toNumber = __commonJS((exports, module) => {
  var baseTrim = require__baseTrim();
  var isObject = require_isObject();
  var isSymbol = require_isSymbol();
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  module.exports = toNumber;
});

// node_modules/lodash/toFinite.js
var require_toFinite = __commonJS((exports, module) => {
  var toNumber = require_toNumber();
  var INFINITY = 1 / 0;
  var MAX_INTEGER = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  module.exports = toFinite;
});

// node_modules/lodash/toInteger.js
var require_toInteger = __commonJS((exports, module) => {
  var toFinite = require_toFinite();
  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  module.exports = toInteger;
});

// node_modules/lodash/take.js
var require_take = __commonJS((exports, module) => {
  var baseSlice = require__baseSlice();
  var toInteger = require_toInteger();
  function take(array, n, guard) {
    if (!(array && array.length)) {
      return [];
    }
    n = guard || n === undefined ? 1 : toInteger(n);
    return baseSlice(array, 0, n < 0 ? 0 : n);
  }
  module.exports = take;
});

// node_modules/lodash/_baseAt.js
var require__baseAt = __commonJS((exports, module) => {
  var get = require_get();
  function baseAt(object, paths) {
    var index = -1, length = paths.length, result = Array(length), skip = object == null;
    while (++index < length) {
      result[index] = skip ? undefined : get(object, paths[index]);
    }
    return result;
  }
  module.exports = baseAt;
});

// node_modules/lodash/_isFlattenable.js
var require__isFlattenable = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var isArguments = require_isArguments();
  var isArray = require_isArray();
  var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined;
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  module.exports = isFlattenable;
});

// node_modules/lodash/_baseFlatten.js
var require__baseFlatten = __commonJS((exports, module) => {
  var arrayPush = require__arrayPush();
  var isFlattenable = require__isFlattenable();
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  module.exports = baseFlatten;
});

// node_modules/lodash/flatten.js
var require_flatten = __commonJS((exports, module) => {
  var baseFlatten = require__baseFlatten();
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }
  module.exports = flatten;
});

// node_modules/lodash/_flatRest.js
var require__flatRest = __commonJS((exports, module) => {
  var flatten = require_flatten();
  var overRest = require__overRest();
  var setToString = require__setToString();
  function flatRest(func) {
    return setToString(overRest(func, undefined, flatten), func + "");
  }
  module.exports = flatRest;
});

// node_modules/lodash/at.js
var require_at = __commonJS((exports, module) => {
  var baseAt = require__baseAt();
  var flatRest = require__flatRest();
  var at = flatRest(baseAt);
  module.exports = at;
});

// node_modules/lodash/_arrayEach.js
var require__arrayEach = __commonJS((exports, module) => {
  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  module.exports = arrayEach;
});

// node_modules/lodash/_baseAssign.js
var require__baseAssign = __commonJS((exports, module) => {
  var copyObject = require__copyObject();
  var keys = require_keys();
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  module.exports = baseAssign;
});

// node_modules/lodash/_baseAssignIn.js
var require__baseAssignIn = __commonJS((exports, module) => {
  var copyObject = require__copyObject();
  var keysIn = require_keysIn();
  function baseAssignIn(object, source) {
    return object && copyObject(source, keysIn(source), object);
  }
  module.exports = baseAssignIn;
});

// node_modules/lodash/_cloneBuffer.js
var require__cloneBuffer = __commonJS((exports, module) => {
  var root = require__root();
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root.Buffer : undefined;
  var allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  module.exports = cloneBuffer;
});

// node_modules/lodash/_copyArray.js
var require__copyArray = __commonJS((exports, module) => {
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  module.exports = copyArray;
});

// node_modules/lodash/_copySymbols.js
var require__copySymbols = __commonJS((exports, module) => {
  var copyObject = require__copyObject();
  var getSymbols = require__getSymbols();
  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }
  module.exports = copySymbols;
});

// node_modules/lodash/_getSymbolsIn.js
var require__getSymbolsIn = __commonJS((exports, module) => {
  var arrayPush = require__arrayPush();
  var getPrototype = require__getPrototype();
  var getSymbols = require__getSymbols();
  var stubArray = require_stubArray();
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush(result, getSymbols(object));
      object = getPrototype(object);
    }
    return result;
  };
  module.exports = getSymbolsIn;
});

// node_modules/lodash/_copySymbolsIn.js
var require__copySymbolsIn = __commonJS((exports, module) => {
  var copyObject = require__copyObject();
  var getSymbolsIn = require__getSymbolsIn();
  function copySymbolsIn(source, object) {
    return copyObject(source, getSymbolsIn(source), object);
  }
  module.exports = copySymbolsIn;
});

// node_modules/lodash/_getAllKeysIn.js
var require__getAllKeysIn = __commonJS((exports, module) => {
  var baseGetAllKeys = require__baseGetAllKeys();
  var getSymbolsIn = require__getSymbolsIn();
  var keysIn = require_keysIn();
  function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn, getSymbolsIn);
  }
  module.exports = getAllKeysIn;
});

// node_modules/lodash/_initCloneArray.js
var require__initCloneArray = __commonJS((exports, module) => {
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  module.exports = initCloneArray;
});

// node_modules/lodash/_cloneArrayBuffer.js
var require__cloneArrayBuffer = __commonJS((exports, module) => {
  var Uint8Array2 = require__Uint8Array();
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
    return result;
  }
  module.exports = cloneArrayBuffer;
});

// node_modules/lodash/_cloneDataView.js
var require__cloneDataView = __commonJS((exports, module) => {
  var cloneArrayBuffer = require__cloneArrayBuffer();
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  module.exports = cloneDataView;
});

// node_modules/lodash/_cloneRegExp.js
var require__cloneRegExp = __commonJS((exports, module) => {
  var reFlags = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  module.exports = cloneRegExp;
});

// node_modules/lodash/_cloneSymbol.js
var require__cloneSymbol = __commonJS((exports, module) => {
  var Symbol2 = require__Symbol();
  var symbolProto = Symbol2 ? Symbol2.prototype : undefined;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  module.exports = cloneSymbol;
});

// node_modules/lodash/_cloneTypedArray.js
var require__cloneTypedArray = __commonJS((exports, module) => {
  var cloneArrayBuffer = require__cloneArrayBuffer();
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  module.exports = cloneTypedArray;
});

// node_modules/lodash/_initCloneByTag.js
var require__initCloneByTag = __commonJS((exports, module) => {
  var cloneArrayBuffer = require__cloneArrayBuffer();
  var cloneDataView = require__cloneDataView();
  var cloneRegExp = require__cloneRegExp();
  var cloneSymbol = require__cloneSymbol();
  var cloneTypedArray = require__cloneTypedArray();
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);
      case boolTag:
      case dateTag:
        return new Ctor(+object);
      case dataViewTag:
        return cloneDataView(object, isDeep);
      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);
      case mapTag:
        return new Ctor;
      case numberTag:
      case stringTag:
        return new Ctor(object);
      case regexpTag:
        return cloneRegExp(object);
      case setTag:
        return new Ctor;
      case symbolTag:
        return cloneSymbol(object);
    }
  }
  module.exports = initCloneByTag;
});

// node_modules/lodash/_baseCreate.js
var require__baseCreate = __commonJS((exports, module) => {
  var isObject = require_isObject();
  var objectCreate = Object.create;
  var baseCreate = function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }();
  module.exports = baseCreate;
});

// node_modules/lodash/_initCloneObject.js
var require__initCloneObject = __commonJS((exports, module) => {
  var baseCreate = require__baseCreate();
  var getPrototype = require__getPrototype();
  var isPrototype = require__isPrototype();
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }
  module.exports = initCloneObject;
});

// node_modules/lodash/_baseIsMap.js
var require__baseIsMap = __commonJS((exports, module) => {
  var getTag = require__getTag();
  var isObjectLike = require_isObjectLike();
  var mapTag = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike(value) && getTag(value) == mapTag;
  }
  module.exports = baseIsMap;
});

// node_modules/lodash/isMap.js
var require_isMap = __commonJS((exports, module) => {
  var baseIsMap = require__baseIsMap();
  var baseUnary = require__baseUnary();
  var nodeUtil = require__nodeUtil();
  var nodeIsMap = nodeUtil && nodeUtil.isMap;
  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
  module.exports = isMap;
});

// node_modules/lodash/_baseIsSet.js
var require__baseIsSet = __commonJS((exports, module) => {
  var getTag = require__getTag();
  var isObjectLike = require_isObjectLike();
  var setTag = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike(value) && getTag(value) == setTag;
  }
  module.exports = baseIsSet;
});

// node_modules/lodash/isSet.js
var require_isSet = __commonJS((exports, module) => {
  var baseIsSet = require__baseIsSet();
  var baseUnary = require__baseUnary();
  var nodeUtil = require__nodeUtil();
  var nodeIsSet = nodeUtil && nodeUtil.isSet;
  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
  module.exports = isSet;
});

// node_modules/lodash/_baseClone.js
var require__baseClone = __commonJS((exports, module) => {
  var Stack = require__Stack();
  var arrayEach = require__arrayEach();
  var assignValue = require__assignValue();
  var baseAssign = require__baseAssign();
  var baseAssignIn = require__baseAssignIn();
  var cloneBuffer = require__cloneBuffer();
  var copyArray = require__copyArray();
  var copySymbols = require__copySymbols();
  var copySymbolsIn = require__copySymbolsIn();
  var getAllKeys = require__getAllKeys();
  var getAllKeysIn = require__getAllKeysIn();
  var getTag = require__getTag();
  var initCloneArray = require__initCloneArray();
  var initCloneByTag = require__initCloneByTag();
  var initCloneObject = require__initCloneObject();
  var isArray = require_isArray();
  var isBuffer = require_isBuffer();
  var isMap = require_isMap();
  var isObject = require_isObject();
  var isSet = require_isSet();
  var keys = require_keys();
  var keysIn = require_keysIn();
  var CLONE_DEEP_FLAG = 1;
  var CLONE_FLAT_FLAG = 2;
  var CLONE_SYMBOLS_FLAG = 4;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? undefined : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  module.exports = baseClone;
});

// node_modules/lodash/clone.js
var require_clone = __commonJS((exports, module) => {
  var baseClone = require__baseClone();
  var CLONE_SYMBOLS_FLAG = 4;
  function clone(value) {
    return baseClone(value, CLONE_SYMBOLS_FLAG);
  }
  module.exports = clone;
});

// node_modules/lodash/_baseFilter.js
var require__baseFilter = __commonJS((exports, module) => {
  var baseEach = require__baseEach();
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection2) {
      if (predicate(value, index, collection2)) {
        result.push(value);
      }
    });
    return result;
  }
  module.exports = baseFilter;
});

// node_modules/lodash/filter.js
var require_filter = __commonJS((exports, module) => {
  var arrayFilter = require__arrayFilter();
  var baseFilter = require__baseFilter();
  var baseIteratee = require__baseIteratee();
  var isArray = require_isArray();
  function filter(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, baseIteratee(predicate, 3));
  }
  module.exports = filter;
});

// node_modules/lodash/_baseFindIndex.js
var require__baseFindIndex = __commonJS((exports, module) => {
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  module.exports = baseFindIndex;
});

// node_modules/lodash/_baseIsNaN.js
var require__baseIsNaN = __commonJS((exports, module) => {
  function baseIsNaN(value) {
    return value !== value;
  }
  module.exports = baseIsNaN;
});

// node_modules/lodash/_strictIndexOf.js
var require__strictIndexOf = __commonJS((exports, module) => {
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1, length = array.length;
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }
  module.exports = strictIndexOf;
});

// node_modules/lodash/_baseIndexOf.js
var require__baseIndexOf = __commonJS((exports, module) => {
  var baseFindIndex = require__baseFindIndex();
  var baseIsNaN = require__baseIsNaN();
  var strictIndexOf = require__strictIndexOf();
  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
  }
  module.exports = baseIndexOf;
});

// node_modules/lodash/_baseValues.js
var require__baseValues = __commonJS((exports, module) => {
  var arrayMap = require__arrayMap();
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }
  module.exports = baseValues;
});

// node_modules/lodash/values.js
var require_values = __commonJS((exports, module) => {
  var baseValues = require__baseValues();
  var keys = require_keys();
  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }
  module.exports = values;
});

// node_modules/lodash/includes.js
var require_includes = __commonJS((exports, module) => {
  var baseIndexOf = require__baseIndexOf();
  var isArrayLike = require_isArrayLike();
  var isString = require_isString();
  var toInteger = require_toInteger();
  var values = require_values();
  var nativeMax = Math.max;
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
  }
  module.exports = includes;
});

// node_modules/lodash/isNumber.js
var require_isNumber = __commonJS((exports, module) => {
  var baseGetTag = require__baseGetTag();
  var isObjectLike = require_isObjectLike();
  var numberTag = "[object Number]";
  function isNumber(value) {
    return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
  }
  module.exports = isNumber;
});

// node_modules/cloudinary/lib/utils/encoding/smart_escape.js
var require_smart_escape = __commonJS((exports, module) => {
  function smart_escape(string, unsafe = /([^a-zA-Z0-9_.\-\/:]+)/g) {
    return string.replace(unsafe, function(match2) {
      return match2.split("").map(function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      }).join("");
    });
  }
  module.exports = smart_escape;
});

// node_modules/cloudinary/lib/utils/parsing/consumeOption.js
var require_consumeOption = __commonJS((exports, module) => {
  function consumeOption(options, option_name, default_value) {
    let result = options[option_name];
    delete options[option_name];
    return result != null ? result : default_value;
  }
  module.exports = consumeOption;
});

// node_modules/cloudinary/lib/utils/parsing/toArray.js
var require_toArray = __commonJS((exports, module) => {
  var isArray = require_isArray();
  function toArray(arg) {
    switch (true) {
      case arg == null:
        return [];
      case isArray(arg):
        return arg;
      default:
        return [arg];
    }
  }
  module.exports = toArray;
});

// node_modules/cloudinary/lib/utils/encoding/base64Encode.js
var require_base64Encode = __commonJS((exports, module) => {
  function base64Encode(input) {
    if (!(input instanceof Buffer)) {
      input = Buffer.from(String(input), "binary");
    }
    return input.toString("base64");
  }
  exports.base64Encode = base64Encode;
});

// node_modules/cloudinary/lib/utils/encoding/base64EncodeURL.js
var require_base64EncodeURL = __commonJS((exports, module) => {
  var { base64Encode } = require_base64Encode();
  function base64EncodeURL(sourceUrl) {
    try {
      sourceUrl = decodeURI(sourceUrl);
    } catch (error) {}
    sourceUrl = encodeURI(sourceUrl);
    return base64Encode(sourceUrl).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  exports.base64EncodeURL = base64EncodeURL;
});

// node_modules/cloudinary/lib/utils/encoding/encodeDoubleArray.js
var require_encodeDoubleArray = __commonJS((exports, module) => {
  var isArray = require_isArray();
  var toArray = require_toArray();
  function encodeDoubleArray(array) {
    array = toArray(array);
    if (!isArray(array[0])) {
      array = [array];
    }
    return array.map((e) => toArray(e).join(",")).join("|");
  }
  module.exports = encodeDoubleArray;
});

// node_modules/cloudinary/lib/auth_token.js
var require_auth_token = __commonJS((exports, module) => {
  var crypto2 = __require("crypto");
  var smart_escape = require_smart_escape();
  var unsafe = /([ "#%&'/:;<=>?@[\]^`{|}~]+)/g;
  function digest(message, key) {
    return crypto2.createHmac("sha256", Buffer.from(key, "hex")).update(message).digest("hex");
  }
  function escapeToLower(url) {
    const safeUrl = smart_escape(url, unsafe);
    return safeUrl.replace(/%../g, function(match2) {
      return match2.toLowerCase();
    });
  }
  module.exports = function(options) {
    const tokenName = options.token_name ? options.token_name : "__cld_token__";
    const tokenSeparator = "~";
    if (options.expiration == null) {
      if (options.duration != null) {
        let start = options.start_time != null ? options.start_time : Math.round(Date.now() / 1000);
        options.expiration = start + options.duration;
      } else {
        throw new Error("Must provide either expiration or duration");
      }
    }
    let tokenParts = [];
    if (options.ip != null) {
      tokenParts.push(`ip=${options.ip}`);
    }
    if (options.start_time != null) {
      tokenParts.push(`st=${options.start_time}`);
    }
    tokenParts.push(`exp=${options.expiration}`);
    if (options.acl != null) {
      if (Array.isArray(options.acl) === true) {
        options.acl = options.acl.join("!");
      }
      tokenParts.push(`acl=${escapeToLower(options.acl)}`);
    }
    let toSign = [...tokenParts];
    if (options.url != null && options.acl == null) {
      let url = escapeToLower(options.url);
      toSign.push(`url=${url}`);
    }
    let auth = digest(toSign.join(tokenSeparator), options.key);
    tokenParts.push(`hmac=${auth}`);
    if (!options.url && !options.acl) {
      throw "authToken must contain either an acl or a url property";
    }
    return `${tokenName}=${tokenParts.join(tokenSeparator)}`;
  };
});

// node_modules/cloudinary/lib/utils/utf8_encode.js
var require_utf8_encode = __commonJS((exports, module) => {
  module.exports = function utf8_encode(argString) {
    let c1, enc, n;
    if (argString == null) {
      return "";
    }
    let string = argString + "";
    let utftext = "";
    let start = 0;
    let end = 0;
    let stringl = string.length;
    n = 0;
    while (n < stringl) {
      c1 = string.charCodeAt(n);
      enc = null;
      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
      } else {
        enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = n + 1;
        end = start;
      }
      n++;
    }
    if (end > start) {
      utftext += string.slice(start, stringl);
    }
    return utftext;
  };
});

// node_modules/cloudinary/lib/utils/crc32.js
var require_crc32 = __commonJS((exports, module) => {
  var utf8_encode = require_utf8_encode();
  function crc32(str) {
    let crc, i, iTop, table, x, y;
    str = utf8_encode(str);
    table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    crc = 0;
    x = 0;
    y = 0;
    crc = crc ^ -1;
    i = 0;
    iTop = str.length;
    while (i < iTop) {
      y = (crc ^ str.charCodeAt(i)) & 255;
      x = "0x" + table.substr(y * 9, 8);
      crc = crc >>> 8 ^ x;
      i++;
    }
    crc = crc ^ -1;
    if (crc < 0) {
      crc += 4294967296;
    }
    return crc;
  }
  module.exports = crc32;
});

// node_modules/cloudinary/lib/utils/ensurePresenceOf.js
var require_ensurePresenceOf = __commonJS((exports, module) => {
  function ensurePresenceOf(parameters) {
    let missing = Object.keys(parameters).filter((key) => parameters[key] === undefined);
    if (missing.length) {
      console.error(missing.join(",") + " cannot be undefined");
    }
  }
  module.exports = ensurePresenceOf;
});

// node_modules/cloudinary/lib/utils/ensureOption.js
var require_ensureOption = __commonJS((exports, module) => {
  function defaults(defaultOptions) {
    return function ensureOption(options, name, defaultValue) {
      let value;
      if (typeof options[name] !== "undefined") {
        value = options[name];
      } else if (typeof defaultOptions[name] !== "undefined") {
        value = defaultOptions[name];
      } else if (typeof defaultValue !== "undefined") {
        value = defaultValue;
      } else {
        throw new Error(`Must supply ${name}`);
      }
      return value;
    };
  }
  module.exports = defaults({});
  module.exports.defaults = defaults;
});

// node_modules/cloudinary/lib/utils/isRemoteUrl.js
var require_isRemoteUrl = __commonJS((exports, module) => {
  var isString = require_isString();
  function isRemoteUrl(url) {
    const SUBSTRING_LENGTH = 120;
    const urlSubstring = isString(url) && url.substring(0, SUBSTRING_LENGTH);
    return isString(url) && /^ftp:|^https?:|^gs:|^s3:|^data:([\w-.]+\/[\w-.]+(\+[\w-.]+)?)?(;[\w-.]+=[\w-.]+)*;base64,([a-zA-Z0-9\/+\n=]+)$/.test(urlSubstring);
  }
  module.exports = isRemoteUrl;
});

// node_modules/cloudinary/lib/utils/handleFileParameter.js
var require_handleFileParameter = __commonJS((exports, module) => {
  var fs = __require("fs");
  var path = __require("path");
  var isRemoteUrl = require_isRemoteUrl();
  function handleFileParameter(file) {
    if (file == null) {
      return;
    }
    if (Buffer.isBuffer(file)) {
      return { filename: "file", data: file };
    }
    if (typeof file === "string" && !isRemoteUrl(file)) {
      return { filename: path.basename(file), data: fs.readFileSync(file) };
    }
    return file;
  }
  module.exports = handleFileParameter;
});

// node_modules/cloudinary/lib/utils/analytics/getSDKVersions.js
var require_getSDKVersions = __commonJS((exports, module) => {
  var __dirname = "C:\\Users\\Dell\\Desktop\\projects\\keo\\api\\node_modules\\cloudinary\\lib\\utils\\analytics";
  var fs = __require("fs");
  var path = __require("path");
  var sdkCode = "M";
  function readSdkSemver() {
    const pkgJsonPath = path.join(__dirname, "../../../package.json");
    try {
      const pkgJSONFile = fs.readFileSync(pkgJsonPath, "utf-8");
      return JSON.parse(pkgJSONFile).version;
    } catch (e) {
      if (e.code === "ENOENT") {
        return "0.0.0";
      }
      return "n/a";
    }
  }
  function getSDKVersions(useSDKVersion = "default", useNodeVersion = "default") {
    const sdkSemver = useSDKVersion === "default" ? readSdkSemver() : useSDKVersion;
    const version = process.version.slice(1);
    const techVersion = useNodeVersion === "default" ? version : useNodeVersion;
    const product = "A";
    return {
      sdkSemver,
      techVersion,
      sdkCode,
      product
    };
  }
  module.exports = getSDKVersions;
});

// node_modules/cloudinary/lib/utils/analytics/removePatchFromSemver.js
var require_removePatchFromSemver = __commonJS((exports, module) => {
  module.exports = (semVerStr) => {
    let parts = semVerStr.split(".");
    return `${parts[0]}.${parts[1]}`;
  };
});

// node_modules/cloudinary/lib/utils/analytics/stringPad.js
var require_stringPad = __commonJS((exports, module) => {
  function repeatStringNumTimes(string, times) {
    let repeatedString = "";
    while (times > 0) {
      repeatedString += string;
      times--;
    }
    return repeatedString;
  }
  module.exports = (value, targetLength, padString) => {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (value.length > targetLength) {
      return String(value);
    } else {
      targetLength = targetLength - value.length;
      if (targetLength > padString.length) {
        padString += repeatStringNumTimes(padString, targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(value);
    }
  };
});

// node_modules/cloudinary/lib/utils/analytics/reverseVersion.js
var require_reverseVersion = __commonJS((exports, module) => {
  var stringPad = require_stringPad();
  module.exports = (semVer) => {
    if (semVer.split(".").length < 2) {
      throw new Error("invalid semVer, must have at least two segments");
    }
    return semVer.split(".").reverse().map((segment) => {
      return stringPad(segment, 2, "0");
    }).join(".");
  };
});

// node_modules/cloudinary/lib/utils/encoding/base64Map.js
var require_base64Map = __commonJS((exports, module) => {
  var stringPad = require_stringPad();
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var num = 0;
  var base64Map = {};
  [...chars].forEach((char) => {
    let key = num.toString(2);
    key = stringPad(key, 6, "0");
    base64Map[key] = char;
    num++;
  });
  module.exports = base64Map;
});

// node_modules/cloudinary/lib/utils/analytics/encodeVersion.js
var require_encodeVersion = __commonJS((exports, module) => {
  var reverseVersion = require_reverseVersion();
  var stringPad = require_stringPad();
  var base64Map = require_base64Map();
  module.exports = (semVer) => {
    let strResult = "";
    let parts = semVer.split(".").length;
    let paddedStringLength = parts * 6;
    let paddedReversedSemver = reverseVersion(semVer);
    let num = parseInt(paddedReversedSemver.split(".").join(""));
    let paddedBinary = num.toString(2);
    paddedBinary = stringPad(paddedBinary, paddedStringLength, "0");
    if (paddedBinary.length % 6 !== 0) {
      throw "Version must be smaller than 43.21.26)";
    }
    paddedBinary.match(/.{1,6}/g).forEach((bitString) => {
      strResult += base64Map[bitString];
    });
    return strResult;
  };
});

// node_modules/cloudinary/lib/utils/analytics/index.js
var require_analytics = __commonJS((exports, module) => {
  var removePatchFromSemver = require_removePatchFromSemver();
  var encodeVersion = require_encodeVersion();
  function getSDKAnalyticsSignature(analyticsOptions = {}) {
    try {
      const twoPartVersion = removePatchFromSemver(analyticsOptions.techVersion);
      const encodedSDKVersion = encodeVersion(analyticsOptions.sdkSemver);
      const encodedTechVersion = encodeVersion(twoPartVersion);
      const featureCode = analyticsOptions.feature;
      const SDKCode = analyticsOptions.sdkCode;
      const product = analyticsOptions.product;
      const algoVersion = "B";
      return `${algoVersion}${product}${SDKCode}${encodedSDKVersion}${encodedTechVersion}${featureCode}`;
    } catch (e) {
      return "E";
    }
  }
  function getAnalyticsOptions(options) {
    let analyticsOptions = {
      sdkSemver: options.sdkSemver,
      techVersion: options.techVersion,
      sdkCode: options.sdkCode,
      product: options.product,
      feature: "0"
    };
    if (options.urlAnalytics) {
      if (options.accessibility) {
        analyticsOptions.feature = "D";
      }
      if (options.loading === "lazy") {
        analyticsOptions.feature = "C";
      }
      if (options.responsive) {
        analyticsOptions.feature = "A";
      }
      if (options.placeholder) {
        analyticsOptions.feature = "B";
      }
      return analyticsOptions;
    } else {
      return {};
    }
  }
  module.exports = {
    getSDKAnalyticsSignature,
    getAnalyticsOptions
  };
});

// node_modules/cloudinary/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    author: "Cloudinary <info@cloudinary.com>",
    name: "cloudinary",
    description: "Upload, transform, optimize, and manage images and videos with Cloudinary from Node.js.",
    version: "2.11.0",
    homepage: "https://cloudinary.com",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/cloudinary/cloudinary_npm.git"
    },
    main: "cloudinary.js",
    dependencies: {
      lodash: "^4.17.23"
    },
    devDependencies: {
      "@types/expect.js": "^0.3.32",
      "@types/mocha": "^10.0.10",
      "@types/node": "~22.18.0",
      "date-fns": "^2.30.0",
      dotenv: "^8.2.0",
      dtslint: "^2.0.6",
      eslint: "^6.8.0",
      "eslint-config-airbnb-base": "^14.2.1",
      "eslint-plugin-import": "^2.32.0",
      "eslint-plugin-node": "^11.1.0",
      "expect.js": "^0.3.1",
      glob: "^7.2.3",
      jsdoc: "^4.0.4",
      jsdom: "^15.2.1",
      "jsdom-global": "^3.0.2",
      mocha: "^7.2.0",
      nyc: "^15.1.0",
      rimraf: "^3.0.2",
      sinon: "^9.2.4",
      typescript: "^4.9.5",
      "webpack-cli": "^3.3.12"
    },
    files: [
      "lib/**/*",
      "cloudinary.js",
      "babel.config.js",
      "package.json",
      "types/index.d.ts",
      "docs/**/*.md",
      "examples/**/*.js",
      "SECURITY.md",
      "CHANGELOG.md"
    ],
    types: "types",
    scripts: {
      test: "tools/scripts/test.sh",
      "test:unit": "tools/scripts/test.es6.unit.sh",
      "test-with-temp-cloud": "tools/scripts/tests-with-temp-cloud.sh",
      dtslint: "tools/scripts/ditslint.sh",
      lint: "tools/scripts/lint.sh",
      coverage: "tools/scripts/test.es6.sh --coverage",
      "test-es6": "tools/scripts/test.es6.sh",
      docs: "tools/scripts/docs.sh"
    },
    engines: {
      node: ">=9"
    }
  };
});

// node_modules/cloudinary/lib/utils/consts.js
var require_consts = __commonJS((exports, module) => {
  var DEFAULT_RESPONSIVE_WIDTH_TRANSFORMATION = {
    width: "auto",
    crop: "limit"
  };
  var DEFAULT_POSTER_OPTIONS = {
    format: "jpg",
    resource_type: "video"
  };
  var DEFAULT_VIDEO_SOURCE_TYPES = ["webm", "mp4", "ogv"];
  var CONDITIONAL_OPERATORS = {
    "=": "eq",
    "!=": "ne",
    "<": "lt",
    ">": "gt",
    "<=": "lte",
    ">=": "gte",
    "&&": "and",
    "||": "or",
    "*": "mul",
    "/": "div",
    "+": "add",
    "-": "sub",
    "^": "pow"
  };
  var SIMPLE_PARAMS = [
    ["audio_codec", "ac"],
    ["audio_frequency", "af"],
    ["bit_rate", "br"],
    ["color_space", "cs"],
    ["default_image", "d"],
    ["delay", "dl"],
    ["density", "dn"],
    ["duration", "du"],
    ["end_offset", "eo"],
    ["fetch_format", "f"],
    ["gravity", "g"],
    ["page", "pg"],
    ["prefix", "p"],
    ["start_offset", "so"],
    ["streaming_profile", "sp"],
    ["video_codec", "vc"],
    ["video_sampling", "vs"]
  ];
  var PREDEFINED_VARS = {
    aspect_ratio: "ar",
    aspectRatio: "ar",
    current_page: "cp",
    currentPage: "cp",
    duration: "du",
    face_count: "fc",
    faceCount: "fc",
    height: "h",
    initial_aspect_ratio: "iar",
    initial_height: "ih",
    initial_width: "iw",
    initialAspectRatio: "iar",
    initialHeight: "ih",
    initialWidth: "iw",
    initial_duration: "idu",
    initialDuration: "idu",
    page_count: "pc",
    page_x: "px",
    page_y: "py",
    pageCount: "pc",
    pageX: "px",
    pageY: "py",
    tags: "tags",
    width: "w"
  };
  var TRANSFORMATION_PARAMS = [
    "angle",
    "aspect_ratio",
    "audio_codec",
    "audio_frequency",
    "background",
    "bit_rate",
    "border",
    "color",
    "color_space",
    "crop",
    "default_image",
    "delay",
    "density",
    "dpr",
    "duration",
    "effect",
    "end_offset",
    "fetch_format",
    "flags",
    "fps",
    "gravity",
    "height",
    "if",
    "keyframe_interval",
    "offset",
    "opacity",
    "overlay",
    "page",
    "prefix",
    "quality",
    "radius",
    "raw_transformation",
    "responsive_width",
    "size",
    "start_offset",
    "streaming_profile",
    "transformation",
    "underlay",
    "variables",
    "video_codec",
    "video_sampling",
    "width",
    "x",
    "y",
    "zoom"
  ];
  var LAYER_KEYWORD_PARAMS = {
    font_weight: "normal",
    font_style: "normal",
    text_decoration: "none",
    text_align: null,
    stroke: "none"
  };
  var UPLOAD_PREFIX = "https://api.cloudinary.com";
  var SUPPORTED_SIGNATURE_ALGORITHMS = ["sha1", "sha256"];
  var DEFAULT_SIGNATURE_ALGORITHM = "sha1";
  module.exports = {
    DEFAULT_RESPONSIVE_WIDTH_TRANSFORMATION,
    DEFAULT_POSTER_OPTIONS,
    DEFAULT_VIDEO_SOURCE_TYPES,
    CONDITIONAL_OPERATORS,
    PREDEFINED_VARS,
    LAYER_KEYWORD_PARAMS,
    TRANSFORMATION_PARAMS,
    SIMPLE_PARAMS,
    UPLOAD_PREFIX,
    SUPPORTED_SIGNATURE_ALGORITHMS,
    DEFAULT_SIGNATURE_ALGORITHM
  };
});

// node_modules/cloudinary/lib/utils/qPolyfill.js
var require_qPolyfill = __commonJS((exports, module) => {
  var scheduleCompatCallback = typeof setImmediate === "function" ? (fn) => setImmediate(fn) : (fn) => setTimeout(fn, 0);
  function qFinally(onFinally) {
    const handler = typeof onFinally === "function" ? onFinally : () => onFinally;
    const PromiseCtor = typeof this.constructor === "function" && typeof this.constructor.resolve === "function" ? this.constructor : Promise;
    return this.then((value) => PromiseCtor.resolve(handler()).then(() => value), (reason) => PromiseCtor.resolve(handler()).then(() => {
      throw reason;
    }));
  }
  function qFin(handler) {
    return this.finally(handler);
  }
  function qDone(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected).catch((err) => {
      scheduleCompatCallback(() => {
        throw err;
      });
    });
  }
  function qNodeify(callback) {
    if (typeof callback !== "function") {
      return this;
    }
    this.then((value) => scheduleCompatCallback(() => callback(null, value)), (error) => scheduleCompatCallback(() => callback(error)));
    return this;
  }
  function qFail(onRejected) {
    return this.catch(onRejected);
  }
  function qProgress() {
    return this;
  }
  function qSpread(onFulfilled, onRejected) {
    return this.then((values) => {
      if (typeof onFulfilled !== "function") {
        return values;
      }
      if (Array.isArray(values)) {
        return onFulfilled.apply(undefined, values);
      }
      return onFulfilled(values);
    }, onRejected);
  }
  function applyQCompat(promise) {
    if (!promise || typeof promise !== "object" && typeof promise !== "function") {
      return promise;
    }
    if (promise.__cloudinaryQCompatApplied) {
      return promise;
    }
    Object.defineProperty(promise, "__cloudinaryQCompatApplied", {
      value: true,
      enumerable: false
    });
    const nativeThen = promise.then;
    if (typeof nativeThen === "function") {
      promise.then = function(...args) {
        return applyQCompat(nativeThen.apply(this, args));
      };
    }
    const nativeCatch = promise.catch;
    if (typeof nativeCatch === "function") {
      promise.catch = function(...args) {
        return applyQCompat(nativeCatch.apply(this, args));
      };
    }
    const nativeFinally = promise.finally;
    if (typeof nativeFinally === "function") {
      promise.finally = function(...args) {
        return applyQCompat(nativeFinally.apply(this, args));
      };
    } else {
      promise.finally = qFinally;
    }
    if (typeof promise.fin !== "function") {
      promise.fin = qFin;
    }
    if (typeof promise.done !== "function") {
      promise.done = qDone;
    }
    if (typeof promise.nodeify !== "function") {
      promise.nodeify = qNodeify;
    }
    if (typeof promise.fail !== "function") {
      promise.fail = qFail;
    }
    if (typeof promise.progress !== "function") {
      promise.progress = qProgress;
    }
    if (typeof promise.spread !== "function") {
      promise.spread = qSpread;
    }
    return promise;
  }
  module.exports = applyQCompat;
});

// node_modules/cloudinary/lib/utils/index.js
var require_utils = __commonJS((exports, module) => {
  var crypto2 = __require("crypto");
  var querystring = __require("querystring");
  var { URL: URL2 } = __require("url");
  var compact = require_compact();
  var first = require_head();
  var isFunction = require_isFunction();
  var isPlainObject = require_isPlainObject();
  var last = require_last();
  var map = require_map();
  var take = require_take();
  var at = require_at();
  var clone = require_clone();
  var extend = require_assignIn();
  var filter = require_filter();
  var includes = require_includes();
  var isArray = require_isArray();
  var isEmpty = require_isEmpty();
  var isNumber = require_isNumber();
  var isObject = require_isObject();
  var isString = require_isString();
  var isUndefined = require_isUndefined();
  var smart_escape = require_smart_escape();
  var consumeOption = require_consumeOption();
  var toArray = require_toArray();
  var { base64EncodeURL } = require_base64EncodeURL();
  var encodeDoubleArray = require_encodeDoubleArray();
  var config2 = require_config();
  var generate_token = require_auth_token();
  var crc32 = require_crc32();
  var ensurePresenceOf = require_ensurePresenceOf();
  var ensureOption = require_ensureOption().defaults(config2());
  var entries = require_entries();
  var handleFileParameter = require_handleFileParameter();
  var isRemoteUrl = require_isRemoteUrl();
  var getSDKVersions = require_getSDKVersions();
  var {
    getAnalyticsOptions,
    getSDKAnalyticsSignature
  } = require_analytics();
  exports = module.exports;
  var utils = module.exports;
  try {
    utils.VERSION = require_package().version;
  } catch (error) {
    utils.VERSION = "";
  }
  function generate_auth_token(options) {
    let token_options = Object.assign({}, config2().auth_token, options);
    return generate_token(token_options);
  }
  exports.CF_SHARED_CDN = "d3jpl91pxevbkh.cloudfront.net";
  exports.OLD_AKAMAI_SHARED_CDN = "cloudinary-a.akamaihd.net";
  exports.AKAMAI_SHARED_CDN = "res.cloudinary.com";
  exports.SHARED_CDN = exports.AKAMAI_SHARED_CDN;
  exports.USER_AGENT = `CloudinaryNodeJS/${exports.VERSION} (Node ${process.versions.node})`;
  exports.userPlatform = "";
  function getUserAgent() {
    return isEmpty(utils.userPlatform) ? `${utils.USER_AGENT}` : `${utils.userPlatform} ${utils.USER_AGENT}`;
  }
  var {
    DEFAULT_RESPONSIVE_WIDTH_TRANSFORMATION,
    DEFAULT_POSTER_OPTIONS,
    DEFAULT_VIDEO_SOURCE_TYPES,
    CONDITIONAL_OPERATORS,
    PREDEFINED_VARS,
    LAYER_KEYWORD_PARAMS,
    TRANSFORMATION_PARAMS,
    SIMPLE_PARAMS,
    UPLOAD_PREFIX,
    SUPPORTED_SIGNATURE_ALGORITHMS,
    DEFAULT_SIGNATURE_ALGORITHM
  } = require_consts();
  var applyQCompat = require_qPolyfill();
  function textStyle(layer) {
    let keywords = [];
    let style = "";
    if (!isEmpty(layer.text_style)) {
      return layer.text_style;
    }
    Object.keys(LAYER_KEYWORD_PARAMS).forEach((attr) => {
      let default_value = LAYER_KEYWORD_PARAMS[attr];
      let attr_value = layer[attr] || default_value;
      if (attr_value !== default_value) {
        keywords.push(attr_value);
      }
    });
    Object.keys(layer).forEach((attr) => {
      if (attr === "letter_spacing" || attr === "line_spacing") {
        keywords.push(`${attr}_${layer[attr]}`);
      }
      if (attr === "font_hinting") {
        keywords.push(`${attr.split("_").pop()}_${layer[attr]}`);
      }
      if (attr === "font_antialiasing") {
        keywords.push(`antialias_${layer[attr]}`);
      }
    });
    if (layer.hasOwnProperty("font_size") || !isEmpty(keywords)) {
      if (!layer.font_size)
        throw new Error("Must supply font_size for text in overlay/underlay");
      if (!layer.font_family)
        throw new Error("Must supply font_family for text in overlay/underlay");
      keywords.unshift(layer.font_size);
      keywords.unshift(layer.font_family);
      style = compact(keywords).join("_");
    }
    return style;
  }
  function normalize_expression(expression) {
    if (!isString(expression) || expression.length === 0 || expression.match(/^!.+!$/)) {
      return expression;
    }
    const operators = "\\|\\||>=|<=|&&|!=|>|=|<|/|-|\\^|\\+|\\*";
    const operatorsPattern = "((" + operators + ")(?=[ _]))";
    const operatorsReplaceRE = new RegExp(operatorsPattern, "g");
    expression = expression.replace(operatorsReplaceRE, (match2) => CONDITIONAL_OPERATORS[match2]);
    const predefinedVarsPattern = "(" + Object.keys(PREDEFINED_VARS).map((v) => `:${v}|${v}`).join("|") + ")";
    const userVariablePattern = "(\\$_*[^_ ]+)";
    const variablesReplaceRE = new RegExp(`${userVariablePattern}|${predefinedVarsPattern}`, "g");
    expression = expression.replace(variablesReplaceRE, (match2) => PREDEFINED_VARS[match2] || match2);
    return expression.replace(/[ _]+/g, "_");
  }
  function process_custom_function(customFunction) {
    if (!isObject(customFunction)) {
      return customFunction;
    }
    if (customFunction.function_type === "remote") {
      const encodedSource = base64EncodeURL(customFunction.source);
      return [customFunction.function_type, encodedSource].join(":");
    }
    return [customFunction.function_type, customFunction.source].join(":");
  }
  function process_custom_pre_function(customPreFunction) {
    let result = process_custom_function(customPreFunction);
    return utils.isString(result) ? `pre:${result}` : null;
  }
  function process_if(ifValue) {
    return ifValue ? "if_" + normalize_expression(ifValue) : ifValue;
  }
  function process_layer(layer) {
    if (isString(layer)) {
      let resourceType = null;
      let layerUrl = "";
      let fetchLayerBegin = "fetch:";
      if (layer.startsWith(fetchLayerBegin)) {
        layerUrl = layer.substring(fetchLayerBegin.length);
      } else if (layer.indexOf(":fetch:", 0) !== -1) {
        const parts = layer.split(":", 3);
        resourceType = parts[0];
        layerUrl = parts[2];
      } else {
        return layer;
      }
      layer = {
        url: layerUrl,
        type: "fetch"
      };
      if (resourceType) {
        layer.resource_type = resourceType;
      }
    }
    if (typeof layer !== "object") {
      return layer;
    }
    let {
      resource_type,
      text,
      type,
      public_id,
      format,
      url: fetchUrl
    } = layer;
    const components = [];
    if (!isEmpty(text) && isEmpty(resource_type)) {
      resource_type = "text";
    }
    if (!isEmpty(fetchUrl) && isEmpty(type)) {
      type = "fetch";
    }
    if (!isEmpty(public_id) && !isEmpty(format)) {
      public_id = `${public_id}.${format}`;
    }
    if (isEmpty(public_id) && resource_type !== "text" && type !== "fetch") {
      throw new Error("Must supply public_id for non-text overlay");
    }
    if (!isEmpty(resource_type) && resource_type !== "image") {
      components.push(resource_type);
    }
    if (!isEmpty(type) && type !== "upload") {
      components.push(type);
    }
    if (resource_type === "text" || resource_type === "subtitles") {
      if (isEmpty(public_id) && isEmpty(text)) {
        throw new Error("Must supply either text or public_in in overlay");
      }
      const textOptions = textStyle(layer);
      if (!isEmpty(textOptions)) {
        components.push(textOptions);
      }
      if (!isEmpty(public_id)) {
        public_id = public_id.replace("/", ":");
        components.push(public_id);
      }
      if (!isEmpty(text)) {
        const variablesRegex = new RegExp(/(\$\([a-zA-Z]\w+\))/g);
        const textDividedByVariables = text.split(variablesRegex).filter((x) => x);
        const encodedParts = textDividedByVariables.map((subText) => {
          const matches = variablesRegex[Symbol.match](subText);
          const isVariable = matches ? matches.length > 0 : false;
          if (isVariable) {
            return subText;
          }
          return encodeCurlyBraces(encodeURIComponent(smart_escape(subText, new RegExp(/([,\/])/g))));
        });
        components.push(encodedParts.join(""));
      }
    } else if (type === "fetch") {
      const encodedUrl = base64EncodeURL(fetchUrl);
      components.push(encodedUrl);
    } else {
      public_id = public_id.replace("/", ":");
      components.push(public_id);
    }
    return components.join(":");
  }
  function replaceAllSubstrings(string, search, replacement = "") {
    return string.split(search).join(replacement);
  }
  function encodeCurlyBraces(input) {
    return replaceAllSubstrings(replaceAllSubstrings(input, "(", "%28"), ")", "%29");
  }
  function process_radius(radius) {
    if (!radius) {
      return radius;
    }
    if (!isArray(radius)) {
      radius = [radius];
    }
    if (radius.length === 0 || radius.length > 4) {
      throw new Error("Radius array should contain between 1 and 4 values");
    }
    if (radius.findIndex((x) => x === null) >= 0) {
      throw new Error("Corner: Cannot be null");
    }
    return radius.map(normalize_expression).join(":");
  }
  function build_multi_and_sprite_params(tagOrOptions, options) {
    let tag = null;
    if (typeof tagOrOptions === "string") {
      tag = tagOrOptions;
    } else {
      if (isEmpty(options)) {
        options = tagOrOptions;
      } else {
        throw new Error("First argument must be a tag when additional options are passed");
      }
      tag = null;
    }
    if (!options && !tag) {
      throw new Error("Either tag or urls are required");
    }
    if (!options) {
      options = {};
    }
    const urls = options.urls;
    const transformation = generate_transformation_string(extend({}, options, {
      fetch_format: options.format
    }));
    return {
      tag,
      transformation,
      urls,
      timestamp: utils.timestamp(),
      async: options.async,
      notification_url: options.notification_url
    };
  }
  function build_upload_params(options) {
    let params = {
      access_mode: options.access_mode,
      allowed_formats: options.allowed_formats && toArray(options.allowed_formats).join(","),
      asset_folder: options.asset_folder,
      async: utils.as_safe_bool(options.async),
      backup: utils.as_safe_bool(options.backup),
      callback: options.callback,
      cinemagraph_analysis: utils.as_safe_bool(options.cinemagraph_analysis),
      colors: utils.as_safe_bool(options.colors),
      display_name: options.display_name,
      discard_original_filename: utils.as_safe_bool(options.discard_original_filename),
      eager: utils.build_eager(options.eager),
      eager_async: utils.as_safe_bool(options.eager_async),
      eager_notification_url: options.eager_notification_url,
      eval: options.eval,
      exif: utils.as_safe_bool(options.exif),
      faces: utils.as_safe_bool(options.faces),
      folder: options.folder,
      format: options.format,
      filename_override: options.filename_override,
      image_metadata: utils.as_safe_bool(options.image_metadata),
      media_metadata: utils.as_safe_bool(options.media_metadata),
      invalidate: utils.as_safe_bool(options.invalidate),
      clear_invalid: utils.as_safe_bool(options.clear_invalid),
      moderation: options.moderation,
      notification_url: options.notification_url,
      overwrite: utils.as_safe_bool(options.overwrite),
      phash: utils.as_safe_bool(options.phash),
      proxy: options.proxy,
      public_id: options.public_id,
      public_id_prefix: options.public_id_prefix,
      quality_analysis: utils.as_safe_bool(options.quality_analysis),
      responsive_breakpoints: utils.generate_responsive_breakpoints_string(options.responsive_breakpoints),
      return_delete_token: utils.as_safe_bool(options.return_delete_token),
      timestamp: options.timestamp || exports.timestamp(),
      transformation: decodeURIComponent(utils.generate_transformation_string(clone(options))),
      type: options.type,
      unique_filename: utils.as_safe_bool(options.unique_filename),
      upload_preset: options.upload_preset,
      use_filename: utils.as_safe_bool(options.use_filename),
      use_filename_as_display_name: utils.as_safe_bool(options.use_filename_as_display_name),
      quality_override: options.quality_override,
      accessibility_analysis: utils.as_safe_bool(options.accessibility_analysis),
      use_asset_folder_as_public_id_prefix: utils.as_safe_bool(options.use_asset_folder_as_public_id_prefix),
      visual_search: utils.as_safe_bool(options.visual_search),
      on_success: options.on_success,
      auto_transcription: options.auto_transcription,
      auto_chaptering: utils.as_safe_bool(options.auto_chaptering)
    };
    return utils.updateable_resource_params(options, params);
  }
  function encode_key_value(arg) {
    if (!isObject(arg)) {
      return arg;
    }
    return entries(arg).map(([k, v]) => `${k}=${v}`).join("|");
  }
  function escapeMetadataValue(value) {
    return value.toString().replace(/([=|])/g, "\\$&");
  }
  function encode_context(metadataObj) {
    if (!isObject(metadataObj)) {
      return metadataObj;
    }
    return entries(metadataObj).map(([key, value]) => {
      if (isString(value)) {
        return `${key}=${escapeMetadataValue(value)}`;
      } else if (isArray(value)) {
        let values = value.map((innerVal) => {
          return `"${escapeMetadataValue(innerVal)}"`;
        }).join(",");
        return `${key}=[${values}]`;
      } else if (Number.isInteger(value)) {
        return `${key}=${escapeMetadataValue(String(value))}`;
      } else {
        return value.toString();
      }
    }).join("|");
  }
  function build_eager(transformations) {
    return toArray(transformations).map((transformation) => {
      const transformationString = utils.generate_transformation_string(clone(transformation));
      const format = transformation.format;
      return format == null ? transformationString : `${transformationString}/${format}`;
    }).join("|");
  }
  function build_custom_headers(headers) {
    switch (true) {
      case headers == null:
        return;
      case isArray(headers):
        return headers.join(`
`);
      case isObject(headers):
        return entries(headers).map(([k, v]) => `${k}:${v}`).join(`
`);
      default:
        return headers;
    }
  }
  function generate_transformation_string(options) {
    if (utils.isString(options)) {
      return options;
    }
    if (isArray(options)) {
      return options.map((t) => utils.generate_transformation_string(clone(t))).filter(utils.present).join("/");
    }
    let responsive_width = consumeOption(options, "responsive_width", config2().responsive_width);
    let width = options.width;
    let height = options.height;
    let size = consumeOption(options, "size");
    if (size) {
      [width, height] = size.split("x");
      [options.width, options.height] = [width, height];
    }
    let has_layer = options.overlay || options.underlay;
    let crop = consumeOption(options, "crop");
    let angle = toArray(consumeOption(options, "angle")).join(".");
    let no_html_sizes = has_layer || utils.present(angle) || crop === "fit" || crop === "limit" || responsive_width;
    if (width && (width.toString().indexOf("auto") === 0 || no_html_sizes || parseFloat(width) < 1)) {
      delete options.width;
    }
    if (height && (no_html_sizes || parseFloat(height) < 1)) {
      delete options.height;
    }
    let background = consumeOption(options, "background");
    background = background && background.replace(/^#/, "rgb:");
    let color = consumeOption(options, "color");
    color = color && color.replace(/^#/, "rgb:");
    let base_transformations = toArray(consumeOption(options, "transformation", []));
    let named_transformation = [];
    if (base_transformations.some(isObject)) {
      base_transformations = base_transformations.map((tr) => utils.generate_transformation_string(isObject(tr) ? clone(tr) : { transformation: tr }));
    } else {
      named_transformation = base_transformations.join(".");
      base_transformations = [];
    }
    let effect = consumeOption(options, "effect");
    if (isArray(effect)) {
      effect = effect.join(":");
    } else if (isObject(effect)) {
      effect = entries(effect).map(([key, value]) => `${key}:${value}`);
    }
    let border = consumeOption(options, "border");
    if (isObject(border)) {
      border = `${border.width != null ? border.width : 2}px_solid_${(border.color != null ? border.color : "black").replace(/^#/, "rgb:")}`;
    } else if (/^\d+$/.exec(border)) {
      options.border = border;
      border = undefined;
    }
    let flags = toArray(consumeOption(options, "flags")).join(".");
    let dpr = consumeOption(options, "dpr", config2().dpr);
    if (options.offset != null) {
      [options.start_offset, options.end_offset] = split_range(consumeOption(options, "offset"));
    }
    if (options.start_offset) {
      options.start_offset = normalize_expression(options.start_offset);
    }
    if (options.end_offset) {
      options.end_offset = normalize_expression(options.end_offset);
    }
    let overlay = process_layer(consumeOption(options, "overlay"));
    let radius = process_radius(consumeOption(options, "radius"));
    let underlay = process_layer(consumeOption(options, "underlay"));
    let ifValue = process_if(consumeOption(options, "if"));
    let custom_function = process_custom_function(consumeOption(options, "custom_function"));
    let custom_pre_function = process_custom_pre_function(consumeOption(options, "custom_pre_function"));
    let fps = consumeOption(options, "fps");
    if (isArray(fps)) {
      fps = fps.join("-");
    }
    let params = {
      a: normalize_expression(angle),
      ar: normalize_expression(consumeOption(options, "aspect_ratio")),
      b: background,
      bo: border,
      c: crop,
      co: color,
      dpr: normalize_expression(dpr),
      e: normalize_expression(effect),
      fl: flags,
      fn: custom_function || custom_pre_function,
      fps,
      h: normalize_expression(height),
      ki: normalize_expression(consumeOption(options, "keyframe_interval")),
      l: overlay,
      o: normalize_expression(consumeOption(options, "opacity")),
      q: normalize_expression(consumeOption(options, "quality")),
      r: radius,
      t: named_transformation,
      u: underlay,
      w: normalize_expression(width),
      x: normalize_expression(consumeOption(options, "x")),
      y: normalize_expression(consumeOption(options, "y")),
      z: normalize_expression(consumeOption(options, "zoom"))
    };
    SIMPLE_PARAMS.forEach(([name, short]) => {
      let value = consumeOption(options, name);
      if (value !== undefined) {
        params[short] = value;
      }
    });
    if (params.vc != null) {
      params.vc = process_video_params(params.vc);
    }
    ["so", "eo", "du"].forEach((short) => {
      if (params[short] !== undefined) {
        params[short] = norm_range_value(params[short]);
      }
    });
    let variablesParam = consumeOption(options, "variables", []);
    let variables = entries(options).filter(([key, value]) => key.startsWith("$")).map(([key, value]) => {
      delete options[key];
      return `${key}_${normalize_expression(value)}`;
    }).sort().concat(variablesParam.map(([name, value]) => `${name}_${normalize_expression(value)}`)).join(",");
    let transformations = entries(params).filter(([key, value]) => utils.present(value)).map(([key, value]) => key + "_" + value).sort().join(",");
    let raw_transformation = consumeOption(options, "raw_transformation");
    transformations = compact([ifValue, variables, transformations, raw_transformation]).join(",");
    base_transformations.push(transformations);
    transformations = base_transformations;
    if (responsive_width) {
      let responsive_width_transformation = config2().responsive_width_transformation || DEFAULT_RESPONSIVE_WIDTH_TRANSFORMATION;
      transformations.push(utils.generate_transformation_string(clone(responsive_width_transformation)));
    }
    if (String(width).startsWith("auto") || responsive_width) {
      options.responsive = true;
    }
    if (dpr === "auto") {
      options.hidpi = true;
    }
    return filter(transformations, utils.present).join("/");
  }
  function updateable_resource_params(options, params = {}) {
    if (options.access_control != null) {
      params.access_control = utils.jsonArrayParam(options.access_control);
    }
    if (options.auto_tagging != null) {
      params.auto_tagging = options.auto_tagging;
    }
    if (options.background_removal != null) {
      params.background_removal = options.background_removal;
    }
    if (options.categorization != null) {
      params.categorization = options.categorization;
    }
    if (options.context != null) {
      params.context = utils.encode_context(options.context);
    }
    if (options.metadata != null) {
      params.metadata = utils.encode_context(options.metadata);
    }
    if (options.custom_coordinates != null) {
      params.custom_coordinates = encodeDoubleArray(options.custom_coordinates);
    }
    if (options.detection != null) {
      params.detection = options.detection;
    }
    if (options.face_coordinates != null) {
      params.face_coordinates = encodeDoubleArray(options.face_coordinates);
    }
    if (options.headers != null) {
      params.headers = utils.build_custom_headers(options.headers);
    }
    if (options.notification_url != null) {
      params.notification_url = options.notification_url;
    }
    if (options.ocr != null) {
      params.ocr = options.ocr;
    }
    if (options.raw_convert != null) {
      params.raw_convert = options.raw_convert;
    }
    if (options.similarity_search != null) {
      params.similarity_search = options.similarity_search;
    }
    if (options.tags != null) {
      params.tags = toArray(options.tags).join(",");
    }
    if (options.quality_override != null) {
      params.quality_override = options.quality_override;
    }
    if (options.asset_folder != null) {
      params.asset_folder = options.asset_folder;
    }
    if (options.display_name != null) {
      params.display_name = options.display_name;
    }
    if (options.unique_display_name != null) {
      params.unique_display_name = options.unique_display_name;
    }
    if (options.visual_search != null) {
      params.visual_search = options.visual_search;
    }
    if (options.regions != null) {
      params.regions = JSON.stringify(options.regions);
    }
    const autoTranscription = options.auto_transcription;
    if (autoTranscription != null) {
      if (typeof autoTranscription === "boolean") {
        params.auto_transcription = utils.as_safe_bool(autoTranscription);
      } else {
        const isAutoTranscriptionObject = typeof autoTranscription === "object" && !Array.isArray(autoTranscription);
        if (isAutoTranscriptionObject && Object.keys(autoTranscription).includes("translate")) {
          params.auto_transcription = JSON.stringify(autoTranscription);
        }
      }
    }
    return params;
  }
  var URL_KEYS = ["api_secret", "auth_token", "cdn_subdomain", "cloud_name", "cname", "format", "long_url_signature", "private_cdn", "resource_type", "secure", "secure_cdn_subdomain", "secure_distribution", "shorten", "sign_url", "ssl_detected", "type", "url_suffix", "use_root_path", "version"];
  function extractUrlParams(options) {
    return pickOnlyExistingValues(options, ...URL_KEYS);
  }
  function extractTransformationParams(options) {
    return pickOnlyExistingValues(options, ...TRANSFORMATION_PARAMS);
  }
  function patchFetchFormat(options = {}) {
    if (options.type === "fetch") {
      if (options.fetch_format == null) {
        options.fetch_format = consumeOption(options, "format");
      }
    }
  }
  function build_distribution_domain(source, options) {
    const cloud_name = consumeOption(options, "cloud_name", config2().cloud_name);
    if (!cloud_name) {
      throw new Error("Must supply cloud_name in tag or in configuration");
    }
    let secure = consumeOption(options, "secure", true);
    const ssl_detected = consumeOption(options, "ssl_detected", config2().ssl_detected);
    if (secure === null) {
      secure = ssl_detected || config2().secure;
    }
    const private_cdn = consumeOption(options, "private_cdn", config2().private_cdn);
    const cname = consumeOption(options, "cname", config2().cname);
    const secure_distribution = consumeOption(options, "secure_distribution", config2().secure_distribution);
    const cdn_subdomain = consumeOption(options, "cdn_subdomain", config2().cdn_subdomain);
    const secure_cdn_subdomain = consumeOption(options, "secure_cdn_subdomain", config2().secure_cdn_subdomain);
    return unsigned_url_prefix(source, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution);
  }
  function url(public_id, options = {}) {
    let signature, source_to_sign;
    utils.patchFetchFormat(options);
    let type = consumeOption(options, "type", null);
    let transformation = utils.generate_transformation_string(options);
    let resource_type = consumeOption(options, "resource_type", "image");
    let version = consumeOption(options, "version");
    let force_version = consumeOption(options, "force_version", config2().force_version);
    if (force_version == null) {
      force_version = true;
    }
    let long_url_signature = !!consumeOption(options, "long_url_signature", config2().long_url_signature);
    let format = consumeOption(options, "format");
    let shorten = consumeOption(options, "shorten", config2().shorten);
    let sign_url = consumeOption(options, "sign_url", config2().sign_url);
    let api_secret = consumeOption(options, "api_secret", config2().api_secret);
    let url_suffix = consumeOption(options, "url_suffix");
    let use_root_path = consumeOption(options, "use_root_path", config2().use_root_path);
    let signature_algorithm = consumeOption(options, "signature_algorithm", config2().signature_algorithm || DEFAULT_SIGNATURE_ALGORITHM);
    if (long_url_signature) {
      signature_algorithm = "sha256";
    }
    let auth_token = consumeOption(options, "auth_token");
    if (auth_token !== false) {
      auth_token = exports.merge(config2().auth_token, auth_token);
    }
    let preloaded = /^(image|raw)\/([a-z0-9_]+)\/v(\d+)\/([^#]+)$/.exec(public_id);
    if (preloaded) {
      resource_type = preloaded[1];
      type = preloaded[2];
      version = preloaded[3];
      public_id = preloaded[4];
    }
    let original_source = public_id;
    if (public_id == null) {
      return original_source;
    }
    public_id = public_id.toString();
    if (type === null && public_id.match(/^https?:\//i)) {
      return original_source;
    }
    [resource_type, type] = finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten);
    [public_id, source_to_sign] = finalize_source(public_id, format, url_suffix);
    if (version == null && force_version && source_to_sign.indexOf("/") >= 0 && !source_to_sign.match(/^v[0-9]+/) && !source_to_sign.match(/^https?:\//)) {
      version = 1;
    }
    if (version != null) {
      version = `v${version}`;
    } else {
      version = null;
    }
    transformation = transformation.replace(/([^:])\/\//g, "$1/");
    if (sign_url && isEmpty(auth_token)) {
      let to_sign = [transformation, source_to_sign].filter(function(part) {
        return part != null && part !== "";
      }).join("/");
      const signatureConfig = {};
      if (long_url_signature) {
        signatureConfig.algorithm = "sha256";
        signatureConfig.signatureLength = 32;
      } else {
        signatureConfig.algorithm = signature_algorithm;
        signatureConfig.signatureLength = 8;
      }
      const truncated = compute_hash(to_sign + api_secret, signatureConfig.algorithm, "base64").slice(0, signatureConfig.signatureLength).replace(/\//g, "_").replace(/\+/g, "-");
      signature = `s--${truncated}--`;
    }
    let prefix = build_distribution_domain(public_id, options);
    let resultUrl = [prefix, resource_type, type, signature, transformation, version, public_id].filter(function(part) {
      return part != null && part !== "";
    }).join("/").replace(/ /g, "%20");
    if (sign_url && !isEmpty(auth_token)) {
      const parsedUrl = new URL2(resultUrl, "http://dummy");
      auth_token.url = parsedUrl.pathname + parsedUrl.search;
      let token = generate_token(auth_token);
      resultUrl += `?${token}`;
    }
    const urlAnalytics = ensureOption(options, "urlAnalytics", ensureOption(options, "analytics", true));
    if (urlAnalytics === true) {
      let {
        sdkCode: sdkCodeDefault,
        sdkSemver: sdkSemverDefault,
        techVersion: techVersionDefault,
        product: productDefault
      } = getSDKVersions();
      const sdkCode = ensureOption(options, "sdkCode", ensureOption(options, "sdk_code", sdkCodeDefault));
      const sdkSemver = ensureOption(options, "sdkSemver", ensureOption(options, "sdk_semver", sdkSemverDefault));
      const techVersion = ensureOption(options, "techVersion", ensureOption(options, "tech_version", techVersionDefault));
      const product = ensureOption(options, "product", productDefault);
      let sdkVersions = {
        sdkCode,
        sdkSemver,
        techVersion,
        product,
        urlAnalytics
      };
      let analyticsOptions = getAnalyticsOptions(Object.assign({}, options, sdkVersions));
      let sdkAnalyticsSignature = getSDKAnalyticsSignature(analyticsOptions);
      let appender = "?";
      if (resultUrl.indexOf("?") >= 0) {
        appender = "&";
      }
      resultUrl = `${resultUrl}${appender}_a=${sdkAnalyticsSignature}`;
    }
    return resultUrl;
  }
  function video_url(public_id, options) {
    options = extend({
      resource_type: "video"
    }, options);
    return utils.url(public_id, options);
  }
  function finalize_source(source, format, url_suffix) {
    let source_to_sign;
    source = source.replace(/([^:])\/\//g, "$1/");
    if (source.match(/^https?:\//i)) {
      source = smart_escape(source);
      source_to_sign = source;
    } else {
      source = encodeURIComponent(decodeURIComponent(source)).replace(/%3A/g, ":").replace(/%2F/g, "/");
      source_to_sign = source;
      if (url_suffix) {
        if (url_suffix.match(/[\.\/]/)) {
          throw new Error("url_suffix should not include . or /");
        }
        source = source + "/" + url_suffix;
      }
      if (format != null) {
        source = source + "." + format;
        source_to_sign = source_to_sign + "." + format;
      }
    }
    return [source, source_to_sign];
  }
  function video_thumbnail_url(public_id, options) {
    options = extend({}, DEFAULT_POSTER_OPTIONS, options);
    return utils.url(public_id, options);
  }
  function finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten) {
    if (type == null) {
      type = "upload";
    }
    if (url_suffix != null) {
      if (resource_type === "image" && type === "upload") {
        resource_type = "images";
        type = null;
      } else if (resource_type === "image" && type === "private") {
        resource_type = "private_images";
        type = null;
      } else if (resource_type === "image" && type === "authenticated") {
        resource_type = "authenticated_images";
        type = null;
      } else if (resource_type === "raw" && type === "upload") {
        resource_type = "files";
        type = null;
      } else if (resource_type === "video" && type === "upload") {
        resource_type = "videos";
        type = null;
      } else {
        throw new Error("URL Suffix only supported for image/upload, image/private, image/authenticated, video/upload and raw/upload");
      }
    }
    if (use_root_path) {
      if (resource_type === "image" && type === "upload" || resource_type === "images" && type == null) {
        resource_type = null;
        type = null;
      } else {
        throw new Error("Root path only supported for image/upload");
      }
    }
    if (shorten && resource_type === "image" && type === "upload") {
      resource_type = "iu";
      type = null;
    }
    return [resource_type, type];
  }
  function unsigned_url_prefix(source, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution) {
    let prefix;
    if (cloud_name.indexOf("/") === 0) {
      return "/res" + cloud_name;
    }
    let shared_domain = !private_cdn;
    if (secure) {
      if (secure_distribution == null || secure_distribution === exports.OLD_AKAMAI_SHARED_CDN) {
        secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : exports.SHARED_CDN;
      }
      if (shared_domain == null) {
        shared_domain = secure_distribution === exports.SHARED_CDN;
      }
      if (secure_cdn_subdomain == null && shared_domain) {
        secure_cdn_subdomain = cdn_subdomain;
      }
      if (secure_cdn_subdomain) {
        secure_distribution = secure_distribution.replace("res.cloudinary.com", "res-" + (crc32(source) % 5 + 1 + ".cloudinary.com"));
      }
      prefix = "https://" + secure_distribution;
    } else if (cname) {
      let subdomain = cdn_subdomain ? "a" + (crc32(source) % 5 + 1) + "." : "";
      prefix = "http://" + subdomain + cname;
    } else {
      let cdn_part = private_cdn ? cloud_name + "-" : "";
      let subdomain_part = cdn_subdomain ? "-" + (crc32(source) % 5 + 1) : "";
      let host = [cdn_part, "res", subdomain_part, ".cloudinary.com"].join("");
      prefix = "http://" + host;
    }
    if (shared_domain) {
      prefix += "/" + cloud_name;
    }
    return prefix;
  }
  function base_api_url_v1_1() {
    return base_api_url("v1_1");
  }
  function base_api_url_v2() {
    return base_api_url("v2");
  }
  function base_api_url(api_version) {
    if (!api_version || api_version.length === 0) {
      throw new Error("api_version needs to be a non-empty string");
    }
    return (path = [], options = []) => {
      let cloudinary = ensureOption(options, "upload_prefix", UPLOAD_PREFIX);
      let cloud_name = ensureOption(options, "cloud_name");
      let encode_path = (unencoded_path) => encodeURIComponent(unencoded_path).replace("'", "%27");
      let encoded_path = Array.isArray(path) ? path.map(encode_path) : encode_path(path);
      return [cloudinary, api_version, cloud_name].concat(encoded_path).join("/");
    };
  }
  function api_url(action = "upload", options = {}) {
    let resource_type = options.resource_type || "image";
    return base_api_url_v1_1()([resource_type, action], options);
  }
  function random_public_id() {
    return crypto2.randomBytes(12).toString("base64").replace(/[^a-z0-9]/g, "");
  }
  function signed_preloaded_image(result) {
    return `${result.resource_type}/upload/v${result.version}/${filter([result.public_id, result.format], utils.present).join(".")}#${result.signature}`;
  }
  function encode_param(value) {
    return String(value).replace(/&/g, "%26");
  }
  function api_string_to_sign(params_to_sign, signature_version = 2) {
    let params = entries(params_to_sign).map(([k, v]) => [String(k), Array.isArray(v) ? v.join(",") : v]).filter(([k, v]) => v !== null && v !== undefined && v !== "");
    params.sort((a, b) => a[0].localeCompare(b[0]));
    let paramStrings = params.map(([k, v]) => {
      const paramString = `${k}=${v}`;
      return signature_version >= 2 ? encode_param(paramString) : paramString;
    });
    return paramStrings.join("&");
  }
  function api_sign_request(params_to_sign, api_secret, signature_algorithm = null, signature_version = null) {
    if (signature_version == null) {
      signature_version = config2().signature_version || 2;
    }
    const to_sign = api_string_to_sign(params_to_sign, signature_version);
    const algo = signature_algorithm || config2().signature_algorithm || DEFAULT_SIGNATURE_ALGORITHM;
    return compute_hash(to_sign + api_secret, algo, "hex");
  }
  function compute_hash(input, signature_algorithm, encoding) {
    if (!SUPPORTED_SIGNATURE_ALGORITHMS.includes(signature_algorithm)) {
      throw new Error(`Signature algorithm ${signature_algorithm} is not supported. Supported algorithms: ${SUPPORTED_SIGNATURE_ALGORITHMS.join(", ")}`);
    }
    const hash = crypto2.createHash(signature_algorithm).update(input).digest();
    return Buffer.from(hash).toString(encoding);
  }
  function clear_blank(hash) {
    let filtered_hash = {};
    entries(hash).filter(([k, v]) => utils.present(v)).forEach(([k, v]) => {
      filtered_hash[k] = v.filter ? v.filter((x) => x) : v;
    });
    return filtered_hash;
  }
  function sort_object_by_key(object) {
    return Object.keys(object).sort().reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  }
  function merge(hash1, hash2) {
    return { ...hash1, ...hash2 };
  }
  function sign_request(params, options = {}) {
    let apiKey = ensureOption(options, "api_key");
    let apiSecret = ensureOption(options, "api_secret");
    let signature_algorithm = options.signature_algorithm;
    let signature_version = options.signature_version;
    params = exports.clear_blank(params);
    params.signature = exports.api_sign_request(params, apiSecret, signature_algorithm, signature_version);
    params.api_key = apiKey;
    return params;
  }
  function webhook_signature(data, timestamp, options = {}) {
    ensurePresenceOf({
      data,
      timestamp
    });
    let api_secret = ensureOption(options, "api_secret");
    let signature_algorithm = ensureOption(options, "signature_algorithm", DEFAULT_SIGNATURE_ALGORITHM);
    return compute_hash(data + timestamp + api_secret, signature_algorithm, "hex");
  }
  function verifyNotificationSignature(body, timestamp, signature, valid_for = 7200) {
    if (timestamp < Math.round(Date.now() / 1000) - valid_for) {
      return false;
    }
    const payload_hash = utils.webhook_signature(body, timestamp, {
      api_secret: config2().api_secret,
      signature_algorithm: config2().signature_algorithm
    });
    return signature === payload_hash;
  }
  function process_request_params(params, options) {
    if (options.unsigned != null && options.unsigned) {
      params = exports.clear_blank(params);
      delete params.timestamp;
    } else if (options.oauth_token || config2().oauth_token) {
      params = exports.clear_blank(params);
    } else if (options.signature) {
      params = exports.clear_blank(options);
    } else {
      params = exports.sign_request(params, options);
    }
    return params;
  }
  function private_download_url(public_id, format, options = {}) {
    let params = exports.sign_request({
      timestamp: options.timestamp || exports.timestamp(),
      public_id,
      format,
      type: options.type,
      attachment: options.attachment,
      expires_at: options.expires_at
    }, options);
    return exports.api_url("download", options) + "?" + querystring.stringify(params);
  }
  function zip_download_url(tag, options = {}) {
    let params = exports.sign_request({
      timestamp: options.timestamp || exports.timestamp(),
      tag,
      transformation: utils.generate_transformation_string(options)
    }, options);
    return exports.api_url("download_tag.zip", options) + "?" + hashToQuery(params);
  }
  function download_backedup_asset(asset_id, version_id, options = {}) {
    let params = exports.sign_request({
      timestamp: options.timestamp || exports.timestamp(),
      asset_id,
      version_id
    }, options);
    return exports.base_api_url_v1()(["download_backup"], options) + "?" + hashToQuery(params);
  }
  function api_download_url(action, params, options) {
    const download_params = {
      ...params,
      mode: "download"
    };
    let cloudinary_params = exports.sign_request(download_params, options);
    return exports.api_url(action, options) + "?" + hashToQuery(cloudinary_params);
  }
  function download_archive_url(options = {}) {
    const params = exports.archive_params(merge(options, {
      mode: "download"
    }));
    return api_download_url("generate_archive", params, options);
  }
  function download_zip_url(options = {}) {
    return exports.download_archive_url(merge(options, {
      target_format: "zip"
    }));
  }
  function download_folder(folder_path, options = {}) {
    options.resource_type = options.resource_type || "all";
    options.prefixes = folder_path;
    let cloudinary_params = exports.sign_request(exports.archive_params(merge(options, {
      mode: "download"
    })), options);
    return exports.api_url("generate_archive", options) + "?" + hashToQuery(cloudinary_params);
  }
  function join_pair(key, value) {
    if (!value) {
      return;
    }
    return value === true ? key : key + "='" + value + "'";
  }
  function escapeQuotes(value) {
    return isString(value) ? value.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") : value;
  }
  exports.html_attrs = function html_attrs(attrs) {
    return filter(map(attrs, function(value, key) {
      return join_pair(key, escapeQuotes(value));
    })).sort().join(" ");
  };
  var CLOUDINARY_JS_CONFIG_PARAMS = ["api_key", "cloud_name", "private_cdn", "secure_distribution", "cdn_subdomain"];
  function cloudinary_js_config() {
    let params = pickOnlyExistingValues(config2(), ...CLOUDINARY_JS_CONFIG_PARAMS);
    return `<script type='text/javascript'>
$.cloudinary.config(${JSON.stringify(params)});
</script>`;
  }
  function v1_result_adapter(callback) {
    if (callback == null) {
      return;
    }
    return function(result) {
      if (result.error != null) {
        return callback(result.error);
      }
      return callback(undefined, result);
    };
  }
  function v1_adapter(name, num_pass_args, v1) {
    return function(...args) {
      let pass_args = take(args, num_pass_args);
      let options = args[num_pass_args];
      let callback = args[num_pass_args + 1];
      if (callback == null && isFunction(options)) {
        callback = options;
        options = {};
      }
      callback = v1_result_adapter(callback);
      args = pass_args.concat([callback, options]);
      return v1[name].apply(this, args);
    };
  }
  function v1_adapters(exports2, v1, mapping) {
    return Object.keys(mapping).map((name) => {
      let num_pass_args = mapping[name];
      exports2[name] = v1_adapter(name, num_pass_args, v1);
      return exports2[name];
    });
  }
  function as_safe_bool(value) {
    if (value == null) {
      return;
    }
    if (value === true || value === "true" || value === "1") {
      value = 1;
    }
    if (value === false || value === "false" || value === "0") {
      value = 0;
    }
    return value;
  }
  var NUMBER_PATTERN = "([0-9]*)\\.([0-9]+)|([0-9]+)";
  var OFFSET_ANY_PATTERN = `(${NUMBER_PATTERN})([%pP])?`;
  var RANGE_VALUE_RE = RegExp(`^${OFFSET_ANY_PATTERN}$`);
  var OFFSET_ANY_PATTERN_RE = RegExp(`(${OFFSET_ANY_PATTERN})\\.\\.(${OFFSET_ANY_PATTERN})`);
  function split_range(range) {
    switch (range.constructor) {
      case String:
        if (!OFFSET_ANY_PATTERN_RE.test(range)) {
          return range;
        }
        return range.split("..");
      case Array:
        return [first(range), last(range)];
      default:
        return [null, null];
    }
  }
  function norm_range_value(value) {
    let offset = String(value).match(RANGE_VALUE_RE);
    if (offset) {
      let modifier = offset[5] ? "p" : "";
      value = `${offset[1] || offset[4]}${modifier}`;
    }
    return value;
  }
  function process_video_params(param) {
    switch (param.constructor) {
      case Object: {
        let video = "";
        if ("codec" in param) {
          video = param.codec;
          if ("profile" in param) {
            video += ":" + param.profile;
            if ("level" in param) {
              video += ":" + param.level;
            }
          }
        }
        return video;
      }
      case String:
        return param;
      default:
        return null;
    }
  }
  function archive_params(options = {}) {
    return {
      allow_missing: exports.as_safe_bool(options.allow_missing),
      async: exports.as_safe_bool(options.async),
      expires_at: options.expires_at,
      flatten_folders: exports.as_safe_bool(options.flatten_folders),
      flatten_transformations: exports.as_safe_bool(options.flatten_transformations),
      keep_derived: exports.as_safe_bool(options.keep_derived),
      mode: options.mode,
      notification_url: options.notification_url,
      prefixes: options.prefixes && toArray(options.prefixes),
      fully_qualified_public_ids: options.fully_qualified_public_ids && toArray(options.fully_qualified_public_ids),
      public_ids: options.public_ids && toArray(options.public_ids),
      skip_transformation_name: exports.as_safe_bool(options.skip_transformation_name),
      tags: options.tags && toArray(options.tags),
      target_format: options.target_format,
      target_public_id: options.target_public_id,
      target_asset_folder: options.target_asset_folder,
      target_tags: options.target_tags && toArray(options.target_tags),
      timestamp: options.timestamp || exports.timestamp(),
      transformations: utils.build_eager(options.transformations),
      type: options.type,
      use_original_filename: exports.as_safe_bool(options.use_original_filename)
    };
  }
  exports.process_layer = process_layer;
  exports.create_source_tag = function create_source_tag(src, source_type, codecs = null) {
    let video_type = source_type === "ogv" ? "ogg" : source_type;
    let mime_type = `video/${video_type}`;
    if (!isEmpty(codecs)) {
      let codecs_str = isArray(codecs) ? codecs.join(", ") : codecs;
      mime_type += `; codecs=${codecs_str}`;
    }
    return `<source ${utils.html_attrs({
      src,
      type: mime_type
    })}>`;
  };
  function build_explicit_api_params(public_id, options = {}) {
    return [exports.build_upload_params(extend({}, { public_id }, options))];
  }
  function generate_responsive_breakpoints_string(breakpoints) {
    if (breakpoints == null) {
      return null;
    }
    breakpoints = clone(breakpoints);
    if (!isArray(breakpoints)) {
      breakpoints = [breakpoints];
    }
    for (let j = 0;j < breakpoints.length; j++) {
      let breakpoint_settings = breakpoints[j];
      if (breakpoint_settings != null) {
        if (breakpoint_settings.transformation) {
          breakpoint_settings.transformation = utils.generate_transformation_string(clone(breakpoint_settings.transformation));
        }
      }
    }
    return JSON.stringify(breakpoints);
  }
  function build_streaming_profiles_param(options = {}) {
    let params = pickOnlyExistingValues(options, "display_name", "representations");
    if (isArray(params.representations)) {
      params.representations = JSON.stringify(params.representations.map((r) => ({
        transformation: utils.generate_transformation_string(r.transformation)
      })));
    }
    return params;
  }
  function hashToParameters(hash) {
    return entries(hash).reduce((parameters, [key, value]) => {
      if (isArray(value)) {
        key = key.endsWith("[]") ? key : key + "[]";
        const items = value.map((v) => [key, v]);
        parameters = parameters.concat(items);
      } else {
        parameters.push([key, value]);
      }
      return parameters;
    }, []);
  }
  function hashToQuery(hash) {
    return hashToParameters(hash).map(([key, value]) => `${querystring.escape(key)}=${querystring.escape(value)}`).join("&");
  }
  function present(value) {
    return value != null && ("" + value).length > 0;
  }
  function pickOnlyExistingValues(source, ...keys) {
    let result = {};
    if (source) {
      keys.forEach((key) => {
        if (source[key] != null) {
          result[key] = source[key];
        }
      });
    }
    return result;
  }
  function jsonArrayParam(data, modifier) {
    if (!data) {
      return null;
    }
    if (isString(data)) {
      data = JSON.parse(data);
    }
    if (!isArray(data)) {
      data = [data];
    }
    if (isFunction(modifier)) {
      data = modifier(data);
    }
    return JSON.stringify(data);
  }
  exports.NOP = function() {};
  function deferredPromise() {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    applyQCompat(promise);
    promise.catch(() => {});
    return {
      resolve,
      reject,
      promise
    };
  }
  exports.deferredPromise = deferredPromise;
  exports.generate_auth_token = generate_auth_token;
  exports.getUserAgent = getUserAgent;
  exports.build_upload_params = build_upload_params;
  exports.build_multi_and_sprite_params = build_multi_and_sprite_params;
  exports.api_download_url = api_download_url;
  exports.timestamp = () => Math.floor(new Date().getTime() / 1000);
  exports.option_consume = consumeOption;
  exports.build_array = toArray;
  exports.encode_double_array = encodeDoubleArray;
  exports.encode_key_value = encode_key_value;
  exports.encode_context = encode_context;
  exports.build_eager = build_eager;
  exports.build_custom_headers = build_custom_headers;
  exports.generate_transformation_string = generate_transformation_string;
  exports.updateable_resource_params = updateable_resource_params;
  exports.extractUrlParams = extractUrlParams;
  exports.extractTransformationParams = extractTransformationParams;
  exports.patchFetchFormat = patchFetchFormat;
  exports.url = url;
  exports.video_url = video_url;
  exports.video_thumbnail_url = video_thumbnail_url;
  exports.api_url = api_url;
  exports.random_public_id = random_public_id;
  exports.signed_preloaded_image = signed_preloaded_image;
  exports.api_sign_request = api_sign_request;
  exports.clear_blank = clear_blank;
  exports.merge = merge;
  exports.sign_request = sign_request;
  exports.webhook_signature = webhook_signature;
  exports.verifyNotificationSignature = verifyNotificationSignature;
  exports.process_request_params = process_request_params;
  exports.private_download_url = private_download_url;
  exports.zip_download_url = zip_download_url;
  exports.download_archive_url = download_archive_url;
  exports.download_zip_url = download_zip_url;
  exports.cloudinary_js_config = cloudinary_js_config;
  exports.v1_adapters = v1_adapters;
  exports.as_safe_bool = as_safe_bool;
  exports.archive_params = archive_params;
  exports.build_explicit_api_params = build_explicit_api_params;
  exports.generate_responsive_breakpoints_string = generate_responsive_breakpoints_string;
  exports.build_streaming_profiles_param = build_streaming_profiles_param;
  exports.hashToParameters = hashToParameters;
  exports.present = present;
  exports.only = pickOnlyExistingValues;
  exports.pickOnlyExistingValues = pickOnlyExistingValues;
  exports.jsonArrayParam = jsonArrayParam;
  exports.download_folder = download_folder;
  exports.base_api_url_v1 = base_api_url_v1_1;
  exports.base_api_url_v2 = base_api_url_v2;
  exports.download_backedup_asset = download_backedup_asset;
  exports.compute_hash = compute_hash;
  exports.build_distribution_domain = build_distribution_domain;
  exports.sort_object_by_key = sort_object_by_key;
  exports.DEFAULT_POSTER_OPTIONS = DEFAULT_POSTER_OPTIONS;
  exports.DEFAULT_VIDEO_SOURCE_TYPES = DEFAULT_VIDEO_SOURCE_TYPES;
  Object.assign(module.exports, {
    normalize_expression,
    at,
    clone,
    extend,
    filter,
    handleFileParameter,
    includes,
    isArray,
    isEmpty,
    isNumber,
    isObject,
    isRemoteUrl,
    isString,
    isUndefined,
    keys: (source) => Object.keys(source),
    ensurePresenceOf
  });
  function verify_api_response_signature(public_id, version, signature) {
    const api_secret = config2().api_secret;
    const expected = exports.api_sign_request({
      public_id,
      version
    }, api_secret, null, 1);
    return signature === expected;
  }
  exports.verify_api_response_signature = verify_api_response_signature;
});

// node_modules/cloudinary/lib/cache.js
var require_cache = __commonJS((exports, module) => {
  var CACHE = Symbol.for("com.cloudinary.cache");
  var CACHE_ADAPTER = Symbol.for("com.cloudinary.cacheAdapter");
  var { ensurePresenceOf, generate_transformation_string } = require_utils();

  class CacheAdapter {
    get(publicId, type, resourceType, transformation, format) {}
    set(publicId, type, resourceType, transformation, format, value) {}
    flushAll() {}
  }
  var Cache = {
    CacheAdapter,
    setAdapter(adapter) {
      if (this.adapter) {
        console.warn("Overriding existing cache adapter");
      }
      this.adapter = adapter;
    },
    getAdapter() {
      return this.adapter;
    },
    get(publicId, options) {
      if (!this.adapter) {
        return;
      }
      ensurePresenceOf({ publicId });
      let transformation = generate_transformation_string({ ...options });
      return this.adapter.get(publicId, options.type || "upload", options.resource_type || "image", transformation, options.format);
    },
    set(publicId, options, value) {
      if (!this.adapter) {
        return;
      }
      ensurePresenceOf({ publicId, value });
      let transformation = generate_transformation_string({ ...options });
      return this.adapter.set(publicId, options.type || "upload", options.resource_type || "image", transformation, options.format, value);
    },
    flushAll() {
      if (!this.adapter) {
        return;
      }
      return this.adapter.flushAll();
    }
  };
  Object.defineProperty(Cache, "instance", {
    get() {
      return global[CACHE];
    }
  });
  Object.defineProperty(Cache, "adapter", {
    get() {
      return global[CACHE_ADAPTER];
    },
    set(adapter) {
      global[CACHE_ADAPTER] = adapter;
    }
  });
  Object.freeze(Cache);
  var symbols = Object.getOwnPropertySymbols(global);
  if (symbols.indexOf(CACHE) < 0) {
    global[CACHE] = Cache;
  }
  module.exports = Cache;
});

// node_modules/cloudinary/lib/upload_stream.js
var require_upload_stream = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;

  class UploadStream extends Transform {
    constructor(options) {
      super();
      this.boundary = options.boundary;
    }
    _transform(data, encoding, next) {
      let buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, encoding);
      this.push(buffer);
      next();
    }
    _flush(next) {
      this.push(Buffer.from(`\r
`, "ascii"));
      this.push(Buffer.from("--" + this.boundary + "--", "ascii"));
      return next();
    }
  }
  module.exports = UploadStream;
});

// node_modules/cloudinary/lib/uploader.js
var require_uploader = __commonJS((exports) => {
  var fs = __require("fs");
  var {
    extname,
    basename
  } = __require("path");
  var Writable = __require("stream").Writable;
  var { upload_prefix } = require_config()();
  var isSecure = !(upload_prefix && upload_prefix.slice(0, 5) === "http:");
  var https = isSecure ? __require("https") : __require("http");
  var { URL: URL2 } = __require("url");
  var Cache = require_cache();
  var utils = require_utils();
  var UploadStream = require_upload_stream();
  var config2 = require_config();
  var ensureOption = require_ensureOption().defaults(config2());
  var agent = config2.api_proxy ? new https.Agent(config2.api_proxy) : null;
  var {
    build_upload_params,
    extend,
    includes,
    isEmpty,
    isObject,
    isRemoteUrl,
    merge,
    pickOnlyExistingValues
  } = utils;
  exports.unsigned_upload_stream = function unsigned_upload_stream(upload_preset, callback, options = {}) {
    return exports.upload_stream(callback, merge(options, {
      unsigned: true,
      upload_preset
    }));
  };
  exports.upload_stream = function upload_stream(callback, options = {}) {
    return exports.upload(null, callback, extend({
      stream: true
    }, options));
  };
  exports.unsigned_upload = function unsigned_upload(file, upload_preset, callback, options = {}) {
    return exports.upload(file, callback, merge(options, {
      unsigned: true,
      upload_preset
    }));
  };
  exports.upload = function upload(file, callback, options = {}) {
    return call_api("upload", callback, options, function() {
      let params = build_upload_params(options);
      return isRemoteUrl(file) ? [params, { file }] : [params, {}, file];
    });
  };
  exports.upload_large = function upload_large(path, callback, options = {}) {
    if (path != null && isRemoteUrl(path)) {
      return exports.upload(path, callback, options);
    }
    if (path != null && !options.filename) {
      options.filename = path.split(/(\\|\/)/g).pop().replace(/\.[^/.]+$/, "");
    }
    return exports.upload_chunked(path, callback, extend({
      resource_type: "raw"
    }, options));
  };
  exports.upload_chunked = function upload_chunked(path, callback, options) {
    let file_reader = fs.createReadStream(path);
    let out_stream = exports.upload_chunked_stream(callback, options);
    return file_reader.pipe(out_stream);
  };

  class Chunkable extends Writable {
    constructor(options) {
      super(options);
      this.chunk_size = options.chunk_size != null ? options.chunk_size : 20000000;
      this.buffer = Buffer.alloc(0);
      this.active = true;
      this.on("finish", () => {
        if (this.active) {
          this.emit("ready", this.buffer, true, function() {});
        }
      });
    }
    _write(data, encoding, done) {
      if (!this.active) {
        done();
      }
      if (this.buffer.length + data.length <= this.chunk_size) {
        this.buffer = Buffer.concat([this.buffer, data], this.buffer.length + data.length);
        done();
      } else {
        const grab = this.chunk_size - this.buffer.length;
        this.buffer = Buffer.concat([this.buffer, data.slice(0, grab)], this.buffer.length + grab);
        this.emit("ready", this.buffer, false, (active) => {
          this.active = active;
          if (this.active) {
            const remaining = data.slice(grab);
            this.buffer = Buffer.alloc(0);
            this._write(remaining, encoding, done);
          }
        });
      }
    }
  }
  exports.upload_large_stream = function upload_large_stream(_unused_, callback, options = {}) {
    return exports.upload_chunked_stream(callback, extend({
      resource_type: "raw"
    }, options));
  };
  exports.upload_chunked_stream = function upload_chunked_stream(callback, options = {}) {
    options = extend({}, options, {
      stream: true
    });
    options.x_unique_upload_id = utils.random_public_id();
    let params = build_upload_params(options);
    let chunk_size = options.chunk_size != null ? options.chunk_size : options.part_size;
    let chunker = new Chunkable({
      chunk_size
    });
    let sent = 0;
    chunker.on("ready", function(buffer, is_last, done) {
      let chunk_start = sent;
      sent += buffer.length;
      options.content_range = `bytes ${chunk_start}-${sent - 1}/${is_last ? sent : -1}`;
      params.timestamp = utils.timestamp();
      let finished_part = function(result) {
        const errorOrLast = result.error != null || is_last;
        if (errorOrLast && typeof callback === "function") {
          callback(result);
        }
        return done(!errorOrLast);
      };
      let stream = call_api("upload", finished_part, options, function() {
        return [params, {}, buffer];
      });
      return stream.write(buffer, "buffer", function() {
        return stream.end();
      });
    });
    return chunker;
  };
  exports.explicit = function explicit(public_id, callback, options = {}) {
    return call_api("explicit", callback, options, function() {
      return utils.build_explicit_api_params(public_id, options);
    });
  };
  exports.create_archive = function create_archive(callback, options = {}, target_format = null) {
    return call_api("generate_archive", callback, options, function() {
      let opt = utils.archive_params(options);
      if (target_format) {
        opt.target_format = target_format;
      }
      return [opt];
    });
  };
  exports.create_zip = function create_zip(callback, options = {}) {
    return exports.create_archive(callback, options, "zip");
  };
  exports.destroy = function destroy(public_id, callback, options = {}) {
    return call_api("destroy", callback, options, function() {
      return [
        {
          timestamp: utils.timestamp(),
          type: options.type,
          invalidate: options.invalidate,
          public_id,
          notification_url: options.notification_url
        }
      ];
    });
  };
  exports.rename = function rename(from_public_id, to_public_id, callback, options = {}) {
    return call_api("rename", callback, options, function() {
      return [
        {
          timestamp: utils.timestamp(),
          type: options.type,
          from_public_id,
          to_public_id,
          overwrite: options.overwrite,
          invalidate: options.invalidate,
          to_type: options.to_type,
          context: options.context,
          metadata: options.metadata,
          notification_url: options.notification_url
        }
      ];
    });
  };
  var TEXT_PARAMS = ["public_id", "font_family", "font_size", "font_color", "text_align", "font_weight", "font_style", "background", "opacity", "text_decoration", "font_hinting", "font_antialiasing"];
  exports.text = function text(content, callback, options = {}) {
    return call_api("text", callback, options, function() {
      let textParams = pickOnlyExistingValues(options, ...TEXT_PARAMS);
      let params = {
        timestamp: utils.timestamp(),
        text: content,
        ...textParams
      };
      return [params];
    });
  };
  exports.generate_sprite = function generate_sprite(tag, callback, options = {}) {
    return call_api("sprite", callback, options, function() {
      return [utils.build_multi_and_sprite_params(tag, options)];
    });
  };
  exports.download_generated_sprite = function download_generated_sprite(tag, options = {}) {
    return utils.api_download_url("sprite", utils.build_multi_and_sprite_params(tag, options), options);
  };
  exports.download_multi = function download_multi(tag, options = {}) {
    return utils.api_download_url("multi", utils.build_multi_and_sprite_params(tag, options), options);
  };
  exports.multi = function multi(tag, callback, options = {}) {
    return call_api("multi", callback, options, function() {
      return [utils.build_multi_and_sprite_params(tag, options)];
    });
  };
  exports.explode = function explode(public_id, callback, options = {}) {
    return call_api("explode", callback, options, function() {
      const transformation = utils.generate_transformation_string(extend({}, options));
      return [
        {
          timestamp: utils.timestamp(),
          public_id,
          transformation,
          format: options.format,
          type: options.type,
          notification_url: options.notification_url
        }
      ];
    });
  };
  exports.add_tag = function add_tag(tag, public_ids = [], callback, options = {}) {
    const exclusive = utils.option_consume("exclusive", options);
    const command = exclusive ? "set_exclusive" : "add";
    return call_tags_api(tag, command, public_ids, callback, options);
  };
  exports.remove_tag = function remove_tag(tag, public_ids = [], callback, options = {}) {
    return call_tags_api(tag, "remove", public_ids, callback, options);
  };
  exports.remove_all_tags = function remove_all_tags(public_ids = [], callback, options = {}) {
    return call_tags_api(null, "remove_all", public_ids, callback, options);
  };
  exports.replace_tag = function replace_tag(tag, public_ids = [], callback, options = {}) {
    return call_tags_api(tag, "replace", public_ids, callback, options);
  };
  function call_tags_api(tag, command, public_ids = [], callback, options = {}) {
    return call_api("tags", callback, options, function() {
      let params = {
        timestamp: utils.timestamp(),
        public_ids: utils.build_array(public_ids),
        command,
        type: options.type
      };
      if (tag != null) {
        params.tag = tag;
      }
      return [params];
    });
  }
  exports.add_context = function add_context(context, public_ids = [], callback, options = {}) {
    return call_context_api(context, "add", public_ids, callback, options);
  };
  exports.remove_all_context = function remove_all_context(public_ids = [], callback, options = {}) {
    return call_context_api(null, "remove_all", public_ids, callback, options);
  };
  function call_context_api(context, command, public_ids = [], callback, options = {}) {
    return call_api("context", callback, options, function() {
      let params = {
        timestamp: utils.timestamp(),
        public_ids: utils.build_array(public_ids),
        command,
        type: options.type
      };
      if (context != null) {
        params.context = utils.encode_context(context);
      }
      return [params];
    });
  }
  function cacheResults(result, {
    type,
    resource_type
  }) {
    if (result.responsive_breakpoints) {
      result.responsive_breakpoints.forEach(({
        transformation,
        url,
        breakpoints
      }) => Cache.set(result.public_id, {
        type,
        resource_type,
        raw_transformation: transformation,
        format: extname(breakpoints[0].url).slice(1)
      }, breakpoints.map((i) => i.width)));
    }
  }
  function parseResult(buffer, res) {
    let result = "";
    try {
      result = JSON.parse(buffer);
      if (result.error && !result.error.name) {
        result.error.name = "Error";
      }
    } catch (jsonError) {
      result = {
        error: {
          message: `Server return invalid JSON response. Status Code ${res.statusCode}. ${jsonError}`,
          name: "Error"
        }
      };
    }
    return result;
  }
  function call_api(action, callback, options, get_params) {
    if (typeof callback !== "function") {
      callback = function() {};
    }
    const USE_PROMISES = !options.disable_promises;
    const deferred = utils.deferredPromise();
    if (options == null) {
      options = {};
    }
    let [params, unsigned_params, file] = get_params.call();
    params = utils.process_request_params(params, options);
    params = extend(params, unsigned_params);
    let api_url = utils.api_url(action, options);
    let boundary = utils.random_public_id();
    let errorRaised = false;
    let handle_response = function(res) {
      if (errorRaised) {} else if (res.error) {
        errorRaised = true;
        if (USE_PROMISES) {
          deferred.reject(res);
        }
        callback(res);
      } else if (includes([200, 400, 401, 404, 420, 429, 500], res.statusCode)) {
        let buffer = "";
        res.on("data", (d) => {
          buffer += d;
          return buffer;
        });
        res.on("end", () => {
          let result2;
          if (errorRaised) {
            return;
          }
          result2 = parseResult(buffer, res);
          if (result2.error) {
            result2.error.http_code = res.statusCode;
            if (USE_PROMISES) {
              deferred.reject(result2.error);
            }
          } else {
            cacheResults(result2, options);
            if (USE_PROMISES) {
              deferred.resolve(result2);
            }
          }
          callback(result2);
        });
        res.on("error", (error) => {
          errorRaised = true;
          if (USE_PROMISES) {
            deferred.reject(error);
          }
          callback({ error });
        });
      } else {
        let error = {
          message: `Server returned unexpected status code - ${res.statusCode}`,
          http_code: res.statusCode,
          name: "UnexpectedResponse"
        };
        if (USE_PROMISES) {
          deferred.reject(error);
        }
        callback({ error });
      }
    };
    let post_data = utils.hashToParameters(params).filter(([key, value]) => value != null).map(([key, value]) => Buffer.from(encodeFieldPart(boundary, key, value), "utf8"));
    let result = post(api_url, post_data, boundary, file, handle_response, options);
    if (isObject(result)) {
      return result;
    }
    if (USE_PROMISES) {
      return deferred.promise;
    }
  }
  function post(url, post_data, boundary, file, callback, options) {
    let file_header;
    let finish_buffer = Buffer.from("--" + boundary + "--", "ascii");
    let oauth_token = options.oauth_token || config2().oauth_token;
    if (file != null || options.stream) {
      let filename = options.stream ? options.filename ? options.filename : "file" : basename(file);
      file_header = Buffer.from(encodeFilePart(boundary, "application/octet-stream", "file", filename), "binary");
    }
    const parsedUrl = new URL2(url);
    let post_options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      pathname: parsedUrl.pathname,
      query: parsedUrl.search ? parsedUrl.search.substring(1) : ""
    };
    if (parsedUrl.port) {
      post_options.port = parsedUrl.port;
    }
    let headers = {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "User-Agent": utils.getUserAgent()
    };
    if (options.content_range != null) {
      headers["Content-Range"] = options.content_range;
    }
    if (options.x_unique_upload_id != null) {
      headers["X-Unique-Upload-Id"] = options.x_unique_upload_id;
    }
    if (options.extra_headers !== null) {
      headers = merge(headers, options.extra_headers);
    }
    if (oauth_token != null) {
      headers.Authorization = `Bearer ${oauth_token}`;
    }
    post_options = extend(post_options, {
      method: "POST",
      headers
    });
    if (options.agent != null) {
      post_options.agent = options.agent;
    }
    let proxy = options.api_proxy || config2().api_proxy;
    if (!isEmpty(proxy)) {
      if (!post_options.agent && agent) {
        post_options.agent = agent;
      } else if (!post_options.agent) {
        post_options.agent = new https.Agent(proxy);
      } else {
        console.warn("Proxy is set, but request uses a custom agent, proxy is ignored.");
      }
    }
    let post_request = https.request(post_options, callback);
    let upload_stream = new UploadStream({ boundary });
    upload_stream.pipe(post_request);
    let timeout = false;
    post_request.on("error", function(error) {
      if (timeout) {
        error = {
          message: "Request Timeout",
          http_code: 499,
          name: "TimeoutError"
        };
      }
      return callback({ error });
    });
    post_request.setTimeout(options.timeout != null ? options.timeout : 60000, function() {
      timeout = true;
      return post_request.abort();
    });
    post_data.forEach((postDatum) => post_request.write(postDatum));
    if (options.stream) {
      post_request.write(file_header);
      return upload_stream;
    }
    if (file != null) {
      post_request.write(file_header);
      fs.createReadStream(file).on("error", function(error) {
        callback({
          error
        });
        return post_request.abort();
      }).pipe(upload_stream);
    } else {
      post_request.write(finish_buffer);
      post_request.end();
    }
    return true;
  }
  function encodeFieldPart(boundary, name, value) {
    return [
      `--${boundary}\r
`,
      `Content-Disposition: form-data; name="${name}"\r
`,
      `\r
`,
      `${value}\r
`,
      ""
    ].join("");
  }
  function encodeFilePart(boundary, type, name, filename) {
    return [
      `--${boundary}\r
`,
      `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r
`,
      `Content-Type: ${type}\r
`,
      `\r
`,
      ""
    ].join("");
  }
  exports.direct_upload = function direct_upload(callback_url, options = {}) {
    let params = build_upload_params(extend({
      callback: callback_url
    }, options));
    params = utils.process_request_params(params, options);
    let api_url = utils.api_url("upload", options);
    return {
      hidden_fields: params,
      form_attrs: {
        action: api_url,
        method: "POST",
        enctype: "multipart/form-data"
      }
    };
  };
  exports.upload_tag_params = function upload_tag_params(options = {}) {
    let params = build_upload_params(options);
    params = utils.process_request_params(params, options);
    return JSON.stringify(params);
  };
  exports.upload_url = function upload_url(options = {}) {
    if (options.resource_type == null) {
      options.resource_type = "auto";
    }
    return utils.api_url("upload", options);
  };
  exports.image_upload_tag = function image_upload_tag(field, options = {}) {
    let html_options = options.html || {};
    let tag_options = extend({
      type: "file",
      name: "file",
      "data-url": exports.upload_url(options),
      "data-form-data": exports.upload_tag_params(options),
      "data-cloudinary-field": field,
      "data-max-chunk-size": options.chunk_size,
      class: [html_options.class, "cloudinary-fileupload"].join(" ")
    }, html_options);
    return `<input ${utils.html_attrs(tag_options)}/>`;
  };
  exports.unsigned_image_upload_tag = function unsigned_image_upload_tag(field, upload_preset, options = {}) {
    return exports.image_upload_tag(field, merge(options, {
      unsigned: true,
      upload_preset
    }));
  };
  exports.update_metadata = function update_metadata(metadata, public_ids, callback, options = {}) {
    return call_api("metadata", callback, options, function() {
      let params = {
        metadata: utils.encode_context(metadata),
        public_ids: utils.build_array(public_ids),
        timestamp: utils.timestamp(),
        type: options.type,
        clear_invalid: options.clear_invalid
      };
      return [params];
    });
  };
});

// node_modules/cloudinary/lib/api_client/execute_request.js
var require_execute_request = __commonJS((exports, module) => {
  var config2 = require_config();
  var https = /^http:/.test(config2().upload_prefix) ? __require("http") : __require("https");
  var querystring = __require("querystring");
  var utils = require_utils();
  var ensureOption = require_ensureOption().defaults(config2());
  var { URL: URL2 } = __require("url");
  var { extend, includes, isEmpty } = utils;
  var agent = config2.api_proxy ? new https.Agent(config2.api_proxy) : null;
  function encodeFieldPart(boundary, name, value) {
    return [
      `--${boundary}\r
`,
      `Content-Disposition: form-data; name="${name}"\r
`,
      `\r
`,
      `${value}\r
`,
      ""
    ].join("");
  }
  function encodeFilePart(boundary, type, name, filename) {
    return [
      `--${boundary}\r
`,
      `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r
`,
      `Content-Type: ${type}\r
`,
      `\r
`,
      ""
    ].join("");
  }
  function buildMultipartBody(params, boundary) {
    const parts = [];
    utils.hashToParameters(params).forEach(([key, value]) => {
      if (value == null) {
        return;
      }
      if (typeof value === "object" && Buffer.isBuffer(value.data)) {
        parts.push(Buffer.from(encodeFilePart(boundary, "application/octet-stream", key, value.filename), "binary"));
        parts.push(value.data);
        parts.push(Buffer.from(`\r
`, "ascii"));
      } else {
        parts.push(Buffer.from(encodeFieldPart(boundary, key, value), "utf8"));
      }
    });
    parts.push(Buffer.from(`--${boundary}--`, "ascii"));
    return Buffer.concat(parts);
  }
  function execute_request(method, params, auth, api_url, callback, options = {}) {
    method = method.toUpperCase();
    const deferred = utils.deferredPromise();
    let query_params, handle_response;
    let key = auth.key;
    let secret = auth.secret;
    let oauth_token = auth.oauth_token;
    let content_type = "application/x-www-form-urlencoded";
    if (options.content_type === "json") {
      query_params = JSON.stringify(params);
      content_type = "application/json";
    } else if (options.content_type === "multipart") {
      const boundary = utils.random_public_id();
      query_params = buildMultipartBody(params, boundary);
      content_type = `multipart/form-data; boundary=${boundary}`;
    } else {
      query_params = querystring.stringify(params);
    }
    if (method === "GET") {
      api_url += "?" + query_params;
    }
    const parsedUrl = new URL2(api_url);
    let request_options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      pathname: parsedUrl.pathname,
      query: parsedUrl.search ? parsedUrl.search.substring(1) : ""
    };
    if (parsedUrl.port) {
      request_options.port = parsedUrl.port;
    }
    request_options = extend(request_options, {
      method,
      headers: {
        "Content-Type": content_type,
        "User-Agent": utils.getUserAgent()
      }
    });
    if (oauth_token) {
      request_options.headers.Authorization = `Bearer ${oauth_token}`;
    } else {
      request_options.auth = key + ":" + secret;
    }
    if (options.agent != null) {
      request_options.agent = options.agent;
    }
    let proxy = options.api_proxy || config2().api_proxy;
    if (!isEmpty(proxy)) {
      if (!request_options.agent && agent) {
        request_options.agent = agent;
      } else if (!request_options.agent) {
        request_options.agent = new https.Agent(proxy);
      } else {
        console.warn("Proxy is set, but request uses a custom agent, proxy is ignored.");
      }
    }
    if (method !== "GET") {
      request_options.headers["Content-Length"] = Buffer.byteLength(query_params);
    }
    handle_response = function(res) {
      const { hide_sensitive = false, debug = false } = config2();
      const sanitizedOptions = { ...request_options };
      const requestId = res.headers["x-request-id"];
      if (hide_sensitive === true) {
        if ("auth" in sanitizedOptions) {
          delete sanitizedOptions.auth;
        }
        if ("Authorization" in sanitizedOptions.headers) {
          delete sanitizedOptions.headers.Authorization;
        }
      }
      if (includes([200, 400, 401, 403, 404, 409, 420, 429, 500], res.statusCode)) {
        let buffer = "";
        let error = false;
        res.on("data", function(d) {
          buffer += d;
          return buffer;
        });
        res.on("end", function() {
          let result;
          if (error) {
            return;
          }
          try {
            result = JSON.parse(buffer);
          } catch (e) {
            result = {
              error: {
                message: "Server return invalid JSON response. Status Code " + res.statusCode
              }
            };
          }
          if (result.error) {
            result.error.http_code = res.statusCode;
            if (debug && requestId) {
              result.error.request_id = requestId;
            }
          } else {
            if (res.headers["x-featureratelimit-limit"]) {
              result.rate_limit_allowed = parseInt(res.headers["x-featureratelimit-limit"]);
            }
            if (res.headers["x-featureratelimit-reset"]) {
              result.rate_limit_reset_at = new Date(res.headers["x-featureratelimit-reset"]);
            }
            if (res.headers["x-featureratelimit-remaining"]) {
              result.rate_limit_remaining = parseInt(res.headers["x-featureratelimit-remaining"]);
            }
            if (debug && requestId) {
              result.request_id = requestId;
            }
          }
          if (result.error) {
            deferred.reject(Object.assign({
              request_options: sanitizedOptions,
              query_params
            }, result));
          } else {
            deferred.resolve(result);
          }
          if (typeof callback === "function") {
            callback(result);
          }
        });
        res.on("error", function(e) {
          error = true;
          let err_obj = {
            error: {
              message: e,
              http_code: res.statusCode,
              request_options: sanitizedOptions,
              query_params
            }
          };
          if (debug && requestId) {
            err_obj.error.request_id = requestId;
          }
          deferred.reject(err_obj.error);
          if (typeof callback === "function") {
            callback(err_obj);
          }
        });
      } else {
        let err_obj = {
          error: {
            message: "Server returned unexpected status code - " + res.statusCode,
            http_code: res.statusCode,
            request_options: sanitizedOptions,
            query_params
          }
        };
        if (debug && requestId) {
          err_obj.error.request_id = requestId;
        }
        deferred.reject(err_obj.error);
        if (typeof callback === "function") {
          callback(err_obj);
        }
      }
    };
    const request = https.request(request_options, handle_response);
    request.on("error", function(e) {
      deferred.reject(e);
      return typeof callback === "function" ? callback({ error: e }) : undefined;
    });
    request.setTimeout(ensureOption(options, "timeout", 60000));
    if (method !== "GET") {
      request.write(query_params);
    }
    request.end();
    return deferred.promise;
  }
  module.exports = execute_request;
});

// node_modules/cloudinary/lib/api_client/call_api.js
var require_call_api = __commonJS((exports, module) => {
  var config2 = require_config();
  var utils = require_utils();
  var ensureOption = require_ensureOption().defaults(config2());
  var execute_request = require_execute_request();
  var { ensurePresenceOf } = utils;
  function call_api(method, uri, params, callback, options) {
    ensurePresenceOf({ method, uri });
    const api_url = utils.base_api_url_v1()(uri, options);
    let auth = {};
    if (options.oauth_token || config2().oauth_token) {
      auth = {
        oauth_token: ensureOption(options, "oauth_token")
      };
    } else {
      auth = {
        key: ensureOption(options, "api_key"),
        secret: ensureOption(options, "api_secret")
      };
    }
    return execute_request(method, params, auth, api_url, callback, options);
  }
  module.exports = call_api;
});

// node_modules/cloudinary/lib/api.js
var require_api = __commonJS((exports) => {
  var utils = require_utils();
  var call_api = require_call_api();
  var {
    extend,
    pickOnlyExistingValues
  } = utils;
  var TRANSFORMATIONS_URI = "transformations";
  function deleteResourcesParams(options, params = {}) {
    return extend(params, pickOnlyExistingValues(options, "keep_original", "invalidate", "next_cursor", "transformations"));
  }
  function getResourceParams(options) {
    return pickOnlyExistingValues(options, "exif", "cinemagraph_analysis", "colors", "derived_next_cursor", "faces", "image_metadata", "media_metadata", "pages", "phash", "coordinates", "max_results", "versions", "accessibility_analysis", "related", "related_next_cursor");
  }
  exports.ping = function ping(callback, options = {}) {
    return call_api("get", ["ping"], {}, callback, options);
  };
  exports.usage = function usage(callback, options = {}) {
    const uri = ["usage"];
    if (options.date) {
      uri.push(options.date);
    }
    return call_api("get", uri, {}, callback, options);
  };
  exports.resource_types = function resource_types(callback, options = {}) {
    return call_api("get", ["resources"], {}, callback, options);
  };
  exports.resources = function resources(callback, options = {}) {
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type;
    uri = ["resources", resource_type];
    if (type != null) {
      uri.push(type);
    }
    if (options.start_at != null && Object.prototype.toString.call(options.start_at) === "[object Date]") {
      options.start_at = options.start_at.toUTCString();
    }
    return call_api("get", uri, pickOnlyExistingValues(options, "next_cursor", "max_results", "prefix", "tags", "context", "direction", "moderations", "start_at", "metadata", "fields"), callback, options);
  };
  exports.resources_by_tag = function resources_by_tag(tag, callback, options = {}) {
    let resource_type, uri;
    resource_type = options.resource_type || "image";
    uri = ["resources", resource_type, "tags", tag];
    return call_api("get", uri, pickOnlyExistingValues(options, "next_cursor", "max_results", "tags", "context", "direction", "moderations", "metadata", "fields"), callback, options);
  };
  exports.resources_by_context = function resources_by_context(key, value, callback, options = {}) {
    let params, resource_type, uri;
    resource_type = options.resource_type || "image";
    uri = ["resources", resource_type, "context"];
    params = pickOnlyExistingValues(options, "next_cursor", "max_results", "tags", "context", "direction", "moderations", "metadata", "fields");
    params.key = key;
    if (value != null) {
      params.value = value;
    }
    return call_api("get", uri, params, callback, options);
  };
  exports.resources_by_moderation = function resources_by_moderation(kind, status, callback, options = {}) {
    let resource_type, uri;
    resource_type = options.resource_type || "image";
    uri = ["resources", resource_type, "moderations", kind, status];
    return call_api("get", uri, pickOnlyExistingValues(options, "next_cursor", "max_results", "tags", "context", "direction", "moderations", "metadata", "fields"), callback, options);
  };
  exports.resource_by_asset_id = function resource_by_asset_id(asset_id, callback, options = {}) {
    const uri = ["resources", asset_id];
    return call_api("get", uri, getResourceParams(options), callback, options);
  };
  exports.resources_by_asset_folder = function resources_by_asset_folder(asset_folder, callback, options = {}) {
    let params, uri;
    uri = ["resources", "by_asset_folder"];
    params = pickOnlyExistingValues(options, "next_cursor", "max_results", "tags", "context", "moderations", "fields");
    params.asset_folder = asset_folder;
    return call_api("get", uri, params, callback, options);
  };
  exports.resources_by_asset_ids = function resources_by_asset_ids(asset_ids, callback, options = {}) {
    let params, uri;
    uri = ["resources", "by_asset_ids"];
    params = pickOnlyExistingValues(options, "tags", "context", "moderations", "fields");
    params["asset_ids[]"] = asset_ids;
    return call_api("get", uri, params, callback, options);
  };
  exports.resources_by_ids = function resources_by_ids(public_ids, callback, options = {}) {
    let params, resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type];
    params = pickOnlyExistingValues(options, "tags", "context", "moderations", "fields");
    params["public_ids[]"] = public_ids;
    return call_api("get", uri, params, callback, options);
  };
  exports.resource = function resource(public_id, callback, options = {}) {
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type, public_id];
    return call_api("get", uri, getResourceParams(options), callback, options);
  };
  exports.restore = function restore(public_ids, callback, options = {}) {
    options.content_type = "json";
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type, "restore"];
    return call_api("post", uri, {
      public_ids,
      versions: options.versions
    }, callback, options);
  };
  exports.restore_by_asset_ids = function restore_by_asset_ids(asset_ids, callback, options = {}) {
    options.content_type = "json";
    let uri = ["resources", "restore"];
    if (!Array.isArray(asset_ids)) {
      asset_ids = [asset_ids];
    }
    return call_api("post", uri, {
      asset_ids,
      versions: options.versions
    }, callback, options);
  };
  exports.update = function update(public_id, callback, options = {}) {
    let params, resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type, public_id];
    params = utils.updateable_resource_params(options);
    if (options.moderation_status != null) {
      params.moderation_status = options.moderation_status;
    }
    if (options.clear_invalid != null) {
      params.clear_invalid = options.clear_invalid;
    }
    return call_api("post", uri, params, callback, options);
  };
  exports.delete_resources = function delete_resources(public_ids, callback, options = {}) {
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type];
    return call_api("delete", uri, deleteResourcesParams(options, {
      "public_ids[]": public_ids
    }), callback, options);
  };
  exports.delete_resources_by_asset_ids = function delete_resources_by_asset_ids(asset_ids, callback, options = {}) {
    let uri = ["resources"];
    return call_api("delete", uri, deleteResourcesParams(options, {
      "asset_ids[]": asset_ids
    }), callback, options);
  };
  exports.delete_resources_by_prefix = function delete_resources_by_prefix(prefix, callback, options = {}) {
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type];
    return call_api("delete", uri, deleteResourcesParams(options, {
      prefix
    }), callback, options);
  };
  exports.delete_resources_by_tag = function delete_resources_by_tag(tag, callback, options = {}) {
    let resource_type, uri;
    resource_type = options.resource_type || "image";
    uri = ["resources", resource_type, "tags", tag];
    return call_api("delete", uri, deleteResourcesParams(options), callback, options);
  };
  exports.delete_all_resources = function delete_all_resources(callback, options = {}) {
    let resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = ["resources", resource_type, type];
    return call_api("delete", uri, deleteResourcesParams(options, {
      all: true
    }), callback, options);
  };
  exports.delete_backed_up_assets = (assetId, versionIds, callback, options = {}) => {
    const params = deleteBackupParams(versionIds);
    return call_api("delete", ["resources", "backup", assetId], params, callback, options);
  };
  var deleteBackupParams = (versionIds = []) => {
    return {
      "version_ids[]": Array.isArray(versionIds) ? versionIds : [versionIds]
    };
  };
  var createRelationParams = (publicIds = []) => {
    return {
      assets_to_relate: Array.isArray(publicIds) ? publicIds : [publicIds]
    };
  };
  var deleteRelationParams = (publicIds = []) => {
    return {
      assets_to_unrelate: Array.isArray(publicIds) ? publicIds : [publicIds]
    };
  };
  exports.add_related_assets = (publicId, assetsToRelate, callback, options = {}) => {
    const params = createRelationParams(assetsToRelate);
    const resourceType = options.resource_type || "image";
    const type = options.type || "upload";
    options.content_type = "json";
    return call_api("post", ["resources", "related_assets", resourceType, type, publicId], params, callback, options);
  };
  exports.add_related_assets_by_asset_id = (assetId, assetsToRelate, callback, options = {}) => {
    const params = createRelationParams(assetsToRelate);
    options.content_type = "json";
    return call_api("post", ["resources", "related_assets", assetId], params, callback, options);
  };
  exports.delete_related_assets = (publicId, assetsToUnrelate, callback, options = {}) => {
    const params = deleteRelationParams(assetsToUnrelate);
    const resourceType = options.resource_type || "image";
    const type = options.type || "upload";
    options.content_type = "json";
    return call_api("delete", ["resources", "related_assets", resourceType, type, publicId], params, callback, options);
  };
  exports.delete_related_assets_by_asset_id = (assetId, assetsToUnrelate, callback, options = {}) => {
    const params = deleteRelationParams(assetsToUnrelate);
    options.content_type = "json";
    return call_api("delete", ["resources", "related_assets", assetId], params, callback, options);
  };
  exports.delete_derived_resources = function delete_derived_resources(derived_resource_ids, callback, options = {}) {
    let uri;
    uri = ["derived_resources"];
    return call_api("delete", uri, {
      "derived_resource_ids[]": derived_resource_ids
    }, callback, options);
  };
  exports.delete_derived_by_transformation = function delete_derived_by_transformation(public_ids, transformations, callback, options = {}) {
    let params, resource_type, type, uri;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    uri = "resources/" + resource_type + "/" + type;
    params = extend({
      "public_ids[]": public_ids
    }, pickOnlyExistingValues(options, "invalidate"));
    params.keep_original = true;
    params.transformations = utils.build_eager(transformations);
    return call_api("delete", uri, params, callback, options);
  };
  exports.tags = function tags(callback, options = {}) {
    let resource_type, uri;
    resource_type = options.resource_type || "image";
    uri = ["tags", resource_type];
    return call_api("get", uri, pickOnlyExistingValues(options, "next_cursor", "max_results", "prefix"), callback, options);
  };
  exports.transformations = function transformations(callback, options = {}) {
    const params = pickOnlyExistingValues(options, "next_cursor", "max_results", "named");
    return call_api("get", TRANSFORMATIONS_URI, params, callback, options);
  };
  exports.transformation = function transformation(transformationName, callback, options = {}) {
    const params = pickOnlyExistingValues(options, "next_cursor", "max_results");
    params.transformation = utils.build_eager(transformationName);
    return call_api("get", TRANSFORMATIONS_URI, params, callback, options);
  };
  exports.delete_transformation = function delete_transformation(transformationName, callback, options = {}) {
    const params = {};
    params.transformation = utils.build_eager(transformationName);
    return call_api("delete", TRANSFORMATIONS_URI, params, callback, options);
  };
  exports.update_transformation = function update_transformation(transformationName, updates, callback, options = {}) {
    const params = pickOnlyExistingValues(updates, "allowed_for_strict");
    params.transformation = utils.build_eager(transformationName);
    if (updates.unsafe_update != null) {
      params.unsafe_update = utils.build_eager(updates.unsafe_update);
    }
    return call_api("put", TRANSFORMATIONS_URI, params, callback, options);
  };
  exports.create_transformation = function create_transformation(name, definition, callback, options = {}) {
    const params = { name };
    params.transformation = utils.build_eager(definition);
    return call_api("post", TRANSFORMATIONS_URI, params, callback, options);
  };
  exports.upload_presets = function upload_presets(callback, options = {}) {
    return call_api("get", ["upload_presets"], pickOnlyExistingValues(options, "next_cursor", "max_results"), callback, options);
  };
  exports.upload_preset = function upload_preset(name, callback, options = {}) {
    let uri;
    uri = ["upload_presets", name];
    return call_api("get", uri, {}, callback, options);
  };
  exports.delete_upload_preset = function delete_upload_preset(name, callback, options = {}) {
    let uri;
    uri = ["upload_presets", name];
    return call_api("delete", uri, {}, callback, options);
  };
  exports.update_upload_preset = function update_upload_preset(name, callback, options = {}) {
    let params, uri;
    uri = ["upload_presets", name];
    params = utils.merge(utils.clear_blank(utils.build_upload_params(options)), pickOnlyExistingValues(options, "unsigned", "disallow_public_id", "live"));
    return call_api("put", uri, params, callback, options);
  };
  exports.create_upload_preset = function create_upload_preset(callback, options = {}) {
    let params, uri;
    uri = ["upload_presets"];
    params = utils.merge(utils.clear_blank(utils.build_upload_params(options)), pickOnlyExistingValues(options, "name", "unsigned", "disallow_public_id", "live"));
    return call_api("post", uri, params, callback, options);
  };
  exports.root_folders = function root_folders(callback, options = {}) {
    let uri, params;
    uri = ["folders"];
    params = pickOnlyExistingValues(options, "next_cursor", "max_results");
    return call_api("get", uri, params, callback, options);
  };
  exports.sub_folders = function sub_folders(path, callback, options = {}) {
    let uri, params;
    uri = ["folders", path];
    params = pickOnlyExistingValues(options, "next_cursor", "max_results");
    return call_api("get", uri, params, callback, options);
  };
  exports.create_folder = function create_folder(path, callback, options = {}) {
    let uri;
    uri = ["folders", path];
    return call_api("post", uri, {}, callback, options);
  };
  exports.delete_folder = function delete_folder(path, callback, options = {}) {
    let uri;
    uri = ["folders", path];
    return call_api("delete", uri, {}, callback, options);
  };
  exports.rename_folder = function rename_folder(old_path, new_path, callback, options = {}) {
    let uri;
    uri = ["folders", old_path];
    let rename_folder_params = {
      to_folder: new_path
    };
    options.content_type = "json";
    return call_api("put", uri, rename_folder_params, callback, options);
  };
  exports.upload_mappings = function upload_mappings(callback, options = {}) {
    let params;
    params = pickOnlyExistingValues(options, "next_cursor", "max_results");
    return call_api("get", "upload_mappings", params, callback, options);
  };
  exports.upload_mapping = function upload_mapping(name, callback, options = {}) {
    if (name == null) {
      name = null;
    }
    return call_api("get", "upload_mappings", {
      folder: name
    }, callback, options);
  };
  exports.delete_upload_mapping = function delete_upload_mapping(name, callback, options = {}) {
    return call_api("delete", "upload_mappings", {
      folder: name
    }, callback, options);
  };
  exports.update_upload_mapping = function update_upload_mapping(name, callback, options = {}) {
    let params;
    params = pickOnlyExistingValues(options, "template");
    params.folder = name;
    return call_api("put", "upload_mappings", params, callback, options);
  };
  exports.create_upload_mapping = function create_upload_mapping(name, callback, options = {}) {
    let params;
    params = pickOnlyExistingValues(options, "template");
    params.folder = name;
    return call_api("post", "upload_mappings", params, callback, options);
  };
  function publishResource(byKey, value, callback, options = {}) {
    let params, resource_type, uri;
    params = pickOnlyExistingValues(options, "type", "invalidate", "overwrite");
    params[byKey] = value;
    resource_type = options.resource_type || "image";
    uri = ["resources", resource_type, "publish_resources"];
    options = extend({
      resource_type
    }, options);
    return call_api("post", uri, params, callback, options);
  }
  exports.publish_by_prefix = function publish_by_prefix(prefix, callback, options = {}) {
    return publishResource("prefix", prefix, callback, options);
  };
  exports.publish_by_tag = function publish_by_tag(tag, callback, options = {}) {
    return publishResource("tag", tag, callback, options);
  };
  exports.publish_by_ids = function publish_by_ids(public_ids, callback, options = {}) {
    return publishResource("public_ids", public_ids, callback, options);
  };
  exports.list_streaming_profiles = function list_streaming_profiles(callback, options = {}) {
    return call_api("get", "streaming_profiles", {}, callback, options);
  };
  exports.get_streaming_profile = function get_streaming_profile(name, callback, options = {}) {
    return call_api("get", "streaming_profiles/" + name, {}, callback, options);
  };
  exports.delete_streaming_profile = function delete_streaming_profile(name, callback, options = {}) {
    return call_api("delete", "streaming_profiles/" + name, {}, callback, options);
  };
  exports.update_streaming_profile = function update_streaming_profile(name, callback, options = {}) {
    let params;
    params = utils.build_streaming_profiles_param(options);
    return call_api("put", "streaming_profiles/" + name, params, callback, options);
  };
  exports.create_streaming_profile = function create_streaming_profile(name, callback, options = {}) {
    let params;
    params = utils.build_streaming_profiles_param(options);
    params.name = name;
    return call_api("post", "streaming_profiles", params, callback, options);
  };
  function updateResourcesAccessMode(access_mode, by_key, value, callback, options = {}) {
    let params, resource_type, type;
    resource_type = options.resource_type || "image";
    type = options.type || "upload";
    params = {
      access_mode
    };
    params[by_key] = value;
    return call_api("post", "resources/" + resource_type + "/" + type + "/update_access_mode", params, callback, options);
  }
  exports.search = function search(params, callback, options = {}) {
    options.content_type = "json";
    return call_api("post", "resources/search", params, callback, options);
  };
  exports.visual_search = function visual_search(params, callback, options = {}) {
    const allowedParams = pickOnlyExistingValues(params, "image_url", "image_asset_id", "text");
    const image_file = utils.handleFileParameter(params.image_file);
    let requestOptions = options;
    if (image_file != null) {
      allowedParams.image_file = image_file;
      if (typeof image_file === "object") {
        requestOptions = extend({}, options, { content_type: "multipart" });
      }
    }
    return call_api("post", ["resources", "visual_search"], allowedParams, callback, requestOptions);
  };
  exports.search_folders = function search_folders(params, callback, options = {}) {
    options.content_type = "json";
    return call_api("post", "folders/search", params, callback, options);
  };
  exports.update_resources_access_mode_by_prefix = function update_resources_access_mode_by_prefix(access_mode, prefix, callback, options = {}) {
    return updateResourcesAccessMode(access_mode, "prefix", prefix, callback, options);
  };
  exports.update_resources_access_mode_by_tag = function update_resources_access_mode_by_tag(access_mode, tag, callback, options = {}) {
    return updateResourcesAccessMode(access_mode, "tag", tag, callback, options);
  };
  exports.update_resources_access_mode_by_ids = function update_resources_access_mode_by_ids(access_mode, ids, callback, options = {}) {
    return updateResourcesAccessMode(access_mode, "public_ids[]", ids, callback, options);
  };
  exports.add_metadata_field = function add_metadata_field(field, callback, options = {}) {
    const params = pickOnlyExistingValues(field, "external_id", "type", "label", "mandatory", "default_value", "validation", "datasource", "restrictions", "allow_dynamic_list_values");
    options.content_type = "json";
    return call_api("post", ["metadata_fields"], params, callback, options);
  };
  exports.list_metadata_fields = function list_metadata_fields(callback, options = {}) {
    return call_api("get", ["metadata_fields"], {}, callback, options);
  };
  exports.delete_metadata_field = function delete_metadata_field(field_external_id, callback, options = {}) {
    return call_api("delete", ["metadata_fields", field_external_id], {}, callback, options);
  };
  exports.metadata_field_by_field_id = function metadata_field_by_field_id(external_id, callback, options = {}) {
    return call_api("get", ["metadata_fields", external_id], {}, callback, options);
  };
  exports.update_metadata_field = function update_metadata_field(external_id, field, callback, options = {}) {
    const params = pickOnlyExistingValues(field, "external_id", "type", "label", "mandatory", "default_value", "validation", "datasource", "restrictions", "default_disabled", "allow_dynamic_list_values");
    options.content_type = "json";
    return call_api("put", ["metadata_fields", external_id], params, callback, options);
  };
  exports.update_metadata_field_datasource = function update_metadata_field_datasource(field_external_id, entries_external_id, callback, options = {}) {
    const params = pickOnlyExistingValues(entries_external_id, "values");
    options.content_type = "json";
    return call_api("put", ["metadata_fields", field_external_id, "datasource"], params, callback, options);
  };
  exports.delete_datasource_entries = function delete_datasource_entries(field_external_id, entries_external_id, callback, options = {}) {
    options.content_type = "json";
    const params = { external_ids: entries_external_id };
    return call_api("delete", ["metadata_fields", field_external_id, "datasource"], params, callback, options);
  };
  exports.restore_metadata_field_datasource = function restore_metadata_field_datasource(field_external_id, entries_external_id, callback, options = {}) {
    options.content_type = "json";
    const params = { external_ids: entries_external_id };
    return call_api("post", ["metadata_fields", field_external_id, "datasource_restore"], params, callback, options);
  };
  exports.order_metadata_field_datasource = function order_metadata_field_datasource(field_external_id, sort_by, direction, callback, options = {}) {
    options.content_type = "json";
    const params = {
      order_by: sort_by,
      direction
    };
    return call_api("post", ["metadata_fields", field_external_id, "datasource", "order"], params, callback, options);
  };
  exports.reorder_metadata_fields = function reorder_metadata_fields(order_by, direction, callback, options = {}) {
    options.content_type = "json";
    const params = {
      order_by,
      direction
    };
    return call_api("put", ["metadata_fields", "order"], params, callback, options);
  };
  exports.list_metadata_rules = function list_metadata_rules(callback, options = {}) {
    return call_api("get", ["metadata_rules"], {}, callback, options);
  };
  exports.add_metadata_rule = function add_metadata_rule(metadata_rule, callback, options = {}) {
    options.content_type = "json";
    const params = pickOnlyExistingValues(metadata_rule, "metadata_field_id", "condition", "result", "name");
    return call_api("post", ["metadata_rules"], params, callback, options);
  };
  exports.update_metadata_rule = function update_metadata_rule(field_external_id, updated_metadata_rule, callback, options = {}) {
    options.content_type = "json";
    const params = pickOnlyExistingValues(updated_metadata_rule, "metadata_field_id", "condition", "result", "name", "state");
    return call_api("put", ["metadata_rules", field_external_id], params, callback, options);
  };
  exports.delete_metadata_rule = function delete_metadata_rule(field_external_id, callback, options = {}) {
    return call_api("delete", ["metadata_rules", field_external_id], {}, callback, options);
  };
  exports.config = function config(callback, options = {}) {
    const params = pickOnlyExistingValues(options, "settings");
    return call_api("get", ["config"], params, callback, options);
  };
});

// node_modules/cloudinary/lib/api_client/call_analysis_api.js
var require_call_analysis_api = __commonJS((exports, module) => {
  var utils = require_utils();
  var config2 = require_config();
  var ensureOption = require_ensureOption().defaults(config2());
  var execute_request = require_execute_request();
  var { ensurePresenceOf } = utils;
  function call_analysis_api(method, uri, params, callback, options) {
    ensurePresenceOf({
      method,
      uri
    });
    const api_url = utils.base_api_url_v2()(uri, options);
    let auth = {};
    if (options.oauth_token || config2().oauth_token) {
      auth = {
        oauth_token: ensureOption(options, "oauth_token")
      };
    } else {
      auth = {
        key: ensureOption(options, "api_key"),
        secret: ensureOption(options, "api_secret")
      };
    }
    options.content_type = "json";
    return execute_request(method, params, auth, api_url, callback, options);
  }
  module.exports = {
    call_analysis_api
  };
});

// node_modules/cloudinary/lib/analysis/index.js
var require_analysis = __commonJS((exports, module) => {
  var utils = require_utils();
  var { call_analysis_api } = require_call_analysis_api();
  function analyze_uri(uri, analysis_type, options = {}, callback) {
    const params = {
      uri,
      analysis_type
    };
    if (analysis_type === "custom") {
      if (!("model_name" in options) || !("model_version" in options)) {
        throw new Error('Setting analysis_type to "custom" requires additional params: "model_name" and "model_version"');
      }
      params.parameters = {
        custom: {
          model_name: options.model_name,
          model_version: options.model_version
        }
      };
    }
    let api_uri = ["analysis", "analyze", "uri"];
    return call_analysis_api("POST", api_uri, params, callback, options);
  }
  module.exports = {
    analyze_uri
  };
});

// node_modules/cloudinary/lib/api_client/call_account_api.js
var require_call_account_api = __commonJS((exports, module) => {
  var config2 = require_config();
  var utils = require_utils();
  var ensureOption = require_ensureOption().defaults(config2());
  var execute_request = require_execute_request();
  var { ensurePresenceOf } = utils;
  function call_account_api(method, uri, params, callback, options) {
    ensurePresenceOf({ method, uri });
    const cloudinary = ensureOption(options, "upload_prefix", "https://api.cloudinary.com");
    const account_id = ensureOption(options, "account_id");
    const api_url = [cloudinary, "v1_1", "provisioning", "accounts", account_id].concat(uri).join("/");
    const auth = {
      key: ensureOption(options, "provisioning_api_key"),
      secret: ensureOption(options, "provisioning_api_secret")
    };
    return execute_request(method, params, auth, api_url, callback, options);
  }
  module.exports = call_account_api;
});

// node_modules/cloudinary/lib/provisioning/account.js
var require_account = __commonJS((exports, module) => {
  var utils = require_utils();
  var call_account_api = require_call_account_api();
  var { pickOnlyExistingValues } = utils;
  function sub_accounts(enabled, ids = [], prefix, options = {}, callback) {
    let params = {
      enabled,
      ids,
      prefix
    };
    let uri = ["sub_accounts"];
    return call_account_api("GET", uri, params, callback, options);
  }
  function sub_account(sub_account_id, options = {}, callback) {
    let uri = ["sub_accounts", sub_account_id];
    return call_account_api("GET", uri, {}, callback, options);
  }
  function create_sub_account(name, cloud_name, custom_attributes, enabled, base_account, options = {}, callback) {
    let params = {
      cloud_name,
      name,
      custom_attributes,
      enabled,
      base_sub_account_id: base_account
    };
    options.content_type = "json";
    let uri = ["sub_accounts"];
    return call_account_api("POST", uri, params, callback, options);
  }
  function delete_sub_account(sub_account_id, options = {}, callback) {
    let uri = ["sub_accounts", sub_account_id];
    return call_account_api("DELETE", uri, {}, callback, options);
  }
  function update_sub_account(sub_account_id, name, cloud_name, custom_attributes, enabled, options = {}, callback) {
    let params = {
      cloud_name,
      name,
      custom_attributes,
      enabled
    };
    options.content_type = "json";
    let uri = ["sub_accounts", sub_account_id];
    return call_account_api("PUT", uri, params, callback, options);
  }
  function user(user_id, options = {}, callback) {
    let uri = ["users", user_id];
    return call_account_api("GET", uri, {}, callback, options);
  }
  function users(pending, user_ids, prefix, sub_account_id, options = {}, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    let uri = ["users"];
    let params = {
      ids: user_ids,
      pending,
      prefix,
      sub_account_id,
      last_login: options.lastLogin,
      from: options.fromDate,
      to: options.toDate,
      activity: options.activity
    };
    return call_account_api("GET", uri, pickOnlyExistingValues(params, "ids", "pending", "prefix", "sub_account_id", "last_login", "from", "to", "activity"), callback, options);
  }
  function create_user(name, email, role, sub_account_ids, options = {}, callback) {
    let uri = ["users"];
    let params = {
      name,
      email,
      role,
      sub_account_ids
    };
    options.content_type = "json";
    return call_account_api("POST", uri, params, callback, options);
  }
  function update_user(user_id, name, email, role, sub_account_ids, options = {}, callback) {
    let uri = ["users", user_id];
    let params = {
      name,
      email,
      role,
      sub_account_ids
    };
    options.content_type = "json";
    return call_account_api("PUT", uri, params, callback, options);
  }
  function delete_user(user_id, options = {}, callback) {
    let uri = ["users", user_id];
    return call_account_api("DELETE", uri, {}, callback, options);
  }
  function create_user_group(name, options = {}, callback) {
    let uri = ["user_groups"];
    options.content_type = "json";
    let params = {
      name
    };
    return call_account_api("POST", uri, params, callback, options);
  }
  function update_user_group(group_id, name, options = {}, callback) {
    let uri = ["user_groups", group_id];
    let params = {
      name
    };
    return call_account_api("PUT", uri, params, callback, options);
  }
  function delete_user_group(group_id, options = {}, callback) {
    let uri = ["user_groups", group_id];
    return call_account_api("DELETE", uri, {}, callback, options);
  }
  function add_user_to_group(group_id, user_id, options = {}, callback) {
    let uri = ["user_groups", group_id, "users", user_id];
    return call_account_api("POST", uri, {}, callback, options);
  }
  function remove_user_from_group(group_id, user_id, options = {}, callback) {
    let uri = ["user_groups", group_id, "users", user_id];
    return call_account_api("DELETE", uri, {}, callback, options);
  }
  function user_group(group_id, options = {}, callback) {
    let uri = ["user_groups", group_id];
    return call_account_api("GET", uri, {}, callback, options);
  }
  function user_groups(options = {}, callback) {
    let uri = ["user_groups"];
    return call_account_api("GET", uri, {}, callback, options);
  }
  function user_group_users(group_id, options = {}, callback) {
    let uri = ["user_groups", group_id, "users"];
    return call_account_api("GET", uri, {}, callback, options);
  }
  function access_keys(sub_account_id, options = {}, callback) {
    const params = pickOnlyExistingValues({
      page_size: options.page_size,
      page: options.page,
      sort_by: options.sort_by,
      sort_order: options.sort_order
    }, "page_size", "page", "sort_by", "sort_order");
    const uri = ["sub_accounts", sub_account_id, "access_keys"];
    return call_account_api("GET", uri, params, callback, options);
  }
  function generate_access_key(sub_account_id, options = {}, callback) {
    const params = pickOnlyExistingValues({
      name: options.name,
      enabled: options.enabled
    }, "name", "enabled");
    options.content_type = "json";
    const uri = ["sub_accounts", sub_account_id, "access_keys"];
    return call_account_api("POST", uri, params, callback, options);
  }
  function update_access_key(sub_account_id, api_key, options = {}, callback) {
    const params = pickOnlyExistingValues({
      name: options.name,
      enabled: options.enabled,
      dedicated_for: options.dedicated_for
    }, "name", "enabled", "dedicated_for");
    options.content_type = "json";
    const uri = ["sub_accounts", sub_account_id, "access_keys", api_key];
    return call_account_api("PUT", uri, params, callback, options);
  }
  function delete_access_key(sub_account_id, api_key, options = {}, callback) {
    const uri = ["sub_accounts", sub_account_id, "access_keys", api_key];
    return call_account_api("DELETE", uri, {}, callback, options);
  }
  function delete_access_key_by_name(sub_account_id, options = {}, callback) {
    const params = { name: options.name };
    const uri = ["sub_accounts", sub_account_id, "access_keys"];
    return call_account_api("DELETE", uri, params, callback, options);
  }
  module.exports = {
    sub_accounts,
    create_sub_account,
    delete_sub_account,
    sub_account,
    update_sub_account,
    user,
    users,
    user_group,
    user_groups,
    user_group_users,
    remove_user_from_group,
    delete_user,
    update_user_group,
    update_user,
    create_user,
    create_user_group,
    add_user_to_group,
    delete_user_group,
    access_keys,
    generate_access_key,
    update_access_key,
    delete_access_key,
    delete_access_key_by_name
  };
});

// node_modules/cloudinary/lib/preloaded_file.js
var require_preloaded_file = __commonJS((exports, module) => {
  var PRELOADED_CLOUDINARY_PATH;
  var config2;
  var utils;
  utils = require_utils();
  config2 = require_config();
  PRELOADED_CLOUDINARY_PATH = /^([^\/]+)\/([^\/]+)\/v(\d+)\/([^#]+)#([^\/]+)$/;

  class PreloadedFile {
    constructor(file_info) {
      let matches, public_id_and_format;
      matches = file_info.match(PRELOADED_CLOUDINARY_PATH);
      if (!matches) {
        throw "Invalid preloaded file info";
      }
      this.resource_type = matches[1];
      this.type = matches[2];
      this.version = matches[3];
      this.filename = matches[4];
      this.signature = matches[5];
      public_id_and_format = PreloadedFile.split_format(this.filename);
      this.public_id = public_id_and_format[0];
      this.format = public_id_and_format[1];
    }
    is_valid() {
      return utils.verify_api_response_signature(this.public_id, this.version, this.signature);
    }
    static split_format(identifier) {
      let format, last_dot, public_id;
      last_dot = identifier.lastIndexOf(".");
      if (last_dot === -1) {
        return [identifier, null];
      }
      public_id = identifier.substr(0, last_dot);
      format = identifier.substr(last_dot + 1);
      return [public_id, format];
    }
    identifier() {
      return `v${this.version}/${this.filename}`;
    }
    toString() {
      return `${this.resource_type}/${this.type}/v${this.version}/${this.filename}#${this.signature}`;
    }
    toJSON() {
      let result = {};
      Object.getOwnPropertyNames(this).forEach((key) => {
        let val = this[key];
        if (typeof val !== "function") {
          result[key] = val;
        }
      });
      return result;
    }
  }
  module.exports = PreloadedFile;
});

// node_modules/cloudinary/lib/utils/generateBreakpoints.js
var require_generateBreakpoints = __commonJS((exports, module) => {
  function generateBreakpoints(srcset) {
    let breakpoints = srcset.breakpoints || [];
    if (breakpoints.length) {
      return breakpoints;
    }
    let [min_width, max_width, max_images] = [srcset.min_width, srcset.max_width, srcset.max_images].map(Number);
    if ([min_width, max_width, max_images].some(Number.isNaN)) {
      throw "Either (min_width, max_width, max_images) " + "or breakpoints must be provided to the image srcset attribute";
    }
    if (min_width > max_width) {
      throw "min_width must be less than max_width";
    }
    if (max_images <= 0) {
      throw "max_images must be a positive integer";
    } else if (max_images === 1) {
      min_width = max_width;
    }
    let stepSize = Math.ceil((max_width - min_width) / Math.max(max_images - 1, 1));
    for (let current = min_width;current < max_width; current += stepSize) {
      breakpoints.push(current);
    }
    breakpoints.push(max_width);
    return breakpoints;
  }
  module.exports = generateBreakpoints;
});

// node_modules/cloudinary/lib/utils/srcsetUtils.js
var require_srcsetUtils = __commonJS((exports, module) => {
  var utils = require_utils();
  var generateBreakpoints = require_generateBreakpoints();
  var Cache = require_cache();
  var isEmpty = utils.isEmpty;
  function scaledUrl(public_id, width, transformation, options = {}) {
    let configParams = utils.extractUrlParams(options);
    transformation = transformation || options;
    configParams.raw_transformation = utils.generate_transformation_string([utils.extend({}, transformation), { crop: "scale", width }]);
    return utils.url(public_id, configParams);
  }
  function getOrGenerateBreakpoints(public_id, srcset = {}, options = {}) {
    let breakpoints = [];
    if (srcset.useCache) {
      breakpoints = Cache.get(public_id, options);
      if (!breakpoints) {
        breakpoints = [];
      }
    } else {
      breakpoints = generateBreakpoints(srcset);
    }
    return breakpoints;
  }
  function generateSrcsetAttribute(public_id, breakpoints, transformation, options) {
    options = utils.clone(options);
    utils.patchFetchFormat(options);
    return breakpoints.map((width) => `${scaledUrl(public_id, width, transformation, options)} ${width}w`).join(", ");
  }
  function generateSizesAttribute(breakpoints = []) {
    return breakpoints.map((width) => `(max-width: ${width}px) ${width}px`).join(", ");
  }
  function generateImageResponsiveAttributes(publicId, attributes = {}, srcsetData = {}, options = {}) {
    let responsiveAttributes = {};
    if (isEmpty(srcsetData)) {
      return responsiveAttributes;
    }
    const generateSizes = !attributes.sizes && srcsetData.sizes === true;
    const generateSrcset = !attributes.srcset;
    if (generateSrcset || generateSizes) {
      let breakpoints = getOrGenerateBreakpoints(publicId, srcsetData, options);
      if (generateSrcset) {
        let transformation = srcsetData.transformation;
        let srcsetAttr = generateSrcsetAttribute(publicId, breakpoints, transformation, options);
        if (!isEmpty(srcsetAttr)) {
          responsiveAttributes.srcset = srcsetAttr;
        }
      }
      if (generateSizes) {
        let sizesAttr = generateSizesAttribute(breakpoints);
        if (!isEmpty(sizesAttr)) {
          responsiveAttributes.sizes = sizesAttr;
        }
      }
    }
    return responsiveAttributes;
  }
  function generateMediaAttr(options = {}) {
    let mediaQuery = [];
    if (options.min_width != null) {
      mediaQuery.push(`(min-width: ${options.min_width}px)`);
    }
    if (options.max_width != null) {
      mediaQuery.push(`(max-width: ${options.max_width}px)`);
    }
    return mediaQuery.join(" and ");
  }
  module.exports = {
    srcsetUrl: scaledUrl,
    generateSrcsetAttribute,
    generateSizesAttribute,
    generateMediaAttr,
    generateImageResponsiveAttributes
  };
});

// node_modules/cloudinary/lib/v2/api.js
var require_api2 = __commonJS((exports) => {
  var api = require_api();
  var v1_adapters = require_utils().v1_adapters;
  v1_adapters(exports, api, {
    ping: 0,
    usage: 0,
    resource_types: 0,
    resources: 0,
    resources_by_tag: 1,
    resources_by_context: 2,
    resources_by_moderation: 2,
    resource_by_asset_id: 1,
    resources_by_asset_ids: 1,
    resources_by_ids: 1,
    resources_by_asset_folder: 1,
    resource: 1,
    restore: 1,
    restore_by_asset_ids: 1,
    update: 1,
    delete_resources: 1,
    delete_resources_by_asset_ids: 1,
    delete_resources_by_prefix: 1,
    delete_resources_by_tag: 1,
    delete_all_resources: 0,
    delete_derived_resources: 1,
    tags: 0,
    transformations: 0,
    transformation: 1,
    delete_transformation: 1,
    update_transformation: 2,
    create_transformation: 2,
    upload_presets: 0,
    upload_preset: 1,
    delete_upload_preset: 1,
    update_upload_preset: 1,
    create_upload_preset: 0,
    root_folders: 0,
    sub_folders: 1,
    delete_folder: 1,
    rename_folder: 2,
    create_folder: 1,
    upload_mappings: 0,
    upload_mapping: 1,
    delete_upload_mapping: 1,
    update_upload_mapping: 1,
    create_upload_mapping: 1,
    list_streaming_profiles: 0,
    get_streaming_profile: 1,
    delete_streaming_profile: 1,
    update_streaming_profile: 1,
    create_streaming_profile: 1,
    publish_by_ids: 1,
    publish_by_tag: 1,
    publish_by_prefix: 1,
    update_resources_access_mode_by_prefix: 2,
    update_resources_access_mode_by_tag: 2,
    update_resources_access_mode_by_ids: 2,
    search: 1,
    search_folders: 1,
    visual_search: 1,
    delete_derived_by_transformation: 2,
    add_metadata_field: 1,
    list_metadata_fields: 1,
    delete_metadata_field: 1,
    metadata_field_by_field_id: 1,
    update_metadata_field: 2,
    update_metadata_field_datasource: 2,
    delete_datasource_entries: 2,
    restore_metadata_field_datasource: 2,
    order_metadata_field_datasource: 3,
    reorder_metadata_fields: 2,
    list_metadata_rules: 1,
    add_metadata_rule: 1,
    delete_metadata_rule: 1,
    update_metadata_rule: 2,
    add_related_assets: 2,
    add_related_assets_by_asset_id: 2,
    delete_related_assets: 2,
    delete_related_assets_by_asset_id: 2,
    delete_backed_up_assets: 2,
    config: 0
  });
});

// node_modules/cloudinary/lib/v2/uploader.js
var require_uploader2 = __commonJS((exports) => {
  var uploader = require_uploader();
  var v1_adapters = require_utils().v1_adapters;
  v1_adapters(exports, uploader, {
    unsigned_upload_stream: 1,
    upload_stream: 0,
    unsigned_upload: 2,
    upload: 1,
    upload_large_part: 0,
    upload_large: 1,
    upload_chunked: 1,
    upload_chunked_stream: 0,
    explicit: 1,
    destroy: 1,
    rename: 2,
    text: 1,
    generate_sprite: 1,
    multi: 1,
    explode: 1,
    add_tag: 2,
    remove_tag: 2,
    remove_all_tags: 1,
    add_context: 2,
    remove_all_context: 1,
    replace_tag: 2,
    create_archive: 0,
    create_zip: 0,
    update_metadata: 2
  });
  exports.direct_upload = uploader.direct_upload;
  exports.upload_tag_params = uploader.upload_tag_params;
  exports.upload_url = uploader.upload_url;
  exports.image_upload_tag = uploader.image_upload_tag;
  exports.unsigned_image_upload_tag = uploader.unsigned_image_upload_tag;
  exports.download_generated_sprite = uploader.download_generated_sprite;
  exports.download_multi = uploader.download_multi;
});

// node_modules/cloudinary/lib/v2/search.js
var require_search = __commonJS((exports, module) => {
  var api = require_api2();
  var config2 = require_config();
  var {
    isEmpty,
    isNumber,
    compute_hash,
    build_distribution_domain,
    clear_blank,
    sort_object_by_key
  } = require_utils();
  var { base64Encode } = require_base64Encode();
  var Search = class Search2 {
    constructor() {
      this.query_hash = {
        sort_by: [],
        aggregate: [],
        with_field: [],
        fields: []
      };
      this._ttl = 300;
    }
    static instance() {
      return new Search2;
    }
    static expression(value) {
      return this.instance().expression(value);
    }
    static max_results(value) {
      return this.instance().max_results(value);
    }
    static next_cursor(value) {
      return this.instance().next_cursor(value);
    }
    static aggregate(value) {
      return this.instance().aggregate(value);
    }
    static with_field(value) {
      return this.instance().with_field(value);
    }
    static fields(value) {
      return this.instance().fields(value);
    }
    static sort_by(field_name, dir = "asc") {
      return this.instance().sort_by(field_name, dir);
    }
    static ttl(newTtl) {
      return this.instance().ttl(newTtl);
    }
    static execute(options, callback) {
      return this.instance().execute(options, callback);
    }
    expression(value) {
      this.query_hash.expression = value;
      return this;
    }
    max_results(value) {
      this.query_hash.max_results = value;
      return this;
    }
    next_cursor(value) {
      this.query_hash.next_cursor = value;
      return this;
    }
    aggregate(value) {
      const found = this.query_hash.aggregate.find((v) => v === value);
      if (!found) {
        this.query_hash.aggregate.push(value);
      }
      return this;
    }
    with_field(value) {
      if (Array.isArray(value)) {
        this.query_hash.with_field = this.query_hash.with_field.concat(value);
      } else {
        this.query_hash.with_field.push(value);
      }
      this.query_hash.with_field = Array.from(new Set(this.query_hash.with_field));
      return this;
    }
    fields(value) {
      if (Array.isArray(value)) {
        this.query_hash.fields = this.query_hash.fields.concat(value);
      } else {
        this.query_hash.fields.push(value);
      }
      this.query_hash.fields = Array.from(new Set(this.query_hash.fields));
      return this;
    }
    sort_by(field_name, dir = "desc") {
      let sort_bucket;
      sort_bucket = {};
      sort_bucket[field_name] = dir;
      const previously_sorted_obj = this.query_hash.sort_by.find((sort_by) => sort_by[field_name]);
      if (previously_sorted_obj) {
        previously_sorted_obj[field_name] = dir;
      } else {
        this.query_hash.sort_by.push(sort_bucket);
      }
      return this;
    }
    ttl(newTtl) {
      if (isNumber(newTtl)) {
        this._ttl = newTtl;
        return this;
      }
      throw new Error("New TTL value has to be a Number.");
    }
    to_query() {
      Object.keys(this.query_hash).forEach((k) => {
        let v = this.query_hash[k];
        if (!isNumber(v) && isEmpty(v)) {
          delete this.query_hash[k];
        }
      });
      return this.query_hash;
    }
    execute(options, callback) {
      if (callback === null) {
        callback = options;
      }
      options = options || {};
      return api.search(this.to_query(), options, callback);
    }
    to_url(ttl, next_cursor, options = {}) {
      const apiSecret = "api_secret" in options ? options.api_secret : config2().api_secret;
      if (!apiSecret) {
        throw new Error("Must supply api_secret");
      }
      const urlTtl = ttl || this._ttl;
      const query = this.to_query();
      let urlCursor = next_cursor;
      if (query.next_cursor && !next_cursor) {
        urlCursor = query.next_cursor;
      }
      delete query.next_cursor;
      const dataOrderedByKey = sort_object_by_key(clear_blank(query));
      const encodedQuery = base64Encode(JSON.stringify(dataOrderedByKey));
      const urlPrefix = build_distribution_domain(options.source, options);
      const signature = compute_hash(`${urlTtl}${encodedQuery}${apiSecret}`, "sha256", "hex");
      const urlWithoutCursor = `${urlPrefix}/search/${signature}/${urlTtl}/${encodedQuery}`;
      return urlCursor ? `${urlWithoutCursor}/${urlCursor}` : urlWithoutCursor;
    }
  };
  module.exports = Search;
});

// node_modules/cloudinary/lib/v2/search_folders.js
var require_search_folders = __commonJS((exports, module) => {
  var Search = require_search();
  var api = require_api2();
  var SearchFolders = class SearchFolders2 extends Search {
    constructor() {
      super();
    }
    static instance() {
      return new SearchFolders2;
    }
    execute(options, callback) {
      if (callback === null) {
        callback = options;
      }
      options = options || {};
      return api.search_folders(this.to_query(), options, callback);
    }
  };
  module.exports = SearchFolders;
});

// node_modules/cloudinary/lib/v2/index.js
var require_v2 = __commonJS((exports, module) => {
  var v1 = require_cloudinary();
  var api = require_api2();
  var uploader = require_uploader2();
  var search = require_search();
  var search_folders = require_search_folders();
  var v2 = {
    ...v1,
    api,
    uploader,
    search,
    search_folders
  };
  module.exports = v2;
});

// node_modules/cloudinary/lib/cloudinary.js
var require_cloudinary = __commonJS((exports, module) => {
  var _ = require_lodash();
  exports.config = require_config();
  exports.utils = require_utils();
  exports.uploader = require_uploader();
  exports.api = require_api();
  exports.analysis = require_analysis();
  var account = require_account();
  exports.provisioning = {
    account
  };
  exports.PreloadedFile = require_preloaded_file();
  exports.Cache = require_cache();
  var cloudinary = exports;
  var optionConsume = cloudinary.utils.option_consume;
  exports.url = function url(public_id, options) {
    options = _.extend({}, options);
    return cloudinary.utils.url(public_id, options);
  };
  var { generateImageResponsiveAttributes, generateMediaAttr } = require_srcsetUtils();
  function chainTransformations(options, transformation = []) {
    let urlOptions = cloudinary.utils.extractUrlParams(options);
    let currentTransformation = cloudinary.utils.extractTransformationParams(options);
    transformation = cloudinary.utils.build_array(transformation);
    urlOptions.transformation = [currentTransformation, ...transformation];
    return urlOptions;
  }
  exports.image = function image(source, options) {
    let localOptions = _.extend({}, options);
    let srcsetParam = optionConsume(localOptions, "srcset");
    let attributes = optionConsume(localOptions, "attributes", {});
    let src = cloudinary.utils.url(source, localOptions);
    if ("html_width" in localOptions)
      localOptions.width = optionConsume(localOptions, "html_width");
    if ("html_height" in localOptions)
      localOptions.height = optionConsume(localOptions, "html_height");
    let client_hints = optionConsume(localOptions, "client_hints", cloudinary.config().client_hints);
    let responsive = optionConsume(localOptions, "responsive");
    let hidpi = optionConsume(localOptions, "hidpi");
    if ((responsive || hidpi) && !client_hints) {
      localOptions["data-src"] = src;
      let classes = [responsive ? "cld-responsive" : "cld-hidpi"];
      let current_class = optionConsume(localOptions, "class");
      if (current_class)
        classes.push(current_class);
      localOptions.class = classes.join(" ");
      src = optionConsume(localOptions, "responsive_placeholder", cloudinary.config().responsive_placeholder);
      if (src === "blank") {
        src = cloudinary.BLANK;
      }
    }
    let html = "<img ";
    if (src)
      html += "src='" + src + "' ";
    let responsiveAttributes = {};
    if (cloudinary.utils.isString(srcsetParam)) {
      responsiveAttributes.srcset = srcsetParam;
    } else {
      responsiveAttributes = generateImageResponsiveAttributes(source, attributes, srcsetParam, options);
    }
    if (!cloudinary.utils.isEmpty(responsiveAttributes)) {
      delete localOptions.width;
      delete localOptions.height;
    }
    html += cloudinary.utils.html_attrs(_.extend(localOptions, responsiveAttributes, attributes)) + "/>";
    return html;
  };
  exports.video = function video(public_id, options) {
    options = _.extend({}, options);
    public_id = public_id.replace(/\.(mp4|ogv|webm)$/, "");
    let source_types = optionConsume(options, "source_types", []);
    let source_transformation = optionConsume(options, "source_transformation", {});
    let sources = optionConsume(options, "sources", []);
    let fallback = optionConsume(options, "fallback_content", "");
    if (source_types.length === 0)
      source_types = cloudinary.utils.DEFAULT_VIDEO_SOURCE_TYPES;
    let video_options = _.cloneDeep(options);
    if (video_options.hasOwnProperty("poster")) {
      if (_.isPlainObject(video_options.poster)) {
        if (video_options.poster.hasOwnProperty("public_id")) {
          video_options.poster = cloudinary.utils.url(video_options.poster.public_id, video_options.poster);
        } else {
          video_options.poster = cloudinary.utils.url(public_id, _.extend({}, cloudinary.utils.DEFAULT_POSTER_OPTIONS, video_options.poster));
        }
      }
    } else {
      video_options.poster = cloudinary.utils.url(public_id, _.extend({}, cloudinary.utils.DEFAULT_POSTER_OPTIONS, options));
    }
    if (!video_options.poster)
      delete video_options.poster;
    let html = "<video ";
    if (!video_options.hasOwnProperty("resource_type"))
      video_options.resource_type = "video";
    let multi_source_types = _.isArray(source_types) && source_types.length > 1;
    let has_sources = _.isArray(sources) && sources.length > 0;
    let source = public_id;
    if (!multi_source_types && !has_sources) {
      source = source + "." + cloudinary.utils.build_array(source_types)[0];
    }
    let src = cloudinary.utils.url(source, video_options);
    if (!multi_source_types && !has_sources)
      video_options.src = src;
    if (video_options.hasOwnProperty("html_width"))
      video_options.width = optionConsume(video_options, "html_width");
    if (video_options.hasOwnProperty("html_height"))
      video_options.height = optionConsume(video_options, "html_height");
    html = html + cloudinary.utils.html_attrs(video_options) + ">";
    if (multi_source_types && !has_sources) {
      sources = source_types.map((source_type) => ({
        type: source_type,
        transformations: source_transformation[source_type] || {}
      }));
    }
    if (_.isArray(sources) && sources.length > 0) {
      html += sources.map((source_data) => {
        let source_type = source_data.type;
        let codecs = source_data.codecs;
        let transformation = source_data.transformations || {};
        src = cloudinary.utils.url(source + "." + source_type, _.extend({ resource_type: "video" }, _.cloneDeep(options), _.cloneDeep(transformation)));
        return cloudinary.utils.create_source_tag(src, source_type, codecs);
      }).join("");
    }
    return `${html}${fallback}</video>`;
  };
  exports.source = function source(public_id, options = {}) {
    let srcsetParam = cloudinary.utils.extend({}, options.srcset, cloudinary.config().srcset);
    let attributes = options.attributes || {};
    cloudinary.utils.extend(attributes, generateImageResponsiveAttributes(public_id, attributes, srcsetParam, options));
    if (!attributes.srcset) {
      attributes.srcset = cloudinary.url(public_id, options);
    }
    if (!attributes.media && options.media) {
      attributes.media = generateMediaAttr(options.media);
    }
    return `<source ${cloudinary.utils.html_attrs(attributes)}>`;
  };
  exports.picture = function picture(public_id, options = {}) {
    let sources = options.sources || [];
    options = cloudinary.utils.clone(options);
    delete options.sources;
    cloudinary.utils.patchFetchFormat(options);
    return "<picture>" + sources.map((source) => {
      let sourceOptions = chainTransformations(options, source.transformation);
      sourceOptions.media = source;
      return cloudinary.source(public_id, sourceOptions);
    }).join("") + cloudinary.image(public_id, options) + "</picture>";
  };
  exports.cloudinary_js_config = cloudinary.utils.cloudinary_js_config;
  exports.CF_SHARED_CDN = cloudinary.utils.CF_SHARED_CDN;
  exports.AKAMAI_SHARED_CDN = cloudinary.utils.AKAMAI_SHARED_CDN;
  exports.SHARED_CDN = cloudinary.utils.SHARED_CDN;
  exports.BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  exports.v2 = require_v2();
});

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
};

// node_modules/hono/dist/utils/body.js
var isRawRequest = (request) => ("headers" in request);
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(await request.bodyCache.formData, options);
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? undefined : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== undefined) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? undefined;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers;
    if (value === undefined) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers;
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) {
          if (++count > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers;
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {}
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== undefined ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length;i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if ((regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node;
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node;
        }
      }
      node = nextNode;
    }
    if (node.#index !== undefined) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node;
  #index = 0;
  paths = /* @__PURE__ */ Object.create(null);
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0;; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#tries = { [METHOD_NAME_ALL]: new Trie };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      Object.keys(middleware).forEach((m) => {
        if ((method === METHOD_NAME_ALL || method === m) && !middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      });
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          if (!routes[m][path2]) {
            this.#insertPath(m, path2);
            routes[m][path2] = [
              ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
            ];
          }
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = this.#tries = undefined;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = /* @__PURE__ */ Object.create(null);
    const handlerData = [];
    [middleware, routes].forEach((r) => {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
          continue;
        }
        const paramAssoc = pathData[1];
        handlerData[pathData[0]] = handlers.map(([h, paramCount]) => {
          const paramIndexMap = /* @__PURE__ */ Object.create(null);
          paramCount -= 1;
          for (;paramCount >= 0; paramCount--) {
            const [key, value] = paramAssoc[paramCount];
            paramIndexMap[key] = value;
          }
          return [h, paramIndexMap];
        });
      }
    });
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (let i = 0, len = handlerData.length;i < len; i++) {
      for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
        const map = handlerData[i][j]?.[1];
        if (!map) {
          continue;
        }
        const keys = Object.keys(map);
        for (let k = 0, len3 = keys.length;k < len3; k++) {
          map[keys[k]] = paramReplacementMap[map[keys[k]]];
        }
      }
    }
    const handlerMap = [];
    for (const i in indexReplacementMap) {
      handlerMap[i] = handlerData[indexReplacementMap[i]];
    }
    return [regexp, handlerMap, staticMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var PreparedRegExpRouter = class {
  name = "PreparedRegExpRouter";
  #matchers;
  #relocateMap;
  constructor(matchers, relocateMap) {
    this.#matchers = matchers;
    this.#relocateMap = relocateMap;
  }
  #addWildcard(method, handlerData) {
    const matcher = this.#matchers[method];
    matcher[1].forEach((list) => list && list.push(handlerData));
    Object.values(matcher[2]).forEach((list) => list[0].push(handlerData));
  }
  #addPath(method, path, handler, indexes, map) {
    const matcher = this.#matchers[method];
    if (!map) {
      matcher[2][path][0].push([handler, {}]);
    } else {
      indexes.forEach((index) => {
        if (typeof index === "number") {
          matcher[1][index].push([handler, map]);
        } else {
          matcher[2][index || path][0].push([handler, map]);
        }
      });
    }
  }
  add(method, path, handler) {
    if (!this.#matchers[method]) {
      const all = this.#matchers[METHOD_NAME_ALL];
      const staticMap = {};
      for (const key in all[2]) {
        staticMap[key] = [all[2][key][0].slice(), emptyParam];
      }
      this.#matchers[method] = [
        all[0],
        all[1].map((list) => Array.isArray(list) ? list.slice() : 0),
        staticMap
      ];
    }
    if (path === "/*" || path === "*") {
      const handlerData = [handler, {}];
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addWildcard(m, handlerData);
        }
      } else {
        this.#addWildcard(method, handlerData);
      }
      return;
    }
    const data = this.#relocateMap[path];
    if (!data) {
      throw new Error(`Path ${path} is not registered`);
    }
    for (const [indexes, map] of data) {
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addPath(m, path, handler, indexes, map);
        }
      } else {
        this.#addPath(method, path, handler, indexes, map);
      }
    }
  }
  buildAllMatchers() {
    return this.#matchers;
  }
  match = match;
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var order = 0;
var Node2 = class _Node2 {
  #methods = [];
  #children = /* @__PURE__ */ Object.create(null);
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set;
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === undefined && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new _Node2;
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) {
        possibleKeys.add(pattern[1]);
      }
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: [...possibleKeys],
        score: ++order
      }
    });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length;i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) {
            continue;
          }
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0;p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
              }
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node2;
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) {
      this.#node.insert(method, result, handler);
    }
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "QUERY"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(",") : undefined;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(",") : undefined;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return async (origin, c) => (await optsAllowMethods(origin, c)).join(",");
    } else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(",");
      return () => methodsStr;
    } else {
      return () => "";
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (exposeHeadersStr) {
      set("Access-Control-Expose-Headers", exposeHeadersStr);
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        c.res.headers.append("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods) {
        set("Access-Control-Allow-Methods", allowMethods);
      }
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headersStr = requestHeaders.split(",").map((h) => h.trim()).join(",");
        }
      }
      if (headersStr) {
        set("Access-Control-Allow-Headers", headersStr);
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== undefined ? "NO_COLOR" in process2?.env : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== undefined && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// node_modules/hono/dist/middleware/timing/timing.js
var getTime = () => {
  try {
    return performance.now();
  } catch {}
  return Date.now();
};
var timing = (config) => {
  const options = {
    total: true,
    enabled: true,
    totalDescription: "Total Response Time",
    autoEnd: true,
    crossOrigin: false,
    ...config
  };
  return async function timing2(c, next) {
    const headers = [];
    const timers = /* @__PURE__ */ new Map;
    if (c.get("metric")) {
      return await next();
    }
    c.set("metric", { headers, timers });
    if (options.total) {
      startTime(c, "total", options.totalDescription);
    }
    await next();
    if (options.total) {
      endTime(c, "total");
    }
    if (options.autoEnd) {
      timers.forEach((_, key) => {
        endTime(c, key);
      });
    }
    const enabled = typeof options.enabled === "function" ? options.enabled(c) : options.enabled;
    if (enabled) {
      c.res.headers.append("Server-Timing", headers.join(","));
      const crossOrigin = typeof options.crossOrigin === "function" ? options.crossOrigin(c) : options.crossOrigin;
      if (crossOrigin) {
        c.res.headers.append("Timing-Allow-Origin", typeof crossOrigin === "string" ? crossOrigin : "*");
      }
    }
  };
};
var setMetric = (c, name, valueDescription, description, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  if (typeof valueDescription === "number") {
    const dur = valueDescription.toFixed(precision || 1);
    const metric = description ? `${name};dur=${dur};desc="${description}"` : `${name};dur=${dur}`;
    metrics.headers.push(metric);
  } else {
    const metric = valueDescription ? `${name};desc="${valueDescription}"` : `${name}`;
    metrics.headers.push(metric);
  }
};
var startTime = (c, name, description) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  metrics.timers.set(name, { description, start: getTime() });
};
var endTime = (c, name, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  const timer = metrics.timers.get(name);
  if (!timer) {
    console.warn(`Timer "${name}" does not exist!`);
    return;
  }
  const { description, start } = timer;
  const duration = getTime() - start;
  setMetric(c, name, duration, description, precision);
  metrics.timers.delete(name);
};

// node_modules/hono/dist/adapter/vercel/handler.js
var handle = (app) => (req) => {
  return app.fetch(req);
};

// src/index.ts
init_database();
init_config();

// src/repositories/roomRepository.ts
init_database();
function mapRoom(row) {
  if (!row)
    return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    tagline: row.tagline || "",
    description: row.description || "",
    overview: row.overview || row.description || "",
    pricePerNight: Number(row.price_per_night),
    priceNairaPerNight: Number(row.price_naira_per_night || row.price_per_night * 1600),
    price_per_night: Number(row.price_per_night),
    price_naira_per_night: Number(row.price_naira_per_night || row.price_per_night * 1600),
    capacity: row.capacity || 2,
    bedType: row.bed_type || "King Bed",
    bed_type: row.bed_type || "King Bed",
    size: row.size || 45,
    floor: row.floor || "2",
    units: row.units || 1,
    image: row.image || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900",
    heroImage: row.image || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900",
    gallery: Array.isArray(row.gallery) ? row.gallery : typeof row.gallery === "string" ? (() => {
      try {
        return JSON.parse(row.gallery);
      } catch {
        return [row.gallery];
      }
    })() : [],
    videoUrl: row.video_url || null,
    video_url: row.video_url || null,
    location: row.location || "Victoria Island Promenade, Lagos",
    roomNumbers: Array.isArray(row.room_numbers) ? row.room_numbers : [`${row.floor || "2"}0${Math.floor(1 + Math.random() * 8)}`],
    maxGuests: row.capacity || row.max_guests || 2,
    bedrooms: row.bedrooms || 1,
    bathrooms: row.bathrooms || 1,
    squareMeters: row.size || 45,
    isWalkInReady: true,
    rating: row.rating || 5,
    reviewsCount: row.reviews_count || 1,
    amenities: Array.isArray(row.amenities) ? row.amenities : typeof row.amenities === "string" ? (() => {
      try {
        return JSON.parse(row.amenities);
      } catch {
        return [];
      }
    })() : [],
    features: Array.isArray(row.features) ? row.features : typeof row.features === "string" ? (() => {
      try {
        return JSON.parse(row.features);
      } catch {
        return [];
      }
    })() : []
  };
}

class RoomRepository {
  async fetchRooms() {
    const db = getDatabase();
    const rooms = await db.query("SELECT * FROM rooms WHERE is_active = true ORDER BY name");
    return rooms.rows.map(mapRoom);
  }
  async fetchRoom(slug) {
    const db = getDatabase();
    const room = await db.queryOne("SELECT * FROM rooms WHERE (slug = $1 OR id = $2) AND (is_active = true OR is_active = 1)", [slug, slug]);
    return mapRoom(room);
  }
  async fetchAvailableRooms(checkIn, checkOut) {
    const db = getDatabase();
    const rooms = await db.query("SELECT * FROM rooms WHERE is_active = true", []);
    return rooms.rows.map(mapRoom);
  }
  async createRoom(roomData) {
    const db = getDatabase();
    const slug = roomData.slug || roomData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const result = await db.queryOne(`INSERT INTO rooms (slug, name, category, tagline, description, price_per_night, price_naira_per_night, capacity, bed_type, size, floor, units, image, gallery, video_url, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`, [
      slug,
      roomData.name,
      roomData.category || "Executive Suite",
      roomData.tagline || "",
      roomData.description || "",
      roomData.pricePerNight || 250,
      roomData.priceNairaPerNight || 400000,
      roomData.maxGuests || roomData.capacity || 2,
      roomData.bedType || "King Bed",
      roomData.squareMeters || roomData.size || 45,
      roomData.floor || "2",
      roomData.units || 1,
      roomData.heroImage || roomData.image || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900",
      roomData.gallery || [],
      roomData.videoUrl || null,
      JSON.stringify(roomData.amenities || [])
    ]);
    return mapRoom(result || roomData);
  }
  async updateRoom(id, roomData) {
    const db = getDatabase();
    await db.query(`UPDATE rooms 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           tagline = COALESCE($3, tagline),
           description = COALESCE($4, description),
           price_per_night = COALESCE($5, price_per_night),
           price_naira_per_night = COALESCE($6, price_naira_per_night),
           video_url = COALESCE($7, video_url),
           image = COALESCE($8, image),
           gallery = COALESCE($9, gallery),
           capacity = COALESCE($10, capacity),
           bed_type = COALESCE($11, bed_type),
           size = COALESCE($12, size),
           floor = COALESCE($13, floor),
           updated_at = NOW()
       WHERE id = $14 OR slug = $15`, [
      roomData.name,
      roomData.category,
      roomData.tagline,
      roomData.description,
      roomData.pricePerNight,
      roomData.priceNairaPerNight,
      roomData.videoUrl,
      roomData.heroImage || roomData.image,
      roomData.gallery ? JSON.stringify(roomData.gallery) : null,
      roomData.maxGuests || roomData.capacity,
      roomData.bedType || roomData.bed_type,
      roomData.squareMeters || roomData.size,
      roomData.floor ? String(roomData.floor) : null,
      id,
      id
    ]);
    const updated = await this.fetchRoom(id);
    return updated || { id, ...roomData };
  }
  async deleteRoom(id) {
    const db = getDatabase();
    await db.query("UPDATE rooms SET is_active = false WHERE id = $1 OR slug = $1", [id]);
    return true;
  }
}
var roomRepository_default = new RoomRepository;

// src/services/roomService.ts
class RoomService {
  async fetchRooms() {
    return await roomRepository_default.fetchRooms();
  }
  async fetchRoom(slug) {
    return await roomRepository_default.fetchRoom(slug);
  }
  async fetchAvailability(checkIn, checkOut, adults, children, rooms) {
    const roomList = await roomRepository_default.fetchAvailableRooms(checkIn, checkOut);
    if (!checkIn || !checkOut) {
      return roomList.map((room) => ({
        room,
        availableUnits: room.units || 1,
        pricePerNight: room.price_per_night || 250,
        total: (room.price_per_night || 250) * (rooms || 1),
        taxEstimate: (room.price_per_night || 250) * 0.075
      }));
    }
    const nights = this.calculateNights(checkIn, checkOut);
    return roomList.map((room) => {
      const availableUnits = room.units;
      const pricePerNight = room.price_per_night;
      const total = pricePerNight * nights * rooms;
      const taxEstimate = total * 0.075;
      return {
        room,
        availableUnits,
        pricePerNight,
        nights,
        total,
        taxEstimate
      };
    });
  }
  async createRoom(roomData) {
    return await roomRepository_default.createRoom(roomData);
  }
  async updateRoom(id, roomData) {
    return await roomRepository_default.updateRoom(id, roomData);
  }
  async deleteRoom(id) {
    return await roomRepository_default.deleteRoom(id);
  }
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
var roomService_default = new RoomService;

// src/controllers/roomController.ts
class RoomController {
  async fetchRooms(c) {
    const rooms = await roomService_default.fetchRooms();
    return c.json(rooms);
  }
  async fetchRoom(c) {
    const slug = c.req.param("slug");
    const room = await roomService_default.fetchRoom(slug);
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }
    return c.json(room);
  }
  async fetchAvailability(c) {
    const checkIn = c.req.query("checkIn");
    const checkOut = c.req.query("checkOut");
    const adults = Number(c.req.query("adults") || 1);
    const children = Number(c.req.query("children") || 0);
    const rooms = Number(c.req.query("rooms") || 1);
    const availability = await roomService_default.fetchAvailability(checkIn, checkOut, adults, children, rooms);
    return c.json(availability);
  }
  async createRoom(c) {
    const body = await c.req.json();
    const room = await roomService_default.createRoom(body);
    return c.json({ success: true, room }, 201);
  }
  async updateRoom(c) {
    const id = c.req.param("id");
    const body = await c.req.json();
    const room = await roomService_default.updateRoom(id, body);
    return c.json({ success: true, room });
  }
  async deleteRoom(c) {
    const id = c.req.param("id");
    await roomService_default.deleteRoom(id);
    return c.json({ success: true, message: "Room deleted" });
  }
}
var roomController_default = new RoomController;

// src/repositories/serviceRepository.ts
init_database();

class ServiceRepository {
  async fetchServiceMenu() {
    const db = getDatabase();
    const result = await db.query("SELECT * FROM service_menu ORDER BY is_popular DESC, name");
    return result.rows;
  }
  async fetchServiceBySlug(slug) {
    const db = getDatabase();
    const service = await db.queryOne("SELECT * FROM service_menu WHERE LOWER(REPLACE(name, ' ', '-')) = $1", [slug]);
    return service;
  }
  async createServiceOrder(data) {
    const db = getDatabase();
    const order2 = await db.queryOne(`INSERT INTO service_orders (
        order_number, guest_name, guest_avatar, vip_tier, room_number, department,
        status, priority, scheduled_time, assigned_staff, items, total_amount, total_amount_usd,
        is_billed_to_folio, folio_id, dietary_allergens, order_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`, [
      data.orderNumber,
      data.guestName,
      data.guestAvatar,
      data.vipTier,
      data.roomNumber,
      data.department,
      data.status,
      data.priority,
      data.scheduledTime,
      data.assignedStaff,
      JSON.stringify(data.items),
      data.totalAmount,
      data.totalAmountUSD,
      data.isBilledToFolio,
      data.folioId,
      data.dietaryAllergens || null,
      data.orderNotes || null
    ]);
    return order2;
  }
  async fetchServiceOrders(filters) {
    const db = getDatabase();
    let query = `SELECT * FROM service_orders WHERE 1=1`;
    const params = [];
    if (filters.department && filters.department !== "all") {
      query += ` AND department = $${params.length + 1}`;
      params.push(filters.department);
    }
    if (filters.status && filters.status !== "all") {
      query += ` AND status = $${params.length + 1}`;
      params.push(filters.status);
    }
    query += ` ORDER BY created_at DESC`;
    const result = await db.query(query, params);
    return result.rows;
  }
  async updateServiceOrderStatus(id, status) {
    const db = getDatabase();
    const order2 = await db.queryOne(`UPDATE service_orders SET status = $1, completed_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
    return order2;
  }
  async findServiceOrderById(id) {
    const db = getDatabase();
    const order2 = await db.queryOne(`SELECT * FROM service_orders WHERE id = $1`, [id]);
    return order2;
  }
}
var serviceRepository_default = new ServiceRepository;

// src/services/serviceService.ts
class ServiceService {
  async getServiceMenu() {
    return await serviceRepository_default.fetchServiceMenu();
  }
  async getServiceBySlug(slug) {
    return await serviceRepository_default.fetchServiceBySlug(slug);
  }
  async createServiceOrder(data) {
    return await serviceRepository_default.createServiceOrder(data);
  }
  async getServiceOrders(filters) {
    return await serviceRepository_default.fetchServiceOrders(filters);
  }
  async updateServiceOrderStatus(id, status) {
    return await serviceRepository_default.updateServiceOrderStatus(id, status);
  }
  async getServiceOrderById(id) {
    return await serviceRepository_default.findServiceOrderById(id);
  }
}
var serviceService_default = new ServiceService;

// src/types/errorTypes.ts
class ApiError extends Error {
  status;
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}
function handleApiError(c, error) {
  console.error(error);
  return c.json({ error: error.message }, error.status);
}

// src/controllers/serviceController.ts
class ServiceController {
  async getServiceMenu(c) {
    try {
      const services = await serviceService_default.getServiceMenu();
      return c.json(services);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getService(c) {
    try {
      const slug = c.req.param("slug");
      const service = await serviceService_default.getServiceBySlug(slug);
      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }
      return c.json(service);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async createServiceOrder(c) {
    try {
      const data = await c.req.json();
      const order2 = await serviceService_default.createServiceOrder(data);
      return c.json(order2, 201);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getServiceOrders(c) {
    try {
      const department = c.req.query("department");
      const status = c.req.query("status");
      const orders = await serviceService_default.getServiceOrders({ department, status });
      return c.json(orders);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updateServiceOrderStatus(c) {
    try {
      const id = c.req.param("id");
      const { status } = await c.req.json();
      const order2 = await serviceService_default.updateServiceOrderStatus(id, status);
      return c.json(order2);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var serviceController_default = new ServiceController;

// src/controllers/publicBookingController.ts
init_bookingService();

// src/repositories/extrasRepository.ts
init_database();

class ExtrasRepository {
  async findAll() {
    const db = getDatabase();
    const result = await db.query(`SELECT id, slug, name, description, price, price_naira, per_night, icon
       FROM extras WHERE is_active = true ORDER BY price ASC`);
    return result.rows;
  }
  async findByIds(ids) {
    if (!ids.length)
      return [];
    const db = getDatabase();
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const result = await db.query(`SELECT id, slug, name, description, price, price_naira, per_night, icon
       FROM extras WHERE id IN (${placeholders}) AND is_active = true`, ids);
    return result.rows;
  }
}
var extrasRepository_default = new ExtrasRepository;

// src/controllers/publicBookingController.ts
class PublicBookingController {
  async createBooking(c) {
    try {
      const body = await c.req.json();
      const idempotencyKey = c.req.header("Idempotency-Key") ?? undefined;
      if (!body.search?.checkIn || !body.search?.checkOut) {
        return c.json({ error: "checkIn and checkOut are required" }, 400);
      }
      if (!body.room?.id || !body.guest?.email) {
        return c.json({ error: "room and guest are required" }, 400);
      }
      const booking = await bookingService_default.createPublicBooking(body, idempotencyKey);
      return c.json(booking, 201);
    } catch (err) {
      console.error("[createBooking]", err);
      return c.json({ error: err.message || "Failed to create booking" }, 500);
    }
  }
  async getReservation(c) {
    try {
      const reference = c.req.param("reference");
      const email = c.req.query("email") ?? undefined;
      const booking = await bookingService_default.lookupBooking(reference, email);
      if (!booking)
        return c.json({ error: "Reservation not found" }, 404);
      return c.json(booking);
    } catch (err) {
      console.error("[getReservation]", err);
      return c.json({ error: err.message || "Failed to fetch reservation" }, 500);
    }
  }
  async cancelReservation(c) {
    try {
      const reference = c.req.param("reference");
      const result = await bookingService_default.cancelBooking(reference);
      if (!result)
        return c.json({ error: "Reservation not found or already cancelled" }, 404);
      return c.json(result);
    } catch (err) {
      console.error("[cancelReservation]", err);
      return c.json({ error: err.message || "Failed to cancel" }, 500);
    }
  }
  async setPaymentMethod(c) {
    try {
      const reference = c.req.param("reference");
      const { method, depositAmount } = await c.req.json();
      const db = (await Promise.resolve().then(() => (init_database(), exports_database))).getDatabase();
      await db.query(`UPDATE bookings SET payment_method = $1 WHERE reference = $2`, [method, reference]);
      const booking = await bookingService_default.lookupBooking(reference);
      return c.json(booking);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  }
  async getExtras(c) {
    try {
      const extras = await extrasRepository_default.findAll();
      return c.json(extras);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  }
}
var publicBookingController_default = new PublicBookingController;

// src/repositories/paystackRepository.ts
init_config();

class PaystackRepository {
  get headers() {
    return {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      "Content-Type": "application/json"
    };
  }
  async initializeTransaction(params) {
    const res = await fetch(`${config.paystackBaseUrl}/transaction/initialize`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        email: params.email,
        amount: params.amountKobo,
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata ?? {}
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(`Paystack init failed: ${json.message}`);
    return json.data;
  }
  async verifyTransaction(reference) {
    const res = await fetch(`${config.paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`, { headers: this.headers });
    const json = await res.json();
    if (!json.status)
      throw new Error(`Paystack verify failed: ${json.message}`);
    return json.data;
  }
  async chargeCard(params) {
    const res = await fetch(`${config.paystackBaseUrl}/charge`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        email: params.email,
        amount: params.amountKobo,
        reference: params.reference,
        card: params.card,
        pin: params.pin
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(json.message || "Charge failed");
    return json.data;
  }
  async submitPin(params) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_pin`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        pin: params.pin
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(json.message || "Submit PIN failed");
    return json.data;
  }
  async submitOtp(params) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_otp`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        otp: params.otp
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(json.message || "Submit OTP failed");
    return json.data;
  }
  async submitPhone(params) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_phone`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        phone: params.phone
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(json.message || "Submit phone failed");
    return json.data;
  }
  async submitBirthday(params) {
    const res = await fetch(`${config.paystackBaseUrl}/charge/submit_birthday`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        reference: params.reference,
        birthday: params.birthday
      })
    });
    const json = await res.json();
    if (!json.status)
      throw new Error(json.message || "Submit birthday failed");
    return json.data;
  }
  async verifyWebhookSignature(rawBody, signature) {
    if (!config.paystackSecretKey)
      return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(config.paystackSecretKey), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex === signature;
  }
}
var paystackRepository_default = new PaystackRepository;

// src/repositories/paymentRepository.ts
init_database();

class PaymentRepository {
  async create(data) {
    const db = getDatabase();
    return await db.queryOne(`INSERT INTO payments (
        booking_reference, paystack_reference, idempotency_key,
        amount, amount_kobo, method, authorization_url, access_code,
        transfer_bank_name, transfer_account_name, transfer_account_number, transfer_expires_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, [
      data.bookingReference,
      data.paystackReference ?? null,
      data.idempotencyKey ?? null,
      data.amount,
      data.amountKobo,
      data.method,
      data.authorizationUrl ?? null,
      data.accessCode ?? null,
      data.transferBankName ?? null,
      data.transferAccountName ?? null,
      data.transferAccountNumber ?? null,
      data.transferExpiresAt ?? null
    ]);
  }
  async findByIdempotencyKey(key) {
    const db = getDatabase();
    return await db.queryOne(`SELECT * FROM payments WHERE idempotency_key = $1`, [key]);
  }
  async findByPaystackReference(ref) {
    const db = getDatabase();
    return await db.queryOne(`SELECT * FROM payments WHERE paystack_reference = $1`, [ref]);
  }
  async markPaid(paystackRef, paidAt) {
    const db = getDatabase();
    await db.query(`UPDATE payments SET status = 'success', paid_at = $1 WHERE paystack_reference = $2`, [paidAt, paystackRef]);
  }
  async markFailed(paystackRef) {
    const db = getDatabase();
    await db.query(`UPDATE payments SET status = 'failed' WHERE paystack_reference = $1`, [paystackRef]);
  }
}
var paymentRepository_default = new PaymentRepository;

// src/services/paymentService.ts
init_database();
init_config();

class PaymentService {
  async initialize(params) {
    const db = getDatabase();
    if (params.idempotencyKey) {
      const existing = await paymentRepository_default.findByIdempotencyKey(params.idempotencyKey);
      if (existing)
        return this.formatInit(existing, params.method);
    }
    const booking = await db.queryOne(`SELECT total_amount, guest_email FROM bookings WHERE reference = $1`, [params.bookingReference]);
    if (!booking)
      throw new Error("Booking not found");
    const serverAmount = Number(booking.total_amount);
    const chargeAmount = params.method === "deposit" ? Math.round(serverAmount * config.depositRate) : serverAmount;
    const amountKobo = Math.round(chargeAmount * 100);
    const paystackRef = `KEO-PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const callbackUrl = `${config.frontendUrl}/booking/confirmation?ref=${paystackRef}`;
    if (params.method === "card" || params.method === "deposit") {
      const psData = await paystackRepository_default.initializeTransaction({
        email: booking.guest_email,
        amountKobo,
        reference: paystackRef,
        callbackUrl,
        metadata: { bookingReference: params.bookingReference, internal: true }
      });
      const row2 = await paymentRepository_default.create({
        bookingReference: params.bookingReference,
        paystackReference: paystackRef,
        idempotencyKey: params.idempotencyKey,
        amount: chargeAmount,
        amountKobo,
        method: params.method,
        authorizationUrl: psData.authorization_url,
        accessCode: psData.access_code
      });
      return this.formatInit(row2, params.method);
    }
    const transferExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const row = await paymentRepository_default.create({
      bookingReference: params.bookingReference,
      paystackReference: paystackRef,
      idempotencyKey: params.idempotencyKey,
      amount: chargeAmount,
      amountKobo,
      method: "transfer",
      transferBankName: "GTBank",
      transferAccountName: "KEO Experience Hotel",
      transferAccountNumber: "0123456789",
      transferExpiresAt
    });
    return this.formatInit(row, "transfer");
  }
  async verify(paystackReference) {
    const db = getDatabase();
    const psData = await paystackRepository_default.verifyTransaction(paystackReference);
    const state = psData.status === "success" ? "success" : psData.status === "failed" ? "failed" : "pending";
    if (state === "success") {
      await paymentRepository_default.markPaid(paystackReference, psData.paid_at ?? new Date().toISOString());
      const row = await paymentRepository_default.findByPaystackReference(paystackReference);
      if (row) {
        await db.query(`UPDATE bookings SET amount_paid = amount_paid + $1, balance_due = GREATEST(0, balance_due - $1),
           payment_status = 'success', paid_at = NOW() WHERE reference = $2`, [row.amount, row.booking_reference]);
      }
    }
    return {
      state,
      reference: paystackReference,
      amount: Math.round(psData.amount / 100),
      paidAt: psData.paid_at ?? undefined
    };
  }
  async handleWebhook(rawBody, signature) {
    const valid = await paystackRepository_default.verifyWebhookSignature(rawBody, signature);
    if (!valid)
      throw new Error("Invalid webhook signature");
    const event = JSON.parse(rawBody);
    if (event.event !== "charge.success")
      return;
    const psRef = event.data.reference;
    await this.verify(psRef);
  }
  async chargeCard(params) {
    const db = getDatabase();
    const booking = await db.queryOne(`SELECT total_amount, guest_email FROM bookings WHERE reference = $1`, [params.bookingReference]);
    if (!booking)
      throw new Error("Booking not found");
    const amountKobo = Math.round(Number(booking.total_amount) * 100);
    const paystackRef = `KEO-CHARGE-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const res = await paystackRepository_default.chargeCard({
      email: booking.guest_email,
      amountKobo,
      reference: paystackRef,
      card: params.card,
      pin: params.pin
    });
    return {
      status: res.status,
      reference: res.reference || paystackRef,
      displayText: res.display_text,
      url: res.url
    };
  }
  async submitPin(reference, pin) {
    const res = await paystackRepository_default.submitPin({ reference, pin });
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text
    };
  }
  async submitOtp(reference, otp) {
    const res = await paystackRepository_default.submitOtp({ reference, otp });
    if (res.status === "success") {
      await this.verify(reference);
    }
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text
    };
  }
  async submitPhone(reference, phone) {
    const res = await paystackRepository_default.submitPhone({ reference, phone });
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text
    };
  }
  async submitBirthday(reference, birthday) {
    const res = await paystackRepository_default.submitBirthday({ reference, birthday });
    return {
      status: res.status,
      reference: res.reference || reference,
      displayText: res.display_text
    };
  }
  formatInit(row, method) {
    return {
      reference: row.paystack_reference ?? row.booking_reference,
      gateway: "paystack",
      method,
      amount: Number(row.amount),
      authorizationUrl: row.authorization_url ?? undefined,
      accessCode: row.access_code ?? undefined,
      transferInstructions: row.transfer_account_number ? {
        provider: "Bank Transfer",
        bankName: row.transfer_bank_name,
        accountName: row.transfer_account_name,
        accountNumber: row.transfer_account_number,
        reference: row.paystack_reference,
        amount: Number(row.amount),
        expiresAt: row.transfer_expires_at
      } : undefined
    };
  }
}
var paymentService_default = new PaymentService;

// src/controllers/publicPaymentController.ts
class PublicPaymentController {
  async initialize(c) {
    try {
      const body = await c.req.json();
      const idempotencyKey = c.req.header("Idempotency-Key") ?? undefined;
      const { bookingReference, amount, method } = body;
      if (!bookingReference || !method) {
        return c.json({ error: "bookingReference and method are required" }, 400);
      }
      const result = await paymentService_default.initialize({
        bookingReference,
        amount: Number(amount ?? 0),
        method,
        email: body.email ?? "",
        idempotencyKey,
        depositAmount: body.depositAmount
      });
      return c.json(result);
    } catch (err) {
      console.error("[payment.initialize]", err);
      return c.json({ error: err.message || "Payment initialization failed" }, 500);
    }
  }
  async verify(c) {
    try {
      const reference = c.req.param("reference");
      const result = await paymentService_default.verify(reference);
      return c.json(result);
    } catch (err) {
      console.error("[payment.verify]", err);
      return c.json({ error: err.message || "Payment verification failed" }, 500);
    }
  }
  async webhook(c) {
    try {
      const signature = c.req.header("x-paystack-signature") ?? "";
      const rawBody = await c.req.text();
      await paymentService_default.handleWebhook(rawBody, signature);
      return c.json({ received: true });
    } catch (err) {
      console.error("[payment.webhook]", err);
      return c.json({ received: false, error: err.message }, 200);
    }
  }
  async confirmTransfer(c) {
    try {
      const reference = c.req.param("reference");
      const db = (await Promise.resolve().then(() => (init_database(), exports_database))).getDatabase();
      await db.query(`UPDATE bookings SET payment_method='transfer', payment_status='processing'
         WHERE reference=$1`, [reference]);
      const booking = await (await Promise.resolve().then(() => (init_bookingService(), exports_bookingService))).default.lookupBooking(reference);
      return c.json(booking);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  }
  async charge(c) {
    try {
      const body = await c.req.json();
      const result = await paymentService_default.chargeCard(body);
      return c.json(result);
    } catch (err) {
      console.error("[payment.charge]", err);
      return c.json({ error: err.message || "Charge failed" }, 500);
    }
  }
  async submitPin(c) {
    try {
      const { reference, pin } = await c.req.json();
      const result = await paymentService_default.submitPin(reference, pin);
      return c.json(result);
    } catch (err) {
      console.error("[payment.submitPin]", err);
      return c.json({ error: err.message || "Submit PIN failed" }, 500);
    }
  }
  async submitOtp(c) {
    try {
      const { reference, otp } = await c.req.json();
      const result = await paymentService_default.submitOtp(reference, otp);
      return c.json(result);
    } catch (err) {
      console.error("[payment.submitOtp]", err);
      return c.json({ error: err.message || "Submit OTP failed" }, 500);
    }
  }
  async submitPhone(c) {
    try {
      const { reference, phone } = await c.req.json();
      const result = await paymentService_default.submitPhone(reference, phone);
      return c.json(result);
    } catch (err) {
      console.error("[payment.submitPhone]", err);
      return c.json({ error: err.message || "Submit phone failed" }, 500);
    }
  }
  async submitBirthday(c) {
    try {
      const { reference, birthday } = await c.req.json();
      const result = await paymentService_default.submitBirthday(reference, birthday);
      return c.json(result);
    } catch (err) {
      console.error("[payment.submitBirthday]", err);
      return c.json({ error: err.message || "Submit birthday failed" }, 500);
    }
  }
}
var publicPaymentController_default = new PublicPaymentController;

// src/repositories/authRepository.ts
init_database();

class AuthRepository {
  async findUserByEmail(email) {
    const db = getDatabase();
    const user = await db.queryOne("SELECT * FROM staff_users WHERE email = $1 AND is_active = true", [email]);
    return user;
  }
  async verifyPassword(password, hash) {
    return await verifyPassword(password, hash);
  }
  async updateLastLogin(userId) {
    const db = getDatabase();
    await db.query("UPDATE staff_users SET last_login = NOW() WHERE id = $1", [userId]);
  }
  async findUserById(userId) {
    const db = getDatabase();
    const user = await db.queryOne("SELECT id, name, email, staff_id, role, role_title, avatar_url, department, hotel_branch, shift, terminal_id, permissions, phone FROM staff_users WHERE id = $1", [userId]);
    return user;
  }
}
var authRepository_default = new AuthRepository;

// src/services/authService.ts
class AuthService {
  async login(email, password) {
    const user = await authRepository_default.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }
    const isValid = await authRepository_default.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }
    await authRepository_default.updateLastLogin(user.id);
    return {
      token: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        staffId: user.staff_id,
        role: user.role,
        roleTitle: user.role_title,
        avatarUrl: user.avatar_url,
        department: user.department,
        hotelBranch: user.hotel_branch,
        shift: user.shift,
        terminalId: user.terminal_id,
        permissions: user.permissions,
        phone: user.phone
      }
    };
  }
  async getCurrentUser(userId) {
    const user = await authRepository_default.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    return user;
  }
}
var authService_default = new AuthService;

// src/controllers/authController.ts
class AuthController {
  async login(c) {
    try {
      const body = await c.req.json();
      const email = body.email || body.username;
      const password = body.password;
      if (!email || !password) {
        throw new UnauthorizedError("Email/username and password are required");
      }
      const result = await authService_default.login(email, password);
      return c.json(result);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async logout(c) {
    return c.json({ success: true });
  }
  async getCurrentUser(c) {
    try {
      const userId = c.get("userId");
      const user = await authService_default.getCurrentUser(userId);
      return c.json(user);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var authController_default = new AuthController;

// src/routes/admin/auth.ts
var router = new Hono2;
router.post("/login", authController_default.login.bind(authController_default));
router.get("/me", authController_default.getCurrentUser.bind(authController_default));
var auth_default = router;

// src/controllers/bookingController.ts
init_bookingService();
class BookingController {
  async getBookings(c) {
    try {
      const filters = {
        searchQuery: c.req.query("searchQuery") || "",
        channelCategory: c.req.query("channelCategory") || "all",
        channelSpecific: c.req.query("channelSpecific") || "all",
        status: c.req.query("status") || "all",
        timeframe: c.req.query("timeframe") || "all",
        sortBy: c.req.query("sortBy") || "latest_booked"
      };
      const bookings = await bookingService_default.getBookings(filters);
      return c.json(bookings);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getBooking(c) {
    try {
      const id = c.req.param("id");
      const booking = await bookingService_default.getBookingById(id);
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404);
      }
      return c.json(booking);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updateBookingStatus(c) {
    try {
      const id = c.req.param("id");
      const { status } = await c.req.json();
      const booking = await bookingService_default.updateBookingStatus(id, status);
      return c.json(booking);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async recordPayment(c) {
    try {
      const id = c.req.param("id");
      const { amount, paymentStatus } = await c.req.json();
      const booking = await bookingService_default.recordPayment(id, amount, paymentStatus);
      return c.json(booking);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async issueKeycard(c) {
    try {
      const id = c.req.param("id");
      const { cardUid, issuedBy } = await c.req.json();
      const booking = await bookingService_default.issueKeycard(id, cardUid, issuedBy);
      return c.json(booking);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var bookingController_default = new BookingController;

// src/middleware.ts
async function authMiddleware(c, next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const db = (await Promise.resolve().then(() => (init_database(), exports_database))).getDatabase();
    const user = await db.queryOne("SELECT id, role, permissions FROM staff_users WHERE id = $1 AND is_active = true", [token]);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("userId", user.id);
    c.set("userRole", user.role);
    c.set("userPermissions", user.permissions);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
}

// src/routes/admin/bookings.ts
var router2 = new Hono2;
router2.get("/", authMiddleware, bookingController_default.getBookings.bind(bookingController_default));
router2.get("/:id", authMiddleware, bookingController_default.getBooking.bind(bookingController_default));
router2.post("/:id/status", authMiddleware, bookingController_default.updateBookingStatus.bind(bookingController_default));
router2.post("/:id/payment", authMiddleware, bookingController_default.recordPayment.bind(bookingController_default));
router2.post("/:id/keycard", authMiddleware, bookingController_default.issueKeycard.bind(bookingController_default));
var bookings_default = router2;

// src/repositories/revenueRepository.ts
init_database();

class RevenueRepository {
  async getDashboardData() {
    const db = getDatabase();
    const revenue = await db.queryOne(`SELECT SUM(total_amount) as total FROM bookings 
       WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'`);
    const revpar = await db.queryOne(`SELECT AVG(rate_per_night) as total FROM bookings 
       WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'`);
    const adr = await db.queryOne(`SELECT AVG(rate_per_night) as avg_rate FROM bookings 
       WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'`);
    const fnbSpend = await db.queryOne(`SELECT SUM(amount_paid) as total FROM service_orders 
       WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`);
    const directBookings = await db.queryOne(`SELECT COUNT(*) as count FROM bookings 
       WHERE channel_category = 'offline' AND check_in_date >= CURRENT_DATE - INTERVAL '7 days'`);
    const channelBreakdown = await db.query(`SELECT channel_label, SUM(total_amount) as value 
       FROM bookings 
       WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY channel_label
       ORDER BY value DESC`);
    const transactions = await db.query(`SELECT reference as id, folio_number as folio, 'Folio Settlement' as desc, 'Rooms' as category, payment_method as method, TO_CHAR(booked_at, 'HH12:MI AM') as time, total_amount as amountUSD 
       FROM bookings 
       ORDER BY booked_at DESC 
       LIMIT 10`);
    return {
      revenue: revenue?.total || 0,
      revpar: revpar?.total || 324.5,
      adr: adr?.avg_rate || 368,
      fnbSpend: fnbSpend?.total || 197900,
      directBookings: directBookings?.count || 21,
      channelBreakdown: channelBreakdown.rows,
      transactions: transactions.rows
    };
  }
  async getTransactions(page = 1, limit = 20) {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    const transactions = await db.query(`SELECT reference as id, folio_number as folio, 'Folio Settlement' as desc, 'Rooms' as category, payment_method as method, TO_CHAR(booked_at, 'HH12:MI AM') as time, total_amount as amountUSD 
       FROM bookings 
       ORDER BY booked_at DESC 
       LIMIT $1 OFFSET $2`, [limit, offset]);
    const total = await db.queryOne("SELECT COUNT(*) as count FROM bookings");
    return {
      data: transactions.rows,
      total: total?.count || 0,
      page,
      totalPages: Math.ceil((total?.count || 0) / limit)
    };
  }
  async getReports(timeframe = "week") {
    const db = getDatabase();
    const dateFilter = timeframe === "today" ? "CURRENT_DATE" : timeframe === "month" ? "CURRENT_DATE - INTERVAL '30 days'" : "CURRENT_DATE - INTERVAL '7 days'";
    const report = await db.query(`SELECT 
         DATE(check_in_date) as day,
         SUM(total_amount) as revenue,
         COUNT(*) as bookings,
         AVG(rate_per_night) as adr,
         AVG(CASE WHEN payment_status = 'Paid' THEN 1 ELSE 0 END) * 100 as payout_rate
       FROM bookings 
       WHERE check_in_date >= ${dateFilter}
       GROUP BY DATE(check_in_date)
       ORDER BY day DESC`);
    return {
      timeframe,
      dateRange: timeframe === "today" ? "Today" : timeframe === "week" ? "Last 7 Days" : "Last 30 Days",
      data: report.rows
    };
  }
}
var revenueRepository_default = new RevenueRepository;

// src/services/revenueService.ts
class RevenueService {
  async getDashboardData() {
    return await revenueRepository_default.getDashboardData();
  }
  async getTransactions(page = 1, limit = 20) {
    return await revenueRepository_default.getTransactions(page, limit);
  }
  async getReports(timeframe = "week") {
    return await revenueRepository_default.getReports(timeframe);
  }
}
var revenueService_default = new RevenueService;

// src/controllers/revenueController.ts
class RevenueController {
  async getDashboard(c) {
    try {
      const data = await revenueService_default.getDashboardData();
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getTransactions(c) {
    try {
      const page = Number(c.req.query("page") || 1);
      const limit = Number(c.req.query("limit") || 20);
      const data = await revenueService_default.getTransactions(page, limit);
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getReports(c) {
    try {
      const timeframe = c.req.query("timeframe") || "week";
      const data = await revenueService_default.getReports(timeframe);
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var revenueController_default = new RevenueController;

// src/routes/admin/revenue.ts
var router3 = new Hono2;
router3.get("/dashboard", authMiddleware, revenueController_default.getDashboard.bind(revenueController_default));
router3.get("/transactions", authMiddleware, revenueController_default.getTransactions.bind(revenueController_default));
router3.get("/reports", authMiddleware, revenueController_default.getReports.bind(revenueController_default));
var revenue_default = router3;

// src/routes/admin/services.ts
var router4 = new Hono2;
router4.get("/menu", authMiddleware, serviceController_default.getServiceMenu.bind(serviceController_default));
router4.get("/menu/:slug", authMiddleware, serviceController_default.getService.bind(serviceController_default));
router4.post("/orders", authMiddleware, serviceController_default.createServiceOrder.bind(serviceController_default));
router4.get("/orders", authMiddleware, serviceController_default.getServiceOrders.bind(serviceController_default));
router4.post("/orders/:id/status", authMiddleware, serviceController_default.updateServiceOrderStatus.bind(serviceController_default));
var services_default = router4;

// src/repositories/settingsRepository.ts
init_database();
var inMemorySettingsCache = {
  propertyName: "KeoExperience Luxury Hotel & Suites",
  starRating: 5,
  tagline: "Luxury oceanfront sanctuary with infinity plunge suites",
  address: "Plot 1421, Victoria Island Promenade, Lagos, Nigeria",
  phone: "+234 1 890 2341",
  email: "reception@KeoExperience.luxury",
  licenseNumber: "HOTEL-LIC-2026-9021",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  gracePeriodMins: 30,
  earlyCheckInFeePct: 25,
  lateCheckOutFeeHr: 50,
  autoReleaseUnpaidHrs: 2,
  baseCurrency: "USD ($)",
  currencyMultiplier: 1600,
  vatTaxRatePct: 7.5,
  serviceChargePct: 10,
  tourismLevyPerNight: 5,
  autoInvoiceReceipts: true,
  keycardFrequency: "13.56MHz (Mifare Classic / DESFire)",
  keycardExpirationPaddingHrs: 2,
  keycardAutoInvalidate: true,
  encoderIpPort: "192.168.1.150:8080",
  enableSmsWelcome: true,
  enableEmailFolio: true,
  lowInventoryThreshold: 15,
  nightAuditAutoTime: "02:00",
  paystackPublicKey: "pk_live_90218401928410294109",
  stripePublicKey: "pk_live_51M092184019284102941",
  otaChannelManagerToken: "TOKEN-OTA-SYNC-9021"
};

class SettingsRepository {
  async getSettings() {
    try {
      const db = getDatabase();
      const row = await db.queryOne("SELECT * FROM hotel_settings WHERE id = 'default'");
      if (row) {
        return {
          propertyName: row.property_name || inMemorySettingsCache.propertyName,
          starRating: row.star_rating || inMemorySettingsCache.starRating,
          tagline: row.tagline || inMemorySettingsCache.tagline,
          address: row.address || inMemorySettingsCache.address,
          phone: row.phone || inMemorySettingsCache.phone,
          email: row.email || inMemorySettingsCache.email,
          licenseNumber: row.license_number || inMemorySettingsCache.licenseNumber,
          checkInTime: row.check_in_time || inMemorySettingsCache.checkInTime,
          checkOutTime: row.check_out_time || inMemorySettingsCache.checkOutTime,
          gracePeriodMins: row.grace_period_mins || inMemorySettingsCache.gracePeriodMins,
          earlyCheckInFeePct: row.early_check_in_fee_pct || inMemorySettingsCache.earlyCheckInFeePct,
          lateCheckOutFeeHr: row.late_check_out_fee_hr || inMemorySettingsCache.lateCheckOutFeeHr,
          autoReleaseUnpaidHrs: row.auto_release_unpaid_hrs || inMemorySettingsCache.autoReleaseUnpaidHrs,
          baseCurrency: row.base_currency || inMemorySettingsCache.baseCurrency,
          currencyMultiplier: row.currency_multiplier || inMemorySettingsCache.currencyMultiplier,
          vatTaxRatePct: row.vat_tax_rate_pct || inMemorySettingsCache.vatTaxRatePct,
          serviceChargePct: row.service_charge_pct || inMemorySettingsCache.serviceChargePct,
          tourismLevyPerNight: row.tourism_levy_per_night || inMemorySettingsCache.tourismLevyPerNight,
          autoInvoiceReceipts: row.auto_invoice_receipts ?? inMemorySettingsCache.autoInvoiceReceipts,
          keycardFrequency: row.keycard_frequency || inMemorySettingsCache.keycardFrequency,
          keycardExpirationPaddingHrs: row.keycard_expiration_padding_hrs || inMemorySettingsCache.keycardExpirationPaddingHrs,
          keycardAutoInvalidate: row.keycard_auto_invalidate ?? inMemorySettingsCache.keycardAutoInvalidate,
          encoderIpPort: row.encoder_ip_port || inMemorySettingsCache.encoderIpPort,
          enableSmsWelcome: row.enable_sms_welcome ?? inMemorySettingsCache.enableSmsWelcome,
          enableEmailFolio: row.enable_email_folio ?? inMemorySettingsCache.enableEmailFolio,
          lowInventoryThreshold: row.low_inventory_threshold || inMemorySettingsCache.lowInventoryThreshold,
          nightAuditAutoTime: row.night_audit_auto_time || inMemorySettingsCache.nightAuditAutoTime,
          paystackPublicKey: row.paystack_public_key || inMemorySettingsCache.paystackPublicKey,
          stripePublicKey: row.stripe_public_key || inMemorySettingsCache.stripePublicKey,
          otaChannelManagerToken: row.ota_channel_manager_token || inMemorySettingsCache.otaChannelManagerToken
        };
      }
    } catch (e) {}
    return inMemorySettingsCache;
  }
  async updateSettings(newSettings) {
    inMemorySettingsCache = { ...inMemorySettingsCache, ...newSettings };
    return inMemorySettingsCache;
  }
}
var settingsRepository_default = new SettingsRepository;

// src/services/settingsService.ts
class SettingsService {
  async getSettings() {
    return await settingsRepository_default.getSettings();
  }
  async updateSettings(settings) {
    return await settingsRepository_default.updateSettings(settings);
  }
}
var settingsService_default = new SettingsService;

// src/controllers/settingsController.ts
class SettingsController {
  async getSettings(c) {
    try {
      const data = await settingsService_default.getSettings();
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updateSettings(c) {
    try {
      const body = await c.req.json();
      const data = await settingsService_default.updateSettings(body);
      return c.json({ success: true, settings: data });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var settingsController_default = new SettingsController;

// src/routes/admin/settings.ts
var router5 = new Hono2;
router5.get("/", authMiddleware, settingsController_default.getSettings.bind(settingsController_default));
router5.post("/", authMiddleware, settingsController_default.updateSettings.bind(settingsController_default));
var settings_default = router5;

// src/repositories/dashboardRepository.ts
init_database();

class DashboardRepository {
  async getDashboardOverview() {
    const db = getDatabase();
    const revenueResult = await db.queryOne(`SELECT SUM(total_amount) as total FROM bookings WHERE status != 'Cancelled'`);
    const roomCounts = await db.queryOne(`SELECT 
         COUNT(*) as total,
         COUNT(CASE WHEN is_active = true THEN 1 END) as occupied
       FROM rooms`);
    const bookingStats = await db.queryOne(`SELECT 
         COUNT(*) as total_bookings,
         COUNT(CASE WHEN channel_category = 'offline' THEN 1 END) as offline_bookings,
         COUNT(CASE WHEN channel_category = 'online' THEN 1 END) as online_bookings
       FROM bookings`);
    const serviceStats = await db.queryOne(`SELECT 
         COALESCE(SUM(total_amount_usd), 0) as total_revenue,
         COUNT(CASE WHEN status != 'Completed' THEN 1 END) as active_orders
       FROM service_orders`);
    const latestBookings = await db.query(`SELECT 
         reference as id, 
         guest_name as name, 
         COALESCE(guest_avatar, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120') as avatar,
         check_in_date as "checkIn",
         check_out_date as "checkOut",
         room_name || ' #' || COALESCE(room_number, '101') as "roomDesc",
         channel_label as channel,
         CASE WHEN channel_category = 'offline' THEN 1 ELSE 0 END as "isOffline",
         total_amount as "amountUSD"
       FROM bookings 
       ORDER BY booked_at DESC 
       LIMIT 6`);
    const totalRooms = 500;
    const occupiedCount = roomCounts?.total ? roomCounts.total * 15 : 280;
    const vacantCount = totalRooms - occupiedCount;
    return {
      kpis: [
        {
          title: "Occupancy Rate",
          icon: "occupancy",
          mainValue: occupiedCount,
          mainUnit: `/${totalRooms} Rooms`,
          highlightText: `${(occupiedCount / totalRooms * 100).toFixed(1)}% current fill rate`,
          highlightIcon: "trending",
          stats: [
            { label: "Booked Rooms", value: occupiedCount - 60, icon: "bed", iconColor: "text-indigo-500" },
            { label: "Cancelled Rooms", value: 24, icon: "x", iconColor: "text-rose-500" }
          ],
          linkText: "View All Bookings",
          linkTo: "/admin/reservations"
        },
        {
          title: "Arrivals & Departures",
          icon: "travel",
          mainValue: 50,
          subtitle: "Total transfers scheduled",
          stats: [
            { label: "Scheduled Check-outs", value: 24, icon: "arrowUp", iconColor: "text-rose-500" },
            { label: "Scheduled Check-ins", value: 26, icon: "check", iconColor: "text-emerald-500" }
          ],
          linkText: "Dispatch Travel Trip",
          linkTo: "/admin/travel"
        },
        {
          title: "Culinary & Catering",
          icon: "catering",
          mainValue: Math.round(serviceStats?.total_revenue || 86500),
          highlightText: `${serviceStats?.active_orders || 22} active in kitchen station`,
          highlightIcon: "sparkles",
          stats: [
            { label: "Culinary Revenue", value: Math.round(serviceStats?.total_revenue || 86500), icon: "dollar", iconColor: "text-emerald-600" },
            { label: "Orders Completed", value: 228, icon: "check", iconColor: "text-indigo-500" }
          ],
          linkText: "Open Kitchen Board",
          linkTo: "/admin/services"
        }
      ],
      onlineStats: {
        bookingsCount: bookingStats?.online_bookings || 182,
        sharePct: 65,
        grossRevenueUSD: 148600,
        avgBookingUSD: 816,
        avgStayNights: 3.4,
        otaCommissionUSD: 14200,
        netYieldUSD: 134400,
        netMarginPct: "90.4%",
        conversionRate: "3.8%"
      },
      offlineStats: {
        bookingsCount: bookingStats?.offline_bookings || 98,
        sharePct: 35,
        grossRevenueUSD: 114500,
        avgBookingUSD: 1168,
        avgStayNights: 2.1,
        otaCommissionUSD: 0,
        netYieldUSD: 114500,
        netMarginPct: "100%",
        walkInConversionRate: "94.2%"
      },
      roomStatusItems: [
        { label: "Vacant", count: vacantCount, color: "#10B981" },
        { label: "Occupied", count: occupiedCount, color: "#4F46E5" },
        { label: "In-House Stay Overs", count: 60, color: "#8B5CF6" },
        { label: "Walk-Ins", count: 40, color: "#F59E0B" },
        { label: "Under Maintenance", count: 12, color: "#6B7280" },
        { label: "Out of Order", count: 8, color: "#EF4444" },
        { label: "Cleaning", count: 120, color: "#F97316" }
      ],
      latestBookings: latestBookings.rows.length > 0 ? latestBookings.rows : undefined,
      totalRevenueUSD: revenueResult?.total || 263100
    };
  }
}
var dashboardRepository_default = new DashboardRepository;

// src/services/dashboardService.ts
class DashboardService {
  async getDashboardOverview() {
    return await dashboardRepository_default.getDashboardOverview();
  }
}
var dashboardService_default = new DashboardService;

// src/controllers/dashboardController.ts
class DashboardController {
  async getOverview(c) {
    try {
      const data = await dashboardService_default.getDashboardOverview();
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var dashboardController_default = new DashboardController;

// src/routes/admin/dashboard.ts
var router6 = new Hono2;
router6.get("/overview", authMiddleware, dashboardController_default.getOverview.bind(dashboardController_default));
var dashboard_default = router6;

// src/repositories/staffRepository.ts
init_database();

class StaffRepository {
  async getAllStaff() {
    const db = getDatabase();
    const result = await db.query(`SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions,
              phone, is_active, last_login
       FROM staff_users
       ORDER BY CASE WHEN role = 'manager' THEN 0 ELSE 1 END, name ASC`);
    return result.rows;
  }
  async getStaffByRole(role) {
    const db = getDatabase();
    return db.queryOne(`SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions, phone
       FROM staff_users WHERE role = $1 AND is_active = true`, [role]);
  }
  async updateStaffProfile(id, data) {
    const db = getDatabase();
    const fields = [];
    const values = [];
    let idx = 1;
    if (data.name) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.email) {
      fields.push(`email = $${idx++}`);
      values.push(data.email);
    }
    if (data.roleTitle) {
      fields.push(`role_title = $${idx++}`);
      values.push(data.roleTitle);
    }
    if (data.phone) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }
    if (data.shift) {
      fields.push(`shift = $${idx++}`);
      values.push(data.shift);
    }
    if (data.department) {
      fields.push(`department = $${idx++}`);
      values.push(data.department);
    }
    if (data.avatarUrl) {
      fields.push(`avatar_url = $${idx++}`);
      values.push(data.avatarUrl);
    }
    if (fields.length === 0)
      return null;
    fields.push(`updated_at = NOW()`);
    values.push(id);
    await db.query(`UPDATE staff_users SET ${fields.join(", ")} WHERE id = $${idx}`, values);
    return this.getStaffById(id);
  }
  async updatePassword(id, newPasswordHash) {
    const db = getDatabase();
    await db.query(`UPDATE staff_users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [newPasswordHash, id]);
  }
  async updatePin(id, newPinHash) {
    const db = getDatabase();
    await db.query(`UPDATE staff_users SET pin_hash = $1, updated_at = NOW() WHERE id = $2`, [newPinHash, id]);
  }
  async getStaffById(id) {
    const db = getDatabase();
    return db.queryOne(`SELECT id, name, email, staff_id, role, role_title, avatar_url,
              department, hotel_branch, shift, terminal_id, permissions, phone
       FROM staff_users WHERE id = $1`, [id]);
  }
  async verifyPassword(id, password) {
    const db = getDatabase();
    const user = await db.queryOne(`SELECT password_hash FROM staff_users WHERE id = $1`, [id]);
    if (!user)
      return false;
    return Bun.password.verifySync(password, user.password_hash);
  }
}
var staffRepository_default = new StaffRepository;

// src/controllers/staffController.ts
class StaffController {
  async listStaff(c) {
    try {
      const staff = await staffRepository_default.getAllStaff();
      return c.json({ staff });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async getStaffByRole(c) {
    try {
      const role = c.req.param("role");
      if (!role)
        return c.json({ error: "Role parameter is required" }, 400);
      const staff = await staffRepository_default.getStaffByRole(role);
      if (!staff)
        return c.json({ error: "Not found" }, 404);
      return c.json({ staff });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updateProfile(c) {
    try {
      const id = c.req.param("id");
      if (!id)
        return c.json({ error: "ID parameter is required" }, 400);
      const body = await c.req.json();
      const { name, email, roleTitle, phone, shift, department, avatarUrl } = body;
      const updated = await staffRepository_default.updateStaffProfile(id, {
        name,
        email,
        roleTitle,
        phone,
        shift,
        department,
        avatarUrl
      });
      return c.json({ success: true, staff: updated });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updatePassword(c) {
    try {
      const id = c.req.param("id");
      if (!id)
        return c.json({ error: "ID parameter is required" }, 400);
      const { currentPassword, newPassword } = await c.req.json();
      if (!newPassword || newPassword.length < 6) {
        return c.json({ error: "Password must be at least 6 characters" }, 400);
      }
      const valid = await staffRepository_default.verifyPassword(id, currentPassword);
      if (!valid) {
        return c.json({ error: "Current password is incorrect" }, 401);
      }
      const hash = Bun.password.hashSync(newPassword);
      await staffRepository_default.updatePassword(id, hash);
      return c.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async verifyPin(c) {
    try {
      const id = c.req.param("id");
      if (!id)
        return c.json({ error: "ID parameter is required" }, 400);
      const { pin } = await c.req.json();
      const db = (await Promise.resolve().then(() => (init_database(), exports_database))).getDatabase();
      const user = await db.queryOne(`SELECT pin_hash FROM staff_users WHERE id = $1`, [id]);
      if (!user?.pin_hash)
        return c.json({ error: "Not found" }, 404);
      const valid = Bun.password.verifySync(pin, user.pin_hash);
      if (!valid)
        return c.json({ error: "Invalid PIN" }, 401);
      return c.json({ success: true });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
  async updatePin(c) {
    try {
      const id = c.req.param("id");
      if (!id)
        return c.json({ error: "ID parameter is required" }, 400);
      const { pin } = await c.req.json();
      if (!pin || !/^\d{4,6}$/.test(pin)) {
        return c.json({ error: "PIN must be 4\u20136 digits" }, 400);
      }
      const hash = Bun.password.hashSync(pin);
      await staffRepository_default.updatePin(id, hash);
      return c.json({ success: true, message: "Terminal PIN updated successfully" });
    } catch (error) {
      return handleApiError(c, error);
    }
  }
}
var staffController_default = new StaffController;

// src/routes/admin/staff.ts
var router7 = new Hono2;
router7.get("/", staffController_default.listStaff.bind(staffController_default));
router7.get("/role/:role", staffController_default.getStaffByRole.bind(staffController_default));
router7.put("/:id/profile", staffController_default.updateProfile.bind(staffController_default));
router7.put("/:id/password", staffController_default.updatePassword.bind(staffController_default));
router7.put("/:id/pin", staffController_default.updatePin.bind(staffController_default));
router7.post("/:id/verify-pin", staffController_default.verifyPin.bind(staffController_default));
var staff_default = router7;

// src/middlewares/rateLimit.ts
var store = new Map;
function rateLimit(maxRequests, windowMs) {
  return async (c, next) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim() || c.req.header("cf-connecting-ip") || "unknown";
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      c.header("X-RateLimit-Limit", String(maxRequests));
      c.header("X-RateLimit-Remaining", "0");
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }
    entry.count++;
    c.header("X-RateLimit-Limit", String(maxRequests));
    c.header("X-RateLimit-Remaining", String(maxRequests - entry.count));
    return next();
  };
}
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, ip) => {
    if (now > entry.resetAt)
      store.delete(ip);
  });
}, 5 * 60 * 1000);

// src/controllers/uploadController.ts
init_config();
var import_cloudinary = __toESM(require_cloudinary(), 1);
import_cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

class UploadController {
  async upload(c) {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof Blob)) {
        return c.json({ error: "No valid file provided" }, 400);
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = import_cloudinary.v2.uploader.upload_stream({
          folder: "keo_hotel_rooms",
          resource_type: "auto"
        }, (error, result) => {
          if (error)
            return reject(error);
          resolve(result);
        });
        stream.end(buffer);
      });
      return c.json({
        url: uploadResult.secure_url || uploadResult.url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height
      });
    } catch (error) {
      console.error("Cloudinary SDK upload error:", error);
      return c.json({ error: error.message || "Internal upload error" }, 500);
    }
  }
}
var uploadController_default = new UploadController;

// src/routes/index.ts
var router8 = new Hono2;
router8.post("/upload/cloudinary", uploadController_default.upload);
router8.get("/", (c) => c.json({ service: "KEO Hotel Management API", version: "1.0.0", status: "running" }));
router8.get("/rooms", roomController_default.fetchRooms);
router8.get("/rooms/:slug", roomController_default.fetchRoom);
router8.get("/availability", roomController_default.fetchAvailability);
router8.post("/rooms", roomController_default.createRoom);
router8.put("/rooms/:id", roomController_default.updateRoom);
router8.delete("/rooms/:id", roomController_default.deleteRoom);
router8.get("/services", serviceController_default.getServiceMenu);
router8.get("/services/:slug", serviceController_default.getService);
router8.get("/extras", publicBookingController_default.getExtras);
router8.post("/bookings", rateLimit(5, 60000), publicBookingController_default.createBooking);
router8.get("/reservations/:reference", publicBookingController_default.getReservation);
router8.post("/reservations/:reference/cancel", publicBookingController_default.cancelReservation);
router8.post("/bookings/:reference/payment-method", publicBookingController_default.setPaymentMethod);
router8.post("/payments/initialize", rateLimit(10, 60000), publicPaymentController_default.initialize);
router8.get("/payments/:reference/verify", publicPaymentController_default.verify);
router8.post("/payments/webhook", publicPaymentController_default.webhook);
router8.post("/payments/:reference/confirm-transfer", publicPaymentController_default.confirmTransfer);
router8.post("/payments/charge", rateLimit(10, 60000), publicPaymentController_default.charge);
router8.post("/payments/submit-pin", publicPaymentController_default.submitPin);
router8.post("/payments/submit-otp", publicPaymentController_default.submitOtp);
router8.post("/payments/submit-phone", publicPaymentController_default.submitPhone);
router8.post("/payments/submit-birthday", publicPaymentController_default.submitBirthday);
router8.get("/hotel", async (c) => c.json({ hotel: "KEO Experience Hotel" }));
router8.get("/gallery", async (c) => c.json({ gallery: [] }));
router8.route("/admin/auth", auth_default);
router8.route("/admin/bookings", bookings_default);
router8.route("/admin/revenue", revenue_default);
router8.route("/admin/services", services_default);
router8.route("/admin/settings", settings_default);
router8.route("/admin/dashboard", dashboard_default);
router8.route("/admin/staff", staff_default);
var routes_default = router8;

// src/index.ts
var app = new Hono2;
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Client-Version"],
  exposeHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
  credentials: false
}));
app.use("/*", logger());
app.use("/*", timing());
app.get("/health", (c) => c.text("OK"));
app.route("/api", routes_default);
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});
app.notFound((c) => c.json({ error: "Not found" }, 404));
if (typeof Bun !== "undefined" && import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    port: config.port
  });
  console.log(`Server running on http://localhost:${config.port}`);
}
var GET = handle(app);
var POST = handle(app);
var PUT = handle(app);
var DELETE = handle(app);
var src_default = handle(app);
export {
  src_default as default,
  PUT,
  POST,
  GET,
  DELETE
};
