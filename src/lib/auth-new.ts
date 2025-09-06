import { API_ENDPOINTS } from './api-config'

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
    isLoading: true
  }

  private listeners: ((state: AuthState) => void)[] = []

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    // Check for existing token
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        // Validate token with backend using /me endpoint
        const response = await fetch(`${API_ENDPOINTS.auth.me}?token=${token}`)
        
        if (response.ok) {
          const userData = await response.json()
          this.state = {
            user: userData,
            isAuthenticated: true,
            isLoading: false
          }
          this.notifyListeners()
          return
        }
      } catch (error) {
        console.error('Token validation failed:', error)
      }
    }

    this.state.isLoading = false
    this.notifyListeners()
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

  // Update auth state (called by callback page)
  updateAuthState(authenticated: boolean, user: User | null = null) {
    this.state = {
      user: user,
      isAuthenticated: authenticated,
      isLoading: false
    }
    this.notifyListeners()
    
    if (!authenticated) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
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

  async signOut() {
    try {
      // Get token for logout endpoint
      const token = localStorage.getItem('auth_token')
      
      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
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
          await fetch(`${API_ENDPOINTS.auth.logout}?token=${token}`, {
            method: 'POST'
          })
        } catch (error) {
          console.warn('Logout endpoint failed:', error)
        }
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }
}

export const authService = new AuthService()
