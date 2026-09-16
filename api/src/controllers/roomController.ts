import { Context } from "hono"
import roomService from "../services/roomService"

class RoomController {
  async fetchRooms(c: Context): Promise<Response> {
    const rooms = await roomService.fetchRooms()
    return c.json(rooms)
  }

  async fetchRoom(c: Context): Promise<Response> {
    const slug = c.req.param("slug") as string
    const room = await roomService.fetchRoom(slug)
    if (!room) {
      return c.json({ error: "Room not found" }, 404)
    }
    return c.json(room)
  }

  async checkRoomAvailability(c: Context): Promise<Response> {
    const slug = c.req.param("slug") as string
    const checkIn = c.req.query("checkIn") as string
    const checkOut = c.req.query("checkOut") as string

    if (!checkIn || !checkOut) {
      return c.json({ error: "checkIn and checkOut query params are required" }, 400)
    }

    const result = await roomService.checkRoomAvailability(slug, checkIn, checkOut)
    return c.json(result)
  }

  async fetchAvailability(c: Context): Promise<Response> {
    const checkIn = c.req.query("checkIn") as string
    const checkOut = c.req.query("checkOut") as string
    const adults = Number(c.req.query("adults") || 1)
    const children = Number(c.req.query("children") || 0)
    const rooms = Number(c.req.query("rooms") || 1)

    const availability = await roomService.fetchAvailability(checkIn, checkOut, adults, children, rooms)
    return c.json(availability)
  }

  async createRoom(c: Context): Promise<Response> {
    const body = await c.req.json()
    const room = await roomService.createRoom(body)
    return c.json({ success: true, room }, 201)
  }

  async updateRoom(c: Context): Promise<Response> {
    const id = c.req.param("id")as string
    const body = await c.req.json()
    const room = await roomService.updateRoom(id, body)
    return c.json({ success: true, room })
  }

  async deleteRoom(c: Context): Promise<Response> {
    const id = c.req.param("id") as string
    await roomService.deleteRoom(id)
    return c.json({ success: true, message: "Room deleted" })
  }
}

export default new RoomController()