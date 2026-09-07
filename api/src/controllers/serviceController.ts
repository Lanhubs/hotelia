import { Context } from "hono"
import serviceService from "../services/serviceService"
import { ServiceMenu } from "../types/services"
import { handleApiError } from "../types/errorTypes"

class ServiceController {
  async getServiceMenu(c: Context): Promise<Response> {
    try {
      const services = await serviceService.getServiceMenu()
      return c.json(services)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getService(c: Context): Promise<Response> {
    try {
      const slug = c.req.param("slug")as string
      const service = await serviceService.getServiceBySlug(slug)
      if (!service) {
        return c.json({ error: "Service not found" }, 404)
      }
      return c.json(service)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async createServiceOrder(c: Context): Promise<Response> {
    try {
      const data = await c.req.json()
      const order = await serviceService.createServiceOrder(data)
      return c.json(order, 201)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getServiceOrders(c: Context): Promise<Response> {
    try {
      const department = c.req.query('department') as string
      const status = c.req.query('status') as string
      const orders = await serviceService.getServiceOrders({ department, status })
      return c.json(orders)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async updateServiceOrderStatus(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const { status } = await c.req.json()
      const order = await serviceService.updateServiceOrderStatus(id, status)
      return c.json(order)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new ServiceController()