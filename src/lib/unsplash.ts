/**
 * Unsplash API wrapper
 * Understøtter tre modes: dummy, live (public key), oauth
 */

import { createApi } from 'unsplash-js'
import type { ApiResponse } from 'unsplash-js/dist/helpers/response'
import type { Basic } from 'unsplash-js/dist/methods/photos/types'
import { getAccessToken } from '../auth/unsplashAuth'

export interface UnsplashPhoto {
  id: string
  urls: {
    thumb: string
    small: string
    regular: string
  }
  alt_description: string | null
}

export interface SearchResult {
  results: UnsplashPhoto[]
  total: number
}

/**
 * Mock data til dummy mode
 */
const MOCK_URLS = [
  'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?q=80&w=700',
  'https://plus.unsplash.com/premium_photo-1713793236612-50c9bfedbe07?q=80&w=700',
  'https://images.unsplash.com/photo-1678033382919-fa907632fdda?q=80&w=700',
  'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?q=80&w=700',
  'https://plus.unsplash.com/premium_photo-1683121324502-94bd9fa0202e?q=80&w=700',
]

/**
 * Genererer mock resultater
 */
function generateMockResults(query: string): SearchResult {
  const results: UnsplashPhoto[] = []

  // Generér 20 mock billeder baseret på de 5 URLs
  for (let i = 0; i < 20; i++) {
    const baseUrl = MOCK_URLS[i % MOCK_URLS.length]
    results.push({
      id: `mock-${i}`,
      urls: {
        thumb: baseUrl,
        small: baseUrl,
        regular: baseUrl.replace('w=700', 'w=1080'),
      },
      alt_description: `Mock ${query} photo ${i + 1}`,
    })
  }

  return {
    results,
    total: 20,
  }
}

/**
 * Unsplash API client (singleton)
 */
let apiClient: ReturnType<typeof createApi> | null = null

/**
 * Initialiserer Unsplash API client
 */
function getApiClient() {
  if (apiClient) {
    return apiClient
  }

  const isDummyMode = import.meta.env.VITE_APP_DUMMY_MODE === 'true'

  if (isDummyMode) {
    // Dummy mode - ingen rigtig API
    return null
  }

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  const oauthToken = getAccessToken()

  if (oauthToken) {
    // OAuth mode
    apiClient = createApi({
      accessKey: oauthToken,
    })
  } else if (accessKey) {
    // Public key mode
    apiClient = createApi({
      accessKey,
    })
  } else {
    throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY - check your .env file')
  }

  return apiClient
}

/**
 * Søger efter billeder på Unsplash
 */
export async function searchPhotos(query: string): Promise<SearchResult> {
  const isDummyMode = import.meta.env.VITE_APP_DUMMY_MODE === 'true'

  // Dummy mode
  if (isDummyMode) {
    // Simulér netværk delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return generateMockResults(query)
  }

  // Live mode
  const client = getApiClient()
  if (!client) {
    throw new Error('API client not initialized')
  }

  try {
    const response: ApiResponse<{ results: Basic[]; total: number }> =
      await client.search.getPhotos({
        query,
        perPage: 20,
      })

    if (response.errors) {
      throw new Error(response.errors.join(', '))
    }

    if (!response.response) {
      throw new Error('No response from Unsplash API')
    }

    const { results, total } = response.response

    // Map til vores interface
    const photos: UnsplashPhoto[] = results.map(photo => ({
      id: photo.id,
      urls: {
        thumb: photo.urls.thumb,
        small: photo.urls.small,
        regular: photo.urls.regular,
      },
      alt_description: photo.alt_description,
    }))

    return {
      results: photos,
      total,
    }
  } catch (error) {
    // Håndter rate limit errors specifikt
    if (error instanceof Error && error.message.includes('403')) {
      throw new Error('Rate limit exceeded. Try again later or enable OAuth.')
    }

    throw error
  }
}

/**
 * Reset API client (bruges ved logout)
 */
export function resetApiClient(): void {
  apiClient = null
}
