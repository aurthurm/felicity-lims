<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import type { Node, Edge } from '@vue-flow/core';

// Import components
import ReflexCanvas from './components/ReflexCanvas.vue';
import ReflexNodePalette from './components/ReflexNodePalette.vue';
import ReflexNodeInspector from './components/ReflexNodeInspector.vue';
import ReflexValidationPanel from './components/ReflexValidationPanel.vue';
import ReflexHistoryControls from './components/ReflexHistoryControls.vue';

// Import composables
import { useReflexHistory, useReflexHistoryKeyboard } from '@/composables/useReflexHistory';
import { useReflexDraft } from '@/composables/useReflexDraft';
import { useReflexValidation } from '@/composables/useReflexValidation';

// Import store
import { useReflexStore } from '@/stores/reflex';

// Import sweetalert2
import Swal from 'sweetalert2';

// Import API util for GraphQL queries
import useApiUtil from '@/composables/api_util';
import {
  GetAllAnalysesServicesDocument,
  GetAllAnalysesServicesQuery,
  GetAllAnalysesServicesQueryVariables,
  GetAllSampleTypesDocument,
  GetAllSampleTypesQuery,
  GetAllSampleTypesQueryVariables,
} from '@/graphql/operations/analyses.queries';

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
const ruleUid = computed(() => route.params.uid as string);

/**
 * Initialize store and API util
 */
const reflexStore = useReflexStore();
const { withClientQuery } = useApiUtil();

/**
 * State
 */
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const selectedNode = ref<Node | null>(null);
const selectedEdge = ref<Edge | null>(null);
const isLoading = computed(() => reflexStore.fetchingReflexRule);
const isSaving = ref(false);
const isPublishing = ref(false);

/**
 * Check if rule is currently published
 */
const isPublished = computed(() => reflexStore.getReflexRule?.isActive ?? false);

/**
 * Count of saveable nodes (valid + connected to trigger)
 */
const saveableNodeCount = computed(() => {
  const saveableGraph = getSaveableGraph();
  return saveableGraph ? saveableGraph.nodes.length : 0;
});

/**
 * Track last saved state for dirty detection
 */
const lastSavedState = ref<{ nodes: Node[]; edges: Edge[] } | null>(null);

/**
 * Check if current state is dirty (has unsaved changes)
 */
const isDirty = computed(() => {
  if (!lastSavedState.value) return true;

  // Simple comparison - could be more sophisticated
  return (
    JSON.stringify(nodes.value) !== JSON.stringify(lastSavedState.value.nodes) ||
    JSON.stringify(edges.value) !== JSON.stringify(lastSavedState.value.edges)
  );
});

/**
 * Graph model for v-model binding
 */
const graph = computed({
  get: () => ({ nodes: nodes.value, edges: edges.value }),
  set: (value: { nodes: Node[]; edges: Edge[] }) => {
    nodes.value = value.nodes;
    edges.value = value.edges;
  },
});

/**
 * Analyses and sample types from backend
 */
const analyses = ref<Array<{ uid: string; name: string; keyword?: string }>>([]);
const sampleTypes = ref<Array<{ uid: string; name: string; abbr?: string }>>([]);
const isLoadingData = ref(false);

/**
 * Fetch analyses and sample types from backend
 */
const fetchAnalysesAndSampleTypes = async () => {
  isLoadingData.value = true;

  try {
    // Fetch analyses
    const analysesResult = await withClientQuery<
      GetAllAnalysesServicesQuery,
      GetAllAnalysesServicesQueryVariables
    >(GetAllAnalysesServicesDocument, {
      first: 1000, // Get all active analyses
      sortBy: ['name'],
    });

    if (analysesResult?.analysisAll?.items) {
      analyses.value = analysesResult.analysisAll.items
        .filter((a) => a.active)
        .map((a) => ({
          uid: a.uid,
          name: a.name,
          keyword: a.keyword,
        }));
    }

    // Fetch sample types
    const sampleTypesResult = await withClientQuery<
      GetAllSampleTypesQuery,
      GetAllSampleTypesQueryVariables
    >(GetAllSampleTypesDocument, {});

    if (sampleTypesResult?.sampleTypeAll) {
      sampleTypes.value = sampleTypesResult.sampleTypeAll
        .filter((st) => st.active)
        .map((st) => ({
          uid: st.uid,
          name: st.name,
          abbr: st.abbr,
        }));
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Data Load Failed',
      text: 'Failed to load analyses and sample types. Please refresh the page.',
      confirmButtonText: 'OK',
    });
  } finally {
    isLoadingData.value = false;
  }
};

/**
 * Get analyses available for downstream nodes based on trigger selection
 * Only analyses selected in trigger nodes should be available downstream
 */
const availableAnalyses = computed(() => {
  const triggerNodes = nodes.value.filter((n) => n.type === 'trigger');

  if (triggerNodes.length === 0) {
    return []; // No trigger, no analyses available
  }

  // Collect all analysis UIDs from all triggers
  const selectedAnalysisUids = new Set<string>();
  triggerNodes.forEach((trigger) => {
    const triggerAnalyses = trigger.data?.analyses || [];
    triggerAnalyses.forEach((uid: string) => selectedAnalysisUids.add(uid));
  });

  // Filter analyses to only those selected in triggers
  return analyses.value.filter((a) => selectedAnalysisUids.has(a.uid));
});

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
 * Initialize history with empty state immediately (synchronous, before any async operations)
 */
initializeHistory({
  nodes: [],
  edges: [],
  timestamp: Date.now(),
});

/**
 * Draft composable (Auto-save)
 */
const {
  lastSaved,
  isSaving: isDraftSaving,
  saveError,
  saveDraft,
  saveNow,
  getTimeSinceLastSave,
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

    // Explicitly sync to canvas (since we're not using deep watcher anymore)
    canvasRef.value?.syncFromParent(nodes.value, edges.value);
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

    // Explicitly sync to canvas (since we're not using deep watcher anymore)
    canvasRef.value?.syncFromParent(nodes.value, edges.value);
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

  // Note: Auto-save handles backend persistence every 30 seconds
  // No need for manual save on every change

  // Validate (but don't block - validation is non-blocking)
  const validatedNodes = validate(nodes.value, edges.value);
  if (validatedNodes) {
    // Don't replace nodes, just update classes
    // nodes.value = validatedNodes;
  }

  // Sync validation state with store
  reflexStore.setValidation(errors.value, warnings.value);
};

/**
 * Handle node click
 */
const handleNodeClick = (node: Node) => {
  selectedNode.value = node;
  selectedEdge.value = null;

  // Deselect all nodes
  if (Array.isArray(nodes.value)) {
    nodes.value = nodes.value.map((n) => ({ ...n, selected: n.id === node.id }));
  }
  if (Array.isArray(edges.value)) {
    edges.value = edges.value.map((e) => ({ ...e, selected: false }));
  }
};

/**
 * Handle pane click (deselect all)
 */
const handlePaneClick = () => {
  selectedNode.value = null;
  selectedEdge.value = null;
  if (Array.isArray(nodes.value)) {
    nodes.value = nodes.value.map((n) => ({ ...n, selected: false }));
  }
  if (Array.isArray(edges.value)) {
    edges.value = edges.value.map((e) => ({ ...e, selected: false }));
  }
};

/**
 * Delete selected nodes/edges from keyboard
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Delete' && event.key !== 'Backspace') {
    return;
  }

  const target = event.target as HTMLElement | null;
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  ) {
    return;
  }

  canvasRef.value?.deleteSelected();
};

/**
 * Handle edge click
 */
const handleEdgeClick = (edge: Edge) => {
  selectedEdge.value = edge;
  selectedNode.value = null;
  if (Array.isArray(edges.value)) {
    edges.value = edges.value.map((e) => ({ ...e, selected: e.id === edge.id }));
  }
  if (Array.isArray(nodes.value)) {
    nodes.value = nodes.value.map((n) => ({ ...n, selected: false }));
  }
};

/**
 * Handle node update from inspector
 */
const handleNodeUpdate = (updatedNode: Node) => {
  if (Array.isArray(nodes.value)) {
    nodes.value = nodes.value.map((n) =>
      n.id === updatedNode.id ? updatedNode : n
    );
    selectedNode.value = updatedNode;

    // Explicitly sync to canvas since watcher only watches array length
    canvasRef.value?.syncFromParent(nodes.value, edges.value);

    handleGraphChange();
  }
};

/**
 * Handle node delete from inspector
 */
const handleNodeDelete = () => {
  if (!selectedNode.value) return;

  const nodeId = selectedNode.value.id;

  // Remove node
  if (Array.isArray(nodes.value)) {
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);
  }

  // Remove connected edges
  if (Array.isArray(edges.value)) {
    edges.value = edges.value.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
  }

  selectedNode.value = null;
  handleGraphChange();
};

/**
 * Handle add node from palette (click)
 */
const handleAddNode = (nodeType: string) => {
  // Defensive check: ensure nodes is initialized (should always be true now)
  if (!Array.isArray(nodes.value)) {
    nodes.value = [];
  }

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
 * Handle add node at specific position (drag-and-drop)
 */
const handleAddNodeAtPosition = (nodeType: string, position: { x: number; y: number }) => {

  // Defensive check: ensure nodes is initialized
  if (!Array.isArray(nodes.value)) {
    nodes.value = [];
  }

  const newNode: Node = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    position: position,
    data: getDefaultNodeData(nodeType),
  };

  nodes.value = [...nodes.value, newNode];

  handleGraphChange();
};

/**
 * Get all nodes connected to trigger nodes (BFS traversal)
 * Only returns nodes that are part of a valid connected graph starting from triggers
 */
const getConnectedNodes = (allNodes: Node[], allEdges: Edge[]): Node[] => {
  // Find all trigger nodes
  const triggerNodes = allNodes.filter((n) => n.type === 'trigger');

  if (triggerNodes.length === 0) {
    return []; // No triggers, nothing to save
  }

  // BFS to find all connected nodes
  const connectedNodeIds = new Set<string>();
  const queue: string[] = triggerNodes.map((n) => n.id);

  // Add all trigger nodes to connected set
  triggerNodes.forEach((n) => connectedNodeIds.add(n.id));

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    // Find all edges from this node
    const outgoingEdges = allEdges.filter((e) => e.source === currentId);

    outgoingEdges.forEach((edge) => {
      if (!connectedNodeIds.has(edge.target)) {
        connectedNodeIds.add(edge.target);
        queue.push(edge.target);
      }
    });
  }

  // Return nodes that are connected
  return allNodes.filter((n) => connectedNodeIds.has(n.id));
};

/**
 * Get valid nodes only (no validation errors)
 */
const getValidNodes = (nodesToCheck: Node[]): Node[] => {
  return nodesToCheck.filter((node) => {
    const nodeErrors = getNodeIssues(node.id).filter((issue) => issue.type === 'error');
    return nodeErrors.length === 0;
  });
};

/**
 * Get nodes and edges ready for saving (connected to trigger + valid only)
 */
const getSaveableGraph = (): { nodes: Node[]; edges: Edge[] } | null => {

  // Get nodes connected to trigger
  const connectedNodes = getConnectedNodes(nodes.value, edges.value);

  if (connectedNodes.length === 0) {
    return null;
  }

  // Filter to only valid nodes
  const validNodes = getValidNodes(connectedNodes);

  if (validNodes.length === 0) {
    return null;
  }

  // Get node IDs for filtering edges
  const validNodeIds = new Set(validNodes.map((n) => n.id));

  // Filter edges to only include connections between valid nodes
  const validEdges = edges.value.filter(
    (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target)
  );

  return {
    nodes: validNodes,
    edges: validEdges,
  };
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
        sample_type_uid: null,
        analyses: [], // Array of UIDs
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
        priority: 0,
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
 * Handle manual save
 */
const handleManualSave = async () => {
  // Get saveable graph (connected to trigger + valid only)
  const saveableGraph = getSaveableGraph();

  if (!saveableGraph) {
    await Swal.fire({
      icon: 'warning',
      title: 'Nothing to Save',
      text: 'No valid nodes connected to trigger. Please add a trigger node and connect valid nodes to it.',
      confirmButtonText: 'OK',
    });
    return;
  }

  // Check if dirty
  if (!isDirty.value) {
    await Swal.fire({
      icon: 'info',
      title: 'No Changes',
      text: 'No changes to save.',
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  const result = await Swal.fire({
    icon: 'question',
    title: 'Save Rule?',
    text: `This will save ${saveableGraph.nodes.length} valid nodes connected to trigger.`,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    confirmButtonColor: 'hsl(var(--success))',
  });

  if (!result.isConfirmed) return;

  isSaving.value = true;

    try {
      const savedRule = await reflexStore.saveReflexRule(
        ruleUid.value,
        saveableGraph.nodes,
        saveableGraph.edges
      );

      if (savedRule) {
        applySavedRuleGraph(savedRule);
      } else {
        // Fallback: update last saved state using current graph
        lastSavedState.value = {
          nodes: JSON.parse(JSON.stringify(nodes.value)),
          edges: JSON.parse(JSON.stringify(edges.value)),
        };
      }

      await Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Rule saved successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'An error occurred while saving the rule.',
        confirmButtonText: 'OK',
      });
    } finally {
      isSaving.value = false;
    }
};

/**
 * Handle publish/unpublish toggle
 */
const handleTogglePublish = async () => {
  const newState = !isPublished.value;
  const action = newState ? 'publish' : 'unpublish';

  const result = await Swal.fire({
    icon: 'question',
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} Rule?`,
    text: newState
      ? 'Publishing will make this rule active and available for execution.'
      : 'Unpublishing will deactivate this rule and save it as a draft.',
    showCancelButton: true,
    confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
    cancelButtonText: 'Cancel',
    confirmButtonColor: newState ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
  });

  if (!result.isConfirmed) return;

  isPublishing.value = true;

  try {
    await reflexStore.togglePublish(ruleUid.value, newState);
    await Swal.fire({
      icon: 'success',
      title: `${action.charAt(0).toUpperCase() + action.slice(1)}ed!`,
      text: `Rule ${action}ed successfully.`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Failed`,
      text: `Failed to ${action} rule. Please try again.`,
      confirmButtonText: 'OK',
    });
  } finally {
    isPublishing.value = false;
  }
};

/**
 * Convert backend nested format to Vue Flow graph format
 *
 * Backend structure:
 * ReflexRule → ReflexTrigger[] → ReflexDecision[] → ReflexRuleGroup[] / ReflexAddAnalysis[] / ReflexFinalizeAnalysis[]
 *
 * Vue Flow structure:
 * nodes[] with { id, type, position: {x, y}, data }
 * edges[] with { id, source, target, sourceHandle, targetHandle }
 */
const convertBackendToGraph = (ruleData: any): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let edgeCounter = 0;

  // Helper to create edge ID
  const createEdgeId = () => `edge-${edgeCounter++}`;

  // Process each trigger
  ruleData.reflexTriggers?.forEach((trigger: any) => {
    // Create trigger node
    const triggerNode: Node = {
      id: `trigger-${trigger.uid}`,
      type: 'trigger',
      position: {
        x: trigger.posX ?? 100,
        y: trigger.posY ?? 100,
      },
      data: {
        uid: trigger.uid,
        level: trigger.level,
        description: trigger.description,
        sample_type_uid: trigger.sampleTypeUid,
        analyses: trigger.analyses?.map((a: any) => a.uid) || [],
      },
    };
    nodes.push(triggerNode);

    // Process each decision connected to this trigger
    trigger.decisions?.forEach((decision: any, decisionIndex: number) => {
      // Create decision node
      const decisionNode: Node = {
        id: `decision-${decision.uid}`,
        type: 'decision',
        position: {
          x: decision.posX ?? 300,
          y: decision.posY ?? (100 + decisionIndex * 200),
        },
        data: {
          uid: decision.uid,
          description: decision.description,
          priority: decision.priority,
        },
      };
      nodes.push(decisionNode);

      // Create edge: Trigger → Decision
      edges.push({
        id: createEdgeId(),
        source: triggerNode.id,
        target: decisionNode.id,
      });

      // Process rule groups (each group = OR logic, rules within = AND logic)
      decision.ruleGroups?.forEach((ruleGroup: any, groupIndex: number) => {
        let previousRuleNode: Node | null = null;

        ruleGroup.rules?.forEach((rule: any, ruleIndex: number) => {
          // Create rule node
          const ruleNode: Node = {
            id: `rule-${rule.uid}`,
            type: 'rule',
            position: {
              x: ruleGroup.posX ?? (500 + groupIndex * 150),
              y: ruleGroup.posY ?? (100 + ruleIndex * 100),
            },
            data: {
              uid: rule.uid,
              analysis_uid: rule.analysisUid,
              operator: rule.operator,
              value: rule.value,
              priority: rule.priority,
              connector: ruleIndex > 0 ? 'AND' : null, // First rule has no connector
            },
          };
          nodes.push(ruleNode);

          if (ruleIndex === 0) {
            // First rule connects to Decision via 'rules' handle
            edges.push({
              id: createEdgeId(),
              source: decisionNode.id,
              target: ruleNode.id,
              sourceHandle: 'rules',
            });
          } else if (previousRuleNode) {
            // Subsequent rules chain to previous rule (AND logic)
            edges.push({
              id: createEdgeId(),
              source: previousRuleNode.id,
              target: ruleNode.id,
            });
          }

          previousRuleNode = ruleNode;
        });
      });

      // Process add actions
      decision.addAnalyses?.forEach((addAction: any, actionIndex: number) => {
        const actionNode: Node = {
          id: `action-add-${addAction.uid}`,
          type: 'action',
          position: {
            x: addAction.posX ?? 700,
            y: addAction.posY ?? (100 + actionIndex * 100),
          },
          data: {
            uid: addAction.uid,
            actionType: 'add',
            analysis_uid: addAction.analysisUid,
            count: addAction.count,
          },
        };
        nodes.push(actionNode);

        // Create edge: Decision → Action (via 'actions' handle)
        edges.push({
          id: createEdgeId(),
          source: decisionNode.id,
          target: actionNode.id,
          sourceHandle: 'actions',
        });
      });

      // Process finalize actions
      decision.finalizeAnalyses?.forEach((finalizeAction: any, actionIndex: number) => {
        const actionNode: Node = {
          id: `action-finalize-${finalizeAction.uid}`,
          type: 'action',
          position: {
            x: finalizeAction.posX ?? 700,
            y: finalizeAction.posY ?? (300 + actionIndex * 100),
          },
          data: {
            uid: finalizeAction.uid,
            actionType: 'finalize',
            analysis_uid: finalizeAction.analysisUid,
            value: finalizeAction.value,
          },
        };
        nodes.push(actionNode);

        // Create edge: Decision → Action (via 'actions' handle)
        edges.push({
          id: createEdgeId(),
          source: decisionNode.id,
          target: actionNode.id,
          sourceHandle: 'actions',
        });
      });
    });
  });

  return { nodes, edges };
};

/**
 * Apply backend graph after save to ensure node data has UIDs
 * IMPORTANT: This only updates UIDs on saved nodes, it does NOT remove
 * unsaved nodes that the user is still working on.
 */
const applySavedRuleGraph = (ruleData: any) => {
  if (!ruleData) return;

  // Convert backend response to get the saved nodes with UIDs
  const { nodes: savedNodes } = convertBackendToGraph(ruleData);

  // Create a map of saved nodes by their frontend ID pattern
  // Backend nodes have IDs like "trigger-{uid}", "decision-{uid}", etc.
  const savedNodesByType = new Map<string, any[]>();
  savedNodes.forEach((node) => {
    const type = node.type || 'unknown';
    if (!savedNodesByType.has(type)) {
      savedNodesByType.set(type, []);
    }
    savedNodesByType.get(type)!.push(node);
  });

  // Update UIDs on existing nodes without removing unsaved nodes
  nodes.value = nodes.value.map((node) => {
    // If node already has a UID, keep it
    if (node.data?.uid) return node;

    // Try to find matching saved node by type and data
    const savedOfType = savedNodesByType.get(node.type || '') || [];
    const matchingNode = savedOfType.find((saved) => {
      // Match by position (within tolerance) and key data fields
      const posMatch =
        Math.abs(saved.position.x - node.position.x) < 5 &&
        Math.abs(saved.position.y - node.position.y) < 5;

      if (!posMatch) return false;

      // Additional matching by type-specific data
      if (node.type === 'trigger') {
        return saved.data?.level === node.data?.level;
      }
      if (node.type === 'decision') {
        return saved.data?.description === node.data?.description;
      }
      if (node.type === 'rule') {
        return saved.data?.analysis_uid === node.data?.analysis_uid;
      }
      if (node.type === 'action') {
        return saved.data?.analysis_uid === node.data?.analysis_uid &&
               saved.data?.actionType === node.data?.actionType;
      }
      return false;
    });

    if (matchingNode) {
      // Found matching saved node - update UID
      return {
        ...node,
        data: {
          ...node.data,
          uid: matchingNode.data.uid,
        },
      };
    }

    // No match found - keep node as is (it's a new unsaved node)
    return node;
  });

  // Update last saved state with current graph
  lastSavedState.value = {
    nodes: JSON.parse(JSON.stringify(nodes.value)),
    edges: JSON.parse(JSON.stringify(edges.value)),
  };
};

/**
 * Load rule from backend
 */
const loadRule = async () => {
  // Always initialize arrays first to prevent "not iterable" errors
  if (!Array.isArray(nodes.value)) {
    nodes.value = [];
  }
  if (!Array.isArray(edges.value)) {
    edges.value = [];
  }

  try {
    // Fetch from GraphQL using store (includes any saved positions)
    await reflexStore.fetchReflexRuleByUid(ruleUid.value);

    // Convert backend data to graph
    const ruleData = reflexStore.getReflexRule;
    if (ruleData && ruleData.reflexTriggers && ruleData.reflexTriggers.length > 0) {
      // Convert backend format to Vue Flow graph
      const { nodes: convertedNodes, edges: convertedEdges } = convertBackendToGraph(ruleData);

      nodes.value = convertedNodes;
      edges.value = convertedEdges;

      // Explicitly sync to canvas after loading
      // Use nextTick to ensure canvas is ready
      nextTick(() => {
        canvasRef.value?.syncFromParent(convertedNodes, convertedEdges);
      });

      // Set as last saved state (no changes yet)
      lastSavedState.value = {
        nodes: JSON.parse(JSON.stringify(convertedNodes)),
        edges: JSON.parse(JSON.stringify(convertedEdges)),
      };

      initializeHistory({
        nodes: convertedNodes,
        edges: convertedEdges,
        timestamp: Date.now(),
      });
    } else {
      // Initialize with empty graph
      nodes.value = [];
      edges.value = [];

      // Empty state is considered "saved"
      lastSavedState.value = {
        nodes: [],
        edges: [],
      };

      initializeHistory({
        nodes: [],
        edges: [],
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    // Ensure arrays are still initialized even on error
    nodes.value = [];
    edges.value = [];
    lastSavedState.value = {
      nodes: [],
      edges: [],
    };
    initializeHistory({
      nodes: [],
      edges: [],
      timestamp: Date.now(),
    });
  }
};

/**
 * Setup auto-save - DISABLED for now to prevent interference with user workflow
 * Auto-save was removing unsaved nodes while user was still working on them.
 * Save now only happens on explicit user action or on unmount.
 */
const { pause: pauseAutoSave, resume: resumeAutoSave } = startAutoSave(() => {
  // Return empty to skip periodic auto-save
  // We'll only save on unmount or explicit user action
  return { nodes: [], edges: [] };
}, applySavedRuleGraph);

/**
 * Setup unload handler (only saves valid connected nodes)
 */
setupUnloadHandler(() => {
  const saveableGraph = getSaveableGraph();

  // Only return graph if we have valid nodes
  if (saveableGraph && isDirty.value) {
    return saveableGraph;
  }

  // Return empty to skip save
  return { nodes: [], edges: [] };
});

/**
 * Watch for successful auto-saves and update lastSavedState
 */
watch(lastSaved, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    // Auto-save completed successfully, update last saved state
    lastSavedState.value = {
      nodes: JSON.parse(JSON.stringify(nodes.value)),
      edges: JSON.parse(JSON.stringify(edges.value)),
    };
  }
});

/**
 * Load on mount
 */
onMounted(async () => {
  // Fetch analyses and sample types first
  await fetchAnalysesAndSampleTypes();

  // Then load the rule
  await loadRule();

  window.addEventListener('keydown', handleKeyDown);
});

/**
 * Cleanup on unmount
 */
onBeforeUnmount(() => {
  pauseAutoSave();
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="reflex-editor">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <fel-loader message="Loading rule..." variant="muted" size="lg" />
    </div>

    <!-- Main Editor -->
    <div v-else class="editor-container">
      <!-- Toolbar -->
      <div class="editor-toolbar">
        <!-- Left Side -->
        <div class="toolbar-left">
          <h1 class="text-lg font-semibold text-foreground">Reflex Rule Editor</h1>
          <span class="text-sm text-muted-foreground">Rule: {{ ruleUid }}</span>
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
          <!-- Auto-save Status -->
          <div class="flex items-center space-x-3 px-3 py-2 bg-muted border border-border rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="relative">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-success': lastSaved && !isDraftSaving && !isDirty,
                    'bg-warning': lastSaved && isDirty,
                    'bg-primary': isDraftSaving,
                    'bg-muted-foreground/60': !lastSaved
                  }"
                />
                <div
                  v-if="isDraftSaving"
                  class="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75"
                />
              </div>
              <span class="text-xs text-muted-foreground">
                <span v-if="isDraftSaving">Saving...</span>
                <span v-else-if="isDirty && lastSaved">Unsaved changes</span>
                <span v-else-if="lastSaved">{{ getTimeSinceLastSave() }}</span>
                <span v-else>Not saved</span>
              </span>
            </div>
            <div class="h-4 w-px bg-border" />
            <div class="flex items-center space-x-1 text-xs">
              <span class="text-muted-foreground">Valid:</span>
              <span
                class="font-medium"
                :class="{
                  'text-success': saveableNodeCount > 0,
                  'text-muted-foreground': saveableNodeCount === 0
                }"
              >
                {{ saveableNodeCount }}/{{ nodes.length }}
              </span>
            </div>
          </div>

          <!-- Publish Toggle Switch -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-muted-foreground">Draft</span>
            <button
              @click="handleTogglePublish"
              :disabled="isPublishing"
              class="publish-toggle"
              :class="{ 'publish-toggle-active': isPublished }"
              role="switch"
              :aria-checked="isPublished"
            >
              <span
                class="publish-toggle-slider"
                :class="{ 'publish-toggle-slider-active': isPublished }"
              />
            </button>
            <span class="text-sm text-muted-foreground">Published</span>
          </div>

          <!-- Save Button -->
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
            <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
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
            v-model="graph"
            @node-click="handleNodeClick"
            @edge-click="handleEdgeClick"
            @pane-click="handlePaneClick"
            @nodes-change="handleGraphChange"
            @edges-change="handleGraphChange"
            @add-node-at-position="handleAddNodeAtPosition"
          />
        </div>

        <!-- Right Sidebar: Node Inspector -->
        <ReflexNodeInspector
          :selected-node="selectedNode"
          :all-analyses="analyses"
          :available-analyses="availableAnalyses"
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
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/style.css";

.reflex-editor {
  @apply w-full h-screen overflow-hidden bg-muted;
}

/* Loading Overlay */
.loading-overlay {
  @apply fixed inset-0 flex items-center justify-center bg-muted z-50;
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
  @apply flex items-center justify-between px-6 py-3 bg-card border-b border-border;
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

/* Publish Toggle Switch */
.publish-toggle {
  @apply relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full;
  @apply border-2 border-transparent transition-colors duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
  @apply bg-muted;
}

.publish-toggle:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.publish-toggle-active {
  @apply bg-primary;
}

.publish-toggle-slider {
  @apply pointer-events-none inline-block h-5 w-5 transform rounded-full;
  @apply bg-background shadow ring-0 transition duration-200 ease-in-out;
  @apply translate-x-0;
}

.publish-toggle-slider-active {
  @apply translate-x-5;
}

.btn-save {
  @apply flex items-center space-x-2 px-4 py-2;
  @apply bg-success text-success-foreground rounded-lg font-medium;
  @apply hover:bg-success/90 transition-colors;
  @apply text-sm;
}

.btn-save-disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-success/80;
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
