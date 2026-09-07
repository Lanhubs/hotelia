import { Context } from "hono"
import revenueService from "../services/revenueService"
import { handleApiError } from "../types/errorTypes"

class RevenueController {
  async getDashboard(c: Context): Promise<Response> {
    try {
      const data = await revenueService.getDashboardData()
      return c.json(data)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getTransactions(c: Context): Promise<Response> {
    try {
      const page = Number(c.req.query('page') || 1)
      const limit = Number(c.req.query('limit') || 20)
      const data = await revenueService.getTransactions(page, limit)
      return c.json(data)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getReports(c: Context): Promise<Response> {
    try {
      const timeframe = c.req.query('timeframe') || 'week'
      const data = await revenueService.getReports(timeframe)
      return c.json(data)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new RevenueController()