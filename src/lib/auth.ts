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
    isLoading: true // Start with true to avoid hydration mismatch
  }

  private listeners: ((state: AuthState) => void)[] = []
  private initialized = false

  // Helper method to safely access localStorage
  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  private setStorageItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Ignore localStorage errors
    }
  }

  private removeStorageItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore localStorage errors
    }
  }

  constructor() {
    // Initialize with loading state for SSR compatibility
    // On client side, try to get initial state from localStorage
    const token = this.getStorageItem('auth_token')
    const userData = this.getStorageItem('user_data')
    
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
    const token = this.getStorageItem('auth_token')
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
          // Store updated user data
          this.setStorageItem('user_data', JSON.stringify(userData))
          this.notifyListeners()
          return
        } else {
          // Token is invalid, clear storage
          this.removeStorageItem('auth_token')
          this.removeStorageItem('user_data')
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        // Clear storage on error
        this.removeStorageItem('auth_token')
        this.removeStorageItem('user_data')
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

  // Update auth state (called by callback page)
  updateAuthState(authenticated: boolean, user: User | null = null) {
    this.state = {
      user: user,
      isAuthenticated: authenticated,
      isLoading: false
    }
    this.notifyListeners()
    
    if (authenticated && user) {
      this.setStorageItem('user_data', JSON.stringify(user))
    } else {
      this.removeStorageItem('auth_token')
      this.removeStorageItem('user_data')
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
      const token = this.getStorageItem('auth_token')
      
      // Clear local storage
      this.removeStorageItem('auth_token')
      this.removeStorageItem('user_data')
      
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
