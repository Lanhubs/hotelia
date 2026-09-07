import revenueRepository from "../repositories/revenueRepository"

class RevenueService {
  async getDashboardData() {
    return await revenueRepository.getDashboardData()
  }

  async getTransactions(page: number = 1, limit: number = 20) {
    return await revenueRepository.getTransactions(page, limit)
  }

  async getReports(timeframe: string = 'week') {
    return await revenueRepository.getReports(timeframe)
  }
}

export default new RevenueService()