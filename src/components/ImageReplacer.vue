<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchPhotos } from '../lib/unsplash'
import type { UnsplashPhoto } from '../lib/unsplash'
import { debounce } from '../lib/debounce'
import searchTagsConfig from '../config/search-tags.json'

interface Props {
  modelValue: string
  placeholder?: string
  tags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?q=80&w=700'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// State
const isModalOpen = ref(false)
const searchQuery = ref('')
const customUrl = ref('')
const searchResults = ref<UnsplashPhoto[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed
const currentSrc = computed(() => props.modelValue || props.placeholder)

// Tags/Chips - brug props hvis angivet, ellers config, ellers fallback
const CHIPS = computed(() => props.tags || searchTagsConfig.tags || ['Food', 'Sport', 'Animals'])

// Debounced search
const performSearch = debounce(async (query: string) => {
  if (query.length < 3) {
    searchResults.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const result = await searchPhotos(query)
    searchResults.value = result.results
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong. Try again.'
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

// Handlers
function openModal() {
  isModalOpen.value = true
  // Fokuser input efter modal åbning
  setTimeout(() => {
    const input = document.querySelector<HTMLInputElement>('.modal-search-input')
    input?.focus()
  }, 100)
}

function closeModal() {
  isModalOpen.value = false
  // Reset state
  searchQuery.value = ''
  customUrl.value = ''
  searchResults.value = []
  isLoading.value = false
  error.value = null
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  performSearch(target.value)
}

function handleChipClick(chip: string) {
  searchQuery.value = chip
  performSearch(chip)
}

function selectPhoto(photo: UnsplashPhoto) {
  emit('update:modelValue', photo.urls.regular)
  closeModal()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
  } else if (event.key === 'Enter' || event.key === ' ') {
    openModal()
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function handleModalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

function handleCustomUrl() {
  if (customUrl.value.trim()) {
    emit('update:modelValue', customUrl.value.trim())
    closeModal()
  }
}

function handleCustomUrlKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleCustomUrl()
  }
}
</script>

<template>
  <div class="image-replacer">
    <!-- Billede med overlay -->
    <div
      class="image-container"
      role="button"
      tabindex="0"
      aria-label="Click to replace image"
      @click="openModal"
      @keydown="handleKeydown"
    >
      <img :src="currentSrc" alt="Selected image" class="main-image" />
      <div class="overlay">
        <svg
          class="replace-icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="modal-backdrop"
        @click="handleBackdropClick"
        @keydown="handleModalKeydown"
      >
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title">Search Unsplash</h2>
            <button
              class="close-button"
              aria-label="Close modal"
              @click="closeModal"
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
            <!-- Custom URL input -->
            <div class="custom-url-container">
              <input
                type="text"
                class="custom-url-input"
                placeholder="Paste image URL…"
                v-model="customUrl"
                @keydown="handleCustomUrlKeydown"
              />
              <svg
                class="enter-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                @click="handleCustomUrl"
              >
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
            </div>

            <!-- Search input -->
            <input
              type="text"
              class="modal-search-input"
              placeholder="Search Unsplash…"
              :value="searchQuery"
              @input="handleSearchInput"
            />

            <!-- Chips -->
            <div class="chips">
              <button
                v-for="chip in CHIPS"
                :key="chip"
                class="chip"
                @click="handleChipClick(chip)"
              >
                {{ chip }}
              </button>
            </div>

            <!-- Content area -->
            <div class="content">
              <!-- Idle state -->
              <div v-if="!searchQuery && !isLoading && !error" class="state-message">
                Type at least 3 characters…
              </div>

              <!-- Loading state -->
              <div v-else-if="isLoading" class="state-message">
                <div class="spinner"></div>
                <p>Searching…</p>
              </div>

              <!-- Error state -->
              <div v-else-if="error" class="state-message error">
                {{ error }}
              </div>

              <!-- Empty state -->
              <div
                v-else-if="searchQuery.length >= 3 && searchResults.length === 0"
                class="state-message"
              >
                No results for '{{ searchQuery }}'
              </div>

              <!-- Results grid -->
              <div v-else-if="searchResults.length > 0" class="results-grid">
                <button
                  v-for="photo in searchResults"
                  :key="photo.id"
                  class="result-item"
                  @click="selectPhoto(photo)"
                >
                  <img
                    :src="photo.urls.small"
                    :alt="photo.alt_description || 'Unsplash photo'"
                    class="result-image"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.image-replacer {
  width: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  outline: none;
}

.image-container:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.main-image {
  width: 100%;
  height: auto;
  display: block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 150ms ease;
}

.image-container:hover .overlay,
.image-container:focus .overlay {
  opacity: 1;
}

.replace-icon {
  color: white;
}

/* Modal */
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
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.custom-url-container {
  position: relative;
  margin-bottom: 16px;
}

.custom-url-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 150ms ease;
}

.custom-url-input:focus {
  border-color: #3b82f6;
}

.enter-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  transition: color 150ms ease;
}

.enter-icon:hover {
  color: #3b82f6;
}

.modal-search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 150ms ease;
}

.modal-search-input:focus {
  border-color: #3b82f6;
}

.chips {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.chip {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 150ms ease;
}

.chip:hover {
  background: #e5e7eb;
}

.chip:active {
  background: #d1d5db;
}

.content {
  margin-top: 24px;
  min-height: 300px;
}

.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
  font-size: 1rem;
}

.state-message.error {
  color: #dc2626;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.result-item {
  aspect-ratio: 1;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.result-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 200ms ease, opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95);
  opacity: 0;
}
</style>
