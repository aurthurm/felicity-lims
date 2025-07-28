import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { LaboratoryType, UserType, DepartmentType } from '@/types/gql';
import { useEnhancedAuthStore } from './auth_enhanced';
import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';

const { withClientMutation, withClientQuery } = useApiUtil();
const { toastSuccess, toastError, toastWarning, toastInfo } = useNotifyToast();

// Core interfaces for laboratory management
interface ILaboratorySettings {
    uid: string;
    laboratory_uid: string;
    password_lifetime: number;
    inactivity_log_out: number;
    allow_self_verification: boolean;
    require_two_factor: boolean;
    allow_patient_registration: boolean;
    allow_sample_registration: boolean;
    allow_worksheet_creation: boolean;
    auto_receive_samples: boolean;
    qc_frequency: string;
    qc_percentage: number;
    require_qc_approval: boolean;
    default_report_format: string;
    require_result_verification: boolean;
    allow_billing: boolean;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

interface ILaboratoryContext {
    activeLaboratory: LaboratoryType | null;
    availableLaboratories: LaboratoryType[];
    contextSwitching: boolean;
    lastSwitchTime: Date | null;
    contextHistory: Array<{
        laboratory_uid: string;
        laboratory_name: string;
        switch_time: Date;
        session_duration?: number;
    }>;
    frequentLaboratories: LaboratoryType[];
    recentLaboratories: LaboratoryType[];
}

interface IUserAssignment {
    user_uid: string;
    user_name: string;
    user_email: string;
    role: string;
    assigned_at: Date;
    is_active: boolean;
}

interface ILaboratoryStore {
    // Core laboratory data
    laboratories: LaboratoryType[];
    laboratoryContext: ILaboratoryContext;
    laboratorySettings: Record<string, ILaboratorySettings>;
    laboratoryUsers: Record<string, IUserAssignment[]>;
    
    // UI state
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    
    // Search and filtering
    searchQuery: string;
    selectedOrganization: string | null;
    sortBy: 'name' | 'created_at' | 'updated_at';
    sortOrder: 'asc' | 'desc';
    
    // Error handling
    lastError: string | null;
    errorHistory: Array<{
        error: string;
        timestamp: Date;
        context: string;
        laboratory_uid?: string;
    }>;
}

const STORAGE_LABORATORY_KEY = 'felicity_laboratory_store';
const STORAGE_CONTEXT_KEY = 'felicity_laboratory_context';
const MAX_HISTORY_ITEMS = 20;

export const useLaboratoryStore = defineStore('laboratory', () => {
    const authStore = useEnhancedAuthStore();
    
    // Initialize store state
    const initialState: ILaboratoryStore = {
        // Core laboratory data
        laboratories: [],
        laboratoryContext: {
            activeLaboratory: null,
            availableLaboratories: [],
            contextSwitching: false,
            lastSwitchTime: null,
            contextHistory: [],
            frequentLaboratories: [],
            recentLaboratories: [],
        },
        laboratorySettings: {},
        laboratoryUsers: {},
        
        // UI state
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        
        // Search and filtering
        searchQuery: '',
        selectedOrganization: null,
        sortBy: 'name',
        sortOrder: 'asc',
        
        // Error handling
        lastError: null,
        errorHistory: [],
    };

    const store = ref<ILaboratoryStore>({ ...initialState });

    // Computed properties
    const hasMultipleLaboratories = computed(() => {
        return store.value.laboratoryContext.availableLaboratories.length > 1;
    });

    const canSwitchLaboratories = computed(() => {
        return hasMultipleLaboratories.value && !store.value.laboratoryContext.contextSwitching;
    });

    const activeLaboratory = computed(() => {
        return store.value.laboratoryContext.activeLaboratory;
    });

    const availableLaboratories = computed(() => {
        return store.value.laboratoryContext.availableLaboratories;
    });

    const activeLaboratorySettings = computed(() => {
        if (!activeLaboratory.value) return null;
        return store.value.laboratorySettings[activeLaboratory.value.uid] || null;
    });

    const activeLaboratoryUsers = computed(() => {
        if (!activeLaboratory.value) return [];
        return store.value.laboratoryUsers[activeLaboratory.value.uid] || [];
    });

    const filteredLaboratories = computed(() => {
        let filtered = [...store.value.laboratories];
        
        // Apply search filter
        if (store.value.searchQuery) {
            const query = store.value.searchQuery.toLowerCase();
            filtered = filtered.filter(lab => 
                lab.name.toLowerCase().includes(query) ||
                lab.code?.toLowerCase().includes(query) ||
                lab.email?.toLowerCase().includes(query)
            );
        }
        
        // Apply organization filter
        if (store.value.selectedOrganization) {
            filtered = filtered.filter(lab => 
                lab.organization_uid === store.value.selectedOrganization
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (store.value.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                case 'updated_at':
                    aValue = new Date(a.updated_at).getTime();
                    bValue = new Date(b.updated_at).getTime();
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }
            
            if (store.value.sortOrder === 'desc') {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            } else {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        });
        
        return filtered;
    });

    const laboratoryStatistics = computed(() => {
        const totalLabs = store.value.laboratories.length;
        const activeLabs = store.value.laboratories.filter(lab => lab.is_active).length;
        const userAssignments = Object.values(store.value.laboratoryUsers);
        const totalUsers = userAssignments.reduce((sum, assignments) => sum + assignments.length, 0);
        
        return {
            totalLaboratories: totalLabs,
            activeLaboratories: activeLabs,
            inactiveLaboratories: totalLabs - activeLabs,
            totalUsers,
            averageUsersPerLab: totalLabs > 0 ? Math.round(totalUsers / totalLabs) : 0,
        };
    });

    // Error handling methods
    const recordError = (error: string, context: string, laboratoryUid?: string) => {
        const errorEntry = {
            error,
            timestamp: new Date(),
            context,
            laboratory_uid: laboratoryUid,
        };
        
        store.value.errorHistory.unshift(errorEntry);
        store.value.lastError = error;
        
        // Keep only last 20 errors
        if (store.value.errorHistory.length > 20) {
            store.value.errorHistory = store.value.errorHistory.slice(0, 20);
        }
        
        console.error(`Laboratory Store Error [${context}]:`, error);
    };

    const clearErrors = () => {
        store.value.lastError = null;
        store.value.errorHistory = [];
    };

    // Core laboratory operations
    const fetchLaboratories = async (forceRefresh = false): Promise<void> => {
        store.value.isLoading = true;
        
        try {
            const response = await withClientQuery(
                `query GetLaboratories {
                    laboratories {
                        uid
                        name
                        code
                        email
                        organization_uid
                        laboratory_type
                        is_active
                        created_at
                        updated_at
                    }
                }`,
                {}
            );
            
            if (response?.laboratories) {
                store.value.laboratories = response.laboratories;
                
                // Sync with auth store
                store.value.laboratoryContext.availableLaboratories = 
                    authStore.auth.laboratoryContext.availableLaboratories;
            }
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratories');
            toastError('Failed to fetch laboratories');
        } finally {
            store.value.isLoading = false;
        }
    };

    const createLaboratory = async (laboratoryData: any): Promise<LaboratoryType | null> => {
        store.value.isCreating = true;
        
        try {
            const response = await withClientMutation(
                `mutation CreateLaboratory($laboratoryInput: LaboratoryCreateInputType!) {
                    createLaboratory(laboratoryInput: $laboratoryInput) {
                        ... on LaboratoryType {
                            uid
                            name
                            code
                            email
                            organization_uid
                            laboratory_type
                            is_active
                            created_at
                            updated_at
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryInput: laboratoryData }
            );
            
            if (response?.createLaboratory) {
                const result = response.createLaboratory;
                
                if (result.__typename === 'LaboratoryType') {
                    store.value.laboratories.push(result);
                    toastSuccess(`Laboratory "${result.name}" created successfully`);
                    return result;
                } else {
                    throw new Error(result.error || 'Failed to create laboratory');
                }
            }
            
            throw new Error('No response received');
            
        } catch (error) {
            recordError(String(error), 'createLaboratory');
            toastError('Failed to create laboratory');
            return null;
            
        } finally {
            store.value.isCreating = false;
        }
    };

    const updateLaboratory = async (
        laboratoryUid: string,
        updateData: any
    ): Promise<LaboratoryType | null> => {
        store.value.isUpdating = true;
        
        try {
            const response = await withClientMutation(
                `mutation UpdateLaboratory($laboratoryUid: String!, $laboratoryInput: LaboratoryUpdateInputType!) {
                    updateLaboratory(laboratoryUid: $laboratoryUid, laboratoryInput: $laboratoryInput) {
                        ... on LaboratoryType {
                            uid
                            name
                            code
                            email
                            organization_uid
                            laboratory_type
                            is_active
                            created_at
                            updated_at
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                {
                    laboratoryUid,
                    laboratoryInput: updateData,
                }
            );
            
            if (response?.updateLaboratory) {
                const result = response.updateLaboratory;
                
                if (result.__typename === 'LaboratoryType') {
                    // Update in laboratories list
                    const index = store.value.laboratories.findIndex(lab => lab.uid === laboratoryUid);
                    if (index > -1) {
                        store.value.laboratories[index] = result;
                    }
                    
                    // Update active laboratory if it's the same
                    if (store.value.laboratoryContext.activeLaboratory?.uid === laboratoryUid) {
                        store.value.laboratoryContext.activeLaboratory = result;
                    }
                    
                    toastSuccess(`Laboratory "${result.name}" updated successfully`);
                    return result;
                } else {
                    throw new Error(result.error || 'Failed to update laboratory');
                }
            }
            
            throw new Error('No response received');
            
        } catch (error) {
            recordError(String(error), 'updateLaboratory', laboratoryUid);
            toastError('Failed to update laboratory');
            return null;
            
        } finally {
            store.value.isUpdating = false;
        }
    };

    const deleteLaboratory = async (laboratoryUid: string): Promise<boolean> => {
        store.value.isDeleting = true;
        
        try {
            const response = await withClientMutation(
                `mutation DeleteLaboratory($laboratoryUid: String!) {
                    deleteLaboratory(laboratoryUid: $laboratoryUid) {
                        ... on MessageType {
                            message
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.deleteLaboratory) {
                const result = response.deleteLaboratory;
                
                if (result.__typename === 'MessageType') {
                    // Remove from laboratories list
                    store.value.laboratories = store.value.laboratories.filter(lab => lab.uid !== laboratoryUid);
                    
                    // Clear related data
                    delete store.value.laboratorySettings[laboratoryUid];
                    delete store.value.laboratoryUsers[laboratoryUid];
                    
                    // Switch active laboratory if needed
                    if (store.value.laboratoryContext.activeLaboratory?.uid === laboratoryUid) {
                        const availableLabs = store.value.laboratoryContext.availableLaboratories
                            .filter(lab => lab.uid !== laboratoryUid);
                        store.value.laboratoryContext.activeLaboratory = 
                            availableLabs.length > 0 ? availableLabs[0] : null;
                    }
                    
                    toastSuccess('Laboratory deleted successfully');
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to delete laboratory');
                }
            }
            
            throw new Error('No response received');
            
        } catch (error) {
            recordError(String(error), 'deleteLaboratory', laboratoryUid);
            toastError('Failed to delete laboratory');
            return false;
            
        } finally {
            store.value.isDeleting = false;
        }
    };

    // Laboratory context switching
    const switchActiveLaboratory = async (laboratoryUid: string): Promise<boolean> => {
        if (store.value.laboratoryContext.contextSwitching) {
            toastWarning('Laboratory switch already in progress');
            return false;
        }
        
        const targetLab = store.value.laboratoryContext.availableLaboratories
            .find(lab => lab.uid === laboratoryUid);
        if (!targetLab) {
            toastError('Laboratory not found');
            return false;
        }
        
        if (store.value.laboratoryContext.activeLaboratory?.uid === laboratoryUid) {
            toastInfo('Laboratory is already active');
            return true;
        }
        
        store.value.laboratoryContext.contextSwitching = true;
        
        try {
            // Switch in auth store first
            const success = await authStore.switchActiveLaboratory(laboratoryUid);
            
            if (success) {
                const previousLab = store.value.laboratoryContext.activeLaboratory;
                store.value.laboratoryContext.activeLaboratory = targetLab;
                store.value.laboratoryContext.lastSwitchTime = new Date();
                
                // Add to context history
                addToContextHistory(targetLab);
                
                // Update recent and frequent laboratories
                updateRecentLaboratories(targetLab);
                updateFrequentLaboratories();
                
                // Load laboratory-specific data
                await Promise.all([
                    fetchLaboratorySettings(laboratoryUid),
                    fetchLaboratoryUsers(laboratoryUid),
                ]);
                
                // Emit context change event
                emitContextChangeEvent(previousLab, targetLab);
                
                toastSuccess(`Switched to ${targetLab.name}`);
                return true;
            } else {
                toastError('Failed to switch laboratory');
                return false;
            }
            
        } catch (error) {
            recordError(String(error), 'switchActiveLaboratory', laboratoryUid);
            toastError('Failed to switch laboratory');
            return false;
            
        } finally {
            store.value.laboratoryContext.contextSwitching = false;
        }
    };

    const addToContextHistory = (laboratory: LaboratoryType) => {
        const now = new Date();
        const lastItem = store.value.laboratoryContext.contextHistory[
            store.value.laboratoryContext.contextHistory.length - 1
        ];
        
        // Update session duration for previous item
        if (lastItem && store.value.laboratoryContext.lastSwitchTime) {
            const duration = Math.floor(
                (now.getTime() - store.value.laboratoryContext.lastSwitchTime.getTime()) / (1000 * 60)
            );
            lastItem.session_duration = duration;
        }

        // Add new history item
        const historyItem = {
            laboratory_uid: laboratory.uid,
            laboratory_name: laboratory.name,
            switch_time: now,
        };

        store.value.laboratoryContext.contextHistory.push(historyItem);

        // Keep only last MAX_HISTORY_ITEMS
        if (store.value.laboratoryContext.contextHistory.length > MAX_HISTORY_ITEMS) {
            store.value.laboratoryContext.contextHistory = 
                store.value.laboratoryContext.contextHistory.slice(-MAX_HISTORY_ITEMS);
        }

        saveContextToStorage();
    };

    const updateRecentLaboratories = (laboratory: LaboratoryType) => {
        const recent = store.value.laboratoryContext.recentLaboratories;
        const existingIndex = recent.findIndex(lab => lab.uid === laboratory.uid);
        
        if (existingIndex > -1) {
            recent.splice(existingIndex, 1);
        }
        
        recent.unshift(laboratory);
        
        // Keep only last 5 recent laboratories
        if (recent.length > 5) {
            store.value.laboratoryContext.recentLaboratories = recent.slice(0, 5);
        }
    };

    const updateFrequentLaboratories = () => {
        const labCounts = new Map<string, { lab: LaboratoryType; count: number; lastUsed: Date }>();
        
        store.value.laboratoryContext.contextHistory.forEach(item => {
            const lab = store.value.laboratoryContext.availableLaboratories
                .find(l => l.uid === item.laboratory_uid);
            if (lab) {
                const existing = labCounts.get(item.laboratory_uid);
                if (existing) {
                    existing.count++;
                    if (item.switch_time > existing.lastUsed) {
                        existing.lastUsed = item.switch_time;
                    }
                } else {
                    labCounts.set(item.laboratory_uid, {
                        lab,
                        count: 1,
                        lastUsed: item.switch_time,
                    });
                }
            }
        });

        const frequent = Array.from(labCounts.values())
            .sort((a, b) => {
                // Sort by count descending, then by last used descending
                if (a.count !== b.count) {
                    return b.count - a.count;
                }
                return b.lastUsed.getTime() - a.lastUsed.getTime();
            })
            .slice(0, 3) // Top 3 frequently used
            .map(item => item.lab);
        
        store.value.laboratoryContext.frequentLaboratories = frequent;
    };

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

    // Laboratory settings management
    const fetchLaboratorySettings = async (laboratoryUid: string): Promise<ILaboratorySettings | null> => {
        try {
            const response = await withClientQuery(
                `query GetLaboratorySettings($laboratoryUid: String!) {
                    laboratorySettings(laboratoryUid: $laboratoryUid) {
                        uid
                        laboratory_uid
                        password_lifetime
                        inactivity_log_out
                        allow_self_verification
                        require_two_factor
                        allow_patient_registration
                        allow_sample_registration
                        allow_worksheet_creation
                        auto_receive_samples
                        qc_frequency
                        qc_percentage
                        require_qc_approval
                        default_report_format
                        require_result_verification
                        allow_billing
                        currency
                        created_at
                        updated_at
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.laboratorySettings) {
                const settings = response.laboratorySettings;
                store.value.laboratorySettings[laboratoryUid] = settings;
                return settings;
            }
            
            return null;
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratorySettings', laboratoryUid);
            return null;
        }
    };

    const updateLaboratorySettings = async (
        laboratoryUid: string,
        settingsData: Partial<ILaboratorySettings>
    ): Promise<boolean> => {
        try {
            const response = await withClientMutation(
                `mutation UpdateLaboratorySettings($laboratoryUid: String!, $settingsInput: LaboratorySettingsInputType!) {
                    updateLaboratorySettings(laboratoryUid: $laboratoryUid, settingsInput: $settingsInput) {
                        message
                    }
                }`,
                {
                    laboratoryUid,
                    settingsInput: settingsData,
                }
            );
            
            if (response?.updateLaboratorySettings) {
                // Update local cache
                if (store.value.laboratorySettings[laboratoryUid]) {
                    store.value.laboratorySettings[laboratoryUid] = {
                        ...store.value.laboratorySettings[laboratoryUid],
                        ...settingsData,
                        updated_at: new Date(),
                    };
                }
                
                toastSuccess('Laboratory settings updated successfully');
                return true;
            }
            
            return false;
            
        } catch (error) {
            recordError(String(error), 'updateLaboratorySettings', laboratoryUid);
            toastError('Failed to update laboratory settings');
            return false;
        }
    };

    // Laboratory user management
    const fetchLaboratoryUsers = async (laboratoryUid: string): Promise<IUserAssignment[]> => {
        try {
            const response = await withClientQuery(
                `query GetLaboratoryUsers($laboratoryUid: String!) {
                    laboratoryUsers(laboratoryUid: $laboratoryUid) {
                        user_uid
                        user_name
                        user_email
                        role
                        assigned_at
                        is_active
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.laboratoryUsers) {
                const users = response.laboratoryUsers;
                store.value.laboratoryUsers[laboratoryUid] = users;
                return users;
            }
            
            return [];
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratoryUsers', laboratoryUid);
            return [];
        }
    };

    const assignUserToLaboratory = async (
        laboratoryUid: string,
        userUid: string,
        role: string = 'user'
    ): Promise<boolean> => {
        try {
            const response = await withClientMutation(
                `mutation AssignUserToLaboratory($laboratoryUid: String!, $userUid: String!, $role: String!) {
                    assignUserToLaboratory(laboratoryUid: $laboratoryUid, userUid: $userUid, role: $role) {
                        ... on MessageType {
                            message
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid, userUid, role }
            );
            
            if (response?.assignUserToLaboratory) {
                const result = response.assignUserToLaboratory;
                
                if (result.__typename === 'MessageType') {
                    // Refresh laboratory users
                    await fetchLaboratoryUsers(laboratoryUid);
                    toastSuccess('User assigned to laboratory successfully');
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to assign user');
                }
            }
            
            return false;
            
        } catch (error) {
            recordError(String(error), 'assignUserToLaboratory', laboratoryUid);
            toastError('Failed to assign user to laboratory');
            return false;
        }
    };

    const removeUserFromLaboratory = async (
        laboratoryUid: string,
        userUid: string
    ): Promise<boolean> => {
        try {
            const response = await withClientMutation(
                `mutation RemoveUserFromLaboratory($laboratoryUid: String!, $userUid: String!) {
                    removeUserFromLaboratory(laboratoryUid: $laboratoryUid, userUid: $userUid) {
                        ... on MessageType {
                            message
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid, userUid }
            );
            
            if (response?.removeUserFromLaboratory) {
                const result = response.removeUserFromLaboratory;
                
                if (result.__typename === 'MessageType') {
                    // Refresh laboratory users
                    await fetchLaboratoryUsers(laboratoryUid);
                    toastSuccess('User removed from laboratory successfully');
                    return true;
                } else {
                    throw new Error(result.error || 'Failed to remove user');
                }
            }
            
            return false;
            
        } catch (error) {
            recordError(String(error), 'removeUserFromLaboratory', laboratoryUid);
            toastError('Failed to remove user from laboratory');
            return false;
        }
    };

    // Search and filter methods
    const setSearchQuery = (query: string) => {
        store.value.searchQuery = query;
    };

    const setOrganizationFilter = (organizationUid: string | null) => {
        store.value.selectedOrganization = organizationUid;
    };

    const setSorting = (sortBy: typeof store.value.sortBy, sortOrder: typeof store.value.sortOrder) => {
        store.value.sortBy = sortBy;
        store.value.sortOrder = sortOrder;
    };

    // Validation methods
    const validateLaboratoryAccess = (laboratoryUid: string): boolean => {
        return store.value.laboratoryContext.availableLaboratories
            .some(lab => lab.uid === laboratoryUid);
    };

    const canAccessLaboratory = (laboratoryUid: string): boolean => {
        return validateLaboratoryAccess(laboratoryUid);
    };

    const getLaboratoryByUid = (laboratoryUid: string): LaboratoryType | undefined => {
        return store.value.laboratories.find(lab => lab.uid === laboratoryUid);
    };

    const getLaboratoryByCode = (code: string): LaboratoryType | undefined => {
        return store.value.laboratories.find(lab => lab.code === code);
    };

    // Storage management
    const saveToStorage = () => {
        try {
            const storeData = {
                searchQuery: store.value.searchQuery,
                selectedOrganization: store.value.selectedOrganization,
                sortBy: store.value.sortBy,
                sortOrder: store.value.sortOrder,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_LABORATORY_KEY, JSON.stringify(storeData));
        } catch (error) {
            console.error('Failed to save laboratory store to storage:', error);
        }
    };

    const saveContextToStorage = () => {
        try {
            const contextData = {
                activeLaboratoryUid: store.value.laboratoryContext.activeLaboratory?.uid,
                lastSwitchTime: store.value.laboratoryContext.lastSwitchTime,
                contextHistory: store.value.laboratoryContext.contextHistory,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_CONTEXT_KEY, JSON.stringify(contextData));
        } catch (error) {
            console.error('Failed to save laboratory context to storage:', error);
        }
    };

    const loadFromStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_LABORATORY_KEY);
            if (stored) {
                const storeData = JSON.parse(stored);
                
                if (storeData.searchQuery) {
                    store.value.searchQuery = storeData.searchQuery;
                }
                if (storeData.selectedOrganization) {
                    store.value.selectedOrganization = storeData.selectedOrganization;
                }
                if (storeData.sortBy) {
                    store.value.sortBy = storeData.sortBy;
                }
                if (storeData.sortOrder) {
                    store.value.sortOrder = storeData.sortOrder;
                }
            }
        } catch (error) {
            console.error('Failed to load laboratory store from storage:', error);
        }
    };

    const loadContextFromStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_CONTEXT_KEY);
            if (stored) {
                const contextData = JSON.parse(stored);
                
                if (contextData.lastSwitchTime) {
                    store.value.laboratoryContext.lastSwitchTime = new Date(contextData.lastSwitchTime);
                }
                if (contextData.contextHistory) {
                    store.value.laboratoryContext.contextHistory = contextData.contextHistory.map((item: any) => ({
                        ...item,
                        switch_time: new Date(item.switch_time),
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to load laboratory context from storage:', error);
        }
    };

    // Initialize store
    const initializeStore = async () => {
        loadFromStorage();
        loadContextFromStorage();
        
        // Sync with auth store
        if (authStore.auth.isAuthenticated) {
            store.value.laboratoryContext.availableLaboratories = 
                authStore.auth.laboratoryContext.availableLaboratories;
            store.value.laboratoryContext.activeLaboratory = 
                authStore.auth.laboratoryContext.activeLaboratory;
            
            // Fetch initial data
            await fetchLaboratories();
            
            if (store.value.laboratoryContext.activeLaboratory) {
                await Promise.all([
                    fetchLaboratorySettings(store.value.laboratoryContext.activeLaboratory.uid),
                    fetchLaboratoryUsers(store.value.laboratoryContext.activeLaboratory.uid),
                ]);
            }
            
            // Update frequent and recent laboratories
            updateFrequentLaboratories();
        }
    };

    // Reset store
    const resetStore = () => {
        store.value = { ...initialState };
        localStorage.removeItem(STORAGE_LABORATORY_KEY);
        localStorage.removeItem(STORAGE_CONTEXT_KEY);
    };

    // Watch for auth store changes
    watch(() => authStore.auth.isAuthenticated, (isAuthenticated) => {
        if (isAuthenticated) {
            initializeStore();
        } else {
            resetStore();
        }
    });

    // Watch for active laboratory changes in auth store
    watch(() => authStore.auth.laboratoryContext.activeLaboratory, (newActiveLab) => {
        if (newActiveLab && newActiveLab.uid !== store.value.laboratoryContext.activeLaboratory?.uid) {
            store.value.laboratoryContext.activeLaboratory = newActiveLab;
            
            // Load laboratory-specific data
            Promise.all([
                fetchLaboratorySettings(newActiveLab.uid),
                fetchLaboratoryUsers(newActiveLab.uid),
            ]);
        }
    });

    // Auto-save to storage on state changes
    watch(() => [
        store.value.searchQuery,
        store.value.selectedOrganization,
        store.value.sortBy,
        store.value.sortOrder,
    ], () => {
        saveToStorage();
    }, { deep: true });

    // Initialize on store creation
    initializeStore();

    return {
        // State
        store: computed(() => store.value),
        
        // Computed properties
        hasMultipleLaboratories,
        canSwitchLaboratories,
        activeLaboratory,
        availableLaboratories,
        activeLaboratorySettings,
        activeLaboratoryUsers,
        filteredLaboratories,
        laboratoryStatistics,
        
        // Core operations
        fetchLaboratories,
        createLaboratory,
        updateLaboratory,
        deleteLaboratory,
        
        // Context switching
        switchActiveLaboratory,
        
        // Settings management
        fetchLaboratorySettings,
        updateLaboratorySettings,
        
        // User management
        fetchLaboratoryUsers,
        assignUserToLaboratory,
        removeUserFromLaboratory,
        
        // Search and filtering
        setSearchQuery,
        setOrganizationFilter,
        setSorting,
        
        // Validation
        validateLaboratoryAccess,
        canAccessLaboratory,
        getLaboratoryByUid,
        getLaboratoryByCode,
        
        // Error handling
        clearErrors,
        
        // Store management
        initializeStore,
        resetStore,
    };
});