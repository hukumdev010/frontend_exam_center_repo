import { getSecretJson } from './secrets'

// Cache for environment variables
const envCache = new Map<string, string>()

// Static secret name as defined in documentation
const SECRET_NAME = 'examCenterCredentials'

/**
 * Get required environment variable from AWS Secrets Manager with caching
 */
export async function getRequiredEnv(key: string): Promise<string> {
  // Check cache first
  if (envCache.has(key)) {
    return envCache.get(key)!
  }

  try {
    // Try to get from process.env first (for development)
    if (process.env[key]) {
      const value = process.env[key]!
      envCache.set(key, value)
      console.log(`Loaded ${key} from process.env`)
      return value
    }

    // Fall back to AWS Secrets Manager with static secret name
    console.log(`Falling back to AWS Secrets Manager for ${key}`)
    const secrets = await getSecretJson(SECRET_NAME)
    console.log("Printing the secrets", secrets)
    
    if (key in secrets && typeof secrets[key] === 'string') {
      const value = secrets[key] as string
      envCache.set(key, value)
      return value
    }

    throw new Error(`Required environment variable ${key} not found in secrets`)
  } catch (error) {
    console.error(`Error getting required env variable ${key}:`, error)
    throw error
  }
}

/**
 * Get optional environment variable with default value
 */
export async function getOptionalEnv(key: string, defaultValue: string): Promise<string> {
  try {
    return await getRequiredEnv(key)
  } catch {
    return defaultValue
  }
}

/**
 * Clear the environment cache (useful for testing or refreshing secrets)
 */
export function clearEnvCache(): void {
  envCache.clear()
}
