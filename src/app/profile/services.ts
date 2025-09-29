import { API_ENDPOINTS } from "@/lib/api-config";

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
    created_at: string;
    updated_at: string;
}

export interface UserStats {
    total_certifications_attempted: number;
    certifications_passed: number;
    total_quiz_attempts: number;
    average_score: number;
    sessions_booked: number;
    sessions_completed: number;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export class ProfileService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getUserProfile(authHeaders: HeadersInit): Promise<UserProfile> {
        return this.makeRequest(API_ENDPOINTS.auth.me, {
            headers: authHeaders,
        });
    }

    static async updateUserProfile(
        authHeaders: HeadersInit, 
        profileData: UpdateProfileData
    ): Promise<UserProfile> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/users/me`, {
            method: 'PUT',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
    }

    static async getUserStats(authHeaders: HeadersInit): Promise<UserStats> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/users/me/stats`, {
            headers: authHeaders,
        });
    }

    static async deleteAccount(authHeaders: HeadersInit): Promise<{ message: string }> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/users/me`, {
            method: 'DELETE',
            headers: authHeaders,
        });
    }

    static async changePassword(
        authHeaders: HeadersInit,
        passwordData: {
            current_password: string;
            new_password: string;
        }
    ): Promise<{ message: string }> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/users/me/password`, {
            method: 'PUT',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
        });
    }
}