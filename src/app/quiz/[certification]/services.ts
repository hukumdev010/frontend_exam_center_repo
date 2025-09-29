import { API_ENDPOINTS } from "@/lib/api-config";
import { Question } from "@/types/quiz";

export interface Certification {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    questions: Question[];
}

export interface QuizAttempt {
    id: number;
    user_id: string;
    certification_id: number;
    started_at: string;
    completed_at?: string;
    score: number;
    max_score: number;
    passed: boolean;
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    id: number;
    question_id: number;
    selected_answer: string;
    is_correct: boolean;
    points_awarded: number;
}

export class QuizService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getCertificationData(certificationSlug: string): Promise<Certification> {
        return this.makeRequest(API_ENDPOINTS.certifications(certificationSlug));
    }

    static async submitQuizAttempt(
        authHeaders: HeadersInit,
        attemptData: {
            certification_id: number;
            answers: Array<{
                question_id: number;
                selected_answer: string;
            }>;
        }
    ): Promise<QuizAttempt> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/quiz-attempts`, {
            method: 'POST',
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attemptData),
        });
    }

    static async getQuizAttempts(authHeaders: HeadersInit, certificationId?: number): Promise<QuizAttempt[]> {
        const url = certificationId 
            ? `${API_ENDPOINTS.base}/api/quiz-attempts?certification_id=${certificationId}`
            : `${API_ENDPOINTS.base}/api/quiz-attempts`;
            
        return this.makeRequest(url, {
            headers: authHeaders,
        });
    }

    static async getQuizAttempt(authHeaders: HeadersInit, attemptId: number): Promise<QuizAttempt> {
        return this.makeRequest(`${API_ENDPOINTS.base}/api/quiz-attempts/${attemptId}`, {
            headers: authHeaders,
        });
    }
}