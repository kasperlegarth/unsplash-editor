# Unsplash Image Replacer

A reusable Vue 3 component for selecting and replacing images from Unsplash. Built with Vite, TypeScript, and vanilla CSS.

## ✨ Features

- 🖼️ Interactive image replacer with hover overlay
- 🔍 Debounced Unsplash search (300ms)
- 🏷️ Configurable search tags from JSON (or via props)
- ♿ Fully accessible (ARIA, keyboard navigation, focus management)
- 🎨 Pixel-perfect UI with smooth transitions
- 🔐 OAuth PKCE support for higher rate limits
- 🎭 Dummy mode for UI demo without API key
- 📝 v-model support for reactive image switching

## 🚀 Quickstart

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Choose Mode

#### **Dummy Mode** (no API key required)

```env
VITE_APP_DUMMY_MODE=true
```

Run the app:

```bash
npm run dev
```

Dummy mode uses mock data and requires no Unsplash account. Perfect for UI development and demos.

#### **Live Mode** (requires Unsplash Access Key)

1. Create an Unsplash Developer account at [https://unsplash.com/developers](https://unsplash.com/developers)
2. Create a new app and get your **Access Key**
3. Update `.env`:

```env
VITE_APP_DUMMY_MODE=false
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
VITE_UNSPLASH_OAUTH_ENABLED=false
```

Run the app:

```bash
npm run dev
```

#### **OAuth Mode** (higher rate limits)

1. In your Unsplash app settings, add callback URL: `http://localhost:3000/auth/callback`
2. Update `.env`:

```env
VITE_APP_DUMMY_MODE=false
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
VITE_UNSPLASH_OAUTH_ENABLED=true
VITE_UNSPLASH_REDIRECT_URI=http://localhost:3000/auth/callback
```

Run the app and click "Login with Unsplash".

**⚠️ OAuth Limitation:**
Unsplash's token exchange endpoint has CORS restrictions. Full OAuth implementation requires a backend to exchange authorization code for access token. See "OAuth Backend Setup" below.

## 📁 File Structure

```
/src
  /components
    ImageReplacer.vue     # Main component
  /lib
    unsplash.ts           # Unsplash API wrapper
    debounce.ts           # Debounce utility
  /auth
    unsplashAuth.ts       # PKCE OAuth helpers
  App.vue                 # Demo app
  main.ts
  style.css
```

## 🔧 Component API

### Props

```typescript
interface Props {
  modelValue: string      // Image URL (v-model)
  placeholder?: string    // Fallback URL (default: Unsplash sample)
  tags?: string[]         // Custom search tags (default: from src/config/search-tags.json)
}
```

### Search Tags Configuration

Search tags can be configured in two ways:

**1. Via config file (default):**
Edit `src/config/search-tags.json`:
```json
{
  "tags": ["Food", "Sport", "Animals", "Nature", "Technology", "Travel", "Architecture", "People"]
}
```

**2. Via props (override):**
```vue
<ImageReplacer v-model="imageSrc" :tags="['Cats', 'Dogs', 'Birds']" />
```

### Events

```typescript
// Emits new image URL
emit('update:modelValue', url: string)
```

### Usage in Your Project

```vue
<script setup>
import { ref } from 'vue'
import ImageReplacer from './components/ImageReplacer.vue'

const imageSrc = ref('https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?q=80&w=700')
</script>

<template>
  <ImageReplacer v-model="imageSrc" />
</template>
```

## 🎯 Copy to Nuxt

The component is built framework-agnostic and can easily be copied to Nuxt:

1. **Copy files:**
   ```bash
   # From Vue/Vite project to Nuxt
   cp src/components/ImageReplacer.vue <nuxt>/components/
   cp src/lib/unsplash.ts <nuxt>/lib/
   cp src/lib/debounce.ts <nuxt>/lib/
   cp src/auth/unsplashAuth.ts <nuxt>/auth/
   ```

2. **Install dependencies:**
   ```bash
   npm install unsplash-js
   ```

3. **Update imports in Nuxt:**
   - Use `~/lib/unsplash` instead of relative paths
   - Add Unsplash env vars to `.env` (same format)

4. **Use in Nuxt pages/components:**
   ```vue
   <script setup>
   const imageSrc = ref('...')
   </script>

   <template>
     <ImageReplacer v-model="imageSrc" />
   </template>
   ```

5. **Client-side only (if needed):**
   ```vue
   <ClientOnly>
     <ImageReplacer v-model="imageSrc" />
   </ClientOnly>
   ```

## 🔐 OAuth Backend Setup

Unsplash's token exchange typically requires a backend due to CORS. Here's a minimal Node.js endpoint:

**NOTE:** The backend requires your **Secret Key** from Unsplash (found under "Keys" in your app). Secret Key must NEVER be included in frontend code - only in backend environment variables.

```javascript
// server/api/unsplash-token.js (Nuxt example)
export default defineEventHandler(async (event) => {
  const { code, codeVerifier } = await readBody(event)

  const response = await fetch('https://unsplash.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      client_secret: process.env.UNSPLASH_SECRET_KEY,  // ⚠️ Backend only! Not in .env
      redirect_uri: process.env.UNSPLASH_REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  })

  return await response.json()
})
```

**Backend environment variables (e.g., in `.env.server`):**
```env
UNSPLASH_ACCESS_KEY=your_access_key
UNSPLASH_SECRET_KEY=your_secret_key
UNSPLASH_REDIRECT_URI=http://localhost:3000/auth/callback
```

Update `unsplashAuth.ts` to call your backend:

```typescript
// In handleCallback()
const response = await fetch('/api/unsplash-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    codeVerifier: pkceState.codeVerifier,
  }),
})
```

## 🎨 Design Decisions

- **Debounce:** 300ms balance between responsiveness and API calls
- **Grid:** Min 140px cells, object-fit: cover for consistent display
- **Transitions:** 150-200ms for smooth UX
- **Image quality:** `urls.small` for thumbs, `urls.regular` for selected (balance between quality and load time)
- **Accessibility:** ARIA roles, keyboard navigation (Enter/Space opens, ESC closes), focus trap in modal

## 🧪 Testing

Start in **dummy mode** and test:

1. ✅ Hover shows overlay with icon
2. ✅ Click opens modal with focus on input
3. ✅ Grid shows 20 mock thumbs
4. ✅ Click on thumb updates image and closes modal
5. ✅ ESC and backdrop click close modal
6. ✅ Chips populate input and trigger search

Switch to **live mode** and test:

1. ✅ Type "cat" (≥3 chars) → loading → results
2. ✅ Select image → updated v-model
3. ✅ No runtime errors in console

## 📦 Build

```bash
npm run build
```

Output in `dist/` folder.

## 🛠️ Tech Stack

- **Vue 3** (Composition API)
- **Vite** (dev server & bundler)
- **TypeScript** (type safety)
- **unsplash-js** (Unsplash API client)
- **Vanilla CSS** (no frameworks)

## 📄 License

MIT

---

**Powered by [Unsplash](https://unsplash.com)**
