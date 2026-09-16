import { SQL } from 'bun';
import { config } from './config';
import { createSqliteDatabase } from './sqliteAdapter';
import {
  CREATE_ROOMS_TABLE,
  CREATE_BOOKINGS_TABLE,
  CREATE_SERVICE_MENU_TABLE,
  CREATE_SERVICE_ORDERS_TABLE,
  CREATE_STAFF_USERS_TABLE,
  CREATE_SETTINGS_TABLE,
  CREATE_PAYMENTS_TABLE,
  CREATE_EXTRAS_TABLE,
  CREATE_IDEMPOTENCY_TABLE,
  CREATE_NOTIFICATIONS_TABLE,
  SEED_EXTRAS,
  SEED_SERVICE_MENU,
  CREATE_EVENTS_TABLE,
  CREATE_EVENT_BOOKINGS_TABLE,
  CREATE_EVENTS_INDEXES,
  SEED_EVENTS,
} from './dbSchema';

export interface Database {
  query<T>(text: string, params?: any[]): Promise<{ rows: T[] }>;
  queryOne<T>(text: string, params?: any[]): Promise<T | null>;
  transaction<T>(fn: (client: any) => Promise<T>): Promise<T>;
  close(): void;
}

let client: Database | null = null;

export function getDatabase(): Database {
  if (!client) {
    const driver = Bun.env.DB_DRIVER || 'sqlite';
    if (driver === 'postgres' && config.db.connectionString) {
      console.log('Connecting to PostgreSQL database...');
      const pool = new SQL(config.db.connectionString);
      client = {
        query: <T>(text: string, params?: any[]) => pool.unsafe(text, params) as any,
        queryOne: async <T>(text: string, params?: any[]) => {
          const result = await pool.unsafe(text, params);
          return result?.rows ? result.rows[0] || null : null;
        },
        transaction: async <T>(fn: (client: any) => Promise<T>) => {
          const connection = await pool.connect();
          try {
            await connection.unsafe('BEGIN');
            const result = await fn(connection);
            await connection.unsafe('COMMIT');
            return result;
          } catch (error) {
            await connection.unsafe('ROLLBACK');
            throw error;
          }
        },
        close: () => pool.end(),
      };
    } else {
      console.log('Using SQLite database (Bun native driver)...');
      const dbPath = Bun.env.SQLITE_DB_PATH || 'keo_hotel.sqlite';
      client = createSqliteDatabase(dbPath);
    }
  }
  return client;
}

async function seedStaffUsers(db: Database) {
  const staffData = [
    {
      id: 'staff-mgr-001',
      name: 'Marcus Vance',
      email: 'marcus.vance@keoexperience.com',
      staffId: 'STAFF-MGR-001',
      role: 'manager',
      roleTitle: 'General Manager & Director',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      department: 'Executive Management',
      hotelBranch: 'KEO Experience Hotel & Suites',
      shift: 'General Oversight (Day)',
      terminalId: 'EXEC-STATION-01',
      permissions: ['all','revenue_audit','staff_management','pricing_control','system_config','reservations_full'],
      password: 'KeoGM@2026!',
      pin: '1234',
      phone: '+234 813 014 8920',
    },
    {
      id: 'staff-rec-104',
      name: 'Elena Rostova',
      email: 'elena.rostova@keoexperience.com',
      staffId: 'STAFF-REC-104',
      role: 'receptionist',
      roleTitle: 'Front Desk Lead & Concierge',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
      department: 'Front Office & Guest Services',
      hotelBranch: 'KEO Experience Hotel & Suites',
      shift: 'Morning Shift (06:00 - 14:00)',
      terminalId: 'TERMINAL-FD-02',
      permissions: ['check_in_out','walk_in_reservations','keycard_coding','folio_management','guest_lookup'],
      password: 'KeoFD@2026!',
      pin: '5678',
      phone: '+234 813 014 8921',
    },
  ];

  for (const staff of staffData) {
    const passwordHash = Bun.password.hashSync(staff.password);
    const pinHash = Bun.password.hashSync(staff.pin);
    await db.query(
      `INSERT OR IGNORE INTO staff_users (
        id, name, email, staff_id, role, role_title, avatar_url,
        department, hotel_branch, shift, terminal_id,
        permissions, password_hash, pin_hash, phone, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,1)`,
      [
        staff.id, staff.name, staff.email, staff.staffId, staff.role, staff.roleTitle,
        staff.avatarUrl, staff.department, staff.hotelBranch, staff.shift,
        staff.terminalId, JSON.stringify(staff.permissions), passwordHash, pinHash, staff.phone,
      ]
    );
  }
}

async function seedDefaultRooms(db: Database) {
  const defaultRooms = [
    {
      id: 'room-exec-01',
      slug: 'presidential-ocean-suite',
      name: 'Presidential Ocean Suite',
      category: 'Presidential Suite',
      tagline: 'Panoramic Atlantic views, private infinity splash pool & dedicated butler',
      description: 'The pinnacle of Nigerian luxury hospitality. Our Presidential Suite occupies the top floor with 270-degree floor-to-ceiling glass wrapping the Atlantic coastline.',
      overview: 'Spanning over 180 sqm, featuring a private plunge pool, master king bedroom, dining room for 8, and dedicated security entrance.',
      price_per_night: 850,
      price_naira_per_night: 1360000,
      capacity: 4,
      bed_type: 'Grand King Bed',
      size: 180,
      floor: 'Penthouse (12th)',
      units: 1,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1600&h=900',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900'
      ]),
      video_url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-suite-bedroom-41551-large.mp4',
      amenities: JSON.stringify(['Private Infinity Pool', '24/7 Butler Service', 'Executive Lounge Access', 'Helipad Transfer', 'Jacuzzi Bath']),
      features: JSON.stringify(['24/7 Butler Service', 'Private Terrace & Plunge Pool', 'Bang & Olufsen Sound System']),
    },
    {
      id: 'room-exec-02',
      slug: 'diplomatic-king-suite',
      name: 'Diplomatic King Suite',
      category: 'Executive Suite',
      tagline: 'Refined oceanfront elegance tailored for dignitaries & C-suite executives',
      description: 'Designed for high-level business executives and diplomats seeking supreme privacy, seamless security, and unmatched comfort.',
      overview: 'Expansive 110 sqm suite featuring a private meeting salon, ergonomically engineered workspace, and lavish marble bath.',
      price_per_night: 480,
      price_naira_per_night: 768000,
      capacity: 2,
      bed_type: 'King Bed',
      size: 110,
      floor: '9th - 11th Floor',
      units: 3,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1600&h=900',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1600&h=900'
      ]),
      video_url: null,
      amenities: JSON.stringify(['Executive Workspace', 'High-speed Wi-Fi', 'Complimentary Airport Transfer', 'Nespresso Station']),
      features: JSON.stringify(['Executive Meeting Desk', 'Hermès Toiletries', 'Walk-in Closet']),
    },
    {
      id: 'room-deluxe-01',
      slug: 'deluxe-atlantic-room',
      name: 'Deluxe Atlantic Room',
      category: 'Deluxe Room',
      tagline: 'Modern luxury with private balcony overlooking Victoria Island oceanfront',
      description: 'Bright, sleek, and immaculately detailed with natural mahogany accents, premium linens, and floor-to-ceiling balcony views.',
      overview: 'Comfortable 55 sqm luxury room with plush seating area, smart home automated controls, and rainfall shower.',
      price_per_night: 280,
      price_naira_per_night: 448000,
      capacity: 2,
      bed_type: 'King Bed / Twin',
      size: 55,
      floor: '4th - 8th Floor',
      units: 10,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900'
      ]),
      video_url: null,
      amenities: JSON.stringify(['Ocean View Balcony', 'Smart TV', 'Rainfall Shower', '24/7 Room Service']),
      features: JSON.stringify(['Private Balcony', 'Smart Room Control', 'Mini Bar']),
    }
  ];

  for (const r of defaultRooms) {
    await db.query(
      `INSERT OR IGNORE INTO rooms (
        id, slug, name, category, tagline, description, overview,
        price_per_night, price_naira_per_night, capacity, bed_type, size, floor, units,
        image, gallery, video_url, amenities, features, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,1)`,
      [
        r.id, r.slug, r.name, r.category, r.tagline, r.description, r.overview,
        r.price_per_night, r.price_naira_per_night, r.capacity, r.bed_type, r.size, r.floor, r.units,
        r.image, r.gallery, r.video_url, r.amenities, r.features
      ]
    );
  }
}

export async function initDatabase() {
  try {
    const db = getDatabase();
    await db.query(CREATE_ROOMS_TABLE);
    await db.query(CREATE_BOOKINGS_TABLE);
    await db.query(CREATE_SERVICE_MENU_TABLE);
    await db.query(CREATE_SERVICE_ORDERS_TABLE);
    await db.query(CREATE_STAFF_USERS_TABLE);
    await db.query(CREATE_SETTINGS_TABLE);
    await db.query(CREATE_PAYMENTS_TABLE);
    await db.query(CREATE_EXTRAS_TABLE);
    await db.query(CREATE_IDEMPOTENCY_TABLE);
    await db.query(CREATE_NOTIFICATIONS_TABLE);
    await db.query(CREATE_EVENTS_TABLE);
    await db.query(CREATE_EVENT_BOOKINGS_TABLE);
    await db.query(CREATE_EVENTS_INDEXES);
    
    // Migration: Add room_numbers column if it doesn't exist
    try {
      await db.query(`ALTER TABLE rooms ADD COLUMN room_numbers TEXT DEFAULT '[]'`);
      console.log('Added room_numbers column to rooms table');
    } catch (error) {
      // Column already exists or other error - ignore
      console.log('room_numbers column already exists or migration not needed');
    }
    
    await seedStaffUsers(db);
    await seedDefaultRooms(db);
    await db.query(SEED_EXTRAS);
    await db.query(SEED_SERVICE_MENU);
    await db.query(SEED_EVENTS);
    console.log('Database schema and seed data initialized successfully.');
  } catch (error) {
    console.warn('Database initialization warning:', error);
  }
}

initDatabase();