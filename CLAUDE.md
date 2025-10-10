# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**pagebuilder-tools** er et modulært pagebuilder toolkit med genbrugelige komponenter og konfigurer bare moduler til at bygge smukke sider. Projektet er bygget med Nuxt 4 og TypeScript.

**Version:** 0.4.0

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start Nuxt dev server (port 3000)
npm run build           # Build til produktion
npm run generate        # Generate static site
npm run preview         # Preview production build
npm run typecheck       # Run TypeScript type check
```

## Architecture Overview

### Nuxt 4 Project Structure

```
/components             # Alle komponenter
  /system               # System UI komponenter (Modal, Button, etc.)
    /Modal.vue          # Genbrugelig modal komponent
  /ComponentName        # Feature komponenter
    /ComponentName.vue  # Komponent fil
    /config.json        # Komponent-specifik config
    /types.ts           # Komponent-specifik types (optional)
/modules                # Moduler med egne indstillinger
  /ModuleName
    /ModuleName.vue     # Modul komponent
    /types.ts           # Modul-specifikke types
/types                  # Global types
  /modules.ts           # BaseModuleSettings interface
/lib                    # Utility libraries (unsplash, debounce)
/auth                   # Authentication helpers (OAuth)
/assets/css             # Global SCSS styles
/pages                  # Nuxt pages (index.vue demo)
nuxt.config.ts          # Nuxt konfiguration
```

### Modular Architecture

Projektet følger en **system components + feature components + modules** arkitektur:

#### **System Components** (`/components/system`)
Generiske, genbrugelige UI-elementer der bruges på tværs af projektet:
- **Modal**: Genbrugelig modal med slots til indhold
- Fremtidige: Button, Input, Card, etc.

System komponenter:
- **Framework-agnostiske**: Ingen forretningslogik
- **Slot-baserede**: Maksimal fleksibilitet
- **Konsistente**: Ensartet UI på tværs af projektet

#### **Feature Components** (`/components/[ComponentName]`)
Komponenter med specifik funktionalitet, organiseret i egne mapper:
- **ImageReplacer/**: Unsplash image picker med v-model
  - `ImageReplacer.vue`: Komponent
  - `config.json`: Search tags konfiguration
- **Headline/**: Konfigurerbar overskrift (h1-h6, alignment)
- **Text/**: Tekst komponent med size og alignment

Feature komponenter:
- **Selvstændige**: Minimal eksterne dependencies
- **Kapslet**: Alt relateret i én mappe
- **Konfigurerbare**: Props til customization
- **Accessible**: ARIA, keyboard navigation
- **Type-safe**: TypeScript strict mode

#### **Modules** (`/modules`)
Sammensatte blokke der kombinerer komponenter med indstillinger:
- Alle moduler arver **fælles base settings** (backgroundColor, padding)
- Hvert modul har **unikke settings** (fx imagePosition for TextImage)
- Moduler består af én eller flere komponenter

**Eksempel: TextImage modul**
- Kombinerer: Headline + Text + ImageReplacer
- Base settings: backgroundColor, paddingTop, paddingBottom
- Unique settings: imagePosition ('left' | 'right')

#### **Types System** (`/types`)

**Base Module Settings** (`types/modules.ts`):
```typescript
export interface BaseModuleSettings {
  backgroundColor: BackgroundColor  // 'white' | 'light-gray' | 'gray' | 'dark-gray' | 'black'
  paddingTop?: 'none' | 'small' | 'medium' | 'large'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large'
}
```

**Module-Specific Settings** (fx `modules/TextImage/types.ts`):
```typescript
export interface TextImageSettings extends BaseModuleSettings {
  imagePosition: 'left' | 'right'  // Unique setting
  headline: string
  text: string
  imageUrl: string
}
```

## Key Components

### System Components

#### Modal (`components/system/Modal.vue`)

Genbrugelig modal komponent med slot support.

**Props:**
```typescript
interface Props {
  isOpen: boolean
  title?: string  // Optional modal title
}
```

**Events:**
- `@close`: Emitted når modal lukkes (ESC, backdrop click, close button)

**Slots:**
- `default`: Modal body content
- `header`: Custom header (hvis title ikke bruges)

**Usage:**
```vue
<Modal :isOpen="isOpen" title="My Title" @close="handleClose">
  <p>Modal content goes here</p>
</Modal>
```

### Feature Components

#### ImageReplacer (`components/ImageReplacer/ImageReplacer.vue`)

Unsplash image picker med tre operation modes:

1. **Dummy Mode**: Mock data, ingen API-kald
2. **Live Mode**: Unsplash public API med access key
3. **OAuth Mode**: PKCE OAuth flow (kræver backend)

**Props:**
```typescript
interface Props {
  modelValue: string      // Image URL (v-model)
  placeholder?: string    // Fallback URL
  tags?: string[]        // Override search tags
}
```

**Configuration:**
Search tags defineret i `components/ImageReplacer/config.json`:
```json
{
  "tags": ["Food", "Sport", "Animals", ...]
}
```

#### Headline (`components/Headline/Headline.vue`)

**Props:**
```typescript
interface Props {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: 'left' | 'center' | 'right'
}
```

#### Text (`components/Text/Text.vue`)

**Props:**
```typescript
interface Props {
  content: string
  size?: 'small' | 'normal' | 'large'
  align?: 'left' | 'center' | 'right'
}
```

## Key Modules

### TextImage (`modules/TextImage/TextImage.vue`)

Kombinerer headline, text og image med konfigurerbar layout.

**Props:**
```typescript
interface Props {
  settings: TextImageSettings
  editable?: boolean  // Enable ImageReplacer editing
}
```

**Settings:**
```typescript
interface TextImageSettings extends BaseModuleSettings {
  imagePosition: 'left' | 'right'
  headline: string
  text: string
  imageUrl: string
}
```

**Usage:**
```vue
<TextImage
  :settings="{
    backgroundColor: 'white',
    paddingTop: 'medium',
    imagePosition: 'right',
    headline: 'My Headline',
    text: 'My text content',
    imageUrl: 'https://...'
  }"
  :editable="true"
/>
```

## Creating New Components

### Creating a System Component

1. **Opret komponent** i `/components/system/YourComponent.vue`
2. **Fokus på genbrugelighed**: Ingen forretningslogik, brug slots
3. **Props interface**: Minimal, fokuseret API
4. **Example**:
   ```vue
   <script setup lang="ts">
   interface Props {
     variant?: 'primary' | 'secondary'
   }
   defineProps<Props>()
   </script>

   <template>
     <div class="your-component">
       <slot></slot>
     </div>
   </template>
   ```

### Creating a Feature Component

1. **Opret mappe**: `/components/YourComponent/`
2. **Opret komponent**: `YourComponent.vue`
3. **Tilføj config** (hvis nødvendigt): `config.json`
4. **Tilføj types** (hvis nødvendigt): `types.ts`
5. **Structure**:
   ```
   /components/YourComponent/
     YourComponent.vue
     config.json      # Optional
     types.ts         # Optional
   ```

## Creating New Modules

For at oprette et nyt modul:

1. **Opret modul folder**: `/modules/YourModule/`
2. **Definer types** (`types.ts`):
   ```typescript
   import type { BaseModuleSettings } from '~/types/modules'

   export interface YourModuleSettings extends BaseModuleSettings {
     // Add unique settings
     uniqueSetting: string
   }
   ```

3. **Opret komponent** (`YourModule.vue`):
   ```vue
   <script setup lang="ts">
   import type { YourModuleSettings } from './types'

   interface Props {
     settings: YourModuleSettings
   }

   const props = defineProps<Props>()
   </script>
   ```

4. **Brug komponenter**: Brug eksisterende feature komponenter (Headline, Text, ImageReplacer) og system komponenter (Modal)

## Environment Variables

Nuxt 4 bruger `runtimeConfig` - env vars mappes automatisk.

### Public Variables (exposed to client)
- `NUXT_PUBLIC_UNSPLASH_ACCESS_KEY`: Unsplash access key
- `NUXT_PUBLIC_UNSPLASH_OAUTH_ENABLED`: Enable OAuth flow
- `NUXT_PUBLIC_UNSPLASH_REDIRECT_URI`: OAuth redirect URI
- `NUXT_PUBLIC_APP_DUMMY_MODE`: Use mock data mode

### Private Variables (server-only)
- `NUXT_UNSPLASH_SECRET_KEY`: Unsplash secret key (KUN backend)

**Brug i kode:**
```typescript
const config = useRuntimeConfig()
const isDummyMode = config.public.appDummyMode
```

## TypeScript Configuration

- `strict: true`
- `typeCheck: true` i Nuxt config
- Alle komponenter bruger `<script setup lang="ts">`
- Props interfaces eksplicit defineret

## Design Patterns

### Module Pattern
- Arv fra `BaseModuleSettings` for fælles indstillinger
- Tilføj unique settings i modul-specifikke interfaces
- Brug computed styles baseret på settings
- Support både static og editable mode

### Component Composition
- Små, fokuserede komponenter
- Auto-import via Nuxt
- Props over events hvor muligt
- Type-safe interfaces

## Best Practices

1. **Modules**: Arv altid fra `BaseModuleSettings`
2. **Components**: Hold fokuseret på én funktionalitet
3. **Types**: Definer interfaces for alle props
4. **Auto-imports**: Nuxt importerer automatisk fra `/components` og `/modules`
5. **Composables**: Brug `~/` prefix til imports
6. **Accessibility**: ARIA labels, keyboard navigation
7. **Responsive**: Mobile-first design

## Future Roadmap

Planlagte moduler:
- Hero module (headline + CTA + background image)
- Gallery module (image grid)
- Form module (contact forms)
- Testimonial module
- Pricing table module
