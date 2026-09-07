import ApiClient from '../lib/api';
import { UserRole } from '../stores/authStore';
class AuthService {
    async login(payload: { email?: string; username?: string; password: string; role?: UserRole }): Promise<any> {
        try {
            const email = payload.email || payload.username;
            const response = await ApiClient.post<{ token: string; user: any }>('/admin/auth/login', {
                email,
                password: payload.password,
                role: payload.role,
            });
            if (response?.token) {
                ApiClient.setToken(response.token);
            }
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
    async logout(): Promise<void> {
        try {
            await ApiClient.post('/admin/auth/logout');
            ApiClient.clearToken();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }
    async switchRole(role: UserRole): Promise<void> {
        try {
            const response = await ApiClient.post<{ token: string }>('/admin/auth/switch-role', { role });
            if (response?.token) {
                ApiClient.setToken(response.token);
            }
        } catch (error) {
            console.error('Switch role failed:', error);
            throw error;
        }
    }
}

export default new AuthService();