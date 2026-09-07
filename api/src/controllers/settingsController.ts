import { Context } from "hono";
import settingsService from "../services/settingsService";
import { handleApiError } from "../types/errorTypes";

class SettingsController {
  async getSettings(c: Context): Promise<Response> {
    try {
      const data = await settingsService.getSettings();
      return c.json(data);
    } catch (error) {
      return handleApiError(c, error as any);
    }
  }

  async updateSettings(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const data = await settingsService.updateSettings(body);
      return c.json({ success: true, settings: data });
    } catch (error) {
      return handleApiError(c, error as any);
    }
  }
}

export default new SettingsController();
