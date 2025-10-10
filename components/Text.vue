<script setup lang="ts">
interface Props {
  content: string
  size?: 'small' | 'normal' | 'large'
  align?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<Props>(), {
  size: 'normal',
  align: 'left'
})
</script>

<template>
  <div :class="['text-content', `size-${$props.size}`, `align-${$props.align}`]">
    {{ $props.content }}
  </div>
</template>

<style scoped lang="scss">
// Variables
$text-color: #374151;

// Size mapping
$sizes: (
  small: 0.875rem,
  normal: 1rem,
  large: 1.125rem
);

// Alignment values
$alignments: (left, center, right);

.text-content {
  margin: 0;
  line-height: 1.75;
  color: $text-color;
}

// Generate size classes
@each $name, $size in $sizes {
  .size-#{$name} {
    font-size: $size;
  }
}

// Generate alignment classes
@each $align in $alignments {
  .align-#{$align} {
    text-align: $align;
  }
}
</style>
