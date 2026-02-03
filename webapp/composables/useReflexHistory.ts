import { ref, computed } from 'vue';
import type { Node, Edge } from '@vue-flow/core';
import { onKeyStroke } from '@vueuse/core';

/**
 * History state for a single snapshot
 */
interface HistoryState {
    nodes: Node[];
    edges: Edge[];
    timestamp: number;
}

/**
 * History stack with past, present, and future states
 */
interface HistoryStack {
    past: HistoryState[];
    present: HistoryState;
    future: HistoryState[];
}

/**
 * Composable for managing undo/redo functionality in reflex rule editor
 *
 * Features:
 * - Maintains history of graph states (nodes + edges)
 * - Supports undo (Ctrl+Z) and redo (Ctrl+Shift+Z)
 * - Limits history to last 50 states for performance
 * - Provides reactive computed properties for UI state
 *
 * @example
 * const { canUndo, canRedo, pushState, undo, redo, clearHistory } = useReflexHistory();
 *
 * // Push new state after changes
 * pushState({ nodes, edges, timestamp: Date.now() });
 *
 * // Undo last change
 * const previousState = undo();
 * if (previousState) {
 *   nodes.value = previousState.nodes;
 *   edges.value = previousState.edges;
 * }
 */
export function useReflexHistory() {
    const MAX_HISTORY_SIZE = 50;

    const history = ref<HistoryStack>({
        past: [],
        present: { nodes: [], edges: [], timestamp: Date.now() },
        future: [],
    });

    /**
     * Check if undo is available
     */
    const canUndo = computed(() => history.value.past.length > 0);

    /**
     * Check if redo is available
     */
    const canRedo = computed(() => history.value.future.length > 0);

    /**
     * Get the current history size
     */
    const historySize = computed(() => history.value.past.length);

    /**
     * Push a new state onto the history stack
     * Clears the future stack (no redo after new change)
     *
     * @param state - The new state to push
     */
    const pushState = (state: HistoryState) => {
        // Deep clone to avoid reference issues
        const clonedState: HistoryState = {
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges)),
            timestamp: state.timestamp,
        };

        // Push current present to past
        history.value.past.push(history.value.present);

        // Set new present
        history.value.present = clonedState;

        // Clear future (can't redo after new action)
        history.value.future = [];

        // Limit history size
        if (history.value.past.length > MAX_HISTORY_SIZE) {
            history.value.past.shift(); // Remove oldest
        }
    };

    /**
     * Undo the last change
     *
     * @returns The previous state, or undefined if can't undo
     */
    const undo = (): HistoryState | undefined => {
        if (!canUndo.value) {
            return undefined;
        }

        // Move current present to future
        history.value.future.unshift(history.value.present);

        // Pop from past and set as present
        const previousState = history.value.past.pop()!;
        history.value.present = previousState;

        // Return deep clone to avoid reference issues
        return {
            nodes: JSON.parse(JSON.stringify(previousState.nodes)),
            edges: JSON.parse(JSON.stringify(previousState.edges)),
            timestamp: previousState.timestamp,
        };
    };

    /**
     * Redo the last undone change
     *
     * @returns The next state, or undefined if can't redo
     */
    const redo = (): HistoryState | undefined => {
        if (!canRedo.value) {
            return undefined;
        }

        // Push current present to past
        history.value.past.push(history.value.present);

        // Shift from future and set as present
        const nextState = history.value.future.shift()!;
        history.value.present = nextState;

        // Return deep clone to avoid reference issues
        return {
            nodes: JSON.parse(JSON.stringify(nextState.nodes)),
            edges: JSON.parse(JSON.stringify(nextState.edges)),
            timestamp: nextState.timestamp,
        };
    };

    /**
     * Clear all history (useful when loading new rule)
     */
    const clearHistory = () => {
        history.value = {
            past: [],
            present: { nodes: [], edges: [], timestamp: Date.now() },
            future: [],
        };
    };

    /**
     * Initialize history with initial state
     *
     * @param initialState - The initial state
     */
    const initializeHistory = (initialState: HistoryState) => {
        history.value = {
            past: [],
            present: {
                nodes: JSON.parse(JSON.stringify(initialState.nodes)),
                edges: JSON.parse(JSON.stringify(initialState.edges)),
                timestamp: initialState.timestamp,
            },
            future: [],
        };
    };

    /**
     * Get a formatted time difference for display
     *
     * @param timestamp - The timestamp to format
     * @returns Human-readable time difference
     */
    const getTimeDiff = (timestamp: number): string => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return {
        // State
        canUndo,
        canRedo,
        historySize,

        // Methods
        pushState,
        undo,
        redo,
        clearHistory,
        initializeHistory,
        getTimeDiff,
    };
}

/**
 * Composable for keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
 *
 * @param onUndo - Callback when undo is triggered
 * @param onRedo - Callback when redo is triggered
 *
 * @example
 * useReflexHistoryKeyboard(
 *   () => handleUndo(),
 *   () => handleRedo()
 * );
 */
export function useReflexHistoryKeyboard(onUndo: () => void, onRedo: () => void) {
    // Listen for Ctrl+Z (undo)
    onKeyStroke('z', e => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            e.preventDefault();
            onUndo();
        }
    });

    // Listen for Ctrl+Shift+Z (redo)
    onKeyStroke('z', e => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            e.preventDefault();
            onRedo();
        }
    });

    // Also listen for Ctrl+Y (alternative redo)
    onKeyStroke('y', e => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onRedo();
        }
    });
}
