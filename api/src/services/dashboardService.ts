import dashboardRepository from "../repositories/dashboardRepository";

class DashboardService {
  async getDashboardOverview() {
    return await dashboardRepository.getDashboardOverview();
  }
}

export default new DashboardService();
