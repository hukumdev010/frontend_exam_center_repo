import { useState, useEffect } from 'react'
import { authService, AuthState, User } from './auth'

export function useAuth() {
  console.log('🔄 useAuth hook called');
  // Initialize with loading state to avoid hydration mismatch
  const [authState, setAuthState] = useState<AuthState>(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: true
  }))

  useEffect(() => {
    // Use a timeout to avoid setState during render
    const timer = setTimeout(() => {
      // Get current state from service
      setAuthState(authService.getState())
    }, 0)
    
    // Ensure auth service is initialized
    authService.ensureInitialized()
    
    // Subscribe to state changes
    const unsubscribe = authService.subscribe(setAuthState)
    
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login: (user: User, token: string) => authService.login(user, token),
    signIn: () => authService.signInWithGoogle(),
    signOut: () => authService.signOut(),
    getToken: () => authService.getToken(),
    getAuthHeaders: () => authService.getAuthHeaders(),
    apiCall: (url: string, options?: RequestInit) => authService.apiCall(url, options)
  }
}

// For backward compatibility with existing code
export function useSession() {
  console.log('🔄 useSession hook called');
  const auth = useAuth()
  
  return {
    data: auth.isAuthenticated ? { 
      user: auth.user,
      access_token: auth.getToken() // Add access_token for compatibility
    } : null,
    status: auth.isLoading ? 'loading' : auth.isAuthenticated ? 'authenticated' : 'unauthenticated',
    // Expose auth methods
    getToken: auth.getToken,
    getAuthHeaders: auth.getAuthHeaders,
    apiCall: auth.apiCall
  }
}
