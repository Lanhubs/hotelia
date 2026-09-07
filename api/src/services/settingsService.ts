import settingsRepository, { HotelSettingsData } from "../repositories/settingsRepository";

class SettingsService {
  async getSettings(): Promise<HotelSettingsData> {
    return await settingsRepository.getSettings();
  }

  async updateSettings(settings: Partial<HotelSettingsData>): Promise<HotelSettingsData> {
    return await settingsRepository.updateSettings(settings);
  }
}

export default new SettingsService();
