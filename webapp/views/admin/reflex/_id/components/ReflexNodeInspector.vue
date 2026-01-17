<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Node } from '@vue-flow/core';

/**
 * Reflex Node Inspector Component
 *
 * Right sidebar for editing node properties
 * Features:
 * - Dynamic property form based on node type
 * - Analysis selectors
 * - Operator dropdowns
 * - Live preview
 */

interface Props {
  selectedNode: Node | null;
  analyses?: Array<{ uid: string; name: string }>;
  sampleTypes?: Array<{ uid: string; name: string }>;
}

interface Emits {
  (e: 'update:node', node: Node): void;
  (e: 'delete:node'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * Local node data (v-model for form)
 */
const localData = ref<any>({});

/**
 * Watch for selected node changes
 */
watch(
  () => props.selectedNode,
  (newNode) => {
    if (newNode) {
      localData.value = { ...newNode.data };
    } else {
      localData.value = {};
    }
  },
  { immediate: true, deep: true }
);

/**
 * Computed node type
 */
const nodeType = computed(() => props.selectedNode?.type || null);

/**
 * Operators for rule nodes
 */
const operators = [
  { value: '=', label: 'Equals (=)' },
  { value: '!=', label: 'Not Equals (≠)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '>=', label: 'Greater or Equal (≥)' },
  { value: '<=', label: 'Less or Equal (≤)' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not Contains' },
];

/**
 * Action types for action nodes
 */
const actionTypes = [
  { value: 'add', label: 'Add Test' },
  { value: 'finalize', label: 'Finalize Result' },
];

/**
 * Handle update
 */
const handleUpdate = () => {
  if (!props.selectedNode) return;

  const updatedNode: Node = {
    ...props.selectedNode,
    data: { ...localData.value },
  };

  emit('update:node', updatedNode);
};

/**
 * Handle delete
 */
const handleDelete = () => {
  emit('delete:node');
};
</script>

<template>
  <div class="node-inspector">
    <!-- Header -->
    <div class="inspector-header">
      <div class="flex items-center space-x-2">
        <div class="text-lg">🔍</div>
        <h3 class="text-sm font-semibold text-gray-700">Node Inspector</h3>
      </div>
    </div>

    <!-- No Selection State -->
    <div v-if="!selectedNode" class="inspector-empty">
      <div class="empty-content">
        <div class="text-4xl mb-3">👆</div>
        <p class="text-sm text-gray-600 text-center">
          Select a node on the canvas to edit its properties
        </p>
      </div>
    </div>

    <!-- Node Property Forms -->
    <div v-else class="inspector-content">
      <!-- Node Type Badge -->
      <div class="node-type-badge mb-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold"
          :class="{
            'bg-blue-100 text-blue-800': nodeType === 'trigger',
            'bg-purple-100 text-purple-800': nodeType === 'decision',
            'bg-amber-100 text-amber-800': nodeType === 'rule',
            'bg-green-100 text-green-800': nodeType === 'action' && localData.actionType === 'add',
            'bg-pink-100 text-pink-800': nodeType === 'action' && localData.actionType === 'finalize',
          }"
        >
          {{ nodeType?.toUpperCase() }} NODE
        </span>
      </div>

      <!-- Trigger Node Form -->
      <div v-if="nodeType === 'trigger'" class="form-section">
        <!-- Level -->
        <div class="form-group">
          <label class="form-label">Level</label>
          <input
            v-model.number="localData.level"
            type="number"
            min="1"
            class="form-input"
            @input="handleUpdate"
          />
          <p class="form-hint">Higher levels trigger after lower levels</p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea
            v-model="localData.description"
            rows="3"
            class="form-input"
            placeholder="Describe when this trigger should activate..."
            @input="handleUpdate"
          />
        </div>

        <!-- Sample Type -->
        <div class="form-group" v-if="sampleTypes">
          <label class="form-label">Sample Type</label>
          <select v-model="localData.sample_type_uid" class="form-input" @change="handleUpdate">
            <option :value="null">Any sample type</option>
            <option v-for="type in sampleTypes" :key="type.uid" :value="type.uid">
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Analyses (Multi-select) -->
        <div class="form-group" v-if="analyses">
          <label class="form-label">Monitored Tests *</label>
          <div class="analyses-list">
            <div
              v-for="analysis in analyses"
              :key="analysis.uid"
              class="analysis-checkbox"
            >
              <input
                type="checkbox"
                :id="analysis.uid"
                :value="analysis"
                v-model="localData.analyses"
                @change="handleUpdate"
                class="mr-2"
              />
              <label :for="analysis.uid" class="text-sm text-gray-700 cursor-pointer">
                {{ analysis.name }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Decision Node Form -->
      <div v-if="nodeType === 'decision'" class="form-section">
        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            v-model="localData.description"
            rows="3"
            class="form-input"
            placeholder="Describe this decision logic..."
            @input="handleUpdate"
          />
        </div>

        <!-- Priority -->
        <div class="form-group">
          <label class="form-label">Priority</label>
          <input
            v-model.number="localData.priority"
            type="number"
            min="0"
            class="form-input"
            @input="handleUpdate"
          />
          <p class="form-hint">Lower numbers execute first</p>
        </div>

        <!-- Info -->
        <div class="info-box">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-xs text-gray-700">
            <strong>Connect Rules and Actions:</strong> Rules define conditions (IF), Actions define outcomes (THEN)
          </div>
        </div>
      </div>

      <!-- Rule Node Form -->
      <div v-if="nodeType === 'rule'" class="form-section">
        <!-- Analysis Selection -->
        <div class="form-group" v-if="analyses">
          <label class="form-label">Test *</label>
          <select v-model="localData.analysis_uid" class="form-input" @change="handleUpdate">
            <option :value="null">Select a test...</option>
            <option v-for="analysis in analyses" :key="analysis.uid" :value="analysis.uid">
              {{ analysis.name }}
            </option>
          </select>
        </div>

        <!-- Operator -->
        <div class="form-group">
          <label class="form-label">Operator *</label>
          <select v-model="localData.operator" class="form-input" @change="handleUpdate">
            <option :value="null">Select operator...</option>
            <option v-for="op in operators" :key="op.value" :value="op.value">
              {{ op.label }}
            </option>
          </select>
        </div>

        <!-- Value -->
        <div class="form-group">
          <label class="form-label">Expected Value *</label>
          <input
            v-model="localData.value"
            type="text"
            class="form-input"
            placeholder="e.g. Positive, 200, >500..."
            @input="handleUpdate"
          />
          <p class="form-hint">Enter the value to compare against</p>
        </div>

        <!-- Priority -->
        <div class="form-group">
          <label class="form-label">Priority</label>
          <input
            v-model.number="localData.priority"
            type="number"
            min="0"
            class="form-input"
            @input="handleUpdate"
          />
        </div>

        <!-- Preview -->
        <div class="info-box bg-amber-50 border-amber-200">
          <div class="text-xs text-amber-900 font-mono">
            <strong>Rule:</strong>
            {{ localData.analysis?.name || 'Test' }}
            {{ localData.operator || '?' }}
            {{ localData.value || '?' }}
          </div>
        </div>
      </div>

      <!-- Action Node Form -->
      <div v-if="nodeType === 'action'" class="form-section">
        <!-- Action Type -->
        <div class="form-group">
          <label class="form-label">Action Type *</label>
          <select v-model="localData.actionType" class="form-input" @change="handleUpdate">
            <option :value="null">Select action type...</option>
            <option v-for="type in actionTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Analysis Selection -->
        <div class="form-group" v-if="analyses">
          <label class="form-label">Test *</label>
          <select v-model="localData.analysis_uid" class="form-input" @change="handleUpdate">
            <option :value="null">Select a test...</option>
            <option v-for="analysis in analyses" :key="analysis.uid" :value="analysis.uid">
              {{ analysis.name }}
            </option>
          </select>
        </div>

        <!-- Count (for Add actions) -->
        <div v-if="localData.actionType === 'add'" class="form-group">
          <label class="form-label">Count *</label>
          <input
            v-model.number="localData.count"
            type="number"
            min="1"
            class="form-input"
            @input="handleUpdate"
          />
          <p class="form-hint">Number of tests to add</p>
        </div>

        <!-- Value (for Finalize actions) -->
        <div v-if="localData.actionType === 'finalize'" class="form-group">
          <label class="form-label">Result Value *</label>
          <input
            v-model="localData.value"
            type="text"
            class="form-input"
            placeholder="e.g. Positive, Negative, 450..."
            @input="handleUpdate"
          />
          <p class="form-hint">The final result value to set</p>
        </div>
      </div>

      <!-- Delete Button -->
      <div class="inspector-footer">
        <button @click="handleDelete" class="btn-delete">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-inspector {
  @apply w-80 bg-white border-l border-gray-200 shadow-sm;
  @apply flex flex-col h-full overflow-hidden;
}

/* Header */
.inspector-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200;
  @apply bg-gray-50;
}

/* Empty State */
.inspector-empty {
  @apply flex-1 flex items-center justify-center p-6;
}

.empty-content {
  @apply text-center;
}

/* Content */
.inspector-content {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

/* Form Elements */
.form-section {
  @apply space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply text-sm;
}

.form-hint {
  @apply text-xs text-gray-500 italic;
}

/* Analyses List */
.analyses-list {
  @apply max-h-48 overflow-y-auto space-y-2 p-2 border border-gray-200 rounded-lg;
}

.analysis-checkbox {
  @apply flex items-center;
}

/* Info Box */
.info-box {
  @apply flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg;
}

/* Footer */
.inspector-footer {
  @apply mt-6 pt-4 border-t border-gray-200;
}

.btn-delete {
  @apply w-full flex items-center justify-center space-x-2;
  @apply px-4 py-2 bg-red-50 text-red-700 border border-red-300 rounded-lg;
  @apply hover:bg-red-100 hover:border-red-400;
  @apply transition-colors duration-200;
  @apply text-sm font-medium;
}

/* Node Type Badge */
.node-type-badge {
  @apply flex justify-center;
}
</style>
