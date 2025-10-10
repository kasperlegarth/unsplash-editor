<script setup lang="ts">
interface Props {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  level: 2,
  align: 'left'
})

// Dynamisk tag baseret på level
const tag = computed(() => `h${props.level}`)
</script>

<template>
  <component :is="tag" :class="['headline', `align-${align}`]">
    {{ text }}
  </component>
</template>

<style scoped>
.headline {
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
}

h1.headline {
  font-size: 3rem;
}

h2.headline {
  font-size: 2.25rem;
}

h3.headline {
  font-size: 1.875rem;
}

h4.headline {
  font-size: 1.5rem;
}

h5.headline {
  font-size: 1.25rem;
}

h6.headline {
  font-size: 1rem;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

@media (max-width: 768px) {
  h1.headline {
    font-size: 2.25rem;
  }

  h2.headline {
    font-size: 1.875rem;
  }

  h3.headline {
    font-size: 1.5rem;
  }
}
</style>
