import { API_ENDPOINTS } from "@/lib/api-config";

export interface HomePageData {
    featuredCertifications: FeaturedCertification[];
    popularCategories: PopularCategory[];
    stats: HomeStats;
}

export interface FeaturedCertification {
    id: number;
    name: string;
    slug: string;
    description: string;
    level: string;
    duration: number;
    questions_count: number;
    category_name: string;
    icon: string;
    vendor: string;
}

export interface PopularCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    certifications_count: number;
}

export interface HomeStats {
    total_certifications: number;
    total_categories: number;
    total_users: number;
}

export class HomeService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getHomePageData(): Promise<HomePageData> {
        try {
            const [featuredCertifications, popularCategories, stats] = await Promise.all([
                this.getFeaturedCertifications(),
                this.getPopularCategories(),
                this.getHomeStats()
            ]);

            return {
                featuredCertifications,
                popularCategories,
                stats
            };
        } catch (error) {
            console.error("Error loading home page data:", error);
            throw error;
        }
    }

    static async getFeaturedCertifications(limit = 8): Promise<FeaturedCertification[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/certifications/featured?limit=${limit}`);
    }

    static async getPopularCategories(limit = 6): Promise<PopularCategory[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/categories/popular?limit=${limit}`);
    }

    static async getHomeStats(): Promise<HomeStats> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/stats/public`);
    }

    static async searchCertifications(query: string) {
        return this.makeRequest(`${API_ENDPOINTS.searchCertifications}?q=${encodeURIComponent(query)}`);
    }

    static async getAllCertifications(page = 1, perPage = 20) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/certifications?page=${page}&per_page=${perPage}`);
    }
}