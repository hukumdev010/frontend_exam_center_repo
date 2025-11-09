// API configuration for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  
  // Legacy endpoints for backward compatibility
  categories: `${API_BASE_URL}/api/categories`,
  categoriesWithCertifications: `${API_BASE_URL}/api/categories/with-certifications`,
  categoryCertifications: (slug: string) => `${API_BASE_URL}/api/categories/${slug}/certifications`,
  certifications: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}`,
  searchCertifications: `${API_BASE_URL}/api/certifications/search`,
  progress: `${API_BASE_URL}/api/progress`,
  quizAttempts: `${API_BASE_URL}/api/quiz-attempts`,
  
  // Structured API endpoints
  dashboard: {
    stats: `${API_BASE_URL}/api/dashboard/stats`,
  },
  certification: {
    recent: `${API_BASE_URL}/api/certifications/recent`,
    featured: `${API_BASE_URL}/api/certifications/featured`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}`,
    info: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}/info`,
    syllabus: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}/syllabus`,
    search: `${API_BASE_URL}/api/certifications/search`,
  },
  category: {
    list: `${API_BASE_URL}/api/categories`,
    popular: `${API_BASE_URL}/api/categories/popular`,
    withCertifications: `${API_BASE_URL}/api/categories/with-certifications`,
    certifications: (slug: string) => `${API_BASE_URL}/api/categories/${slug}/certifications`,
  },
  teachers: {
    me: `${API_BASE_URL}/api/teachers/me`,
    eligibility: `${API_BASE_URL}/api/teachers/me/eligibility`,
    list: `${API_BASE_URL}/api/teachers`,
    search: `${API_BASE_URL}/api/teachers`,
  },
  users: {
    me: `${API_BASE_URL}/api/users/me`,
    activity: `${API_BASE_URL}/api/users/me/activity`,
    stats: `${API_BASE_URL}/api/users/me/stats`,
    qualifications: `${API_BASE_URL}/api/users/qualifications`,
    list: `${API_BASE_URL}/api/admin/rbac/users`,
    create: `${API_BASE_URL}/api/admin/rbac/users`,
    update: (id: string) => `${API_BASE_URL}/api/admin/rbac/users/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/admin/rbac/users/${id}`,
    assignRole: `${API_BASE_URL}/api/admin/rbac/users/assign-roles`,
    removeRole: (userId: string, roleId: number) => `${API_BASE_URL}/api/admin/rbac/users/${userId}/roles/${roleId}`,
    getUserRoles: (userId: string) => `${API_BASE_URL}/api/admin/rbac/users/${userId}/roles`,
  },
  rbac: {
    users: `${API_BASE_URL}/api/admin/rbac/users`,
    roles: `${API_BASE_URL}/api/admin/rbac/roles`,
    permissions: `${API_BASE_URL}/api/admin/rbac/permissions`,
    policies: `${API_BASE_URL}/api/admin/rbac/policies`,
  },
  sessions: {
    myTeaching: `${API_BASE_URL}/api/sessions/my/teaching`,
    myBookings: `${API_BASE_URL}/api/sessions/my/bookings`,
    available: `${API_BASE_URL}/api/sessions/available`,
  },
  auth: {
    google: `${API_BASE_URL}/api/auth/google`,
    me: `${API_BASE_URL}/api/auth/me`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  ai: {
    chat: `${API_BASE_URL}/api/ai/chat`,
    health: `${API_BASE_URL}/api/ai/health`,
    generatePrompt: `${API_BASE_URL}/api/ai/generate-study-prompt`
  },
  certificates: {
    list: `${API_BASE_URL}/api/certificates`,
    my: `${API_BASE_URL}/api/certificates/my`,
    download: (certificateId: string) => `${API_BASE_URL}/api/certificates/${certificateId}/download`,
    generate: `${API_BASE_URL}/api/certificates/generate`
  },
  home: {
    stats: `${API_BASE_URL}/api/home/stats`,
  }
}

export default API_BASE_URL
