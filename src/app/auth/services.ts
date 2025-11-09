import { API_ENDPOINTS } from "@/lib/api-config";

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export class AuthService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
        return this.makeRequest(API_ENDPOINTS.auth.google);
    }

    static async handleAuthCallback(code: string, state: string): Promise<AuthResponse> {
        return this.makeRequest(`${API_ENDPOINTS.auth.google}/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
        });
    }

    static async getCurrentUser(authHeaders: HeadersInit): Promise<User> {
        return this.makeRequest(API_ENDPOINTS.auth.me, {
            headers: authHeaders,
        });
    }

    static async logout(authHeaders: HeadersInit): Promise<{ message: string }> {
        return this.makeRequest(API_ENDPOINTS.auth.logout, {
            method: 'POST',
            headers: authHeaders,
        });
    }

    static async loginWithEmailPassword(email: string, password: string): Promise<AuthResponse> {
        return this.makeRequest(API_ENDPOINTS.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    }

    static async registerUser(name: string, email: string, password: string): Promise<{ message: string; user: User }> {
        return this.makeRequest(API_ENDPOINTS.auth.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
    }

    static async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    }
}