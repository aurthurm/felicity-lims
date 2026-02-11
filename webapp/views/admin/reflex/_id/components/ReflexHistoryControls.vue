<script setup lang="ts">
import { computed } from 'vue';

/**
 * Reflex History Controls Component
 *
 * Undo/Redo buttons in toolbar
 * Features:
 * - Undo/Redo buttons
 * - Keyboard shortcut hints
 * - Disabled state when no history
 * - Visual feedback
 */

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  historySize?: number;
}

interface Emits {
  (e: 'undo'): void;
  (e: 'redo'): void;
}

const props = withDefaults(defineProps<Props>(), {
  historySize: 0,
});

const emit = defineEmits<Emits>();

/**
 * Handle undo
 */
const handleUndo = () => {
  if (props.canUndo) {
    emit('undo');
  }
};

/**
 * Handle redo
 */
const handleRedo = () => {
  if (props.canRedo) {
    emit('redo');
  }
};

/**
 * History status text
 */
const historyStatus = computed(() => {
  if (props.historySize === 0) return 'No history';
  return `${props.historySize} ${props.historySize === 1 ? 'change' : 'changes'}`;
});
</script>

<template>
  <div class="history-controls">
    <!-- Undo Button -->
    <button
      @click="handleUndo"
      :disabled="!canUndo"
      :title="`Undo (Ctrl+Z) - ${historyStatus}`"
      class="history-btn"
      :class="{ 'btn-disabled': !canUndo }"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
      <span class="btn-label">Undo</span>
      <kbd class="btn-kbd">Ctrl+Z</kbd>
    </button>

    <!-- Redo Button -->
    <button
      @click="handleRedo"
      :disabled="!canRedo"
      title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
      class="history-btn"
      :class="{ 'btn-disabled': !canRedo }"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
        />
      </svg>
      <span class="btn-label">Redo</span>
      <kbd class="btn-kbd">Ctrl+Shift+Z</kbd>
    </button>

    <!-- History Status -->
    <div class="history-status">
      <span class="text-xs text-muted-foreground">{{ historyStatus }}</span>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.history-controls {
  @apply flex items-center space-x-2;
}

.history-btn {
  @apply flex items-center space-x-2 px-3 py-2;
  @apply bg-card border border-input rounded-lg;
  @apply hover:bg-muted hover:border-input;
  @apply transition-all duration-200;
  @apply text-foreground text-sm font-medium;
}

.history-btn:active:not(:disabled) {
  @apply scale-95;
}

.btn-disabled {
  @apply opacity-40 cursor-not-allowed;
  @apply hover:bg-card hover:border-input;
}

.btn-label {
  @apply hidden md:inline;
}

.btn-kbd {
  @apply hidden lg:inline;
  @apply px-1.5 py-0.5 bg-muted border border-input rounded text-xs font-mono;
}

.history-status {
  @apply px-3 py-2 bg-muted border border-border rounded-lg;
  @apply hidden xl:flex items-center;
}
</style>
