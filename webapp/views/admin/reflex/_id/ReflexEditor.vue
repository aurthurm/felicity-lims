<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Node, Edge } from '@vue-flow/core';

// Import components
import ReflexCanvas from './components/ReflexCanvas.vue';
import ReflexNodePalette from './components/ReflexNodePalette.vue';
import ReflexNodeInspector from './components/ReflexNodeInspector.vue';
import ReflexValidationPanel from './components/ReflexValidationPanel.vue';
import ReflexHistoryControls from './components/ReflexHistoryControls.vue';
import ReflexDraftManager from './components/ReflexDraftManager.vue';
import ReflexWizard from './components/ReflexWizard.vue';

// Import composables
import { useReflexHistory, useReflexHistoryKeyboard } from '../../../../composables/useReflexHistory';
import { useReflexDraft } from '../../../../composables/useReflexDraft';
import { useReflexValidation } from '../../../../composables/useReflexValidation';

// Import store (will be updated in Phase 5)
// import { useReflexStore } from '../../../../stores/reflex';

/**
 * Main Reflex Editor Component
 *
 * Integrates all components and composables
 * Features:
 * - Three-column layout (Palette | Canvas | Inspector)
 * - Undo/Redo with keyboard shortcuts
 * - Auto-save drafts every 30 seconds
 * - Real-time validation
 * - Template wizard
 * - Save to backend via GraphQL
 */

const route = useRoute();

/**
 * Get rule UID from route
 */
const ruleUid = computed(() => route.params.id as string);

/**
 * State
 */
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const selectedNode = ref<Node | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const showWizard = ref(false);

/**
 * Mock data for testing (will be replaced with GraphQL queries in Phase 5)
 */
const analyses = ref([
  { uid: 'analysis-1', name: 'HIV Rapid Test' },
  { uid: 'analysis-2', name: 'CD4 Count' },
  { uid: 'analysis-3', name: 'Viral Load' },
  { uid: 'analysis-4', name: 'TB Test' },
]);

const sampleTypes = ref([
  { uid: 'sample-type-1', name: 'Blood' },
  { uid: 'sample-type-2', name: 'Serum' },
  { uid: 'sample-type-3', name: 'Plasma' },
]);

/**
 * History composable (Undo/Redo)
 */
const {
  canUndo,
  canRedo,
  historySize,
  pushState,
  undo,
  redo,
  clearHistory,
  initializeHistory,
} = useReflexHistory();

/**
 * Draft composable (Auto-save)
 */
const {
  lastSaved,
  isSaving: isDraftSaving,
  saveDraftLocal,
  loadDraft,
  hasDraft,
  clearDraft,
  startAutoSave,
  setupUnloadHandler,
} = useReflexDraft(ruleUid.value);

/**
 * Validation composable
 */
const {
  errors,
  warnings,
  isValidating,
  isValid,
  validate,
  validateImmediate,
  getNodeIssues,
  clearValidation,
} = useReflexValidation();

/**
 * Canvas ref
 */
const canvasRef = ref<InstanceType<typeof ReflexCanvas> | null>(null);

/**
 * Handle undo
 */
const handleUndo = () => {
  const previousState = undo();
  if (previousState) {
    nodes.value = previousState.nodes;
    edges.value = previousState.edges;

    // Re-validate
    const validatedNodes = validateImmediate(nodes.value, edges.value);
    nodes.value = validatedNodes;
  }
};

/**
 * Handle redo
 */
const handleRedo = () => {
  const nextState = redo();
  if (nextState) {
    nodes.value = nextState.nodes;
    edges.value = nextState.edges;

    // Re-validate
    const validatedNodes = validateImmediate(nodes.value, edges.value);
    nodes.value = validatedNodes;
  }
};

/**
 * Setup keyboard shortcuts
 */
useReflexHistoryKeyboard(handleUndo, handleRedo);

/**
 * Handle graph changes (nodes or edges)
 */
const handleGraphChange = () => {
  // Push to history
  pushState({
    nodes: nodes.value,
    edges: edges.value,
    timestamp: Date.now(),
  });

  // Save draft
  saveDraftLocal(nodes.value, edges.value);

  // Validate
  const validatedNodes = validate(nodes.value, edges.value);
  if (validatedNodes) {
    nodes.value = validatedNodes;
  }
};

/**
 * Handle node click
 */
const handleNodeClick = (node: Node) => {
  selectedNode.value = node;

  // Deselect all nodes
  nodes.value = nodes.value.map((n) => ({ ...n, selected: n.id === node.id }));
};

/**
 * Handle pane click (deselect all)
 */
const handlePaneClick = () => {
  selectedNode.value = null;
  nodes.value = nodes.value.map((n) => ({ ...n, selected: false }));
};

/**
 * Handle node update from inspector
 */
const handleNodeUpdate = (updatedNode: Node) => {
  nodes.value = nodes.value.map((n) =>
    n.id === updatedNode.id ? updatedNode : n
  );
  selectedNode.value = updatedNode;
  handleGraphChange();
};

/**
 * Handle node delete from inspector
 */
const handleNodeDelete = () => {
  if (!selectedNode.value) return;

  const nodeId = selectedNode.value.id;

  // Remove node
  nodes.value = nodes.value.filter((n) => n.id !== nodeId);

  // Remove connected edges
  edges.value = edges.value.filter(
    (e) => e.source !== nodeId && e.target !== nodeId
  );

  selectedNode.value = null;
  handleGraphChange();
};

/**
 * Handle add node from palette
 */
const handleAddNode = (nodeType: string) => {
  const newNode: Node = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    position: { x: 300, y: 200 }, // Center position
    data: getDefaultNodeData(nodeType),
  };

  nodes.value = [...nodes.value, newNode];
  handleGraphChange();

  // Fit view to show new node
  setTimeout(() => {
    canvasRef.value?.fitViewToNodes();
  }, 100);
};

/**
 * Get default data for node type
 */
const getDefaultNodeData = (nodeType: string): any => {
  switch (nodeType) {
    case 'trigger':
      return {
        level: 1,
        description: 'New trigger',
        analyses: [],
      };
    case 'decision':
      return {
        description: 'New decision',
        priority: 0,
      };
    case 'rule':
      return {
        analysis_uid: null,
        operator: '=',
        value: '',
      };
    case 'action':
      return {
        actionType: 'add',
        analysis_uid: null,
        count: 1,
      };
    default:
      return {};
  }
};

/**
 * Handle validation issue click (highlight node)
 */
const handleHighlightNode = (nodeId: string) => {
  const node = nodes.value.find((n) => n.id === nodeId);
  if (node) {
    handleNodeClick(node);

    // Optionally center the node in view
    // canvasRef.value?.setViewport(...);
  }
};

/**
 * Handle wizard create
 */
const handleWizardCreate = (data: { nodes: Node[]; edges: Edge[] }) => {
  nodes.value = data.nodes;
  edges.value = data.edges;

  // Initialize history with wizard result
  initializeHistory({
    nodes: data.nodes,
    edges: data.edges,
    timestamp: Date.now(),
  });

  handleGraphChange();
  showWizard.value = false;
};

/**
 * Handle manual save
 */
const handleManualSave = async () => {
  if (!isValid.value) {
    alert('Please fix validation errors before saving.');
    return;
  }

  isSaving.value = true;

  try {
    // Convert graph to GraphQL payload
    const payload = convertGraphToPayload();

    // TODO: Call GraphQL mutation (Phase 5)
    // await reflexStore.updateReflexRule(ruleUid.value, payload);

    console.log('Saving rule:', payload);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Clear draft on successful save
    clearDraft();

    alert('Rule saved successfully!');
  } catch (error) {
    console.error('Failed to save rule:', error);
    alert('Failed to save rule. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

/**
 * Convert graph to GraphQL payload
 */
const convertGraphToPayload = () => {
  // Group nodes by type
  const triggerNodes = nodes.value.filter((n) => n.type === 'trigger');
  const decisionNodes = nodes.value.filter((n) => n.type === 'decision');
  const ruleNodes = nodes.value.filter((n) => n.type === 'rule');
  const actionNodes = nodes.value.filter((n) => n.type === 'action');

  // Build triggers with decisions
  const triggers = triggerNodes.map((trigger) => {
    // Find decisions connected to this trigger
    const connectedDecisionIds = edges.value
      .filter((e) => e.source === trigger.id)
      .map((e) => e.target);

    const decisions = decisionNodes
      .filter((d) => connectedDecisionIds.includes(d.id))
      .map((decision) => {
        // Find rules connected to this decision
        const connectedRuleIds = edges.value
          .filter((e) => e.source === decision.id && nodes.value.find((n) => n.id === e.target && n.type === 'rule'))
          .map((e) => e.target);

        // Build rule groups (for now, one rule group per decision)
        const ruleGroups = connectedRuleIds.length > 0 ? [{
          description: 'Rule group',
          priority: 0,
          rules: ruleNodes
            .filter((r) => connectedRuleIds.includes(r.id))
            .map((rule) => ({
              analysis_uid: rule.data.analysis_uid,
              operator: rule.data.operator,
              value: rule.data.value,
              priority: rule.data.priority || 0,
            })),
        }] : [];

        // Find actions connected to this decision
        const connectedActionIds = edges.value
          .filter((e) => e.source === decision.id && nodes.value.find((n) => n.id === e.target && n.type === 'action'))
          .map((e) => e.target);

        const addAnalyses = actionNodes
          .filter((a) => connectedActionIds.includes(a.id) && a.data.actionType === 'add')
          .map((action) => ({
            analysis_uid: action.data.analysis_uid,
            count: action.data.count || 1,
          }));

        const finalizeAnalyses = actionNodes
          .filter((a) => connectedActionIds.includes(a.id) && a.data.actionType === 'finalize')
          .map((action) => ({
            analysis_uid: action.data.analysis_uid,
            value: action.data.value,
          }));

        return {
          description: decision.data.description,
          priority: decision.data.priority,
          rule_groups: ruleGroups,
          add_analyses: addAnalyses,
          finalize_analyses: finalizeAnalyses,
        };
      });

    return {
      level: trigger.data.level,
      description: trigger.data.description,
      sample_type_uid: trigger.data.sample_type_uid,
      analyses: trigger.data.analyses?.map((a: any) => a.uid) || [],
      decisions,
    };
  });

  return {
    reflex_rule_uid: ruleUid.value,
    triggers,
  };
};

/**
 * Load rule from backend
 */
const loadRule = async () => {
  isLoading.value = true;

  try {
    // TODO: Fetch from GraphQL (Phase 5)
    // const rule = await reflexStore.fetchReflexRuleByUidV2(ruleUid.value);
    // convertPayloadToGraph(rule);

    // For now, check for draft
    if (hasDraft()) {
      const draft = loadDraft();
      if (draft) {
        nodes.value = draft.nodes;
        edges.value = draft.edges;

        initializeHistory({
          nodes: draft.nodes,
          edges: draft.edges,
          timestamp: draft.timestamp,
        });
      }
    } else {
      // Initialize with empty graph
      nodes.value = [];
      edges.value = [];

      initializeHistory({
        nodes: [],
        edges: [],
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Failed to load rule:', error);
    alert('Failed to load rule. Please refresh the page.');
  } finally {
    isLoading.value = false;
  }
};

/**
 * Setup auto-save
 */
const { pause: pauseAutoSave, resume: resumeAutoSave } = startAutoSave(() => ({
  nodes: nodes.value,
  edges: edges.value,
}));

/**
 * Setup unload handler
 */
setupUnloadHandler(() => ({
  nodes: nodes.value,
  edges: edges.value,
}));

/**
 * Load on mount
 */
onMounted(() => {
  loadRule();
});

/**
 * Cleanup on unmount
 */
onBeforeUnmount(() => {
  pauseAutoSave();
});
</script>

<template>
  <div class="reflex-editor">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <svg class="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p class="mt-4 text-gray-600">Loading rule...</p>
      </div>
    </div>

    <!-- Main Editor -->
    <div v-else class="editor-container">
      <!-- Toolbar -->
      <div class="editor-toolbar">
        <!-- Left Side -->
        <div class="toolbar-left">
          <h1 class="text-lg font-semibold text-gray-800">Reflex Rule Editor</h1>
          <span class="text-sm text-gray-500">Rule: {{ ruleUid }}</span>
        </div>

        <!-- Center -->
        <div class="toolbar-center">
          <ReflexHistoryControls
            :can-undo="canUndo"
            :can-redo="canRedo"
            :history-size="historySize"
            @undo="handleUndo"
            @redo="handleRedo"
          />
        </div>

        <!-- Right Side -->
        <div class="toolbar-right">
          <ReflexDraftManager
            :last-saved="lastSaved"
            :is-saving="isDraftSaving"
            :has-draft="hasDraft()"
            :auto-save-enabled="true"
            @save="handleManualSave"
            @load-draft="loadRule"
            @clear-draft="clearDraft"
          />

          <button @click="showWizard = true" class="btn-wizard">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span class="hidden lg:inline">Wizard</span>
          </button>

          <button
            @click="handleManualSave"
            :disabled="!isValid || isSaving"
            class="btn-save"
            :class="{ 'btn-save-disabled': !isValid || isSaving }"
          >
            <svg
              class="w-5 h-5"
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
                d="M5 13l4 4L19 7"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save Rule' }}</span>
          </button>
        </div>
      </div>

      <!-- Three-Column Layout -->
      <div class="editor-main">
        <!-- Left Sidebar: Node Palette -->
        <ReflexNodePalette @add-node="handleAddNode" />

        <!-- Center: Canvas -->
        <div class="editor-canvas">
          <ReflexCanvas
            ref="canvasRef"
            v-model="{ nodes, edges }"
            @node-click="handleNodeClick"
            @pane-click="handlePaneClick"
            @nodes-change="handleGraphChange"
            @edges-change="handleGraphChange"
          />
        </div>

        <!-- Right Sidebar: Node Inspector -->
        <ReflexNodeInspector
          :selected-node="selectedNode"
          :analyses="analyses"
          :sample-types="sampleTypes"
          @update:node="handleNodeUpdate"
          @delete:node="handleNodeDelete"
        />
      </div>

      <!-- Floating Validation Panel -->
      <ReflexValidationPanel
        :errors="errors"
        :warnings="warnings"
        @highlight:node="handleHighlightNode"
      />

      <!-- Wizard Modal -->
      <ReflexWizard
        v-if="showWizard"
        @create="handleWizardCreate"
        @close="showWizard = false"
      />
    </div>
  </div>
</template>

<style scoped>
.reflex-editor {
  @apply w-full h-screen overflow-hidden bg-gray-50;
}

/* Loading Overlay */
.loading-overlay {
  @apply fixed inset-0 flex items-center justify-center bg-gray-50 z-50;
}

.loading-spinner {
  @apply text-center;
}

/* Editor Container */
.editor-container {
  @apply flex flex-col h-full;
}

/* Toolbar */
.editor-toolbar {
  @apply flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200;
  @apply shadow-sm z-10;
}

.toolbar-left {
  @apply flex items-center space-x-3;
}

.toolbar-center {
  @apply flex-1 flex justify-center;
}

.toolbar-right {
  @apply flex items-center space-x-3;
}

.btn-wizard {
  @apply flex items-center space-x-2 px-4 py-2;
  @apply bg-purple-600 text-white rounded-lg font-medium;
  @apply hover:bg-purple-700 transition-colors;
  @apply text-sm;
}

.btn-save {
  @apply flex items-center space-x-2 px-4 py-2;
  @apply bg-green-600 text-white rounded-lg font-medium;
  @apply hover:bg-green-700 transition-colors;
  @apply text-sm;
}

.btn-save-disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-green-600;
}

/* Main Editor Area */
.editor-main {
  @apply flex-1 flex overflow-hidden;
}

.editor-canvas {
  @apply flex-1 relative;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
