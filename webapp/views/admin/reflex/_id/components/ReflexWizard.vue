<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Node, Edge } from '@vue-flow/core';

/**
 * Reflex Wizard Component
 *
 * Template-based rule creation wizard
 * Features:
 * - Three templates (Simple Positive, Value Range, Multiple Conditions)
 * - Step-by-step wizard
 * - Preview of generated graph
 * - Auto-layout nodes
 */

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Emits {
  (e: 'create', data: { nodes: Node[]; edges: Edge[] }): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

/**
 * Available templates
 */
const templates: Template[] = [
  {
    id: 'simple-positive',
    name: 'Simple Positive Result Action',
    description: 'Automatically add a test when a result is positive',
    icon: '✅',
    steps: ['Select trigger test', 'Confirm positive value', 'Select test to add'],
    difficulty: 'easy',
  },
  {
    id: 'value-range',
    name: 'Value Range Check',
    description: 'Trigger action when a result is above or below a threshold',
    icon: '📊',
    steps: ['Select trigger test', 'Set threshold value', 'Select action'],
    difficulty: 'medium',
  },
  {
    id: 'multiple-conditions',
    name: 'Multiple Conditions (AND)',
    description: 'Trigger action only when multiple conditions are met',
    icon: '🔗',
    steps: ['Select trigger tests', 'Set criteria for each', 'Select action'],
    difficulty: 'hard',
  },
];

/**
 * Wizard state
 */
const isOpen = ref(true);
const currentStep = ref<'template' | 'config' | 'preview'>('template');
const selectedTemplate = ref<Template | null>(null);

/**
 * Configuration data
 */
const config = ref<{
  triggerAnalysis?: string;
  triggerValue?: string;
  operator?: string;
  actionType?: 'add' | 'finalize';
  actionAnalysis?: string;
  actionCount?: number;
  actionValue?: string;
  multipleAnalyses?: string[];
  multipleCriteria?: Array<{ analysis: string; operator: string; value: string }>;
}>({});

/**
 * Select template
 */
const selectTemplate = (template: Template) => {
  selectedTemplate.value = template;
  currentStep.value = 'config';
  config.value = {}; // Reset config
};

/**
 * Go to preview
 */
const goToPreview = () => {
  currentStep.value = 'preview';
};

/**
 * Go back
 */
const goBack = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'config';
  } else if (currentStep.value === 'config') {
    currentStep.value = 'template';
    selectedTemplate.value = null;
  }
};

/**
 * Generate graph from template
 */
const generateGraph = (): { nodes: Node[]; edges: Edge[] } => {
  if (!selectedTemplate.value) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (selectedTemplate.value.id === 'simple-positive') {
    // Trigger Node
    nodes.push({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 200 },
      data: {
        level: 1,
        description: 'Monitor positive result',
        analyses: config.value.triggerAnalysis ? [{ uid: config.value.triggerAnalysis, name: 'Selected Test' }] : [],
      },
    });

    // Decision Node
    nodes.push({
      id: 'decision-1',
      type: 'decision',
      position: { x: 400, y: 200 },
      data: {
        description: 'Check if positive',
        priority: 0,
      },
    });

    // Rule Node
    nodes.push({
      id: 'rule-1',
      type: 'rule',
      position: { x: 700, y: 150 },
      data: {
        analysis_uid: config.value.triggerAnalysis,
        operator: '=',
        value: 'Positive',
      },
    });

    // Action Node
    nodes.push({
      id: 'action-1',
      type: 'action',
      position: { x: 1000, y: 200 },
      data: {
        actionType: 'add',
        analysis_uid: config.value.actionAnalysis,
        count: config.value.actionCount || 1,
      },
    });

    // Edges
    edges.push(
      { id: 'e-trigger-decision', source: 'trigger-1', target: 'decision-1', animated: true },
      { id: 'e-decision-rule', source: 'decision-1', target: 'rule-1', animated: true },
      { id: 'e-rule-action', source: 'rule-1', target: 'action-1', animated: true }
    );
  } else if (selectedTemplate.value.id === 'value-range') {
    // Trigger Node
    nodes.push({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 200 },
      data: {
        level: 1,
        description: 'Monitor test value',
        analyses: config.value.triggerAnalysis ? [{ uid: config.value.triggerAnalysis, name: 'Selected Test' }] : [],
      },
    });

    // Decision Node
    nodes.push({
      id: 'decision-1',
      type: 'decision',
      position: { x: 400, y: 200 },
      data: {
        description: `Check if ${config.value.operator || '>'} ${config.value.triggerValue || '?'}`,
        priority: 0,
      },
    });

    // Rule Node
    nodes.push({
      id: 'rule-1',
      type: 'rule',
      position: { x: 700, y: 150 },
      data: {
        analysis_uid: config.value.triggerAnalysis,
        operator: config.value.operator || '>',
        value: config.value.triggerValue || '0',
      },
    });

    // Action Node
    nodes.push({
      id: 'action-1',
      type: 'action',
      position: { x: 1000, y: 200 },
      data: {
        actionType: config.value.actionType || 'add',
        analysis_uid: config.value.actionAnalysis,
        count: config.value.actionCount,
        value: config.value.actionValue,
      },
    });

    // Edges
    edges.push(
      { id: 'e-trigger-decision', source: 'trigger-1', target: 'decision-1', animated: true },
      { id: 'e-decision-rule', source: 'decision-1', target: 'rule-1', animated: true },
      { id: 'e-rule-action', source: 'rule-1', target: 'action-1', animated: true }
    );
  } else if (selectedTemplate.value.id === 'multiple-conditions') {
    // Trigger Node
    nodes.push({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 300 },
      data: {
        level: 1,
        description: 'Monitor multiple tests',
        analyses: config.value.multipleAnalyses?.map((uid) => ({ uid, name: 'Test' })) || [],
      },
    });

    // Decision Node
    nodes.push({
      id: 'decision-1',
      type: 'decision',
      position: { x: 400, y: 300 },
      data: {
        description: 'Check all conditions',
        priority: 0,
      },
    });

    // Rule Nodes (AND chain)
    const criteria = config.value.multipleCriteria || [];
    criteria.forEach((criterion, index) => {
      nodes.push({
        id: `rule-${index + 1}`,
        type: 'rule',
        position: { x: 700, y: 200 + index * 100 },
        data: {
          analysis_uid: criterion.analysis,
          operator: criterion.operator,
          value: criterion.value,
          connector: index < criteria.length - 1 ? 'AND' : undefined,
        },
      });
    });

    // Action Node
    nodes.push({
      id: 'action-1',
      type: 'action',
      position: { x: 1000, y: 300 },
      data: {
        actionType: config.value.actionType || 'add',
        analysis_uid: config.value.actionAnalysis,
        count: config.value.actionCount,
        value: config.value.actionValue,
      },
    });

    // Edges
    edges.push({ id: 'e-trigger-decision', source: 'trigger-1', target: 'decision-1', animated: true });

    if (criteria.length > 0) {
      edges.push({ id: 'e-decision-rule1', source: 'decision-1', target: 'rule-1', animated: true });

      // Chain rules with AND
      for (let i = 0; i < criteria.length - 1; i++) {
        edges.push({
          id: `e-rule${i + 1}-rule${i + 2}`,
          source: `rule-${i + 1}`,
          target: `rule-${i + 2}`,
          animated: true,
        });
      }

      edges.push({
        id: `e-rule${criteria.length}-action`,
        source: `rule-${criteria.length}`,
        target: 'action-1',
        animated: true,
      });
    }
  }

  return { nodes, edges };
};

/**
 * Create from template
 */
const createFromTemplate = () => {
  const graph = generateGraph();
  emit('create', graph);
  handleClose();
};

/**
 * Close wizard
 */
const handleClose = () => {
  isOpen.value = false;
  emit('close');
};

/**
 * Preview graph
 */
const previewGraph = computed(() => generateGraph());
</script>

<template>
  <div v-if="isOpen" class="wizard-overlay" @click.self="handleClose">
    <div class="wizard-modal">
      <!-- Header -->
      <div class="wizard-header">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Reflex Rule Wizard</h2>
          <p class="text-sm text-gray-600">Create a rule from a template</p>
        </div>
        <button @click="handleClose" class="close-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Step 1: Template Selection -->
      <div v-if="currentStep === 'template'" class="wizard-content">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Choose a Template</h3>
          <p class="text-sm text-gray-600">Select a template that matches your needs</p>
        </div>

        <div class="template-grid">
          <div
            v-for="template in templates"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template)"
          >
            <div class="template-icon">{{ template.icon }}</div>
            <h4 class="template-name">{{ template.name }}</h4>
            <p class="template-description">{{ template.description }}</p>
            <div class="template-footer">
              <span class="template-difficulty" :class="{
                'badge-easy': template.difficulty === 'easy',
                'badge-medium': template.difficulty === 'medium',
                'badge-hard': template.difficulty === 'hard',
              }">
                {{ template.difficulty }}
              </span>
              <span class="text-xs text-gray-500">{{ template.steps.length }} steps</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configuration -->
      <div v-if="currentStep === 'config' && selectedTemplate" class="wizard-content">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ selectedTemplate.name }}</h3>
          <p class="text-sm text-gray-600">Configure your rule</p>
        </div>

        <div class="config-form">
          <!-- Simple Positive Template Config -->
          <div v-if="selectedTemplate.id === 'simple-positive'" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Trigger Test</label>
              <input v-model="config.triggerAnalysis" class="form-input" placeholder="Select test to monitor" />
            </div>
            <div class="form-group">
              <label class="form-label">Test to Add on Positive Result</label>
              <input v-model="config.actionAnalysis" class="form-input" placeholder="Select test to add" />
            </div>
            <div class="form-group">
              <label class="form-label">Count</label>
              <input v-model.number="config.actionCount" type="number" min="1" class="form-input" placeholder="1" />
            </div>
          </div>

          <!-- Value Range Template Config -->
          <div v-if="selectedTemplate.id === 'value-range'" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Trigger Test</label>
              <input v-model="config.triggerAnalysis" class="form-input" placeholder="Select test to monitor" />
            </div>
            <div class="form-group">
              <label class="form-label">Operator</label>
              <select v-model="config.operator" class="form-input">
                <option value=">">Greater than (&gt;)</option>
                <option value="<">Less than (&lt;)</option>
                <option value=">=">Greater or equal (≥)</option>
                <option value="<=">Less or equal (≤)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Threshold Value</label>
              <input v-model="config.triggerValue" class="form-input" placeholder="e.g. 200" />
            </div>
            <div class="form-group">
              <label class="form-label">Action Type</label>
              <select v-model="config.actionType" class="form-input">
                <option value="add">Add Test</option>
                <option value="finalize">Finalize Result</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Test</label>
              <input v-model="config.actionAnalysis" class="form-input" placeholder="Select test" />
            </div>
          </div>

          <!-- Multiple Conditions Template Config -->
          <div v-if="selectedTemplate.id === 'multiple-conditions'" class="space-y-4">
            <p class="text-sm text-gray-600 italic">Configure multiple AND conditions</p>
            <div class="text-center py-8 text-gray-500">
              <p>Multi-criteria configuration coming soon...</p>
              <p class="text-xs mt-2">For now, use the canvas to create complex rules</p>
            </div>
          </div>
        </div>

        <div class="wizard-actions">
          <button @click="goBack" class="btn-secondary">Back</button>
          <button @click="goToPreview" class="btn-primary">Preview</button>
        </div>
      </div>

      <!-- Step 3: Preview -->
      <div v-if="currentStep === 'preview'" class="wizard-content">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Preview</h3>
          <p class="text-sm text-gray-600">Review your rule before creating</p>
        </div>

        <div class="preview-box">
          <div class="text-sm text-gray-600 mb-2">
            <strong>Nodes:</strong> {{ previewGraph.nodes.length }} |
            <strong>Connections:</strong> {{ previewGraph.edges.length }}
          </div>
          <div class="preview-placeholder">
            <div class="text-4xl mb-2">📊</div>
            <p class="text-sm text-gray-600">
              Your rule will be created with {{ previewGraph.nodes.length }} nodes
            </p>
          </div>
        </div>

        <div class="wizard-actions">
          <button @click="goBack" class="btn-secondary">Back</button>
          <button @click="createFromTemplate" class="btn-success">Create Rule</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wizard-overlay {
  @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
  @apply backdrop-blur-sm;
}

.wizard-modal {
  @apply bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden;
  @apply flex flex-col;
}

/* Header */
.wizard-header {
  @apply flex items-start justify-between px-6 py-4 border-b border-gray-200;
}

.close-btn {
  @apply p-1 hover:bg-gray-100 rounded-lg transition-colors;
}

/* Content */
.wizard-content {
  @apply flex-1 overflow-y-auto px-6 py-6;
}

/* Template Grid */
.template-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.template-card {
  @apply p-6 border-2 border-gray-200 rounded-lg cursor-pointer;
  @apply hover:border-blue-400 hover:shadow-lg transition-all;
}

.template-icon {
  @apply text-4xl mb-3 text-center;
}

.template-name {
  @apply text-sm font-semibold text-gray-800 mb-2;
}

.template-description {
  @apply text-xs text-gray-600 mb-4;
}

.template-footer {
  @apply flex items-center justify-between pt-3 border-t border-gray-100;
}

.template-difficulty {
  @apply px-2 py-0.5 rounded text-xs font-medium;
}

.badge-easy {
  @apply bg-green-100 text-green-800;
}

.badge-medium {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-hard {
  @apply bg-red-100 text-red-800;
}

/* Config Form */
.config-form {
  @apply max-w-2xl mx-auto;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Preview */
.preview-box {
  @apply p-6 bg-gray-50 border border-gray-200 rounded-lg;
}

.preview-placeholder {
  @apply py-12 text-center;
}

/* Actions */
.wizard-actions {
  @apply flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200;
}

.btn-primary {
  @apply px-6 py-2 bg-blue-600 text-white rounded-lg font-medium;
  @apply hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium;
  @apply hover:bg-gray-50 transition-colors;
}

.btn-success {
  @apply px-6 py-2 bg-green-600 text-white rounded-lg font-medium;
  @apply hover:bg-green-700 transition-colors;
}
</style>
