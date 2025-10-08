// API configuration for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  categories: `${API_BASE_URL}/api/categories`,
  categoriesWithCertifications: `${API_BASE_URL}/api/categories/with-certifications`,
  categoryCertifications: (slug: string) => `${API_BASE_URL}/api/categories/${slug}/certifications`,
  certifications: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}`,
  searchCertifications: `${API_BASE_URL}/api/certifications/search`,
  progress: `${API_BASE_URL}/api/progress`,
  quizAttempts: `${API_BASE_URL}/api/quiz-attempts`,
  teachers: {
    me: `${API_BASE_URL}/api/teachers/me`,
    list: `${API_BASE_URL}/api/teachers`,
    search: `${API_BASE_URL}/api/teachers`,
  },
  users: {
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
  },
  ai: {
    chat: `${API_BASE_URL}/api/ai/chat`,
    health: `${API_BASE_URL}/api/ai/health`,
    generatePrompt: `${API_BASE_URL}/api/ai/generate-study-prompt`
  },
  certificates: {
    list: `${API_BASE_URL}/api/certificates`,
    download: (certificateId: string) => `${API_BASE_URL}/api/certificates/${certificateId}/download`,
    generate: `${API_BASE_URL}/api/certificates/generate`
  }
}

export default API_BASE_URL
