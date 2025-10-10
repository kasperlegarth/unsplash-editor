# Pagebuilder Tools

A modular pagebuilder toolkit with reusable Vue 3 components and configurable modules for building beautiful pages. Built with Nuxt 4, TypeScript, and designed to be framework-agnostic.

**Version:** 0.3.0

## ✨ Features

- 🧩 **Modular Architecture**: Components + Modules system
- 🎨 **Base Settings**: All modules share common settings (background, padding)
- ⚙️ **Unique Settings**: Each module has tailored settings
- 🖼️ **ImageReplacer**: Unsplash integration with dummy/live/OAuth modes
- 📝 **Text Components**: Headline and Text with alignment and sizing
- 🔧 **TextImage Module**: Combine text and images with flexible layouts
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 📱 **Responsive**: Mobile-first design
- 🔒 **TypeScript**: Strict mode with full type safety

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

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 📐 Architecture

### Components vs Modules

**Components** (`/components`) are small, focused UI elements:
- **ImageReplacer**: Unsplash image picker
- **Headline**: h1-h6 with alignment
- **Text**: Content with size and alignment

**Modules** (`/modules`) combine components with settings:
- **All modules** inherit base settings (backgroundColor, padding)
- **Each module** adds unique settings (e.g., imagePosition)
- **TextImage**: Headline + Text + Image with layout control

### Example: TextImage Module

```vue
<TextImage
  :settings="{
    backgroundColor: 'white',
    paddingTop: 'medium',
    paddingBottom: 'medium',
    imagePosition: 'right',
    headline: 'Your Headline',
    text: 'Your text content here.',
    imageUrl: 'https://images.unsplash.com/...'
  }"
  :editable="true"
/>
```

**Base Settings** (all modules):
- `backgroundColor`: 'white' | 'light-gray' | 'gray' | 'dark-gray' | 'black'
- `paddingTop/Bottom`: 'none' | 'small' | 'medium' | 'large'

**Unique Settings** (TextImage):
- `imagePosition`: 'left' | 'right'
- `headline`: string
- `text`: string
- `imageUrl`: string

## 📁 Project Structure

```
/components
  ImageReplacer.vue    # Unsplash picker with v-model
  Headline.vue         # Configurable headline (h1-h6)
  Text.vue            # Text content with styling

/modules
  /TextImage
    TextImage.vue      # Module component
    types.ts          # Module-specific types

/types
  modules.ts          # Base module settings interface

/lib
  unsplash.ts         # Unsplash API wrapper (dummy/live/OAuth)
  debounce.ts         # Debounce utility

/config
  search-tags.json    # Default Unsplash search tags

/pages
  index.vue           # Demo page

nuxt.config.ts        # Nuxt configuration
```

## 🧩 Available Components

### ImageReplacer

Interactive image picker with Unsplash integration.

**Props:**
```typescript
{
  modelValue: string      // Image URL (v-model)
  placeholder?: string    // Fallback URL
  tags?: string[]        // Custom search tags
}
```

**Modes:**
1. **Dummy**: Mock data, no API key needed
2. **Live**: Unsplash public API
3. **OAuth**: Higher rate limits (requires backend)

### Headline

Configurable headline component.

**Props:**
```typescript
{
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: 'left' | 'center' | 'right'
}
```

### Text

Text content component.

**Props:**
```typescript
{
  content: string
  size?: 'small' | 'normal' | 'large'
  align?: 'left' | 'center' | 'right'
}
```

## 🎨 Available Modules

### TextImage

Combines headline, text, and image with configurable layout.

**Settings:**
```typescript
interface TextImageSettings extends BaseModuleSettings {
  imagePosition: 'left' | 'right'
  headline: string
  text: string
  imageUrl: string
}
```

**Features:**
- ✅ Image left or right of text
- ✅ Configurable background colors
- ✅ Adjustable padding
- ✅ Editable mode with ImageReplacer
- ✅ Responsive layout (stacks on mobile)

## 🛠️ Creating New Modules

1. **Create module folder**: `/modules/YourModule/`

2. **Define types** (`types.ts`):
```typescript
import type { BaseModuleSettings } from '~/types/modules'

export interface YourModuleSettings extends BaseModuleSettings {
  // Add unique settings
  uniqueSetting: string
}

export const defaultYourModuleSettings: YourModuleSettings = {
  backgroundColor: 'white',
  paddingTop: 'medium',
  paddingBottom: 'medium',
  uniqueSetting: 'default value'
}
```

3. **Create component** (`YourModule.vue`):
```vue
<script setup lang="ts">
import type { YourModuleSettings } from './types'

interface Props {
  settings: YourModuleSettings
}

const props = defineProps<Props>()

// Map background colors
const bgColorMap = {
  'white': '#ffffff',
  'light-gray': '#f9fafb',
  'gray': '#e5e7eb',
  'dark-gray': '#374151',
  'black': '#111827'
}

const moduleStyles = computed(() => ({
  backgroundColor: bgColorMap[props.settings.backgroundColor],
  // ... padding logic
}))
</script>

<template>
  <div class="your-module" :style="moduleStyles">
    <!-- Use existing components -->
    <Headline :text="settings.headline" />
    <Text :content="settings.text" />
  </div>
</template>
```

## 🔧 Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start Nuxt dev server (port 3000)
npm run build           # Build for production
npm run generate        # Generate static site
npm run preview         # Preview production build
npm run typecheck       # Run TypeScript type check
```

## 🌐 Environment Variables

**Dummy Mode** (default - no API key needed):
```env
NUXT_PUBLIC_APP_DUMMY_MODE=true
```

**Live Mode** (requires Unsplash Access Key):
```env
NUXT_PUBLIC_APP_DUMMY_MODE=false
NUXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
```

**OAuth Mode** (higher rate limits):
```env
NUXT_PUBLIC_UNSPLASH_OAUTH_ENABLED=true
NUXT_PUBLIC_UNSPLASH_REDIRECT_URI=http://localhost:3000/auth/callback
```

See [.env.example](.env.example) for full configuration.

## 📚 Documentation

- [CLAUDE.md](CLAUDE.md) - Detailed developer guide
- [Project Structure](#-project-structure)
- [Creating Modules](#-creating-new-modules)

## 🗺️ Roadmap

**Planned Components:**
- Button component
- Icon component
- Card component

**Planned Modules:**
- Hero module (headline + CTA + background)
- Gallery module (image grid)
- Form module (contact forms)
- Testimonial module
- Pricing table module
- FAQ accordion module

## 🛠️ Tech Stack

- **Nuxt 4** - Vue 3 framework
- **Vue 3** - Composition API
- **TypeScript** - Strict mode
- **unsplash-js** - Unsplash API client
- **Vanilla CSS** - No frameworks

## 📄 License

MIT

---

**Built with ❤️ using Nuxt 4 + Vue 3 + TypeScript**
