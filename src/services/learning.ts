import { API_ENDPOINTS } from "@/lib/api-config";
import { authService } from "@/lib/auth";

export interface UserProgress {
    id: string;
    user_id: string;
    certification_id: number;
    current_question: number;
    total_questions: number;
    correct_answers: number;
    points: number;
    is_completed: boolean;
    last_active_at: string;
    updated_at: string;
    certification: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        level?: string;
        duration?: number;
        questions_count?: number;
        is_active: boolean;
        category_id: number;
        category?: {
            id: number;
            name: string;
            description?: string;
            slug: string;
            icon?: string;
            color?: string;
        };
    };
}

export interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description?: string;
    score?: number;
    certification_name?: string;
    certification_id?: number;
    points?: number;
    created_at: string;
}

export interface UserActivity {
    activities: ActivityItem[];
    total_count: number;
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    certification_id: number;
    score: number;
    total_questions: number;
    correct_answers: number;
    points: number;
    completed_at: string;
}

export interface LearningStats {
    totalCertifications: number;
    completedCertifications: number;
    inProgressCertifications: number;
    averageScore: number;
    totalPoints: number;
    categoriesProgress: CategoryProgress[];
}

export interface CategoryProgress {
    category: {
        id: number;
        name: string;
        slug: string;
        icon?: string;
        color?: string;
    };
    totalCertifications: number;
    completedCertifications: number;
    inProgressCertifications: number;
    bestScore: number;
    averageScore: number;
    totalPoints: number;
    progress: number;
}

class LearningService {
    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        // Get auth headers from auth service
        const authHeaders = authService.getAuthHeaders();
        
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async getUserProgress(): Promise<UserProgress[]> {
        return this.fetchWithAuth(API_ENDPOINTS.progress);
    }

    async getUserActivity(limit: number = 10): Promise<UserActivity> {
        return this.fetchWithAuth(`${API_ENDPOINTS.users.activity}?limit=${limit}`);
    }

    async getRecentQuizAttempts(): Promise<QuizAttempt[]> {
        return this.fetchWithAuth(`${API_ENDPOINTS.quizAttempts}/recent`);
    }

    async getLearningStats(): Promise<LearningStats> {
        try {
            // Get user progress data
            const progressData = await this.getUserProgress();
            
            // Calculate stats from progress data
            const stats = this.calculateStatsFromProgress(progressData);
            
            return stats;
        } catch (error) {
            console.error('Error fetching learning stats:', error);
            throw error;
        }
    }

    private calculateStatsFromProgress(progressData: UserProgress[]): LearningStats {
        const totalCertifications = progressData.length;
        const completedCertifications = progressData.filter(p => p.is_completed).length;
        const inProgressCertifications = progressData.filter(p => !p.is_completed && p.current_question > 0).length;
        
        // Calculate average score from completed certifications
        const completedProgress = progressData.filter(p => p.is_completed);
        const averageScore = completedProgress.length > 0 
            ? Math.round(completedProgress.reduce((sum, p) => {
                const score = p.total_questions > 0 ? (p.correct_answers / p.total_questions) * 100 : 0;
                return sum + score;
            }, 0) / completedProgress.length)
            : 0;

        // Calculate total points
        const totalPoints = progressData.reduce((sum, p) => sum + (p.points || 0), 0);

        // Group by categories
        const categoryMap = new Map<number, {
            category: NonNullable<UserProgress['certification']['category']>;
            certifications: UserProgress[];
        }>();

        progressData.forEach(progress => {
            if (progress.certification.category) {
                const categoryId = progress.certification.category.id;
                if (!categoryMap.has(categoryId)) {
                    categoryMap.set(categoryId, {
                        category: progress.certification.category,
                        certifications: []
                    });
                }
                categoryMap.get(categoryId)!.certifications.push(progress);
            }
        });

        // Calculate category progress
        const categoriesProgress: CategoryProgress[] = Array.from(categoryMap.values()).map(({ category, certifications }) => {
            const totalCerts = certifications.length;
            const completedCerts = certifications.filter(c => c.is_completed).length;
            const inProgressCerts = certifications.filter(c => !c.is_completed && c.current_question > 0).length;
            
            const completedCertifications = certifications.filter(c => c.is_completed);
            const scores = completedCertifications.map(c => 
                c.total_questions > 0 ? (c.correct_answers / c.total_questions) * 100 : 0
            );
            
            const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
            const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0;
            const totalPoints = certifications.reduce((sum, c) => sum + (c.points || 0), 0);
            const progress = totalCerts > 0 ? Math.round((completedCerts / totalCerts) * 100) : 0;

            return {
                category,
                totalCertifications: totalCerts,
                completedCertifications: completedCerts,
                inProgressCertifications: inProgressCerts,
                bestScore: Math.round(bestScore),
                averageScore,
                totalPoints,
                progress
            };
        });

        return {
            totalCertifications,
            completedCertifications,
            inProgressCertifications,
            averageScore,
            totalPoints,
            categoriesProgress
        };
    }
}

export const learningService = new LearningService();