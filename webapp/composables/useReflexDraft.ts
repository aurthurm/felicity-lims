import { ref, onBeforeUnmount } from 'vue';
import type { Node, Edge } from '@vue-flow/core';
import { useIntervalFn } from '@vueuse/core';
import { useReflexStore } from '@/stores/reflex';

/**
 * Composable for managing reflex rule auto-save with backend persistence
 *
 * Features:
 * - Backend persistence (accessible across devices)
 * - Auto-save every 30 seconds
 * - Saves node positions to database
 * - Unified save handles both create and update based on UIDs
 * - Separate publish/unpublish for is_active flag
 *
 * @param ruleUid - The UID of the reflex rule
 *
 * @example
 * const {
 *   saveDraft,
 *   saveNow,
 *   lastSaved,
 *   isSaving,
 *   startAutoSave,
 *   getTimeSinceLastSave
 * } = useReflexDraft('rule-uid-123');
 *
 * // Start auto-save
 * startAutoSave(() => ({ nodes: nodes.value, edges: edges.value }));
 *
 * // Manual save
 * await saveNow(nodes.value, edges.value);
 */
export function useReflexDraft(ruleUid: string) {
    const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
    const reflexStore = useReflexStore();

    const lastSaved = ref<number | null>(null);
    const isSaving = ref(false);
    const saveError = ref<string | null>(null);

    /**
     * Save graph to backend (saves positions, creates/updates entities)
     *
     * Note: This doesn't modify is_active flag - use separate publish method for that
     *
     * @param nodes - Current nodes
     * @param edges - Current edges
     * @returns Promise that resolves when save is complete
     */
    const saveDraft = async (nodes: Node[], edges: Edge[], onSaved?: (ruleData: any) => void): Promise<any> => {
        if (isSaving.value) {
            return null;
        }

        try {
            isSaving.value = true;
            saveError.value = null;

            // The store method will convert nodes/edges to backend entities with positions
            // It handles both create and update automatically based on UIDs
            const savedRule = await reflexStore.saveReflexRule(ruleUid, nodes, edges);
            if (savedRule && onSaved) {
                onSaved(savedRule);
            }

            lastSaved.value = Date.now();
            return savedRule;
        } catch (error) {
            saveError.value = error instanceof Error ? error.message : 'Unknown error';
            return null;
        } finally {
            isSaving.value = false;
        }
    };

    /**
     * Get formatted time since last save
     *
     * @returns Human-readable time since last save
     */
    const getTimeSinceLastSave = (): string => {
        if (!lastSaved.value) return 'Not saved yet';

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
    const startAutoSave = (getState: () => { nodes: Node[]; edges: Edge[] }, onSaved?: (ruleData: any) => void) => {
        const { pause, resume, isActive } = useIntervalFn(async () => {
            if (isSaving.value) return; // Skip if already saving

            try {
                const { nodes, edges } = getState();

                // Only save if there are nodes (avoid saving empty state on load)
                if (nodes.length > 0) {
                    await saveDraft(nodes, edges, onSaved);
                }
            } catch {}
        }, AUTO_SAVE_INTERVAL);

        return { pause, resume, isActive };
    };

    /**
     * Save on page unload (browser close/refresh)
     */
    const setupUnloadHandler = (getState: () => { nodes: Node[]; edges: Edge[] }, onSaved?: (ruleData: any) => void) => {
        const handleUnload = async (event: BeforeUnloadEvent) => {
            const { nodes, edges } = getState();

            if (nodes.length > 0 && !isSaving.value) {
                // Try to save (may not complete if browser closes immediately)
                await saveDraft(nodes, edges, onSaved);

                // Show browser warning if there are unsaved changes
                if (lastSaved.value && Date.now() - lastSaved.value > AUTO_SAVE_INTERVAL) {
                    event.preventDefault();
                    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                }
            }
        };

        window.addEventListener('beforeunload', handleUnload as any);

        // Cleanup on component unmount
        onBeforeUnmount(async () => {
            window.removeEventListener('beforeunload', handleUnload as any);

            // Final save on unmount
            const { nodes, edges } = getState();
            if (nodes.length > 0) {
                await saveDraft(nodes, edges, onSaved);
            }
        });

        return handleUnload;
    };

    /**
     * Manually trigger a save (for Save button)
     */
    const saveNow = async (nodes: Node[], edges: Edge[], onSaved?: (ruleData: any) => void): Promise<any> => {
        return await saveDraft(nodes, edges, onSaved);
    };

    return {
        // State
        lastSaved,
        isSaving,
        saveError,

        // Methods
        saveDraft,
        saveNow,
        getTimeSinceLastSave,
        startAutoSave,
        setupUnloadHandler,
    };
}
