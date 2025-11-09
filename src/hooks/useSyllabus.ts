import useSWR from 'swr'
import { useSession } from '@/lib/useAuth'
import { authenticatedFetcher } from '@/lib/swr-config'
import { API_ENDPOINTS } from '@/lib/api-config'
import { SyllabusResponse } from '@/types/syllabus'

export function useSyllabus(certificationSlug: string | null) {
  const { getAuthHeaders, data } = useSession()
  const isAuthenticated = !!data?.user

  return useSWR<SyllabusResponse>(
    // Fetch if slug is provided (syllabus is now publicly accessible)
    certificationSlug 
      ? API_ENDPOINTS.certification.syllabus(certificationSlug)
      : null,
    (url: string) => {
      // Try authenticated fetch first, fall back to public fetch
      if (isAuthenticated) {
        return authenticatedFetcher(url, getAuthHeaders())
      } else {
        // Public fetch without authentication
        return fetch(url).then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes deduplication for syllabus data
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      // Cache for 10 minutes since syllabus data doesn't change frequently
      focusThrottleInterval: 600000,
    }
  )
}