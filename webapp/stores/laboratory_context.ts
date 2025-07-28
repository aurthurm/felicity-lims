import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { LaboratoryType, UserType } from '@/types/gql';
import { useAuthStore } from './auth';
import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';

// GraphQL mutations for laboratory context switching
const SetActiveLaboratoryDocument = `
  mutation SetActiveLaboratory($userUid: String!, $laboratoryUid: String!) {
    setUserActiveLaboratory(userUid: $userUid, laboratoryUid: $laboratoryUid) {
      ... on UserType {
        uid
        activeLaboratoryUid
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const RefreshUserLaboratoriesDocument = `
  query RefreshUserLaboratories($userUid: String!) {
    user(uid: $userUid) {
      uid
      laboratories {
        uid
        name
        code
        email
        organizationUid
        isActive
        createdAt
        updatedAt
      }
      activeLaboratoryUid
    }
  }
`;

interface LaboratoryContext {
  activeLaboratory: LaboratoryType | null;
  availableLaboratories: LaboratoryType[];
  isGlobalUser: boolean;
  contextSwitching: boolean;
  lastSwitchTime: Date | null;
  contextHistory: LaboratoryContextHistoryItem[];
}

interface LaboratoryContextHistoryItem {
  laboratoryUid: string;
  laboratoryName: string;
  switchTime: Date;
  sessionDuration?: number; // in minutes
}

interface SetActiveLaboratoryMutation {
  setUserActiveLaboratory: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    activeLaboratoryUid?: string;
    error?: string;
  };
}

interface SetActiveLaboratoryMutationVariables {
  userUid: string;
  laboratoryUid: string;
}

interface RefreshUserLaboratoriesQuery {
  user: {
    uid: string;
    laboratories: LaboratoryType[];
    activeLaboratoryUid: string;
  };
}

interface RefreshUserLaboratoriesQueryVariables {
  userUid: string;
}

const CONTEXT_STORAGE_KEY = 'felicity_laboratory_context';
const CONTEXT_HISTORY_KEY = 'felicity_context_history';
const MAX_HISTORY_ITEMS = 10;

export const useLaboratoryContextStore = defineStore('laboratoryContext', () => {
  const { withClientMutation, withClientQuery } = useApiUtil();
  const { toastSuccess, toastError, toastWarning } = useNotifyToast();
  const authStore = useAuthStore();

  const initialState: LaboratoryContext = {
    activeLaboratory: null,
    availableLaboratories: [],
    isGlobalUser: false,
    contextSwitching: false,
    lastSwitchTime: null,
    contextHistory: [],
  };

  const context = ref<LaboratoryContext>({ ...initialState });

  // Computed properties
  const hasMultipleLaboratories = computed(() => 
    context.value.availableLaboratories.length > 1
  );

  const canSwitchContext = computed(() => 
    hasMultipleLaboratories.value && !context.value.contextSwitching
  );

  const isLaboratoryAccessible = computed(() => (laboratoryUid: string) => 
    context.value.availableLaboratories.some(lab => lab.uid === laboratoryUid)
  );

  const getLaboratoryByUid = computed(() => (laboratoryUid: string) => 
    context.value.availableLaboratories.find(lab => lab.uid === laboratoryUid)
  );

  const getContextHistory = computed(() => 
    context.value.contextHistory.slice().reverse() // Most recent first
  );

  // Initialize context from auth store
  const initializeContext = () => {
    if (authStore.auth.laboratories && authStore.auth.laboratories.length > 0) {
      context.value.availableLaboratories = [...authStore.auth.laboratories];
      context.value.isGlobalUser = authStore.auth.laboratories.length > 1;
      
      // Set active laboratory
      if (authStore.auth.activeLaboratory) {
        context.value.activeLaboratory = authStore.auth.activeLaboratory;
      } else if (authStore.auth.laboratories.length === 1) {
        context.value.activeLaboratory = authStore.auth.laboratories[0];
      }

      // Load context history from storage
      loadContextHistory();
      
      // Save initial state
      saveContextToStorage();
    }
  };

  // Save context to local storage
  const saveContextToStorage = () => {
    try {
      const contextData = {
        activeLaboratoryUid: context.value.activeLaboratory?.uid,
        lastSwitchTime: context.value.lastSwitchTime,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(contextData));
    } catch (error) {
      console.error('Failed to save laboratory context to storage:', error);
    }
  };

  // Load context from local storage
  const loadContextFromStorage = () => {
    try {
      const stored = localStorage.getItem(CONTEXT_STORAGE_KEY);
      if (stored) {
        const contextData = JSON.parse(stored);
        
        // Validate stored laboratory is still accessible
        if (contextData.activeLaboratoryUid && 
            isLaboratoryAccessible.value(contextData.activeLaboratoryUid)) {
          const lab = getLaboratoryByUid.value(contextData.activeLaboratoryUid);
          if (lab) {
            context.value.activeLaboratory = lab;
          }
        }
        
        if (contextData.lastSwitchTime) {
          context.value.lastSwitchTime = new Date(contextData.lastSwitchTime);
        }
      }
    } catch (error) {
      console.error('Failed to load laboratory context from storage:', error);
    }
  };

  // Save context history
  const saveContextHistory = () => {
    try {
      localStorage.setItem(CONTEXT_HISTORY_KEY, JSON.stringify(context.value.contextHistory));
    } catch (error) {
      console.error('Failed to save context history:', error);
    }
  };

  // Load context history
  const loadContextHistory = () => {
    try {
      const stored = localStorage.getItem(CONTEXT_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        context.value.contextHistory = history.map((item: any) => ({
          ...item,
          switchTime: new Date(item.switchTime),
        }));
      }
    } catch (error) {
      console.error('Failed to load context history:', error);
    }
  };

  // Add to context history
  const addToContextHistory = (laboratory: LaboratoryType) => {
    const now = new Date();
    const lastItem = context.value.contextHistory[context.value.contextHistory.length - 1];
    
    // Update session duration for previous item
    if (lastItem && context.value.lastSwitchTime) {
      const duration = Math.floor((now.getTime() - context.value.lastSwitchTime.getTime()) / (1000 * 60));
      lastItem.sessionDuration = duration;
    }

    // Add new history item
    const historyItem: LaboratoryContextHistoryItem = {
      laboratoryUid: laboratory.uid,
      laboratoryName: laboratory.name,
      switchTime: now,
    };

    context.value.contextHistory.push(historyItem);

    // Keep only last MAX_HISTORY_ITEMS
    if (context.value.contextHistory.length > MAX_HISTORY_ITEMS) {
      context.value.contextHistory = context.value.contextHistory.slice(-MAX_HISTORY_ITEMS);
    }

    context.value.lastSwitchTime = now;
    saveContextHistory();
  };

  // Switch laboratory context
  const switchLaboratory = async (laboratoryUid: string): Promise<boolean> => {
    if (!authStore.auth.user) {
      toastError('User not authenticated');
      return false;
    }

    if (!isLaboratoryAccessible.value(laboratoryUid)) {
      toastError('Laboratory not accessible to user');
      return false;
    }

    if (context.value.activeLaboratory?.uid === laboratoryUid) {
      toastWarning('Laboratory is already active');
      return false;
    }

    const targetLaboratory = getLaboratoryByUid.value(laboratoryUid);
    if (!targetLaboratory) {
      toastError('Laboratory not found');
      return false;
    }

    context.value.contextSwitching = true;

    try {
      // Call backend to update active laboratory
      const result = await withClientMutation<SetActiveLaboratoryMutation, SetActiveLaboratoryMutationVariables>(
        SetActiveLaboratoryDocument,
        {
          userUid: authStore.auth.user.uid,
          laboratoryUid: laboratoryUid,
        },
        'setUserActiveLaboratory'
      );

      if (result.__typename === 'UserType') {
        // Update local state
        const previousLab = context.value.activeLaboratory;
        context.value.activeLaboratory = targetLaboratory;
        
        // Update auth store
        authStore.auth.activeLaboratory = targetLaboratory;
        authStore.auth.user.activeLaboratoryUid = laboratoryUid;

        // Add to history
        addToContextHistory(targetLaboratory);

        // Save to storage
        saveContextToStorage();

        toastSuccess(`Switched to ${targetLaboratory.name}`);
        
        // Emit context change event for other components
        emitContextChangeEvent(previousLab, targetLaboratory);
        
        return true;
      } else {
        toastError(result.error || 'Failed to switch laboratory context');
        return false;
      }
    } catch (error) {
      console.error('Error switching laboratory context:', error);
      toastError('Failed to switch laboratory context');
      return false;
    } finally {
      context.value.contextSwitching = false;
    }
  };

  // Emit context change event
  const emitContextChangeEvent = (previousLab: LaboratoryType | null, newLab: LaboratoryType) => {
    const event = new CustomEvent('laboratoryContextChanged', {
      detail: {
        previousLaboratory: previousLab,
        newLaboratory: newLab,
        timestamp: new Date(),
        userUid: authStore.auth.user?.uid,
      },
    });
    window.dispatchEvent(event);
  };

  // Refresh available laboratories
  const refreshLaboratories = async (): Promise<boolean> => {
    if (!authStore.auth.user) {
      return false;
    }

    try {
      const result = await withClientQuery<RefreshUserLaboratoriesQuery, RefreshUserLaboratoriesQueryVariables>(
        RefreshUserLaboratoriesDocument,
        { userUid: authStore.auth.user.uid }
      );

      if (result.user) {
        context.value.availableLaboratories = result.user.laboratories;
        
        // Update active laboratory if changed
        if (result.user.activeLaboratoryUid) {
          const activeLab = result.user.laboratories.find(lab => lab.uid === result.user.activeLaboratoryUid);
          if (activeLab) {
            context.value.activeLaboratory = activeLab;
            authStore.auth.activeLaboratory = activeLab;
          }
        }

        saveContextToStorage();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing laboratories:', error);
      return false;
    }
  };

  // Reset context (for logout)
  const resetContext = () => {
    context.value = { ...initialState };
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
  };

  // Get frequently used laboratories
  const getFrequentLaboratories = computed(() => {
    const labCounts = new Map<string, { lab: LaboratoryType; count: number; lastUsed: Date }>();
    
    context.value.contextHistory.forEach(item => {
      const lab = getLaboratoryByUid.value(item.laboratoryUid);
      if (lab) {
        const existing = labCounts.get(item.laboratoryUid);
        if (existing) {
          existing.count++;
          if (item.switchTime > existing.lastUsed) {
            existing.lastUsed = item.switchTime;
          }
        } else {
          labCounts.set(item.laboratoryUid, {
            lab,
            count: 1,
            lastUsed: item.switchTime,
          });
        }
      }
    });

    return Array.from(labCounts.values())
      .sort((a, b) => {
        // Sort by count descending, then by last used descending
        if (a.count !== b.count) {
          return b.count - a.count;
        }
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      })
      .slice(0, 5) // Top 5 frequently used
      .map(item => item.lab);
  });

  // Get recent laboratories
  const getRecentLaboratories = computed(() => {
    const recent = context.value.contextHistory
      .slice(-5) // Last 5 switches
      .map(item => getLaboratoryByUid.value(item.laboratoryUid))
      .filter((lab): lab is LaboratoryType => lab !== undefined)
      .reverse(); // Most recent first

    // Remove duplicates while preserving order
    const seen = new Set<string>();
    return recent.filter(lab => {
      if (seen.has(lab.uid)) {
        return false;
      }
      seen.add(lab.uid);
      return true;
    });
  });

  // Watch for auth store changes
  watch(() => authStore.auth, (newAuth) => {
    if (newAuth.user && newAuth.laboratories) {
      initializeContext();
    } else {
      resetContext();
    }
  }, { deep: true, immediate: true });

  return {
    // State
    context,
    
    // Computed
    hasMultipleLaboratories,
    canSwitchContext,
    isLaboratoryAccessible,
    getLaboratoryByUid,
    getContextHistory,
    getFrequentLaboratories,
    getRecentLaboratories,
    
    // Actions
    switchLaboratory,
    refreshLaboratories,
    resetContext,
    initializeContext,
    loadContextFromStorage,
    saveContextToStorage,
  };
});