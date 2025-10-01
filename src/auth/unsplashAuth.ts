/**
 * Unsplash OAuth PKCE helpers
 * Håndterer client-side OAuth flow med PKCE (Proof Key for Code Exchange)
 */

interface PKCEState {
  codeVerifier: string
  codeChallenge: string
  state: string
}

const TOKEN_KEY = 'unsplash_access_token'
const PKCE_KEY = 'unsplash_pkce_state'

/**
 * Genererer tilfældig string til PKCE
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }

  return result
}

/**
 * SHA-256 hash og base64url encoding for code challenge
 */
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)

  // Convert til base64url
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Initierer OAuth login flow
 */
export async function initiateLogin(): Promise<void> {
  const clientId = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  const redirectUri = import.meta.env.VITE_UNSPLASH_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY or VITE_UNSPLASH_REDIRECT_URI')
  }

  // Generér PKCE parameters
  const codeVerifier = generateRandomString(128)
  const codeChallenge = await sha256(codeVerifier)
  const state = generateRandomString(32)

  // Gem PKCE state i sessionStorage
  const pkceState: PKCEState = {
    codeVerifier,
    codeChallenge,
    state
  }
  sessionStorage.setItem(PKCE_KEY, JSON.stringify(pkceState))

  // Byg authorization URL
  const authUrl = new URL('https://unsplash.com/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'public')
  authUrl.searchParams.set('code_challenge', codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', state)

  // Redirect til Unsplash
  window.location.href = authUrl.toString()
}

/**
 * Håndterer callback fra Unsplash
 * BEMÆRK: Token exchange kræver normalt backend pga. CORS.
 * Denne metode forsøger direkte exchange, men vil sandsynligvis fejle.
 * Se README for backend-løsning.
 */
export async function handleCallback(): Promise<{ success: boolean; error?: string }> {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')

  if (!code) {
    return { success: false, error: 'No authorization code received' }
  }

  // Hent PKCE state
  const pkceStateJson = sessionStorage.getItem(PKCE_KEY)
  if (!pkceStateJson) {
    return { success: false, error: 'Missing PKCE state' }
  }

  const pkceState: PKCEState = JSON.parse(pkceStateJson)

  // Verificér state
  if (state !== pkceState.state) {
    return { success: false, error: 'State mismatch - possible CSRF attack' }
  }

  // Exchange code for token
  // BEMÆRK: Dette vil sandsynligvis fejle pga. CORS restrictions fra Unsplash
  try {
    const response = await fetch('https://unsplash.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
        code,
        redirect_uri: import.meta.env.VITE_UNSPLASH_REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier: pkceState.codeVerifier,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `Token exchange failed: ${error}` }
    }

    const data = await response.json()

    // Gem access token
    sessionStorage.setItem(TOKEN_KEY, data.access_token)

    // Ryd PKCE state
    sessionStorage.removeItem(PKCE_KEY)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: `Token exchange error: ${error instanceof Error ? error.message : 'Unknown error'}. Se README for backend-løsning.`
    }
  }
}

/**
 * Henter gemt access token
 */
export function getAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

/**
 * Logger ud (fjerner token)
 */
export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(PKCE_KEY)
}

/**
 * Checker om bruger er authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}
