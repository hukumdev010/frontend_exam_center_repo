import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

// Create client with region from environment (will be validated by env config)
function createSecretsClient() {
  return new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-east-1",
  })
}

// Cache for secrets to avoid repeated AWS calls
const secretCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getSecret(secretName: string): Promise<string> {
  const cached = secretCache.get(secretName)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.value
  }
  
  try {
    const secretsClient = createSecretsClient()
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    })
    
    const response = await secretsClient.send(command)
    
    let value: string
    if (response.SecretString) {
      value = response.SecretString
    } else if (response.SecretBinary) {
      value = Buffer.from(response.SecretBinary).toString('ascii')
    } else {
      throw new Error(`No secret value found for ${secretName}`)
    }
    
    secretCache.set(secretName, { value, timestamp: now })
    return value
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error)
    throw error
  }
}

export async function getSecretJson(secretName: string): Promise<Record<string, unknown>> {
  try {
    const secretString = await getSecret(secretName)
    return JSON.parse(secretString)
  } catch (error) {
    console.error(`Error parsing secret JSON for ${secretName}:`, error)
    throw error
  }
}
