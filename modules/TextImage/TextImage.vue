<script setup lang="ts">
import type { TextImageSettings } from './types'

interface Props {
  settings: TextImageSettings
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

// Local state for editable mode
const localImageUrl = ref(props.settings.imageUrl)

// Background color mapping
const bgColorMap = {
  'white': '#ffffff',
  'light-gray': '#f9fafb',
  'gray': '#e5e7eb',
  'dark-gray': '#374151',
  'black': '#111827'
}

// Padding mapping
const paddingMap = {
  'none': '0',
  'small': '2rem',
  'medium': '4rem',
  'large': '6rem'
}

// Computed styles
const moduleStyles = computed(() => ({
  backgroundColor: bgColorMap[props.settings.backgroundColor],
  paddingTop: paddingMap[props.settings.paddingTop || 'medium'],
  paddingBottom: paddingMap[props.settings.paddingBottom || 'medium']
}))

// Text color based on background
const textColor = computed(() => {
  return ['dark-gray', 'black'].includes(props.settings.backgroundColor) ? '#ffffff' : '#111827'
})
</script>

<template>
  <div class="text-image-module" :style="moduleStyles">
    <div class="container">
      <div
        class="content-wrapper"
        :class="{ 'image-left': settings.imagePosition === 'left' }"
      >
        <!-- Text Content -->
        <div class="text-content">
          <Headline
            :text="settings.headline"
            :level="2"
            :style="{ color: textColor }"
          />
          <Text
            :content="settings.text"
            size="normal"
            :style="{ color: textColor, marginTop: '1rem' }"
          />
        </div>

        <!-- Image Content -->
        <div class="image-content">
          <ImageReplacer
            v-if="editable"
            v-model="localImageUrl"
            :placeholder="settings.imageUrl"
          />
          <img
            v-else
            :src="settings.imageUrl"
            alt="Module image"
            class="static-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Variables
$container-max-width: 1200px;
$breakpoint-tablet: 768px;

.text-image-module {
  width: 100%;
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  // Default: Image right
  .text-content {
    order: 1;
  }

  .image-content {
    order: 2;
  }

  // Image left variant
  &.image-left {
    .text-content {
      order: 2;
    }

    .image-content {
      order: 1;
    }
  }

  // Responsive
  @media (max-width: $breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: 2rem;

    // Stack on mobile: always text first, then image
    .text-content,
    &.image-left .text-content {
      order: 1;
    }

    .image-content,
    &.image-left .image-content {
      order: 2;
    }
  }
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-content {
  width: 100%;
}

.static-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}
</style>
