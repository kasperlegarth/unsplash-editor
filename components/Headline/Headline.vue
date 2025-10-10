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

<style scoped lang="scss">
// Variables
$text-color: #111827;
$breakpoint-tablet: 768px;

.headline {
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
  color: $text-color;
}

// Heading sizes using SCSS
@each $level, $size, $mobile-size in
  (1, 3rem, 2.25rem),
  (2, 2.25rem, 1.875rem),
  (3, 1.875rem, 1.5rem),
  (4, 1.5rem, 1.5rem),
  (5, 1.25rem, 1.25rem),
  (6, 1rem, 1rem)
{
  h#{$level}.headline {
    font-size: $size;

    @if $level <= 3 {
      @media (max-width: $breakpoint-tablet) {
        font-size: $mobile-size;
      }
    }
  }
}

// Text alignment
@each $align in left, center, right {
  .align-#{$align} {
    text-align: $align;
  }
}
</style>
