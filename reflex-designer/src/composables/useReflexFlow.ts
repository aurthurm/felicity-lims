import { ref } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import type { Connection, Edge } from '@vue-flow/core';
import { useReflexDesignerStore } from '@/stores/reflexDesigner';
import type { FlowNode, FlowNodeData, NodeType, DragItem } from '@/types';
import { NODE_COLORS } from '@/types';
import { validateConnection, createNode, snapToGrid, validateFlow } from '@/utils/flowUtils';

export function useReflexFlow() {
  const store = useReflexDesignerStore();
  const {
    addNodes,
    project,
    fitView,
    zoomIn,
    zoomOut,
    setCenter,
  } = useVueFlow();

  const isDragging = ref(false);
  const draggedItem = ref<DragItem | null>(null);

  // Validate if a connection is allowed
  function isValidConnection(connection: Connection): boolean {
    return validateConnection(connection, store.nodes);
  }

  // Create edge with styling
  function createEdge(connection: Connection): Edge | null {
    const sourceNode = store.nodes.find(n => n.id === connection.source);
    const targetNode = store.nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return null;
    
    const sourceType = (sourceNode.data as FlowNodeData).nodeType;
    const targetType = (targetNode.data as FlowNodeData).nodeType;
    
    return {
      id: `e-${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      animated: true,
      style: {
        stroke: NODE_COLORS[sourceType].accent,
        strokeWidth: 2,
      },
      data: {
        sourceType,
        targetType,
        isValid: true,
      },
    };
  }

  // Handle drag start from sidebar
  function handleDragStart(event: DragEvent, item: DragItem) {
    isDragging.value = true;
    draggedItem.value = item;
    
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(item));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  // Handle drag over canvas
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  // Handle drop on canvas
  function handleDrop(event: DragEvent, canvasEl: HTMLElement | null) {
    event.preventDefault();
    isDragging.value = false;
    
    if (!event.dataTransfer || !canvasEl) return;
    
    const dataStr = event.dataTransfer.getData('application/json');
    if (!dataStr) return;
    
    const item: DragItem = JSON.parse(dataStr);
    const bounds = canvasEl.getBoundingClientRect();
    
    const position = project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    
    const snappedPosition = snapToGrid(position, 20);
    const newNode = createNode(item.type, snappedPosition, item.defaultData);
    
    store.addNode(newNode);
    addNodes([newNode]);
    
    draggedItem.value = null;
  }

  // Handle drag end
  function handleDragEnd() {
    isDragging.value = false;
    draggedItem.value = null;
  }

  // Delete selected node
  function deleteSelectedNode() {
    if (store.selectedNodeId) {
      store.removeNode(store.selectedNodeId);
    }
  }

  // Get flow validation result
  function getValidation() {
    return validateFlow(
      store.nodes,
      store.edges.map(e => ({ source: e.source, target: e.target }))
    );
  }

  // Auto-layout nodes
  function autoLayout() {
    // Simple left-to-right layout based on node type hierarchy
    const typeOrder: NodeType[] = ['trigger', 'brain', 'condition', 'action', 'addition', 'final'];
    const HORIZONTAL_GAP = 300;
    const VERTICAL_GAP = 150;
    
    const nodesByType = new Map<NodeType, FlowNode[]>();
    store.nodes.forEach(node => {
      const type = (node.data as FlowNodeData).nodeType;
      if (!nodesByType.has(type)) {
        nodesByType.set(type, []);
      }
      nodesByType.get(type)!.push(node);
    });
    
    let x = 50;
    typeOrder.forEach(type => {
      const nodes = nodesByType.get(type) || [];
      nodes.forEach((node, index) => {
        node.position = { x, y: 50 + index * VERTICAL_GAP };
      });
      if (nodes.length > 0) {
        x += HORIZONTAL_GAP;
      }
    });
    
    fitView({ padding: 0.2 });
  }

  // Center view on specific node
  function centerOnNode(nodeId: string) {
    const node = store.nodes.find(n => n.id === nodeId);
    if (node) {
      setCenter(node.position.x + 100, node.position.y + 50, { zoom: 1.2 });
    }
  }

  // Export flow as JSON
  function exportFlow() {
    return {
      rule: store.currentRule,
      action: store.currentAction,
      nodes: store.nodes,
      edges: store.edges,
      exportedAt: new Date().toISOString(),
    };
  }

  // Import flow from JSON
  function importFlow(data: ReturnType<typeof exportFlow>) {
    store.clearCanvas();
    store.updateRule(data.rule);
    store.updateAction(data.action);
    data.nodes.forEach(node => store.addNode(node));
    data.edges.forEach(edge => store.addEdge(edge as any));
  }

  return {
    // State
    isDragging,
    draggedItem,
    
    // Actions
    isValidConnection,
    createEdge,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    deleteSelectedNode,
    getValidation,
    autoLayout,
    centerOnNode,
    exportFlow,
    importFlow,
    
    // Vue Flow actions
    fitView,
    zoomIn,
    zoomOut,
  };
}
