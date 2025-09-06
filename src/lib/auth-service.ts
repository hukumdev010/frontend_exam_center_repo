// Simple auth service for FastAPI integration
export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    try {
      this.token = localStorage.getItem('auth_token');
    } catch {
      this.token = null;
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem('auth_token', token);
    } catch {
      // Ignore localStorage errors
    }
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken() {
    this.token = null;
    try {
      localStorage.removeItem('auth_token');
    } catch {
      // Ignore localStorage errors
    }
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async apiCall(url: string, options: RequestInit = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export const authService = AuthService.getInstance();
