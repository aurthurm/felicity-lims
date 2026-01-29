<script setup lang="ts">
import { ref, computed } from 'vue';

/**
 * Reflex Validation Panel Component
 *
 * Floating panel showing errors and warnings
 * Features:
 * - Lists errors (red) and warnings (yellow)
 * - Click to highlight node
 * - Collapsible
 * - Badge count
 */

interface ValidationIssue {
  nodeId?: string;
  edgeId?: string;
  type: 'error' | 'warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  field?: string;
  code: string;
}

interface Props {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

interface Emits {
  (e: 'highlight:node', nodeId: string): void;
  (e: 'highlight:edge', edgeId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * Collapsed state
 */
const collapsed = ref(false);

/**
 * Computed total issues
 */
const totalIssues = computed(() => props.errors.length + props.warnings.length);

/**
 * Computed critical errors
 */
const criticalErrors = computed(() =>
  props.errors.filter((e) => e.severity === 'critical')
);

/**
 * Handle issue click
 */
const handleIssueClick = (issue: ValidationIssue) => {
  if (issue.nodeId) {
    emit('highlight:node', issue.nodeId);
  } else if (issue.edgeId) {
    emit('highlight:edge', issue.edgeId);
  }
};

/**
 * Get severity icon
 */
const getSeverityIcon = (severity: string) => {
  if (severity === 'critical') return '🚨';
  if (severity === 'high') return '⚠️';
  if (severity === 'medium') return '⚡';
  return 'ℹ️';
};

/**
 * Toggle collapse
 */
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div
    class="validation-panel"
    :class="{
      'panel-collapsed': collapsed,
      'panel-has-errors': errors.length > 0,
      'panel-has-warnings': warnings.length > 0 && errors.length === 0,
    }"
  >
    <!-- Header -->
    <div class="panel-header" @click="toggleCollapse">
      <div class="flex items-center space-x-2">
        <!-- Status Icon -->
        <div v-if="errors.length > 0" class="text-lg">❌</div>
        <div v-else-if="warnings.length > 0" class="text-lg">⚠️</div>
        <div v-else class="text-lg">✅</div>

        <!-- Title -->
        <span class="text-sm font-semibold text-gray-700">
          Validation
        </span>

        <!-- Badge -->
        <span
          v-if="totalIssues > 0"
          class="badge"
          :class="{
            'badge-error': errors.length > 0,
            'badge-warning': warnings.length > 0 && errors.length === 0,
          }"
        >
          {{ totalIssues }}
        </span>
      </div>

      <!-- Collapse Button -->
      <button
        class="collapse-btn"
        :title="collapsed ? 'Expand panel' : 'Collapse panel'"
      >
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': collapsed }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div v-if="!collapsed" class="panel-content">
      <!-- No Issues State -->
      <div v-if="totalIssues === 0" class="no-issues">
        <div class="text-4xl mb-2">✨</div>
        <p class="text-sm text-gray-600 font-medium">All good!</p>
        <p class="text-xs text-gray-500">No validation issues</p>
      </div>

      <!-- Errors List -->
      <div v-if="errors.length > 0" class="issues-section">
        <div class="section-header">
          <span class="text-xs font-semibold text-red-700 uppercase">
            Errors ({{ errors.length }})
          </span>
        </div>
        <div class="issues-list">
          <div
            v-for="(error, index) in errors"
            :key="`error-${index}`"
            class="issue-item issue-error"
            @click="handleIssueClick(error)"
          >
            <div class="flex items-start space-x-2">
              <span class="text-base">{{ getSeverityIcon(error.severity) }}</span>
              <div class="flex-1">
                <p class="text-xs text-gray-800 font-medium">{{ error.message }}</p>
                <p v-if="error.field" class="text-xs text-gray-500 mt-0.5">
                  Field: <code class="bg-red-50 px-1 rounded">{{ error.field }}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warnings List -->
      <div v-if="warnings.length > 0" class="issues-section">
        <div class="section-header">
          <span class="text-xs font-semibold text-yellow-700 uppercase">
            Warnings ({{ warnings.length }})
          </span>
        </div>
        <div class="issues-list">
          <div
            v-for="(warning, index) in warnings"
            :key="`warning-${index}`"
            class="issue-item issue-warning"
            @click="handleIssueClick(warning)"
          >
            <div class="flex items-start space-x-2">
              <span class="text-base">{{ getSeverityIcon(warning.severity) }}</span>
              <div class="flex-1">
                <p class="text-xs text-gray-800 font-medium">{{ warning.message }}</p>
                <p v-if="warning.field" class="text-xs text-gray-500 mt-0.5">
                  Field: <code class="bg-yellow-50 px-1 rounded">{{ warning.field }}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.validation-panel {
  @apply fixed bottom-4 right-4 w-80 bg-white border-2 rounded-lg shadow-xl;
  @apply transition-all duration-300;
  @apply z-50;
}

.panel-collapsed {
  @apply w-auto;
}

.panel-has-errors {
  @apply border-red-400;
}

.panel-has-warnings {
  @apply border-yellow-400;
}

/* Header */
.panel-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
  @apply bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors;
}

.collapse-btn {
  @apply p-1 hover:bg-gray-200 rounded transition-colors;
}

/* Badge */
.badge {
  @apply px-2 py-0.5 rounded-full text-xs font-bold;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

/* Content */
.panel-content {
  @apply max-h-96 overflow-y-auto p-4 space-y-4;
}

/* No Issues */
.no-issues {
  @apply text-center py-6;
}

/* Issues Section */
.issues-section {
  @apply space-y-2;
}

.section-header {
  @apply pb-2 border-b border-gray-200;
}

/* Issues List */
.issues-list {
  @apply space-y-2;
}

.issue-item {
  @apply p-3 rounded-lg cursor-pointer;
  @apply transition-all duration-200;
  @apply hover:shadow-md;
}

.issue-error {
  @apply bg-red-50 border border-red-200 hover:bg-red-100;
}

.issue-warning {
  @apply bg-yellow-50 border border-yellow-200 hover:bg-yellow-100;
}
</style>
