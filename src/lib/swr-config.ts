import { SWRConfiguration } from 'swr'
import { safeLocalStorage } from './safe-storage'

// Extended Error type with status code
interface HTTPError extends Error {
  status: number
}

// Default fetcher function that uses the auth service
const fetcher = async (url: string) => {
  // Get auth headers from localStorage or auth service using safe access
  const token = safeLocalStorage.getItem('auth_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })
  
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as HTTPError
    // Attach status code for better error handling
    error.status = response.status
    throw error
  }
  
  return response.json()
}

// Authenticated fetcher that requires auth headers
export const authenticatedFetcher = (url: string, authHeaders: HeadersInit) => {
  return fetch(url, { 
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders
    }
  }).then(res => {
    if (!res.ok) {
      const error = new Error(`HTTP ${res.status}: ${res.statusText}`) as HTTPError
      error.status = res.status
      throw error
    }
    return res.json()
  })
}

// Default SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
}

export { fetcher }