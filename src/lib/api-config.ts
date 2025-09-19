// API configuration for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  categories: `${API_BASE_URL}/api/categories`,
  categoryCertifications: (slug: string) => `${API_BASE_URL}/api/categories/${slug}/certifications`,
  certifications: (slug: string) => `${API_BASE_URL}/api/certifications/${slug}`,
  searchCertifications: `${API_BASE_URL}/api/certifications/search`,
  progress: `${API_BASE_URL}/api/progress`,
  quizAttempts: `${API_BASE_URL}/api/quiz-attempts`,
  teachers: {
    me: `${API_BASE_URL}/api/teachers/me`,
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
  }
}

export default API_BASE_URL
