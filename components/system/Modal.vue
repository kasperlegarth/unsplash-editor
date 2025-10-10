<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="modal-backdrop"
      @click="handleBackdropClick"
      @keydown="handleKeydown"
    >
      <div class="modal" role="dialog" aria-modal="true" :aria-labelledby="title ? 'modal-title' : undefined">
        <div class="modal-header">
          <h2 v-if="title" id="modal-title" class="modal-title">{{ title }}</h2>
          <slot name="header" v-else></slot>
          <button
            class="close-button"
            aria-label="Close modal"
            @click="emit('close')"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
// Variables
$primary-color: #3b82f6;
$border-color: #e5e7eb;
$gray-100: #f3f4f6;
$gray-500: #6b7280;
$gray-900: #111827;
$transition-fast: 150ms ease;
$transition-normal: 200ms ease;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid $border-color;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: $gray-900;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: $gray-500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-normal;

  .modal {
    transition: transform $transition-normal, opacity $transition-normal;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
