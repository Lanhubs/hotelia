import { getDatabase } from "../database"
import { Room } from "../types/rooms"

function mapRoom(row: any): any {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    tagline: row.tagline || '',
    description: row.description || '',
    overview: row.overview || row.description || '',
    pricePerNight: Number(row.price_per_night),
    priceNairaPerNight: Number(row.price_naira_per_night || (row.price_per_night * 1600)),
    price_per_night: Number(row.price_per_night),
    price_naira_per_night: Number(row.price_naira_per_night || (row.price_per_night * 1600)),
    capacity: row.capacity || 2,
    bedType: row.bed_type || 'King Bed',
    bed_type: row.bed_type || 'King Bed',
    size: row.size || 45,
    floor: row.floor || '2',
    units: row.units || 1,
    image: row.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900',
    heroImage: row.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900',
    gallery: Array.isArray(row.gallery)
      ? row.gallery
      : typeof row.gallery === 'string'
      ? (() => { try { return JSON.parse(row.gallery); } catch { return [row.gallery]; } })()
      : [],
    videoUrl: row.video_url || null,
    video_url: row.video_url || null,
    location: row.location || 'Victoria Island Promenade, Lagos',
    roomNumbers: Array.isArray(row.room_numbers) ? row.room_numbers : [`${row.floor || '2'}0${Math.floor(1 + Math.random() * 8)}`],
    maxGuests: row.capacity || row.max_guests || 2,
    bedrooms: row.bedrooms || 1,
    bathrooms: row.bathrooms || 1,
    squareMeters: row.size || 45,
    isWalkInReady: true,
    rating: row.rating || 5.0,
    reviewsCount: row.reviews_count || 1,
    amenities: Array.isArray(row.amenities)
      ? row.amenities
      : typeof row.amenities === 'string'
      ? (() => { try { return JSON.parse(row.amenities); } catch { return []; } })()
      : [],
    features: Array.isArray(row.features)
      ? row.features
      : typeof row.features === 'string'
      ? (() => { try { return JSON.parse(row.features); } catch { return []; } })()
      : [],
  };
}

class RoomRepository {
  async fetchRooms(): Promise<any[]> {
    const db = getDatabase();
    const rooms = await db.query<any>('SELECT * FROM rooms WHERE is_active = true ORDER BY name');
    return rooms.rows.map(mapRoom);
  }

  async fetchRoom(slug: string): Promise<any | null> {
    const db = getDatabase();
    const room = await db.queryOne<any>(
      'SELECT * FROM rooms WHERE (slug = $1 OR id = $2) AND (is_active = true OR is_active = 1)',
      [slug, slug]
    );
    return mapRoom(room);
  }

  async fetchAvailableRooms(checkIn: string, checkOut: string): Promise<any[]> {
    const db = getDatabase();
    const rooms = await db.query<any>(
      'SELECT * FROM rooms WHERE is_active = true',
      []
    );
    return rooms.rows.map(mapRoom);
  }

  async createRoom(roomData: any): Promise<any> {
    const db = getDatabase();
    const slug = roomData.slug || roomData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const result = await db.queryOne<any>(
      `INSERT INTO rooms (slug, name, category, tagline, description, price_per_night, price_naira_per_night, capacity, bed_type, size, floor, units, image, gallery, video_url, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        slug, roomData.name, roomData.category || 'Executive Suite', roomData.tagline || '', roomData.description || '',
        roomData.pricePerNight || 250, roomData.priceNairaPerNight || 400000, roomData.maxGuests || roomData.capacity || 2,
        roomData.bedType || 'King Bed', roomData.squareMeters || roomData.size || 45, roomData.floor || '2', roomData.units || 1,
        roomData.heroImage || roomData.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1600&h=900',
        roomData.gallery || [], roomData.videoUrl || null,
        JSON.stringify(roomData.amenities || []),
      ]
    );
    return mapRoom(result || roomData);
  }

  async updateRoom(id: string, roomData: any): Promise<any> {
    const db = getDatabase();
    await db.query(
      `UPDATE rooms 
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
       WHERE id = $14 OR slug = $15`,
      [
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
        id,
      ]
    );

    const updated = await this.fetchRoom(id);
    return updated || { id, ...roomData };
  }

  async deleteRoom(id: string): Promise<boolean> {
    const db = getDatabase();
    await db.query('UPDATE rooms SET is_active = false WHERE id = $1 OR slug = $1', [id]);
    return true;
  }
}

export default new RoomRepository();