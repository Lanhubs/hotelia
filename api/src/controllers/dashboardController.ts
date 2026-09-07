import { Context } from "hono";
import dashboardService from "../services/dashboardService";
import { handleApiError } from "../types/errorTypes";

class DashboardController {
  async getOverview(c: Context): Promise<Response> {
    try {
      const data = await dashboardService.getDashboardOverview();
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error as any);
    }
  }
}

export default new DashboardController();
