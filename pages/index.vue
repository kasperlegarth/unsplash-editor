<script setup lang="ts">
import { ref } from 'vue'
import type { TextImageSettings } from '~/modules/TextImage/types'
import { defaultTextImageSettings } from '~/modules/TextImage/types'

// Demo module configurations
const textImageModule1 = ref<TextImageSettings>({
  ...defaultTextImageSettings,
  backgroundColor: 'white',
  imagePosition: 'right',
  headline: 'Build Beautiful Pages',
  text: 'Create stunning layouts with our modular pagebuilder components. Mix and match text, images, and more to create the perfect design.'
})

const textImageModule2 = ref<TextImageSettings>({
  ...defaultTextImageSettings,
  backgroundColor: 'light-gray',
  imagePosition: 'left',
  headline: 'Flexible Configurations',
  text: 'Every module supports common settings like background colors and padding, plus unique settings tailored to each module type.',
  imageUrl: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?q=80&w=700'
})

const textImageModule3 = ref<TextImageSettings>({
  ...defaultTextImageSettings,
  backgroundColor: 'dark-gray',
  imagePosition: 'right',
  headline: 'Easy Integration',
  text: 'Built with Nuxt 4 and TypeScript, our components are framework-agnostic and easy to integrate into your existing projects.',
  imageUrl: 'https://images.unsplash.com/photo-1678033382919-fa907632fdda?q=80&w=700',
  paddingTop: 'large',
  paddingBottom: 'large'
})

useHead({
  title: 'Pagebuilder Tools - Modular Components Demo',
})
</script>

<template>
  <div class="demo-page">
    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-container">
        <h1 class="hero-title">Pagebuilder Tools</h1>
        <p class="hero-subtitle">
          A collection of modular, reusable Vue 3 components for building beautiful pages
        </p>
        <div class="hero-badges">
          <span class="badge">Nuxt 4</span>
          <span class="badge">TypeScript</span>
          <span class="badge">Modular</span>
          <span class="badge">v0.3.0</span>
        </div>
      </div>
    </header>

    <!-- Module Demos -->
    <main class="demo-modules">
      <TextImage :settings="textImageModule1" :editable="true" />
      <TextImage :settings="textImageModule2" />
      <TextImage :settings="textImageModule3" />
    </main>

    <!-- Components Showcase -->
    <section class="component-showcase">
      <div class="showcase-container">
        <h2 class="showcase-title">Available Components</h2>
        <div class="component-grid">
          <div class="component-card">
            <h3>ImageReplacer</h3>
            <p>Unsplash image picker with v-model support, custom URL input, and three operation modes.</p>
            <code>components/ImageReplacer.vue</code>
          </div>
          <div class="component-card">
            <h3>Headline</h3>
            <p>Configurable headline component with 6 levels and text alignment options.</p>
            <code>components/Headline.vue</code>
          </div>
          <div class="component-card">
            <h3>Text</h3>
            <p>Text content component with size and alignment settings.</p>
            <code>components/Text.vue</code>
          </div>
        </div>

        <h2 class="showcase-title" style="margin-top: 3rem">Available Modules</h2>
        <div class="component-grid">
          <div class="component-card module-card">
            <h3>TextImage</h3>
            <p>Combines headline, text, and image with configurable layout and styling.</p>
            <div class="module-settings">
              <strong>Base Settings:</strong> backgroundColor, padding
              <br />
              <strong>Unique Settings:</strong> imagePosition (left/right)
            </div>
            <code>modules/TextImage/</code>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="demo-footer">
      <p>
        Pagebuilder Tools v0.3.0 | Built with Nuxt 4 + Vue 3 + TypeScript
      </p>
    </footer>
  </div>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 1.5rem;
  text-align: center;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  margin: 0;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.25rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-badges {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* Demo Modules */
.demo-modules {
  flex: 1;
}

/* Component Showcase */
.component-showcase {
  background: #f9fafb;
  padding: 4rem 1.5rem;
}

.showcase-container {
  max-width: 1200px;
  margin: 0 auto;
}

.showcase-title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.component-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.component-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.component-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.component-card p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.6;
}

.component-card code {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #374151;
}

.module-card {
  border-left: 4px solid #667eea;
}

.module-settings {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.6;
}

/* Footer */
.demo-footer {
  background: #111827;
  color: #9ca3af;
  padding: 2rem 1.5rem;
  text-align: center;
}

.demo-footer p {
  margin: 0;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .component-grid {
    grid-template-columns: 1fr;
  }
}
</style>
