import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  FlowNode, 
  FlowEdge, 
  FlowNodeData,
  NodeType 
} from '@/types';
import { 
  CONNECTION_RULES, 
  type ReflexRule, 
  type ReflexAction,
  type Analysis,
  type SampleType 
} from '@/types';

export const useReflexDesignerStore = defineStore('reflexDesigner', () => {
  // State
  const nodes = ref<FlowNode[]>([]);
  const edges = ref<FlowEdge[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const currentRule = ref<Partial<ReflexRule>>({
    name: '',
    description: '',
    is_active: true,
    priority: 0,
    reflex_actions: [],
  });
  const currentAction = ref<Partial<ReflexAction>>({
    level: 1,
    description: '',
    analyses: [],
    brains: [],
  });
  
  // Available analyses and sample types (would come from API)
  const availableAnalyses = ref<Analysis[]>([
    { uid: 'a1', name: 'HIV-1', keyword: 'HIV1', description: 'HIV-1 Viral Load' },
    { uid: 'a2', name: 'HIV-2', keyword: 'HIV2', description: 'HIV-2 Viral Load' },
    { uid: 'a3', name: 'CD4 Count', keyword: 'CD4', description: 'CD4 T-Cell Count' },
    { uid: 'a4', name: 'CD4 Percentage', keyword: 'CD4P', description: 'CD4 Percentage' },
    { uid: 'a5', name: 'Hemoglobin', keyword: 'HGB', description: 'Hemoglobin Level' },
    { uid: 'a6', name: 'WBC', keyword: 'WBC', description: 'White Blood Cell Count' },
    { uid: 'a7', name: 'Platelets', keyword: 'PLT', description: 'Platelet Count' },
    { uid: 'a8', name: 'Glucose', keyword: 'GLU', description: 'Blood Glucose' },
    { uid: 'a9', name: 'Creatinine', keyword: 'CREA', description: 'Serum Creatinine' },
    { uid: 'a10', name: 'ALT', keyword: 'ALT', description: 'Alanine Aminotransferase' },
  ]);

  const availableSampleTypes = ref<SampleType[]>([
    { uid: 'st1', name: 'Whole Blood', description: 'EDTA whole blood' },
    { uid: 'st2', name: 'Serum', description: 'Clotted blood serum' },
    { uid: 'st3', name: 'Plasma', description: 'Blood plasma' },
    { uid: 'st4', name: 'Urine', description: 'Urine sample' },
  ]);

  // Computed
  const selectedNode = computed(() => 
    nodes.value.find(n => n.id === selectedNodeId.value) || null
  );

  const nodesByType = computed(() => {
    const grouped: Record<NodeType, FlowNode[]> = {
      trigger: [],
      brain: [],
      condition: [],
      criteria: [],
      action: [],
      addition: [],
      final: [],
    };
    nodes.value.forEach(node => {
      const nodeType = (node.data as FlowNodeData).nodeType;
      if (nodeType && grouped[nodeType]) {
        grouped[nodeType].push(node);
      }
    });
    return grouped;
  });

  const isValidFlow = computed(() => {
    // Must have at least one trigger and one brain
    const hasTrigger = nodesByType.value.trigger.length > 0;
    const hasBrain = nodesByType.value.brain.length > 0;
    
    // All nodes must be connected
    const connectedNodeIds = new Set<string>();
    edges.value.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const allNodesConnected = nodes.value.length <= 1 || 
      nodes.value.every(node => connectedNodeIds.has(node.id));
    
    return hasTrigger && hasBrain && allNodesConnected;
  });

  // Actions
  function addNode(node: FlowNode) {
    nodes.value.push(node);
  }

  function updateNode(id: string, data: Partial<FlowNodeData>) {
    const index = nodes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      nodes.value[index] = {
        ...nodes.value[index],
        data: { ...nodes.value[index].data, ...data } as FlowNodeData,
      };
    }
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id);
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id);
    if (selectedNodeId.value === id) {
      selectedNodeId.value = null;
    }
  }

  function addEdge(edge: FlowEdge) {
    // Check if connection is valid
    const sourceNode = nodes.value.find(n => n.id === edge.source);
    const targetNode = nodes.value.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return false;
    
    const sourceType = (sourceNode.data as FlowNodeData).nodeType;
    const targetType = (targetNode.data as FlowNodeData).nodeType;
    
    if (!isValidConnection(sourceType, targetType)) return false;
    
    // Don't add duplicate edges
    const exists = edges.value.some(
      e => e.source === edge.source && e.target === edge.target
    );
    if (exists) return false;
    
    edges.value.push({
      ...edge,
      data: {
        sourceType,
        targetType,
        isValid: true,
      },
    });
    return true;
  }

  function removeEdge(id: string) {
    edges.value = edges.value.filter(e => e.id !== id);
  }

  function isValidConnection(sourceType: NodeType, targetType: NodeType): boolean {
    const validTargets = CONNECTION_RULES[sourceType];
    return validTargets?.includes(targetType) ?? false;
  }

  function selectNode(id: string | null) {
    selectedNodeId.value = id;
  }

  function setNodes(newNodes: FlowNode[]) {
    nodes.value = newNodes;
  }

  function setEdges(newEdges: FlowEdge[]) {
    edges.value = newEdges;
  }

  function clearCanvas() {
    nodes.value = [];
    edges.value = [];
    selectedNodeId.value = null;
  }

  function updateRule(data: Partial<ReflexRule>) {
    currentRule.value = { ...currentRule.value, ...data };
  }

  function updateAction(data: Partial<ReflexAction>) {
    currentAction.value = { ...currentAction.value, ...data };
  }

  // Generate unique ID
  function generateId(prefix: string = 'node'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export flow to JSON structure matching backend entities
  function exportToReflexRule(): ReflexRule | null {
    if (!isValidFlow.value) return null;
    
    // This would build the complete structure from nodes and edges
    // Implementation depends on specific requirements
    return {
      ...currentRule.value,
      reflex_actions: [currentAction.value as ReflexAction],
    } as ReflexRule;
  }

  // Import from existing ReflexRule
  function importFromReflexRule(rule: ReflexRule) {
    currentRule.value = rule;
    // Would parse the rule and create nodes/edges
    // Implementation depends on specific requirements
  }

  return {
    // State
    nodes,
    edges,
    selectedNodeId,
    currentRule,
    currentAction,
    availableAnalyses,
    availableSampleTypes,
    
    // Computed
    selectedNode,
    nodesByType,
    isValidFlow,
    
    // Actions
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    isValidConnection,
    selectNode,
    setNodes,
    setEdges,
    clearCanvas,
    updateRule,
    updateAction,
    generateId,
    exportToReflexRule,
    importFromReflexRule,
  };
});
