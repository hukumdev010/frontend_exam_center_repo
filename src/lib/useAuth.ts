import { useState, useEffect } from 'react'
import { authService, AuthState } from './auth'

export function useAuth() {
  // Initialize with loading state to avoid hydration mismatch
  const [authState, setAuthState] = useState<AuthState>(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: true
  }))

  useEffect(() => {
    // Get current state from service
    setAuthState(authService.getState())
    
    // Ensure auth service is initialized
    authService.ensureInitialized()
    
    // Subscribe to state changes
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    signIn: () => authService.signInWithGoogle(),
    signOut: () => authService.signOut()
  }
}

// For backward compatibility with existing code
export function useSession() {
  const auth = useAuth()
  
  return {
    data: auth.isAuthenticated ? { user: auth.user } : null,
    status: auth.isLoading ? 'loading' : auth.isAuthenticated ? 'authenticated' : 'unauthenticated'
  }
}
