# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 3000)
npm run build           # Type-check og build til produktion
npm run preview         # Preview production build
```

## Architecture Overview

### Three-Mode System
Projektet understøtter tre operation modes styret via `.env`:

1. **Dummy Mode** (`VITE_APP_DUMMY_MODE=true`): Mock data, ingen API-kald. Returnerer 20 genererede billeder baseret på 5 hardcoded URLs.
2. **Live Mode** (`VITE_APP_DUMMY_MODE=false` + Access Key): Bruger Unsplash public API med access key.
3. **OAuth Mode** (`VITE_UNSPLASH_OAUTH_ENABLED=true`): PKCE OAuth flow for højere rate limits. **VIGTIGT**: Token exchange kræver backend pga. CORS - se README for implementation.

Mode-logikken er centraliseret i `src/lib/unsplash.ts` via singleton API client.

### Core Component Structure

**ImageReplacer.vue** er en genbrugelig, framework-agnostisk komponent:
- Props: `modelValue` (v-model billede-URL), `placeholder`, `tags` (optional override)
- Emits: `update:modelValue` ved billedvalg
- State management: Lokal ref-baseret state (ikke Pinia/Vuex)
- Modal lifecycle: Åbn → fokus input → søg/vælg → luk + reset state

**Search Tags Configuration:**
Tags hentes fra `src/config/search-tags.json` som default, men kan overrides via props:
```vue
<ImageReplacer :tags="['Custom', 'Tags']" />
```

### API Wrapper Pattern

`src/lib/unsplash.ts` wrapper `unsplash-js` biblioteket:
- Singleton pattern: API client initialiseres én gang baseret på mode
- Mock data generering i dummy mode (500ms simuleret delay)
- Error handling for rate limits (403) med brugervenlig besked
- Type mapping: Unsplash API response → `UnsplashPhoto` interface

### PKCE OAuth Flow

`src/auth/unsplashAuth.ts` implementerer client-side PKCE:
- Code verifier/challenge generering via Web Crypto API
- State parameter for CSRF protection
- Token storage i sessionStorage (ikke localStorage)
- **Begrænsning**: Direct token exchange vil fejle pga. CORS - dokumenteret fallback til backend i README

## Key Design Patterns

### Debounce Implementation
`src/lib/debounce.ts` er en generisk utility:
- 300ms delay hardcoded i `ImageReplacer.vue` (kan ekstrahere til prop hvis nødvendigt)
- Bruges kun til search input, ikke til chip clicks (instant trigger)

### Modal Focus Management
- `setTimeout(..., 100)` efter modal open for fokus på input (venter på DOM render)
- ESC og backdrop click lukker modal
- Enter/Space på image container åbner modal (keyboard accessibility)

### Environment Variable Naming
Alle env vars bruger `VITE_` prefix (Vite requirement):
- `VITE_APP_DUMMY_MODE`: Boolean string ("true"/"false")
- `VITE_UNSPLASH_ACCESS_KEY`: Public access key (OK i browser for read-only)
- `VITE_UNSPLASH_OAUTH_ENABLED`: Aktiverer OAuth flow
- `VITE_UNSPLASH_REDIRECT_URI`: OAuth callback URL (skal matche Unsplash app settings)

## Nuxt Migration Path

Komponenten er designet til at kunne kopieres direkte til Nuxt:
- Ingen Vite-specifik runtime kode
- Relative imports (skal ændres til `~/lib/...` i Nuxt)
- Client-side only logic (brug `<ClientOnly>` wrapper hvis SSR issues)
- sessionStorage i OAuth flow er browser-only

## TypeScript Strict Mode

Projektet bruger strict TypeScript:
- `noUnusedLocals` og `noUnusedParameters` enabled
- Alle komponenter bruger `<script setup lang="ts">`
- Props interfaces eksplicit defineret med `withDefaults`
- JSON imports kræver `resolveJsonModule: true` i tsconfig
