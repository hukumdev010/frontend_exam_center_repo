import { API_ENDPOINTS } from "@/lib/api-config";

export interface UserProgress {
    id: number;
    certification_id: number;
    certification_name: string;
    category_name: string;
    score: number;
    attempts: number;
    last_attempted: string;
    passed: boolean;
}

export interface SessionBooking {
    id: number;
    session_id: number;
    booking_date: string;
    status: string;
    notes: string;
    feedback_rating: number;
    feedback_comment: string;
    session: {
        title: string;
        description: string;
        scheduled_for: string;
        duration_hours: number;
        session_fee: number;
        location_type: string;
        teacher_name: string;
    };
}

export interface AvailableSession {
    id: number;
    title: string;
    description: string;
    scheduled_for: string;
    duration_hours: number;
    session_fee: number;
    location_type: string;
    location_details: string;
    max_participants: number;
    bookings_count: number;
    teacher_name: string;
    category_name: string;
}

export class StudentService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getProgress(authHeaders: HeadersInit): Promise<UserProgress[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/progress`, {
            headers: authHeaders,
        });
    }

    static async getMyBookings(authHeaders: HeadersInit): Promise<SessionBooking[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions/my/bookings`, {
            headers: authHeaders,
        });
    }

    static async getAvailableSessions(authHeaders: HeadersInit, limit = 6): Promise<AvailableSession[]> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/sessions/available?limit=${limit}`, {
            headers: authHeaders,
        });
    }

    static async getAllStudentData(authHeaders: HeadersInit) {
        try {
            const [progress, bookings, availableSessions] = await Promise.all([
                this.getProgress(authHeaders),
                this.getMyBookings(authHeaders),
                this.getAvailableSessions(authHeaders)
            ]);

            return { progress, bookings, availableSessions };
        } catch (error) {
            console.error("Error loading student data:", error);
            throw error;
        }
    }
}