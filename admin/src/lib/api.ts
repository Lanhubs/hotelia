export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: unknown;
}

export interface InterceptorContext {
  url: string;
  config: RequestInit;
}

export type RequestInterceptor = (
  context: InterceptorContext
) => InterceptorContext | Promise<InterceptorContext>;

export type ResponseInterceptor = (
  response: Response
) => Response | Promise<Response>;

export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  tokenKey?: string; // Key name for storage (default: 'auth_token')
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private tokenKey: string;
  private interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  } = {
    request: [],
    response: [],
  };

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.tokenKey = config.tokenKey || 'auth_token';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Register default sessionStorage interceptors
    this.setupAuthInterceptors();
  }

  // --- SessionStorage Helpers ---

  getToken(): string | null {
    try {
      return sessionStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      sessionStorage.setItem(this.tokenKey, token);
    } catch (e) {
      console.error('Failed to save token to sessionStorage:', e);
    }
  }

  clearToken(): void {
    try {
      sessionStorage.removeItem(this.tokenKey);
    } catch (e) {
      console.error('Failed to clear token from sessionStorage:', e);
    }
  }

  // --- Default Interceptors ---

  private setupAuthInterceptors(): void {
    // Automatically attach token from sessionStorage to outgoing requests
    this.addRequestInterceptor(({ url, config }) => {
      const token = this.getToken();
      const headers = new Headers(config.headers);

      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return { url, config: { ...config, headers } };
    });

    // Automatically clear token on 401 Unauthorized
    this.addResponseInterceptor(async (response) => {
      if (response.status === 401) {
        this.clearToken();
      }
      return response;
    });
  }

  // --- Interceptor Registration ---

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.interceptors.response.push(interceptor);
  }

  // --- Core Request Method ---

  async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const { body, headers, ...customOptions } = options;

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (isFormData) {
      delete requestHeaders['Content-Type'];
    }

    let context: InterceptorContext = {
      url: `${this.baseUrl}${endpoint}`,
      config: {
        ...customOptions,
        headers: requestHeaders,
        body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      },
    };

    // Execute Request Interceptors
    for (const interceptor of this.interceptors.request) {
      context = await interceptor(context);
    }

    try {
      let response = await fetch(context.url, context.config);

      // Execute Response Interceptors
      for (const interceptor of this.interceptors.response) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      throw error;
    }
  }

  // --- Verb Helper Methods ---

  get<T>(endpoint: string, options?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestConfig, 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
const Api = new ApiClient({
  baseUrl:  '/api',
  headers: {
    'X-Client-Version': '1.0.0',
  },
});

// ── Notification API Methods ─────────────────────────────────────────────────
const notificationApi = {
  /**
   * Get all notifications
   * @param limit Maximum number of notifications (default: 20)
   * @param offset Number of notifications to skip (default: 0)
   */
  getNotifications: async (limit: number = 20, offset: number = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    return Api.get<{ notifications: any[] }>('/notifications?' + params.toString())
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    return Api.get<{ unreadCount: number }>('/notifications/unread-count')
  },

  /**
   * Create a new notification
   */
  createNotification: async (data: {
    type: 'booking' | 'payment' | 'keycard' | 'service' | 'housekeeping' | 'system'
    severity: 'info' | 'success' | 'urgent'
    title: string
    message: string
    meta?: string
    source: 'action' | 'inbound'
    navigateTo?: string
  }) => {
    return Api.post<{ notification: any; message: string }>('/notifications', data)
  },

  /**
   * Mark a notification as read
   * @param id Notification ID
   */
  markAsRead: async (id: string) => {
    return Api.patch<{ success: boolean; message: string }>(`/notifications/${id}/read`)
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return Api.patch<{ success: boolean; message: string; readCount: number }>('/notifications/read-all')
  },

  /**
   * Delete a specific notification
   * @param id Notification ID
   */
  deleteNotification: async (id: string) => {
    return Api.delete<{ success: boolean; message: string }>(`/notifications/${id}`)
  },

  /**
   * Delete all notifications
   */
  deleteAll: async () => {
    return Api.delete<{ success: boolean; message: string; deletedCount: number }>('/notifications')
  },

  // Helper methods for common notification types
  sendBooking: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'booking',
      severity: 'info',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    }),

  sendPayment: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'payment',
      severity: 'success',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    }),

  sendKeycard: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'keycard',
      severity: 'info',
      title,
      message,
      meta,
      source: 'inbound',
      navigateTo,
    }),

  sendService: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'service',
      severity: 'info',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    }),

  sendHousekeeping: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'housekeeping',
      severity: 'info',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    }),

  sendSystem: (title: string, message: string, meta?: string, navigateTo?: string) =>
    notificationApi.createNotification({
      type: 'system',
      severity: 'urgent',
      title,
      message,
      meta,
      source: 'action',
      navigateTo,
    }),
}

export { notificationApi }
export default Api;