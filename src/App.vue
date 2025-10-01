<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ImageReplacer from './components/ImageReplacer.vue'
import { initiateLogin, handleCallback, logout, isAuthenticated } from './auth/unsplashAuth'
import { resetApiClient } from './lib/unsplash'

const imageSrc = ref('https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?q=80&w=700')
const isLoggedIn = ref(false)
const authError = ref<string | null>(null)

const isOAuthEnabled = import.meta.env.VITE_UNSPLASH_OAUTH_ENABLED === 'true'
const isDummyMode = import.meta.env.VITE_APP_DUMMY_MODE === 'true'

onMounted(async () => {
  // Check om vi er på callback URL
  if (window.location.pathname === '/auth/callback') {
    const result = await handleCallback()

    if (result.success) {
      isLoggedIn.value = true
      // Redirect til root
      window.history.replaceState({}, '', '/')
    } else {
      authError.value = result.error || 'Authentication failed'
      // Redirect til root efter 3 sekunder
      setTimeout(() => {
        window.history.replaceState({}, '', '/')
        authError.value = null
      }, 3000)
    }
  } else {
    // Check om vi allerede er authenticated
    isLoggedIn.value = isAuthenticated()
  }
})

function handleLogin() {
  initiateLogin()
}

function handleLogout() {
  logout()
  resetApiClient()
  isLoggedIn.value = false
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Unsplash Image Replacer</h1>
      <div class="header-info">
        <span v-if="isDummyMode" class="mode-badge dummy">Dummy Mode</span>
        <span v-else-if="isLoggedIn" class="mode-badge authenticated">Authenticated</span>
        <span v-else class="mode-badge">Public API</span>

        <button
          v-if="isOAuthEnabled && !isDummyMode && !isLoggedIn"
          class="auth-button"
          @click="handleLogin"
        >
          Login with Unsplash
        </button>
        <button
          v-if="isOAuthEnabled && isLoggedIn"
          class="auth-button logout"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="app-main">
      <div v-if="authError" class="auth-error">
        {{ authError }}
      </div>

      <div class="demo-container">
        <ImageReplacer v-model="imageSrc" />

        <div class="info">
          <h2>Om komponenten</h2>
          <ul>
            <li>Hover over billedet for at se "udskift"-overlay</li>
            <li>Klik for at åbne modal med Unsplash-søgning</li>
            <li>Søg efter billeder eller brug chips ("Food", "Sport", "Animals")</li>
            <li>Klik på et billede for at erstatte hovedbilledet</li>
            <li>ESC lukker modal, klik udenfor lukker også</li>
          </ul>

          <h3>Aktuel billede-URL:</h3>
          <code class="image-url">{{ imageSrc }}</code>

          <h3>Mode information:</h3>
          <div v-if="isDummyMode" class="mode-info">
            <strong>Dummy Mode:</strong> Bruger mock data (ingen rigtig API).
            <br />
            Sæt <code>VITE_APP_DUMMY_MODE=false</code> i .env for live mode.
          </div>
          <div v-else-if="isLoggedIn" class="mode-info">
            <strong>OAuth Mode:</strong> Authenticated med højere rate limits.
          </div>
          <div v-else class="mode-info">
            <strong>Public API Mode:</strong> Bruger Unsplash Access Key.
            <br />
            <span v-if="isOAuthEnabled">Klik "Login with Unsplash" for højere limits.</span>
          </div>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Built with Vue 3 + Vite + TypeScript |
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Unsplash
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mode-badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.mode-badge.dummy {
  background: rgba(251, 191, 36, 0.9);
}

.mode-badge.authenticated {
  background: rgba(34, 197, 94, 0.9);
}

.auth-button {
  padding: 0.5rem 1.25rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.auth-button.logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.app-main {
  flex: 1;
  padding: 3rem 1.5rem;
  background: #f9fafb;
}

.auth-error {
  max-width: 800px;
  margin: 0 auto 2rem;
  padding: 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  text-align: center;
}

.demo-container {
  max-width: 1000px;
  margin: 0 auto;
}

.info {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.info h2 {
  margin-top: 0;
  color: #111827;
  font-size: 1.5rem;
}

.info h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 1.125rem;
}

.info ul {
  color: #6b7280;
  line-height: 1.75;
}

.image-url {
  display: block;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.875rem;
  word-break: break-all;
  color: #374151;
}

.mode-info {
  padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  color: #1e40af;
  line-height: 1.6;
}

.mode-info strong {
  color: #1e3a8a;
}

.mode-info code {
  background: #dbeafe;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.875rem;
}

.app-footer {
  background: #111827;
  color: #9ca3af;
  padding: 1.5rem;
  text-align: center;
}

.app-footer p {
  margin: 0;
  font-size: 0.875rem;
}

.app-footer a {
  color: #60a5fa;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-info {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
