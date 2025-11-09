import { API_ENDPOINTS } from "@/lib/api-config";

export interface TeacherProfile {
    id: number;
    user_id: number;
    bio?: string;
    specializations?: string[];
    experience_years?: number;
    education?: string;
    certifications?: string[];
    hourly_rate?: number;
    availability?: string;
    timezone?: string;
    languages?: string[];
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    // User information
    user?: {
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
    };
}

export interface TeachingSession {
    id: number;
    teacher_id: number;
    student_id: number;
    title: string;
    description?: string;
    scheduled_date: string;
    duration_minutes: number;
    status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
    meeting_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    // Related information
    student?: {
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
    };
}

export interface TeacherStats {
    total_sessions: number;
    completed_sessions: number;
    upcoming_sessions: number;
    total_students: number;
    average_rating?: number;
    total_earnings?: number;
}

export class TeacherService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getTeacherProfile(authHeaders: HeadersInit): Promise<TeacherProfile> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me`, {
            headers: authHeaders,
        });
    }

    static async updateTeacherProfile(profileData: Partial<TeacherProfile>, authHeaders: HeadersInit): Promise<TeacherProfile> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(profileData),
        });
    }

    static async getMyTeachingSessions(authHeaders: HeadersInit): Promise<TeachingSession[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me/sessions`, {
            headers: authHeaders,
        });
    }

    static async getTeacherStats(authHeaders: HeadersInit): Promise<TeacherStats> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me/stats`, {
            headers: authHeaders,
        });
    }

    static async createTeachingSession(sessionData: Partial<TeachingSession>, authHeaders: HeadersInit): Promise<TeachingSession> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(sessionData),
        });
    }

    static async updateTeachingSession(sessionId: number, sessionData: Partial<TeachingSession>, authHeaders: HeadersInit): Promise<TeachingSession> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/teachers/me/sessions/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(sessionData),
        });
    }
}