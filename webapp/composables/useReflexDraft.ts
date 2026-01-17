import { ref, onBeforeUnmount } from 'vue';
import type { Node, Edge } from '@vue-flow/core';
import { useIntervalFn } from '@vueuse/core';

/**
 * Draft data structure
 */
interface ReflexDraft {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
  version: number;
}

/**
 * Composable for managing reflex rule drafts with auto-save
 *
 * Features:
 * - Local storage (immediate save for browser crash recovery)
 * - Auto-save every 30 seconds
 * - Conflict resolution (uses most recent draft)
 * - Save on page unload
 *
 * @param ruleUid - The UID of the reflex rule
 *
 * @example
 * const {
 *   saveDraftLocal,
 *   loadDraft,
 *   hasDraft,
 *   lastSaved,
 *   clearDraft,
 *   startAutoSave,
 *   stopAutoSave
 * } = useReflexDraft('rule-uid-123');
 *
 * // Start auto-save
 * startAutoSave(() => ({ nodes: nodes.value, edges: edges.value }));
 *
 * // Load existing draft
 * const draft = loadDraft();
 * if (draft) {
 *   nodes.value = draft.nodes;
 *   edges.value = draft.edges;
 * }
 */
export function useReflexDraft(ruleUid: string) {
  const DRAFT_KEY = `reflex_draft_${ruleUid}`;
  const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  const DRAFT_VERSION = 1;

  const lastSaved = ref<number | null>(null);
  const isSaving = ref(false);

  /**
   * Save draft to local storage (immediate)
   *
   * @param nodes - Current nodes
   * @param edges - Current edges
   */
  const saveDraftLocal = (nodes: Node[], edges: Edge[]) => {
    try {
      const draft: ReflexDraft = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
        version: DRAFT_VERSION,
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      lastSaved.value = draft.timestamp;
    } catch (error) {
      console.error('Failed to save draft to local storage:', error);
    }
  };

  /**
   * Load draft from local storage
   *
   * @returns The draft, or null if none exists
   */
  const loadDraft = (): ReflexDraft | null => {
    try {
      const draftJson = localStorage.getItem(DRAFT_KEY);
      if (!draftJson) return null;

      const draft = JSON.parse(draftJson) as ReflexDraft;

      // Validate draft version
      if (draft.version !== DRAFT_VERSION) {
        console.warn('Draft version mismatch, ignoring old draft');
        clearDraft();
        return null;
      }

      lastSaved.value = draft.timestamp;
      return draft;
    } catch (error) {
      console.error('Failed to load draft from local storage:', error);
      return null;
    }
  };

  /**
   * Check if a draft exists
   *
   * @returns True if a draft exists
   */
  const hasDraft = (): boolean => {
    return localStorage.getItem(DRAFT_KEY) !== null;
  };

  /**
   * Clear draft from local storage
   */
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      lastSaved.value = null;
    } catch (error) {
      console.error('Failed to clear draft from local storage:', error);
    }
  };

  /**
   * Get formatted time since last save
   *
   * @returns Human-readable time since last save
   */
  const getTimeSinceLastSave = (): string => {
    if (!lastSaved.value) return 'Never';

    const seconds = Math.floor((Date.now() - lastSaved.value) / 1000);

    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  /**
   * Auto-save setup with interval
   *
   * @param getState - Function to get current state (nodes, edges)
   * @returns Object with pause and resume functions
   */
  const startAutoSave = (getState: () => { nodes: Node[]; edges: Edge[] }) => {
    const { pause, resume, isActive } = useIntervalFn(() => {
      if (isSaving.value) return; // Skip if already saving

      try {
        isSaving.value = true;
        const { nodes, edges } = getState();
        saveDraftLocal(nodes, edges);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        isSaving.value = false;
      }
    }, AUTO_SAVE_INTERVAL);

    return { pause, resume, isActive };
  };

  /**
   * Save on page unload (browser close/refresh)
   */
  const setupUnloadHandler = (getState: () => { nodes: Node[]; edges: Edge[] }) => {
    const handleUnload = () => {
      const { nodes, edges } = getState();
      saveDraftLocal(nodes, edges);
    };

    window.addEventListener('beforeunload', handleUnload);

    // Cleanup on component unmount
    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleUnload);
      // Final save on unmount
      const { nodes, edges } = getState();
      saveDraftLocal(nodes, edges);
    });

    return handleUnload;
  };

  /**
   * Show draft recovery prompt
   *
   * @param draft - The draft to show info for
   * @returns HTML string for prompt
   */
  const getDraftRecoveryMessage = (draft: ReflexDraft): string => {
    const timeDiff = getTimeSinceLastSave();
    const nodeCount = draft.nodes.length;
    const edgeCount = draft.edges.length;

    return `
      A draft was found for this reflex rule:
      - Saved: ${timeDiff}
      - Nodes: ${nodeCount}
      - Connections: ${edgeCount}

      Would you like to restore it?
    `;
  };

  return {
    // State
    lastSaved,
    isSaving,

    // Methods
    saveDraftLocal,
    loadDraft,
    hasDraft,
    clearDraft,
    getTimeSinceLastSave,
    startAutoSave,
    setupUnloadHandler,
    getDraftRecoveryMessage,
  };
}

/**
 * Utility to compare two drafts and determine which is newer
 *
 * @param draft1 - First draft
 * @param draft2 - Second draft
 * @returns The newer draft
 */
export function getMostRecentDraft(
  draft1: ReflexDraft | null,
  draft2: ReflexDraft | null
): ReflexDraft | null {
  if (!draft1 && !draft2) return null;
  if (!draft1) return draft2;
  if (!draft2) return draft1;

  return draft1.timestamp > draft2.timestamp ? draft1 : draft2;
}
