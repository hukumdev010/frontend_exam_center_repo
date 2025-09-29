import { API_ENDPOINTS } from "@/lib/api-config";

export interface DashboardStats {
    total_users: number;
    total_certifications: number;
    total_categories: number;
    recent_activity: ActivityItem[];
}

export interface ActivityItem {
    score: number;
    certification_name: string;
    created_at: string;
}

export interface RecentCertifications {
    id: number;
    name: string;
    slug: string;
    level: string;
    category_name: string;
    attempts_count: number;
}

export class DashboardService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getDashboardStats(authHeaders?: HeadersInit): Promise<DashboardStats> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/dashboard/stats`, {
            headers: authHeaders,
        });
    }

    static async getRecentCertifications(limit = 6): Promise<RecentCertifications[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/certifications/recent?limit=${limit}`);
    }

    static async getPopularCategories(authHeaders?: HeadersInit) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/categories/popular`, {
            headers: authHeaders,
        });
    }

    static async getUserActivity(authHeaders: HeadersInit, limit = 10): Promise<ActivityItem[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/users/me/activity?limit=${limit}`, {
            headers: authHeaders,
        });
    }

    static async searchCertifications(query: string, limit = 10) {
        return this.makeRequest(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}&limit=${limit}`);
    }
}