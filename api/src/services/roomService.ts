import roomRepository from "../repositories/roomRepository"
import { Room } from "../types/rooms"

class RoomService {
  async fetchRooms(): Promise<Room[]> {
    return await roomRepository.fetchRooms()
  }

  async fetchRoom(slug: string): Promise<Room | null> {
    return await roomRepository.fetchRoom(slug)
  }

  async checkRoomAvailability(slugOrId: string, checkIn: string, checkOut: string) {
    return await roomRepository.checkRoomAvailability(slugOrId, checkIn, checkOut)
  }

  async fetchAvailability(checkIn: string, checkOut: string, adults: number, children: number, rooms: number): Promise<any[]> {
    const roomList = await roomRepository.fetchAvailableRooms(checkIn, checkOut)
    
    if (!checkIn || !checkOut) {
      return roomList.map((room: Room) => ({
        room,
        availableUnits: room.units || 1,
        pricePerNight: room.price_per_night || 250,
        total: (room.price_per_night || 250) * (rooms || 1),
        taxEstimate: (room.price_per_night || 250) * 0.075,
      }));
    }

    const nights = this.calculateNights(checkIn, checkOut)
    
    return roomList.map((room: Room) => {
      const availableUnits = room.units
      const pricePerNight = room.price_per_night
      const total = pricePerNight * nights * rooms
      const taxEstimate = total * 0.075
      return {
        room,
        availableUnits,
        pricePerNight,
        nights,
        total,
        taxEstimate,
      }
    })
  }

  async createRoom(roomData: any): Promise<any> {
    return await roomRepository.createRoom(roomData);
  }

  async updateRoom(id: string, roomData: any): Promise<any> {
    return await roomRepository.updateRoom(id, roomData);
  }

  async deleteRoom(id: string): Promise<boolean> {
    return await roomRepository.deleteRoom(id);
  }

  private calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export default new RoomService()