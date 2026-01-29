<script setup lang="ts">
import { computed } from 'vue';

/**
 * Reflex Draft Manager Component
 *
 * Draft indicator and save button
 * Features:
 * - Draft indicator (last saved timestamp)
 * - Manual save button
 * - Load draft prompt if found
 * - Conflict resolution UI
 */

interface Props {
  lastSaved: number | null;
  isSaving: boolean;
  hasDraft: boolean;
  autoSaveEnabled?: boolean;
}

interface Emits {
  (e: 'save'): void;
  (e: 'loadDraft'): void;
  (e: 'clearDraft'): void;
}

const props = withDefaults(defineProps<Props>(), {
  autoSaveEnabled: true,
});

const emit = defineEmits<Emits>();

/**
 * Format last saved time
 */
const lastSavedText = computed(() => {
  if (!props.lastSaved) return 'Never saved';

  const seconds = Math.floor((Date.now() - props.lastSaved) / 1000);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
});

/**
 * Status indicator color
 */
const statusColor = computed(() => {
  if (props.isSaving) return 'text-primary';
  if (!props.lastSaved) return 'text-muted-foreground';

  const seconds = Math.floor((Date.now() - props.lastSaved) / 1000);
  if (seconds < 30) return 'text-success';
  if (seconds < 120) return 'text-warning';
  return 'text-muted-foreground';
});

/**
 * Handle manual save
 */
const handleSave = () => {
  if (!props.isSaving) {
    emit('save');
  }
};

/**
 * Handle load draft
 */
const handleLoadDraft = () => {
  emit('loadDraft');
};

/**
 * Handle clear draft
 */
const handleClearDraft = () => {
  emit('clearDraft');
};
</script>

<template>
  <div class="draft-manager">
    <!-- Draft Notification (if draft exists and not loaded) -->
    <div v-if="hasDraft" class="draft-notification">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">Draft Available</p>
          <p class="text-xs text-muted-foreground">A saved draft was found for this rule</p>
        </div>
      </div>
      <div class="flex space-x-2 mt-2">
        <button @click="handleLoadDraft" class="btn-load">
          Load Draft
        </button>
        <button @click="handleClearDraft" class="btn-discard">
          Discard
        </button>
      </div>
    </div>

    <!-- Draft Status Bar -->
    <div class="draft-status-bar">
      <!-- Status Indicator -->
      <div class="flex items-center space-x-2">
        <!-- Pulsing Dot -->
        <div class="relative">
          <div
            class="w-2 h-2 rounded-full"
            :class="statusColor"
          />
          <div
            v-if="isSaving"
            class="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75"
          />
        </div>

        <!-- Status Text -->
        <span class="text-xs" :class="statusColor">
          <span v-if="isSaving">Saving...</span>
          <span v-else-if="lastSaved">Saved {{ lastSavedText }}</span>
          <span v-else>Not saved</span>
        </span>
      </div>

      <!-- Auto-save Indicator -->
      <div v-if="autoSaveEnabled" class="flex items-center space-x-1 text-xs text-muted-foreground">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Auto-save</span>
      </div>

      <!-- Manual Save Button -->
      <button
        @click="handleSave"
        :disabled="isSaving"
        class="btn-save"
        :class="{ 'btn-save-disabled': isSaving }"
      >
        <svg
          class="w-4 h-4"
          :class="{ 'animate-spin': isSaving }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isSaving"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span class="hidden md:inline">Save</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.draft-manager {
  @apply space-y-2;
}

/* Draft Notification */
.draft-notification {
  @apply p-4 bg-info/10 border border-info/30 rounded-lg;
}

.btn-load {
  @apply px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium;
  @apply hover:bg-primary/90 transition-colors;
}

.btn-discard {
  @apply px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium;
  @apply hover:bg-muted transition-colors;
}

/* Draft Status Bar */
.draft-status-bar {
  @apply flex items-center justify-between space-x-3;
  @apply px-3 py-2 bg-muted border border-border rounded-lg;
}

/* Save Button */
.btn-save {
  @apply flex items-center space-x-1.5 px-3 py-1.5;
  @apply bg-primary text-primary-foreground rounded-lg text-sm font-medium;
  @apply hover:bg-primary/90 transition-colors;
}

.btn-save-disabled {
  @apply opacity-60 cursor-not-allowed hover:bg-primary;
}

/* Animations */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
