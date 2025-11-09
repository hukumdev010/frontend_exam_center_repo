import { SyllabusResponse } from "@/types/syllabus";
import { API_ENDPOINTS } from "@/lib/api-config";

export class SyllabusService {
    private static async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async getSyllabus(authHeaders: HeadersInit, certificationSlug: string): Promise<SyllabusResponse> {
        return this.makeRequest(API_ENDPOINTS.certification.syllabus(certificationSlug), {
            headers: authHeaders,
        });
    }
}