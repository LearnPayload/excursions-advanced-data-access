import { getPayload, Payload } from 'payload'
import config from '@payload-config'

let cached = global.payload

if (!cached) {
  cached = global.payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

declare global {
  var payload: {
    client: Payload | null
    promise: Promise<Payload> | null
  }
}
