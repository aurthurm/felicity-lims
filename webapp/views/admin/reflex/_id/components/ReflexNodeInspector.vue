<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Node } from '@vue-flow/core';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

/**
 * Reflex Node Inspector Component
 *
 * Right sidebar for editing node properties
 * Features:
 * - Dynamic property form based on node type
 * - Analysis selectors with multiselect
 * - Operator dropdowns
 * - Live preview
 * - Filtered analyses for downstream nodes
 */

interface Analysis {
  uid: string;
  name: string;
  keyword?: string;
}

interface SampleType {
  uid: string;
  name: string;
  abbr?: string;
}

interface Props {
  selectedNode: Node | null;
  allAnalyses?: Array<Analysis>; // All analyses (for trigger node)
  availableAnalyses?: Array<Analysis>; // Filtered analyses (for downstream nodes)
  sampleTypes?: Array<SampleType>;
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
 * Selected analyses for trigger node (computed for v-model)
 */
const selectedAnalyses = computed({
  get: () => {
    if (!localData.value.analyses || !props.allAnalyses) return [];

    // localData.analyses may be array of UIDs or array of { uid, name }
    const uids = localData.value.analyses.map((a: string | { uid: string }) => typeof a === 'string' ? a : a.uid);
    return props.allAnalyses.filter((a) => uids.includes(a.uid));
  },
  set: (selected: Analysis[]) => {
    localData.value.analyses = selected.map((a) => ({ uid: a.uid, name: a.name }));
    handleUpdate();
  },
});

/**
 * Selected analysis for rule/action nodes (computed for v-model)
 */
const selectedAnalysis = computed({
  get: () => {
    if (!localData.value.analysis_uid) return null;

    const analyses = nodeType.value === 'trigger' ? props.allAnalyses : props.availableAnalyses;
    return analyses?.find((a) => a.uid === localData.value.analysis_uid) || null;
  },
  set: (selected: Analysis | null) => {
    localData.value.analysis_uid = selected?.uid || null;
    localData.value.analysis = selected ? { uid: selected.uid, name: selected.name } : undefined;
    handleUpdate();
  },
});

/**
 * Selected sample type (computed for v-model)
 */
const selectedSampleType = computed({
  get: () => {
    if (!localData.value.sample_type_uid || !props.sampleTypes) return null;
    return props.sampleTypes.find((st) => st.uid === localData.value.sample_type_uid) || null;
  },
  set: (selected: SampleType | null) => {
    localData.value.sample_type_uid = selected?.uid || null;
    handleUpdate();
  },
});

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
        <h3 class="text-sm font-semibold text-foreground">Node Inspector</h3>
      </div>
    </div>

    <!-- No Selection State -->
    <Empty v-if="!selectedNode" class="inspector-empty">
      <EmptyContent>
        <EmptyMedia variant="icon">
          <span class="text-2xl">👆</span>
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No node selected</EmptyTitle>
          <EmptyDescription>
            Select a node on the canvas to edit its properties.
          </EmptyDescription>
        </EmptyHeader>
      </EmptyContent>
    </Empty>

    <!-- Node Property Forms -->
    <div v-else class="inspector-content">
      <!-- Node Type Badge -->
      <div class="node-type-badge mb-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold"
          :class="{
            'bg-primary/15 text-primary': nodeType === 'trigger',
            'bg-accent/15 text-accent': nodeType === 'decision',
            'bg-amber-100 text-amber-800': nodeType === 'rule',
            'bg-success/15 text-success': nodeType === 'action' && localData.actionType === 'add',
            'bg-accent/15 text-accent': nodeType === 'action' && localData.actionType === 'finalize',
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
          <Multiselect
            v-model="selectedSampleType"
            :options="sampleTypes"
            label="name"
            track-by="uid"
            placeholder="Select sample type (optional)"
            :searchable="true"
            :allow-empty="true"
            :show-labels="false"
          >
            <template #noResult>No sample types found</template>
            <template #noOptions>No sample types available</template>
          </Multiselect>
          <p class="form-hint">Leave empty to apply to all sample types</p>
        </div>

        <!-- Analyses (Multi-select) -->
        <div class="form-group" v-if="allAnalyses">
          <label class="form-label">Monitored Tests *</label>
          <Multiselect
            v-model="selectedAnalyses"
            :options="allAnalyses"
            label="name"
            track-by="uid"
            placeholder="Select tests to monitor"
            :multiple="true"
            :searchable="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :show-labels="false"
          >
            <template #noResult>No tests found</template>
            <template #noOptions>No tests available</template>
          </Multiselect>
          <p class="form-hint">
            Selected tests will be available in downstream nodes
          </p>
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
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-xs text-foreground">
            <strong>Connect Rules and Actions:</strong> Rules define conditions (IF), Actions define outcomes (THEN)
          </div>
        </div>
      </div>

      <!-- Rule Node Form -->
      <div v-if="nodeType === 'rule'" class="form-section">
        <!-- Analysis Selection -->
        <div class="form-group" v-if="availableAnalyses">
          <label class="form-label">Test *</label>
          <Multiselect
            v-model="selectedAnalysis"
            :options="availableAnalyses"
            label="name"
            track-by="uid"
            placeholder="Select test from trigger"
            :searchable="true"
            :allow-empty="false"
            :show-labels="false"
          >
            <template #noResult>No tests found</template>
            <template #noOptions>No tests selected in trigger node</template>
          </Multiselect>
          <p class="form-hint">Only tests from trigger are available</p>
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
        <div class="form-group" v-if="availableAnalyses">
          <label class="form-label">Test *</label>
          <Multiselect
            v-model="selectedAnalysis"
            :options="availableAnalyses"
            label="name"
            track-by="uid"
            placeholder="Select test from trigger"
            :searchable="true"
            :allow-empty="false"
            :show-labels="false"
          >
            <template #noResult>No tests found</template>
            <template #noOptions>No tests selected in trigger node</template>
          </Multiselect>
          <p class="form-hint">Only tests from trigger are available</p>
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
@import "tailwindcss";
.node-inspector {
  @apply w-80 flex flex-col h-full overflow-hidden shadow-sm;
  background-color: var(--card);
  border-left: 1px solid var(--border);
}

/* Header */
.inspector-header {
  @apply flex items-center justify-between px-4 py-3;
  border-bottom: 1px solid var(--border);
  background-color: var(--muted);
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
  @apply block text-sm font-medium;
  color: var(--foreground);
}

.form-input {
  @apply w-full px-3 py-2 rounded-lg text-sm focus:outline-none;
  border: 1px solid var(--input);
}
.form-input:focus {
  box-shadow: 0 0 0 2px var(--ring);
  border-color: var(--primary);
}

.form-hint {
  @apply text-xs italic;
  color: var(--muted-foreground);
}

/* Analyses List */
.analyses-list {
  @apply max-h-48 overflow-y-auto space-y-2 p-2 rounded-lg;
  border: 1px solid var(--border);
}

.analysis-checkbox {
  @apply flex items-center;
}

/* Info Box */
.info-box {
  @apply flex items-start space-x-2 p-3 rounded-lg;
  background-color: color-mix(in oklch, var(--primary), transparent 90%);
  border: 1px solid color-mix(in oklch, var(--primary), transparent 70%);
}

/* Footer */
.inspector-footer {
  @apply mt-6 pt-4;
  border-top: 1px solid var(--border);
}

.btn-delete {
  @apply w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium;
  background-color: color-mix(in oklch, var(--destructive), transparent 90%);
  color: var(--destructive);
  border: 1px solid color-mix(in oklch, var(--destructive), transparent 60%);
}
.btn-delete:hover {
  background-color: color-mix(in oklch, var(--destructive), transparent 85%);
  border-color: color-mix(in oklch, var(--destructive), transparent 50%);
}

/* Node Type Badge */
.node-type-badge {
  @apply flex justify-center;
}
</style>
