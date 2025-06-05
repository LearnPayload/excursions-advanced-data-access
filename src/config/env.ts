// Environment variable mapping and validation
export const env = {
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || '',
  DATABASE_URI: process.env.DATABASE_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

// Validate required environment variables
if (!env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}