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
        <span class="text-sm font-semibold text-foreground">
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
        <p class="text-sm text-muted-foreground font-medium">All good!</p>
        <p class="text-xs text-muted-foreground">No validation issues</p>
      </div>

      <!-- Errors List -->
      <div v-if="errors.length > 0" class="issues-section">
        <div class="section-header">
          <span class="text-xs font-semibold text-destructive uppercase">
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
                <p class="text-xs text-foreground font-medium">{{ error.message }}</p>
                <p v-if="error.field" class="text-xs text-muted-foreground mt-0.5">
                  Field: <code class="bg-destructive/10 px-1 rounded">{{ error.field }}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warnings List -->
      <div v-if="warnings.length > 0" class="issues-section">
        <div class="section-header">
          <span class="text-xs font-semibold text-warning uppercase">
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
                <p class="text-xs text-foreground font-medium">{{ warning.message }}</p>
                <p v-if="warning.field" class="text-xs text-muted-foreground mt-0.5">
                  Field: <code class="bg-warning/10 px-1 rounded">{{ warning.field }}</code>
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
  @apply fixed bottom-4 right-4 w-80 border-2 rounded-lg shadow-xl transition-all duration-300 z-50;
  background-color: var(--card);
}

.panel-collapsed {
  @apply w-auto;
}

.panel-has-errors {
  border-color: color-mix(in oklch, var(--destructive), transparent 50%);
}

.panel-has-warnings {
  border-color: color-mix(in oklch, var(--chart-4), transparent 60%);
}

/* Header */
.panel-header {
  @apply flex items-center justify-between px-4 py-3 cursor-pointer transition-colors;
  border-bottom: 1px solid var(--border);
  background-color: var(--muted);
}
.panel-header:hover {
  background-color: var(--muted);
}

.collapse-btn {
  @apply p-1 rounded transition-colors;
}
.collapse-btn:hover {
  background-color: var(--muted);
}

/* Badge */
.badge {
  @apply px-2 py-0.5 rounded-full text-xs font-bold;
}

.badge-error {
  background-color: color-mix(in oklch, var(--destructive), transparent 85%);
  color: var(--destructive);
}

.badge-warning {
  background-color: color-mix(in oklch, var(--chart-4), transparent 85%);
  color: var(--chart-4);
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
  @apply pb-2;
  border-bottom: 1px solid var(--border);
}

/* Issues List */
.issues-list {
  @apply space-y-2;
}

.issue-item {
  @apply p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md;
}

.issue-error {
  background-color: color-mix(in oklch, var(--destructive), transparent 90%);
  border: 1px solid color-mix(in oklch, var(--destructive), transparent 60%);
}
.issue-error:hover {
  background-color: color-mix(in oklch, var(--destructive), transparent 85%);
}

.issue-warning {
  background-color: color-mix(in oklch, var(--chart-4), transparent 90%);
  border: 1px solid color-mix(in oklch, var(--chart-4), transparent 60%);
}
.issue-warning:hover {
  background-color: color-mix(in oklch, var(--chart-4), transparent 85%);
}
</style>
