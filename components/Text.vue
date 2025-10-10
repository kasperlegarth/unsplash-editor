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

<style scoped>
.text-content {
  margin: 0;
  line-height: 1.75;
  color: #374151;
}

.size-small {
  font-size: 0.875rem;
}

.size-normal {
  font-size: 1rem;
}

.size-large {
  font-size: 1.125rem;
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
</style>
