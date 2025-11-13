import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useSession } from '@/lib/useAuth'
import { API_ENDPOINTS } from '@/lib/api-config'
import { authenticatedFetcher } from '@/lib/swr-config'

// Types
interface CertificationInfo {
  id: number;
  name: string;
  slug: string;
  description: string;
  level: string;
  duration: number;
  questions_count: number;
  benefits: string;
  advantages: string;
  career_benefits: string;
  teaching_eligibility: boolean;
  min_score_for_teaching: number;
  min_score_for_certificate: number;
  has_started: boolean;
  current_question: number;
  progress_percentage: number;
  user_score: number;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
}

interface QuizCertification {
  id: number;
  name: string;
  description: string;
  slug: string;
  level: string;
  duration: number;
  questions_count: number;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  explanation?: string;
  reference?: string;
  points: number;
  answers: Answer[];
  ai_assistant?: AIAssistant;
  question_hash?: string;
}

interface Answer {
  id: number;
  text: string;
  question_id: number;
  isCorrect: boolean;
}

interface AIAssistant {
  response: string;
  model_name: string;
  cache_hits: number;
  cached: boolean;
  created_at?: string;
}

interface UserProgressData {
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

interface LearningStats {
  totalCertifications: number;
  completedCertifications: number;
  inProgressCertifications: number;
  averageScore: number;
  totalPoints: number;
}

interface ActivityItem {
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

interface UserActivity {
  activities: ActivityItem[];
  total_count: number;
}

// Custom hook for authenticated requests
function useAuthenticatedSWR<T>(
  key: string | (() => string | null) | null,
  options?: Parameters<typeof useSWR<T>>[2]
) {
  const { getAuthHeaders, data } = useSession()
  const isAuthenticated = !!data?.user
  
  return useSWR<T>(
    // Only fetch if authenticated and key is provided
    isAuthenticated && key ? (typeof key === 'function' ? key() : key) : null,
    (url: string) => authenticatedFetcher(url, getAuthHeaders()),
    options
  )
}

// Dashboard hooks
export function useDashboardStats() {
  return useAuthenticatedSWR(API_ENDPOINTS.dashboard.stats)
}

export function useRecentCertifications(limit = 6) {
  return useSWR(`${API_ENDPOINTS.certification.recent}?limit=${limit}`)
}

export function usePopularCategories() {
  return useAuthenticatedSWR(API_ENDPOINTS.category.popular)
}

export function useUserActivity(limit = 10) {
  return useAuthenticatedSWR<UserActivity>(`${API_ENDPOINTS.users.activity}?limit=${limit}`)
}

// Categories and certifications hooks
export function useCategories() {
  return useSWR(API_ENDPOINTS.category.list)
}

export function useCategoriesWithCertifications() {
  return useSWR(API_ENDPOINTS.category.withCertifications)
}

export function useCategoryCertifications(categorySlug: string, page = 1, perPage = 12) {
  return useSWR(
    categorySlug 
      ? `${API_ENDPOINTS.category.certifications(categorySlug)}?page=${page}&per_page=${perPage}`
      : null
  )
}

export function useCertification(slug: string) {
  return useSWR(slug ? API_ENDPOINTS.certification.bySlug(slug) : null)
}

export function useCertificationInfo(slug: string) {
  const { data } = useSession()
  
  return useSWR<CertificationInfo>(
    slug ? `${API_ENDPOINTS.certification.info(slug)}-${data?.user?.id || 'anonymous'}` : null,
    () => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      // Add auth headers if user is authenticated
      if (data?.access_token) {
        headers.Authorization = `Bearer ${data.access_token}`
      }

      return fetch(API_ENDPOINTS.certification.info(slug), { headers }).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
    },
    {
      // Revalidate more frequently for this critical data
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // Don't dedupe so we always get fresh data when needed
    }
  )
}

export function useCertificationQuizData(slug: string) {
  console.log('🔄 useCertificationQuizData hook called with slug:', slug);
  return useSWR<QuizCertification>(
    slug ? API_ENDPOINTS.certifications(slug) : null
  )
}

// User progress and bookings
export function useUserProgress() {
  return useAuthenticatedSWR(API_ENDPOINTS.progress)
}

export function useMyBookings() {
  return useAuthenticatedSWR(API_ENDPOINTS.sessions.myBookings)
}

export function useAvailableSessions(limit = 6) {
  return useAuthenticatedSWR(`${API_ENDPOINTS.sessions.available}?limit=${limit}`)
}

// Teacher hooks
export function useTeacherProfile() {
  return useAuthenticatedSWR(API_ENDPOINTS.teachers.me)
}

export function useTeacherEligibility() {
  return useAuthenticatedSWR(API_ENDPOINTS.teachers.eligibility)
}

export function useMyTeachingSessions() {
  return useAuthenticatedSWR(API_ENDPOINTS.sessions.myTeaching)
}

export function useTeachers(status?: string, isAvailable?: boolean, limit = 6, searchQuery?: string) {
  const params = new URLSearchParams()
  if (searchQuery) params.append('q', searchQuery)
  if (status) params.append('status', status)
  if (isAvailable !== undefined) params.append('is_available', String(isAvailable))
  if (limit) params.append('limit', String(limit))
  
  return useSWR(`${API_ENDPOINTS.teachers.list}/?${params.toString()}`)
}

export function useSearchCertifications(query?: string, limit = 20) {
  const params = new URLSearchParams()
  if (query) params.append('q', query)
  if (limit) params.append('limit', String(limit))
  
  return useSWR(
    query ? `${API_ENDPOINTS.certification.search}?${params.toString()}` : null
  )
}

// User management hooks (RBAC)
export function useRoles(page = 0, itemsPerPage = 10, search?: string) {
  const params = new URLSearchParams({
    skip: String(page * itemsPerPage),
    limit: String(itemsPerPage)
  })
  if (search) params.append('search', search)
  
  return useAuthenticatedSWR(`${API_ENDPOINTS.rbac.roles}?${params.toString()}`)
}

export function usePermissions(page = 0, itemsPerPage = 10, search?: string) {
  const params = new URLSearchParams({
    skip: String(page * itemsPerPage),
    limit: String(itemsPerPage)
  })
  if (search) params.append('search', search)
  
  return useAuthenticatedSWR(`${API_ENDPOINTS.rbac.permissions}?${params.toString()}`)
}

export function usePolicies(limit = 1000) {
  return useAuthenticatedSWR(`${API_ENDPOINTS.rbac.policies}?limit=${limit}`)
}

export function useAllPermissions(limit = 1000) {
  return useAuthenticatedSWR(`${API_ENDPOINTS.rbac.permissions}?limit=${limit}`)
}

// Profile hooks
export function useUserProfile() {
  return useAuthenticatedSWR(API_ENDPOINTS.auth.me)
}

export function useUserStats() {
  return useAuthenticatedSWR(API_ENDPOINTS.users.stats)
}

// AI Assistant hooks
export function useAIHealth() {
  const { getAuthHeaders, data } = useSession()
  const isAuthenticated = !!data?.user
  
  return useSWR(
    isAuthenticated ? API_ENDPOINTS.ai.health : null,
    (url: string) => authenticatedFetcher(url, getAuthHeaders())
  )
}

// Home page hooks
export function useFeaturedCertifications(limit = 8) {
  return useSWR(`${API_ENDPOINTS.certification.featured}?limit=${limit}`)
}

export function useHomeStats() {
  return useSWR(API_ENDPOINTS.home.stats)
}

// Types for mutations
interface CreateRoleData {
  name: string
  description?: string
  policy_ids?: number[]
  permission_ids?: number[]
  is_default?: boolean
}

interface UpdateRoleData {
  description?: string
  policy_ids?: number[]
  permission_ids?: number[]
  is_default?: boolean
}

// Mutation hooks for creating/updating data
export function useCreateRole() {
  const { getAuthHeaders } = useSession()
  
  return useSWRMutation(
    API_ENDPOINTS.rbac.roles,
    async (url: string, { arg }: { arg: CreateRoleData }) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(arg)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create role: ${response.statusText}`)
      }
      
      return response.json()
    }
  )
}

export function useUpdateRole() {
  const { getAuthHeaders } = useSession()
  
  return useSWRMutation(
    API_ENDPOINTS.rbac.roles,
    async (url: string, { arg }: { arg: { id: string; data: UpdateRoleData } }) => {
      const response = await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(arg.data)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`)
      }
      
      return response.json()
    }
  )
}

export function useDeleteRole() {
  const { getAuthHeaders } = useSession()
  
  return useSWRMutation(
    API_ENDPOINTS.rbac.roles,
    async (url: string, { arg }: { arg: string }) => {
      const response = await fetch(`${url}/${arg}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete role: ${response.statusText}`)
      }
      
      return response.json()
    }
  )
}

// Certificate hooks
export function useMyCertificates() {
  return useAuthenticatedSWR(API_ENDPOINTS.certificates.my)
}

export function useAllCertificates(page = 0, perPage = 20) {
  const params = new URLSearchParams({
    skip: String(page * perPage),
    limit: String(perPage)
  })
  
  return useAuthenticatedSWR(`${API_ENDPOINTS.certificates.list}?${params.toString()}`)
}

// Additional dashboard hooks
export function useUserQualifications() {
  return useAuthenticatedSWR(API_ENDPOINTS.users.qualifications)
}

// Certificate download mutation
export function useDownloadCertificate() {
  const { getAuthHeaders } = useSession()
  
  return useSWRMutation(
    '/api/certificates/download',
    async (_: string, { arg }: { arg: string }) => {
      const response = await fetch(API_ENDPOINTS.certificates.download(arg), {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`Failed to download certificate: ${response.statusText}`)
      }
      
      return response.blob()
    }
  )
}

// Learning page hooks
export function useLearningStats() {
  const { data: userProgress, isLoading: progressLoading, error: progressError } = useUserProgress()
  
  // Calculate stats from progress data when available
  if (progressLoading) {
    return { data: undefined, isLoading: true, error: null }
  }
  
  if (progressError) {
    return { data: undefined, isLoading: false, error: progressError }
  }

  if (!userProgress || !Array.isArray(userProgress)) {
    return { data: undefined, isLoading: false, error: null }
  }

  const calculateStats = (progressData: UserProgressData[]): LearningStats => {
    const totalCertifications = progressData.length;
    const completedCertifications = progressData.filter(p => p.is_completed).length;
    const inProgressCertifications = progressData.filter(p => !p.is_completed && p.current_question > 0).length;
    
    // Calculate average score from completed certifications
    const completedProgress = progressData.filter(p => p.is_completed);
    const averageScore = completedProgress.length > 0 
      ? Math.round(completedProgress.reduce((sum: number, p: UserProgressData) => {
          const score = p.total_questions > 0 ? (p.correct_answers / p.total_questions) * 100 : 0;
          return sum + score;
        }, 0) / completedProgress.length)
      : 0;

    // Calculate total points
    const totalPoints = progressData.reduce((sum: number, p: UserProgressData) => sum + (p.points || 0), 0);

    return {
      totalCertifications,
      completedCertifications,
      inProgressCertifications,
      averageScore,
      totalPoints
    };
  };

  const stats = calculateStats(userProgress as UserProgressData[]);
  
  return {
    data: stats,
    isLoading: false,
    error: null
  };
}

// Quiz start mutation hook
export function useStartQuiz() {
  const { getAuthHeaders } = useSession()
  
  return useSWRMutation(
    '/api/certifications/start',
    async (_: string, { arg }: { arg: string }) => {
      const response = await fetch(`${API_ENDPOINTS.base}/api/certifications/${arg}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to start quiz: ${response.statusText}`)
      }
      
      return response.json()
    }
  )
}