import serviceRepository from "../repositories/serviceRepository"
import { ServiceMenu, ServiceOrder } from "../types/services"

class ServiceService {
  async getServiceMenu(): Promise<ServiceMenu[]> {
    return await serviceRepository.fetchServiceMenu()
  }

  async getServiceBySlug(slug: string): Promise<ServiceMenu | null> {
    return await serviceRepository.fetchServiceBySlug(slug)
  }

  async createMenuItem(data: any): Promise<ServiceMenu | null> {
    return await serviceRepository.createServiceMenuItem(data)
  }

  async updateMenuItem(id: string, data: any): Promise<ServiceMenu | null> {
    return await serviceRepository.updateServiceMenuItem(id, data)
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return await serviceRepository.deleteServiceMenuItem(id)
  }

  async createServiceOrder(data: any): Promise<ServiceOrder | null> {
    return await serviceRepository.createServiceOrder(data)
  }

  async getServiceOrders(filters: { department?: string; status?: string }): Promise<ServiceOrder[]> {
    return await serviceRepository.fetchServiceOrders(filters)
  }

  async updateServiceOrderStatus(id: string, status: string): Promise<ServiceOrder | null> {
    return await serviceRepository.updateServiceOrderStatus(id, status)
  }

  async getServiceOrderById(id: string): Promise<ServiceOrder | null> {
    return await serviceRepository.findServiceOrderById(id)
  }
}

export default new ServiceService()