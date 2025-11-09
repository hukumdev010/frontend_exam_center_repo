import useSWR from 'swr'
import { useSession } from '@/lib/useAuth'
import { API_ENDPOINTS } from '@/lib/api-config'

interface UserQualifications {
    is_eligible_to_apply: boolean;
    is_eligible_to_teach: boolean;
    qualifications_count: number;
    qualified_subjects: number;
    has_teacher_profile: boolean;
    teacher_status?: string;
    profile_created_at?: string;
    approved_at?: string;
    qualifications_by_subject: Record<string, TeacherQualification[]>;
    next_steps: string;
    // Legacy compatibility
    is_eligible?: boolean;
}

interface TeacherQualification {
    id: number;
    certification_name: string;
    certification_slug: string;
    category_name: string;
    score: number;
    qualified_at: string;
}

// Custom fetcher for teacher eligibility that uses auth headers
const teacherEligibilityFetcher = async (url: string, authHeaders: HeadersInit): Promise<UserQualifications> => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders
        }
    })
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
}

export function useTeacherEligibility() {
    const { data: session, getAuthHeaders } = useSession()
    
    // Only fetch if user is authenticated and create a stable key
    const shouldFetch = !!session?.user?.id
    const userId = session?.user?.id
    
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `${API_ENDPOINTS.base}/api/teachers/me/eligibility?user=${userId}` : null,
        (url: string) => teacherEligibilityFetcher(url, getAuthHeaders()),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // Cache for 30 seconds
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            // Fallback data in case of error
            fallbackData: {
                is_eligible_to_apply: false,
                is_eligible_to_teach: false,
                qualifications_count: 0,
                qualified_subjects: 0,
                has_teacher_profile: false,
                qualifications_by_subject: {},
                next_steps: "",
                is_eligible: false // Legacy compatibility
            }
        }
    )

    return {
        qualifications: data as UserQualifications | null,
        isLoading,
        isError: error,
        mutate, // For manual revalidation
        refetch: () => mutate() // Alias for mutate
    }
}

export type { UserQualifications, TeacherQualification }