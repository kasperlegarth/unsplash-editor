# Unsplash Image Replacer

En genbrugelig Vue 3 komponent til at vælge og erstatte billeder fra Unsplash. Bygget med Vite, TypeScript og ren CSS.

## ✨ Features

- 🖼️ Interaktiv billedskifter med hover-overlay
- 🔍 Debounced Unsplash-søgning (300ms)
- 🏷️ Hurtigsøgning med chips (Food, Sport, Animals)
- ♿ Fuldt tilgængelig (ARIA, keyboard navigation, focus management)
- 🎨 Pixel-perfekt UI med smooth transitions
- 🔐 OAuth PKCE support til højere rate limits
- 🎭 Dummy mode til UI-demo uden API-nøgle

## 🚀 Quickstart

### 1. Installation

```bash
npm install
```

### 2. Konfiguration

Kopiér `.env.example` til `.env`:

```bash
cp .env.example .env
```

### 3. Vælg mode

#### **Dummy Mode** (ingen API-nøgle krævet)

```env
VITE_APP_DUMMY_MODE=true
```

Kør appen:

```bash
npm run dev
```

Dummy mode bruger mock data og kræver ingen Unsplash-konto. Perfekt til UI-udvikling og demo.

#### **Live Mode** (kræver Unsplash Access Key)

1. Opret en Unsplash Developer-konto på [https://unsplash.com/developers](https://unsplash.com/developers)
2. Opret en ny app og få din **Access Key**
3. Opdater `.env`:

```env
VITE_APP_DUMMY_MODE=false
VITE_UNSPLASH_ACCESS_KEY=din_access_key_her
VITE_UNSPLASH_OAUTH_ENABLED=false
```

Kør appen:

```bash
npm run dev
```

#### **OAuth Mode** (højere rate limits)

1. I din Unsplash app-indstillinger, tilføj callback URL: `http://localhost:5173/auth/callback`
2. Opdater `.env`:

```env
VITE_APP_DUMMY_MODE=false
VITE_UNSPLASH_ACCESS_KEY=din_access_key_her
VITE_UNSPLASH_OAUTH_ENABLED=true
VITE_UNSPLASH_REDIRECT_URI=http://localhost:5173/auth/callback
```

Kør appen og klik "Login with Unsplash".

**⚠️ OAuth Begrænsning:**
Unsplash's token exchange endpoint har CORS-restriktioner. Fuld OAuth-implementering kræver en backend til at bytte authorization code til access token. Se "OAuth Backend Setup" nedenfor.

## 📁 Filstruktur

```
/src
  /components
    ImageReplacer.vue     # Hovedkomponent
  /lib
    unsplash.ts           # Unsplash API wrapper
    debounce.ts           # Debounce utility
  /auth
    unsplashAuth.ts       # PKCE OAuth helpers
  App.vue                 # Demo app
  main.ts
  style.css
```

## 🔧 Komponent API

### Props

```typescript
interface Props {
  modelValue: string      // Billede-URL (v-model)
  placeholder?: string    // Fallback URL (default: Unsplash sample)
}
```

### Events

```typescript
// Emitter nyt billede-URL
emit('update:modelValue', url: string)
```

### Brug i dit projekt

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

## 🎯 Kopiér til Nuxt

Komponenten er bygget framework-agnostisk og kan nemt kopieres til Nuxt:

1. **Kopiér filer:**
   ```bash
   # Fra Vue/Vite projekt til Nuxt
   cp src/components/ImageReplacer.vue <nuxt>/components/
   cp src/lib/unsplash.ts <nuxt>/lib/
   cp src/lib/debounce.ts <nuxt>/lib/
   cp src/auth/unsplashAuth.ts <nuxt>/auth/
   ```

2. **Install dependencies:**
   ```bash
   npm install unsplash-js
   ```

3. **Opdater imports i Nuxt:**
   - Brug `~/lib/unsplash` i stedet for relative paths
   - Tilføj Unsplash env-vars til `.env` (samme format)

4. **Brug i Nuxt pages/components:**
   ```vue
   <script setup>
   const imageSrc = ref('...')
   </script>

   <template>
     <ImageReplacer v-model="imageSrc" />
   </template>
   ```

5. **Client-side only (hvis nødvendigt):**
   ```vue
   <ClientOnly>
     <ImageReplacer v-model="imageSrc" />
   </ClientOnly>
   ```

## 🔐 OAuth Backend Setup

Unsplash's token exchange kræver normalt en backend pga. CORS. Her er en minimal Node.js endpoint:

```javascript
// server/api/unsplash-token.js (Nuxt example)
export default defineEventHandler(async (event) => {
  const { code, codeVerifier } = await readBody(event)

  const response = await fetch('https://unsplash.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      client_secret: process.env.UNSPLASH_SECRET_KEY,
      redirect_uri: process.env.UNSPLASH_REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  })

  return await response.json()
})
```

Opdater `unsplashAuth.ts` til at kalde din backend:

```typescript
// I handleCallback()
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

- **Debounce:** 300ms balance mellem responsivitet og API-kald
- **Grid:** Min 140px celler, object-fit: cover for konsistent visning
- **Transitions:** 150-200ms for smooth UX
- **Billede-kvalitet:** `urls.small` til thumbs, `urls.regular` til valgt (balance mellem kvalitet og load-tid)
- **Tilgængelighed:** ARIA-roller, keyboard navigation (Enter/Space åbner, ESC lukker), focus trap i modal

## 🧪 Test

Start i **dummy mode** og test:

1. ✅ Hover viser overlay med ikon
2. ✅ Klik åbner modal med fokus i input
3. ✅ Grid viser 20 mock thumbs
4. ✅ Klik på thumb opdaterer billede og lukker modal
5. ✅ ESC og backdrop-klik lukker modal
6. ✅ Chips udfylder input og trigger søgning

Skift til **live mode** og test:

1. ✅ Skriv "cat" (≥3 tegn) → loading → resultater
2. ✅ Vælg billede → opdateret v-model
3. ✅ Ingen runtime errors i console

## 📦 Build

```bash
npm run build
```

Output i `dist/` folder.

## 🛠️ Tech Stack

- **Vue 3** (Composition API)
- **Vite** (dev server & bundler)
- **TypeScript** (type safety)
- **unsplash-js** (Unsplash API client)
- **Ren CSS** (ingen frameworks)

## 📄 License

MIT

---

**Powered by [Unsplash](https://unsplash.com)**
