import { API_ENDPOINTS } from './api-config'
import CookieManager from './cookie-manager'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Client-side auth state management
class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true // Start with true to avoid hydration mismatch
  }

  private listeners: ((state: AuthState) => void)[] = []
  private initialized = false

  // Helper method to safely access cookies
  private getCookie(key: string): string | null {
    return CookieManager.getCookie(key)
  }

  private setCookie(key: string, value: string): void {
    CookieManager.setCookie(key, value, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      sameSite: 'Lax',
      path: '/'
    })
  }

  private deleteCookie(key: string): void {
    CookieManager.deleteCookie(key)
  }

  constructor() {
    // Initialize with loading state for SSR compatibility
    // On client side, try to get initial state from cookies
    const token = this.getCookie('auth_token')
    const userData = this.getCookie('user_data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.state = {
          user,
          isAuthenticated: true,
          isLoading: true // Still loading to verify token
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }

  private async initializeAuth() {
    // Check for existing token (only available on client side)
    const token = this.getCookie('auth_token')
    if (token) {
      try {
        // Validate token with backend using /me endpoint
        const response = await fetch(API_ENDPOINTS.auth.me, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          this.state = {
            user: userData,
            isAuthenticated: true,
            isLoading: false
          }
          // Store updated user data
          this.setCookie('user_data', JSON.stringify(userData))
          this.notifyListeners()
          return
        } else {
          // Token is invalid, clear cookies
          this.deleteCookie('auth_token')
          this.deleteCookie('user_data')
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        // Clear cookies on error
        this.deleteCookie('auth_token')
        this.deleteCookie('user_data')
      }
    }

    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.notifyListeners()
  }

  // Public method to ensure initialization on client side
  ensureInitialized() {
    if (!this.initialized) {
      this.initialized = true
      // Don't change loading state here since it's already true
      this.initializeAuth()
    }
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  getState(): AuthState {
    return this.state
  }

  // Token access methods for API calls
  getToken(): string | null {
    return this.getCookie('auth_token')
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  async apiCall(url: string, options: RequestInit = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  // Update auth state (called by callback page)
  updateAuthState(authenticated: boolean, user: User | null = null) {
    this.state = {
      user: user,
      isAuthenticated: authenticated,
      isLoading: false
    }
    this.notifyListeners()
    
    if (authenticated && user) {
      this.setCookie('user_data', JSON.stringify(user))
    } else {
      this.deleteCookie('auth_token')
      this.deleteCookie('user_data')
    }
  }

  async signInWithGoogle() {
    try {
      // Get Google OAuth URL from backend
      const response = await fetch(API_ENDPOINTS.auth.google)
      const data = await response.json()
      
      if (data.auth_url) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url
      }
    } catch (error) {
      console.error('Failed to initiate Google sign-in:', error)
      throw error
    }
  }

  async login(user: User, token: string) {
    // Store authentication data in cookies
    this.setCookie('auth_token', token)
    this.setCookie('user_data', JSON.stringify(user))
    
    // Update state
    this.state = {
      user,
      isAuthenticated: true,
      isLoading: false
    }
    
    this.notifyListeners()
  }

  async signOut() {
    try {
      // Get token for logout endpoint
      const token = this.getCookie('auth_token')
      
      // Clear cookies
      this.deleteCookie('auth_token')
      this.deleteCookie('user_data')
      
      // Update state
      this.state = {
        user: null,
        isAuthenticated: false,
        isLoading: false
      }
      
      this.notifyListeners()
      
      // Call logout endpoint if we have a token
      if (token) {
        try {
          await fetch(API_ENDPOINTS.auth.logout, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        } catch (error) {
          console.warn('Logout endpoint failed:', error)
        }
      }
      
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }
}

export const authService = new AuthService()
