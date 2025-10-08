import { API_ENDPOINTS } from "@/lib/api-config";

export interface TeacherQualification {
    id: number;
    certification_name: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

export interface TeacherProfile {
    id: number;
    user_id: string;
    bio: string;
    status: string;
    is_available: boolean;
    hourly_rate: number;
    qualifications: TeacherQualification[];
}

export interface TeachingSession {
    id: number;
    title: string;
    description: string;
    session_type: string;
    scheduled_for: string;
    duration_hours: number;
    max_participants: number;
    session_fee: number;
    location_type: string;
    location_details: string;
    status: string;
    bookings_count: number;
}

export class TeacherService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getMyProfile(authHeaders: HeadersInit): Promise<TeacherProfile> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me`, {
            headers: authHeaders,
        });
    }

    static async checkEligibility(authHeaders: HeadersInit) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me/eligibility`, {
            headers: authHeaders,
        });
    }

    static async getMyTeachingSessions(authHeaders: HeadersInit): Promise<TeachingSession[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions/my/teaching`, {
            headers: authHeaders,
        });
    }

    static async getAllTeacherData(authHeaders: HeadersInit) {
        try {
            const [profile, sessions] = await Promise.all([
                this.getMyProfile(authHeaders),
                this.getMyTeachingSessions(authHeaders)
            ]);

            return { profile, sessions };
        } catch (error) {
            console.error("Error loading teacher data:", error);
            throw error;
        }
    }

    static async createSession(authHeaders: HeadersInit, sessionData: Partial<TeachingSession>) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions`, {
            method: 'POST',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
    }

    static async updateSession(authHeaders: HeadersInit, sessionId: number, sessionData: Partial<TeachingSession>) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions/${sessionId}`, {
            method: 'PUT',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
    }

    static async deleteSession(authHeaders: HeadersInit, sessionId: number) {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: authHeaders,
        });
    }
}