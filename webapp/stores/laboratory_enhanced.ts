import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { LaboratoryType, UserType, DepartmentType } from '@/types/gql';
import { useEnhancedAuthStore } from './auth_enhanced';
import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';

const { withClientMutation, withClientQuery } = useApiUtil();
const { toastSuccess, toastError, toastWarning, toastInfo } = useNotifyToast();

// Enhanced interfaces for comprehensive laboratory management
interface ILaboratorySettings {
    uid: string;
    password_lifetime: number;
    inactivity_log_out: number;
    allow_self_verification: boolean;
    require_two_factor: boolean;
    allow_patient_registration: boolean;
    allow_sample_registration: boolean;
    allow_worksheet_creation: boolean;
    auto_receive_samples: boolean;
    auto_assign_worksheets: boolean;
    qc_frequency: string;
    qc_percentage: number;
    require_qc_approval: boolean;
    default_report_format: string;
    auto_release_results: boolean;
    require_result_verification: boolean;
    allow_provisional_results: boolean;
    allow_billing: boolean;
    currency: string;
    payment_terms_days: number;
    sample_retention_days: number;
    result_retention_days: number;
    audit_retention_days: number;
    external_system_integration: boolean;
    lis_integration_enabled: boolean;
    hl7_enabled: boolean;
    created_at: Date;
    updated_at: Date;
}

interface ILaboratoryTemplate {
    uid: string;
    name: string;
    description: string;
    laboratory_type: string;
    default_settings: Partial<ILaboratorySettings>;
    default_departments: string[];
    configuration_checklist: Array<{
        category: string;
        items: Array<{
            name: string;
            required: boolean;
            completed: boolean;
        }>;
    }>;
    created_at: Date;
}

interface ILaboratoryAnalytics {
    laboratory_uid: string;
    laboratory_name: string;
    organization_name?: string;
    total_users: number;
    active_users: number;
    inactive_users: number;
    user_role_distribution: Record<string, number>;
    total_departments: number;
    department_names: string[];
    configuration_completeness: number;
    compliance_score: number;
    usage_statistics: {
        daily_logins: number;
        weekly_samples: number;
        monthly_results: number;
        average_session_duration: number;
    };
    performance_metrics: {
        average_login_time: number;
        system_uptime: number;
        error_rate: number;
    };
    last_updated: Date;
}

interface ILaboratoryComplianceCheck {
    laboratory_uid: string;
    overall_score: number;
    checks_passed: number;
    total_checks: number;
    compliance_items: Array<{
        category: string;
        item: string;
        status: 'passed' | 'failed' | 'warning';
        description: string;
        recommendation?: string;
    }>;
    recommendations: string[];
    last_checked: Date;
}

interface ILaboratoryValidation {
    laboratory_uid: string;
    is_valid: boolean;
    has_dependencies: boolean;
    errors: string[];
    warnings: string[];
    dependencies: Record<string, any>;
    validation_timestamp: Date;
}

interface ILaboratoryConfiguration {
    laboratory_uid: string;
    settings: Record<string, any>;
    inherited_settings: Record<string, any>;
    departments: DepartmentType[];
    user_count: number;
    active_user_count: number;
    custom_configurations: Record<string, any>;
    feature_flags: Record<string, boolean>;
    integration_settings: Record<string, any>;
}

interface ILaboratoryUserAssignment {
    user_uid: string;
    user_name: string;
    user_email: string;
    role: string;
    assigned_at: Date;
    assigned_by: string;
    is_active: boolean;
    permissions: string[];
    department_assignments?: string[];
}

interface ILaboratoryOperation {
    operation_id: string;
    operation_type: 'create' | 'update' | 'delete' | 'clone' | 'transfer' | 'bulk_assign';
    laboratory_uid: string;
    initiated_by: string;
    initiated_at: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    estimated_completion?: Date;
    error_message?: string;
    metadata: Record<string, any>;
}

interface IEnhancedLaboratoryStore {
    // Core laboratory data
    laboratories: LaboratoryType[];
    activeLaboratory: LaboratoryType | null;
    availableLaboratories: LaboratoryType[];
    
    // Laboratory management
    laboratorySettings: Record<string, ILaboratorySettings>;
    laboratoryAnalytics: Record<string, ILaboratoryAnalytics>;
    laboratoryCompliance: Record<string, ILaboratoryComplianceCheck>;
    laboratoryValidations: Record<string, ILaboratoryValidation>;
    laboratoryConfigurations: Record<string, ILaboratoryConfiguration>;
    
    // Templates and operations
    laboratoryTemplates: ILaboratoryTemplate[];
    activeOperations: ILaboratoryOperation[];
    
    // User assignments
    laboratoryUserAssignments: Record<string, ILaboratoryUserAssignment[]>;
    
    // UI state management
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isSwitching: boolean;
    isValidating: boolean;
    
    // Search and filtering
    searchQuery: string;
    selectedLaboratoryType: string | null;
    selectedOrganization: string | null;
    sortBy: 'name' | 'created_at' | 'updated_at' | 'user_count';
    sortOrder: 'asc' | 'desc';
    
    // Cache management
    cacheTimestamps: Record<string, Date>;
    cacheExpiry: number; // milliseconds
    
    // Error handling
    lastError: string | null;
    errorHistory: Array<{
        error: string;
        timestamp: Date;
        context: string;
        laboratory_uid?: string;
    }>;
    
    // Performance monitoring
    performanceMetrics: {
        laboratory_load_time: number;
        settings_load_time: number;
        analytics_load_time: number;
        operation_execution_time: number;
    };
}

const STORAGE_LABORATORY_KEY = 'felicity_laboratory_store';
const STORAGE_SETTINGS_KEY = 'felicity_laboratory_settings';
const STORAGE_ANALYTICS_KEY = 'felicity_laboratory_analytics';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

export const useEnhancedLaboratoryStore = defineStore('enhancedLaboratory', () => {
    const authStore = useEnhancedAuthStore();
    
    // Initialize store state
    const initialState: IEnhancedLaboratoryStore = {
        // Core laboratory data
        laboratories: [],
        activeLaboratory: null,
        availableLaboratories: [],
        
        // Laboratory management
        laboratorySettings: {},
        laboratoryAnalytics: {},
        laboratoryCompliance: {},
        laboratoryValidations: {},
        laboratoryConfigurations: {},
        
        // Templates and operations
        laboratoryTemplates: [],
        activeOperations: [],
        
        // User assignments
        laboratoryUserAssignments: {},
        
        // UI state management
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isSwitching: false,
        isValidating: false,
        
        // Search and filtering
        searchQuery: '',
        selectedLaboratoryType: null,
        selectedOrganization: null,
        sortBy: 'name',
        sortOrder: 'asc',
        
        // Cache management
        cacheTimestamps: {},
        cacheExpiry: CACHE_EXPIRY_TIME,
        
        // Error handling
        lastError: null,
        errorHistory: [],
        
        // Performance monitoring
        performanceMetrics: {
            laboratory_load_time: 0,
            settings_load_time: 0,
            analytics_load_time: 0,
            operation_execution_time: 0,
        },
    };

    const store = ref<IEnhancedLaboratoryStore>({ ...initialState });

    // Computed properties for enhanced functionality
    const hasMultipleLaboratories = computed(() => {
        return store.value.availableLaboratories.length > 1;
    });

    const canSwitchLaboratories = computed(() => {
        return hasMultipleLaboratories.value && !store.value.isSwitching;
    });

    const activeLaboratorySettings = computed(() => {
        if (!store.value.activeLaboratory) return null;
        return store.value.laboratorySettings[store.value.activeLaboratory.uid] || null;
    });

    const activeLaboratoryAnalytics = computed(() => {
        if (!store.value.activeLaboratory) return null;
        return store.value.laboratoryAnalytics[store.value.activeLaboratory.uid] || null;
    });

    const activeLaboratoryCompliance = computed(() => {
        if (!store.value.activeLaboratory) return null;
        return store.value.laboratoryCompliance[store.value.activeLaboratory.uid] || null;
    });

    const activeLaboratoryConfiguration = computed(() => {
        if (!store.value.activeLaboratory) return null;
        return store.value.laboratoryConfigurations[store.value.activeLaboratory.uid] || null;
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
        
        // Apply laboratory type filter
        if (store.value.selectedLaboratoryType) {
            filtered = filtered.filter(lab => 
                lab.laboratory_type === store.value.selectedLaboratoryType
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
                case 'user_count':
                    const aAnalytics = store.value.laboratoryAnalytics[a.uid];
                    const bAnalytics = store.value.laboratoryAnalytics[b.uid];
                    aValue = aAnalytics?.total_users || 0;
                    bValue = bAnalytics?.total_users || 0;
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

    const recentOperations = computed(() => {
        return store.value.activeOperations
            .slice()
            .sort((a, b) => b.initiated_at.getTime() - a.initiated_at.getTime())
            .slice(0, 10);
    });

    const laboratoryStatistics = computed(() => {
        const totalLabs = store.value.laboratories.length;
        const activeLabs = store.value.laboratories.filter(lab => lab.is_active).length;
        const totalUsers = Object.values(store.value.laboratoryAnalytics)
            .reduce((sum, analytics) => sum + analytics.total_users, 0);
        const averageCompliance = Object.values(store.value.laboratoryCompliance)
            .reduce((sum, compliance, _, arr) => sum + compliance.overall_score / arr.length, 0);
        
        return {
            totalLaboratories: totalLabs,
            activeLaboratories: activeLabs,
            inactiveLaboratories: totalLabs - activeLabs,
            totalUsers,
            averageComplianceScore: averageCompliance,
            averageUsersPerLab: totalLabs > 0 ? Math.round(totalUsers / totalLabs) : 0,
        };
    });

    // Cache management methods
    const isCacheValid = (cacheKey: string): boolean => {
        const timestamp = store.value.cacheTimestamps[cacheKey];
        if (!timestamp) return false;
        return Date.now() - timestamp.getTime() < store.value.cacheExpiry;
    };

    const updateCacheTimestamp = (cacheKey: string) => {
        store.value.cacheTimestamps[cacheKey] = new Date();
    };

    const clearCache = (cacheKey?: string) => {
        if (cacheKey) {
            delete store.value.cacheTimestamps[cacheKey];
        } else {
            store.value.cacheTimestamps = {};
        }
    };

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
        
        // Keep only last 50 errors
        if (store.value.errorHistory.length > 50) {
            store.value.errorHistory = store.value.errorHistory.slice(0, 50);
        }
        
        console.error(`Laboratory Store Error [${context}]:`, error);
    };

    const clearErrors = () => {
        store.value.lastError = null;
        store.value.errorHistory = [];
    };

    // Core laboratory management methods
    const fetchLaboratories = async (forceRefresh = false): Promise<void> => {
        const cacheKey = 'laboratories';
        
        if (!forceRefresh && isCacheValid(cacheKey)) {
            return;
        }
        
        const startTime = performance.now();
        store.value.isLoading = true;
        
        try {
            // This would typically be a GraphQL query
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
                store.value.availableLaboratories = authStore.auth.laboratoryContext.availableLaboratories;
                updateCacheTimestamp(cacheKey);
            }
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratories');
            toastError('Failed to fetch laboratories');
        } finally {
            store.value.isLoading = false;
            store.value.performanceMetrics.laboratory_load_time = performance.now() - startTime;
        }
    };

    const createLaboratory = async (
        laboratoryData: any,
        settingsData?: any
    ): Promise<LaboratoryType | null> => {
        const startTime = performance.now();
        store.value.isCreating = true;
        
        try {
            // Create operation record
            const operationId = `create_${Date.now()}`;
            const operation: ILaboratoryOperation = {
                operation_id: operationId,
                operation_type: 'create',
                laboratory_uid: '',
                initiated_by: authStore.auth.user?.uid || '',
                initiated_at: new Date(),
                status: 'in_progress',
                progress: 0,
                metadata: { laboratoryData, settingsData },
            };
            
            store.value.activeOperations.push(operation);
            
            // Call GraphQL mutation
            const response = await withClientMutation(
                `mutation CreateLaboratoryEnhanced($laboratoryInput: EnhancedLaboratoryCreateInputType!, $settingsInput: LaboratorySettingsInputType) {
                    createLaboratoryEnhanced(laboratoryInput: $laboratoryInput, settingsInput: $settingsInput) {
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
                    laboratoryInput: laboratoryData,
                    settingsInput: settingsData,
                }
            );
            
            if (response?.createLaboratoryEnhanced) {
                const result = response.createLaboratoryEnhanced;
                
                if (result.__typename === 'LaboratoryType') {
                    // Update operation status
                    operation.status = 'completed';
                    operation.progress = 100;
                    operation.laboratory_uid = result.uid;
                    
                    // Add to laboratories list
                    store.value.laboratories.push(result);
                    
                    // Clear cache
                    clearCache();
                    
                    toastSuccess(`Laboratory "${result.name}" created successfully`);
                    return result;
                } else {
                    throw new Error(result.error || 'Failed to create laboratory');
                }
            }
            
            throw new Error('No response received');
            
        } catch (error) {
            // Update operation status
            const operation = store.value.activeOperations.find(op => op.operation_type === 'create');
            if (operation) {
                operation.status = 'failed';
                operation.error_message = String(error);
            }
            
            recordError(String(error), 'createLaboratory');
            toastError('Failed to create laboratory');
            return null;
            
        } finally {
            store.value.isCreating = false;
            store.value.performanceMetrics.operation_execution_time = performance.now() - startTime;
        }
    };

    const updateLaboratory = async (
        laboratoryUid: string,
        updateData: any
    ): Promise<LaboratoryType | null> => {
        const startTime = performance.now();
        store.value.isUpdating = true;
        
        try {
            const response = await withClientMutation(
                `mutation UpdateLaboratoryEnhanced($laboratoryUid: String!, $laboratoryInput: EnhancedLaboratoryUpdateInputType!) {
                    updateLaboratoryEnhanced(laboratoryUid: $laboratoryUid, laboratoryInput: $laboratoryInput) {
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
            
            if (response?.updateLaboratoryEnhanced) {
                const result = response.updateLaboratoryEnhanced;
                
                if (result.__typename === 'LaboratoryType') {
                    // Update in laboratories list
                    const index = store.value.laboratories.findIndex(lab => lab.uid === laboratoryUid);
                    if (index > -1) {
                        store.value.laboratories[index] = result;
                    }
                    
                    // Update active laboratory if it's the same
                    if (store.value.activeLaboratory?.uid === laboratoryUid) {
                        store.value.activeLaboratory = result;
                    }
                    
                    // Clear cache
                    clearCache();
                    
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
            store.value.performanceMetrics.operation_execution_time = performance.now() - startTime;
        }
    };

    const deleteLaboratory = async (
        laboratoryUid: string,
        forceDelete = false,
        reassignUsersTo?: string
    ): Promise<boolean> => {
        const startTime = performance.now();
        store.value.isDeleting = true;
        
        try {
            const response = await withClientMutation(
                `mutation DeleteLaboratoryEnhanced($laboratoryUid: String!, $forceDelete: Boolean!, $reassignUsersTo: String) {
                    deleteLaboratoryEnhanced(laboratoryUid: $laboratoryUid, forceDelete: $forceDelete, reassignUsersTo: $reassignUsersTo) {
                        ... on LaboratoryDeletionResponseType {
                            success
                            cleanup_results
                            errors
                            warnings
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                {
                    laboratoryUid,
                    forceDelete,
                    reassignUsersTo,
                }
            );
            
            if (response?.deleteLaboratoryEnhanced) {
                const result = response.deleteLaboratoryEnhanced;
                
                if (result.__typename === 'LaboratoryDeletionResponseType' && result.success) {
                    // Remove from laboratories list
                    store.value.laboratories = store.value.laboratories.filter(lab => lab.uid !== laboratoryUid);
                    
                    // Clear related data
                    delete store.value.laboratorySettings[laboratoryUid];
                    delete store.value.laboratoryAnalytics[laboratoryUid];
                    delete store.value.laboratoryCompliance[laboratoryUid];
                    delete store.value.laboratoryValidations[laboratoryUid];
                    delete store.value.laboratoryConfigurations[laboratoryUid];
                    delete store.value.laboratoryUserAssignments[laboratoryUid];
                    
                    // Switch active laboratory if needed
                    if (store.value.activeLaboratory?.uid === laboratoryUid) {
                        const availableLabs = store.value.availableLaboratories.filter(lab => lab.uid !== laboratoryUid);
                        store.value.activeLaboratory = availableLabs.length > 0 ? availableLabs[0] : null;
                    }
                    
                    // Clear cache
                    clearCache();
                    
                    toastSuccess('Laboratory deleted successfully');
                    
                    if (result.warnings?.length > 0) {
                        result.warnings.forEach(warning => toastWarning(warning));
                    }
                    
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
            store.value.performanceMetrics.operation_execution_time = performance.now() - startTime;
        }
    };

    const switchActiveLaboratory = async (laboratoryUid: string): Promise<boolean> => {
        if (store.value.isSwitching) {
            toastWarning('Laboratory switch already in progress');
            return false;
        }
        
        const targetLab = store.value.availableLaboratories.find(lab => lab.uid === laboratoryUid);
        if (!targetLab) {
            toastError('Laboratory not found');
            return false;
        }
        
        if (store.value.activeLaboratory?.uid === laboratoryUid) {
            toastInfo('Laboratory is already active');
            return true;
        }
        
        store.value.isSwitching = true;
        
        try {
            // Switch in auth store first
            const success = await authStore.switchActiveLaboratory(laboratoryUid);
            
            if (success) {
                store.value.activeLaboratory = targetLab;
                
                // Load laboratory-specific data
                await Promise.all([
                    fetchLaboratorySettings(laboratoryUid),
                    fetchLaboratoryAnalytics(laboratoryUid),
                    fetchLaboratoryConfiguration(laboratoryUid),
                ]);
                
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
            store.value.isSwitching = false;
        }
    };

    // Laboratory settings management
    const fetchLaboratorySettings = async (laboratoryUid: string, forceRefresh = false): Promise<ILaboratorySettings | null> => {
        const cacheKey = `settings_${laboratoryUid}`;
        
        if (!forceRefresh && isCacheValid(cacheKey) && store.value.laboratorySettings[laboratoryUid]) {
            return store.value.laboratorySettings[laboratoryUid];
        }
        
        const startTime = performance.now();
        
        try {
            // This would be a GraphQL query to fetch settings
            const response = await withClientQuery(
                `query GetLaboratorySettings($laboratoryUid: String!) {
                    laboratorySettings(laboratoryUid: $laboratoryUid) {
                        uid
                        password_lifetime
                        inactivity_log_out
                        allow_self_verification
                        require_two_factor
                        allow_patient_registration
                        allow_sample_registration
                        allow_worksheet_creation
                        auto_receive_samples
                        auto_assign_worksheets
                        qc_frequency
                        qc_percentage
                        require_qc_approval
                        default_report_format
                        auto_release_results
                        require_result_verification
                        allow_provisional_results
                        allow_billing
                        currency
                        payment_terms_days
                        sample_retention_days
                        result_retention_days
                        audit_retention_days
                        external_system_integration
                        lis_integration_enabled
                        hl7_enabled
                        created_at
                        updated_at
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.laboratorySettings) {
                const settings = response.laboratorySettings;
                store.value.laboratorySettings[laboratoryUid] = settings;
                updateCacheTimestamp(cacheKey);
                return settings;
            }
            
            return null;
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratorySettings', laboratoryUid);
            return null;
            
        } finally {
            store.value.performanceMetrics.settings_load_time = performance.now() - startTime;
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
                
                // Clear cache to trigger refresh
                clearCache(`settings_${laboratoryUid}`);
                
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

    // Laboratory analytics methods
    const fetchLaboratoryAnalytics = async (laboratoryUid: string, forceRefresh = false): Promise<ILaboratoryAnalytics | null> => {
        const cacheKey = `analytics_${laboratoryUid}`;
        
        if (!forceRefresh && isCacheValid(cacheKey) && store.value.laboratoryAnalytics[laboratoryUid]) {
            return store.value.laboratoryAnalytics[laboratoryUid];
        }
        
        const startTime = performance.now();
        
        try {
            const response = await withClientMutation(
                `mutation GetLaboratoryAnalytics($laboratoryUid: String!) {
                    getLaboratoryAnalytics(laboratoryUid: $laboratoryUid) {
                        ... on LaboratoryAnalyticsType {
                            laboratory_uid
                            laboratory_name
                            organization_name
                            total_users
                            active_users
                            inactive_users
                            user_role_distribution
                            total_departments
                            department_names
                            configuration_completeness
                            compliance_score
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.getLaboratoryAnalytics) {
                const result = response.getLaboratoryAnalytics;
                
                if (result.__typename === 'LaboratoryAnalyticsType') {
                    const analytics: ILaboratoryAnalytics = {
                        ...result,
                        usage_statistics: {
                            daily_logins: 0,
                            weekly_samples: 0,
                            monthly_results: 0,
                            average_session_duration: 0,
                        },
                        performance_metrics: {
                            average_login_time: 0,
                            system_uptime: 99.5,
                            error_rate: 0.1,
                        },
                        last_updated: new Date(),
                    };
                    
                    store.value.laboratoryAnalytics[laboratoryUid] = analytics;
                    updateCacheTimestamp(cacheKey);
                    return analytics;
                } else {
                    throw new Error(result.error || 'Failed to fetch analytics');
                }
            }
            
            return null;
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratoryAnalytics', laboratoryUid);
            return null;
            
        } finally {
            store.value.performanceMetrics.analytics_load_time = performance.now() - startTime;
        }
    };

    // Laboratory validation methods
    const validateLaboratory = async (laboratoryUid: string): Promise<ILaboratoryValidation | null> => {
        store.value.isValidating = true;
        
        try {
            const response = await withClientMutation(
                `mutation ValidateLaboratoryDependencies($laboratoryUid: String!) {
                    validateLaboratoryDependencies(laboratoryUid: $laboratoryUid) {
                        ... on LaboratoryValidationResultType {
                            laboratory_uid
                            is_valid
                            has_dependencies
                            errors
                            warnings
                            dependencies
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid }
            );
            
            if (response?.validateLaboratoryDependencies) {
                const result = response.validateLaboratoryDependencies;
                
                if (result.__typename === 'LaboratoryValidationResultType') {
                    const validation: ILaboratoryValidation = {
                        ...result,
                        validation_timestamp: new Date(),
                    };
                    
                    store.value.laboratoryValidations[laboratoryUid] = validation;
                    return validation;
                } else {
                    throw new Error(result.error || 'Failed to validate laboratory');
                }
            }
            
            return null;
            
        } catch (error) {
            recordError(String(error), 'validateLaboratory', laboratoryUid);
            return null;
            
        } finally {
            store.value.isValidating = false;
        }
    };

    // Laboratory configuration methods
    const fetchLaboratoryConfiguration = async (laboratoryUid: string, includeInherited = true): Promise<ILaboratoryConfiguration | null> => {
        const cacheKey = `config_${laboratoryUid}`;
        
        if (isCacheValid(cacheKey) && store.value.laboratoryConfigurations[laboratoryUid]) {
            return store.value.laboratoryConfigurations[laboratoryUid];
        }
        
        try {
            const response = await withClientMutation(
                `mutation GetLaboratoryConfiguration($laboratoryUid: String!, $includeInherited: Boolean!) {
                    getLaboratoryConfiguration(laboratoryUid: $laboratoryUid, includeInherited: $includeInherited) {
                        ... on LaboratoryConfigurationType {
                            laboratory_uid
                            settings
                            inherited_settings
                            departments
                            user_count
                            active_user_count
                        }
                        ... on OperationError {
                            error
                        }
                    }
                }`,
                { laboratoryUid, includeInherited }
            );
            
            if (response?.getLaboratoryConfiguration) {
                const result = response.getLaboratoryConfiguration;
                
                if (result.__typename === 'LaboratoryConfigurationType') {
                    const configuration: ILaboratoryConfiguration = {
                        ...result,
                        custom_configurations: {},
                        feature_flags: {},
                        integration_settings: {},
                    };
                    
                    store.value.laboratoryConfigurations[laboratoryUid] = configuration;
                    updateCacheTimestamp(cacheKey);
                    return configuration;
                } else {
                    throw new Error(result.error || 'Failed to fetch configuration');
                }
            }
            
            return null;
            
        } catch (error) {
            recordError(String(error), 'fetchLaboratoryConfiguration', laboratoryUid);
            return null;
        }
    };

    // Search and filter methods
    const setSearchQuery = (query: string) => {
        store.value.searchQuery = query;
    };

    const setLaboratoryTypeFilter = (type: string | null) => {
        store.value.selectedLaboratoryType = type;
    };

    const setOrganizationFilter = (organizationUid: string | null) => {
        store.value.selectedOrganization = organizationUid;
    };

    const setSorting = (sortBy: typeof store.value.sortBy, sortOrder: typeof store.value.sortOrder) => {
        store.value.sortBy = sortBy;
        store.value.sortOrder = sortOrder;
    };

    // Storage management
    const saveToStorage = () => {
        try {
            const storeData = {
                activeLaboratory: store.value.activeLaboratory,
                searchQuery: store.value.searchQuery,
                selectedLaboratoryType: store.value.selectedLaboratoryType,
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

    const loadFromStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_LABORATORY_KEY);
            if (stored) {
                const storeData = JSON.parse(stored);
                
                if (storeData.searchQuery) {
                    store.value.searchQuery = storeData.searchQuery;
                }
                if (storeData.selectedLaboratoryType) {
                    store.value.selectedLaboratoryType = storeData.selectedLaboratoryType;
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

    // Initialize store
    const initializeStore = async () => {
        loadFromStorage();
        
        // Sync with auth store
        if (authStore.auth.isAuthenticated) {
            store.value.availableLaboratories = authStore.auth.laboratoryContext.availableLaboratories;
            store.value.activeLaboratory = authStore.auth.laboratoryContext.activeLaboratory;
            
            // Fetch initial data
            await fetchLaboratories();
            
            if (store.value.activeLaboratory) {
                await Promise.all([
                    fetchLaboratorySettings(store.value.activeLaboratory.uid),
                    fetchLaboratoryAnalytics(store.value.activeLaboratory.uid),
                    fetchLaboratoryConfiguration(store.value.activeLaboratory.uid),
                ]);
            }
        }
    };

    // Reset store
    const resetStore = () => {
        store.value = { ...initialState };
        localStorage.removeItem(STORAGE_LABORATORY_KEY);
        localStorage.removeItem(STORAGE_SETTINGS_KEY);
        localStorage.removeItem(STORAGE_ANALYTICS_KEY);
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
        if (newActiveLab && newActiveLab.uid !== store.value.activeLaboratory?.uid) {
            store.value.activeLaboratory = newActiveLab;
            
            // Load laboratory-specific data
            Promise.all([
                fetchLaboratorySettings(newActiveLab.uid),
                fetchLaboratoryAnalytics(newActiveLab.uid),
                fetchLaboratoryConfiguration(newActiveLab.uid),
            ]);
        }
    });

    // Auto-save to storage on state changes
    watch(() => [
        store.value.searchQuery,
        store.value.selectedLaboratoryType,
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
        activeLaboratorySettings,
        activeLaboratoryAnalytics,
        activeLaboratoryCompliance,
        activeLaboratoryConfiguration,
        filteredLaboratories,
        recentOperations,
        laboratoryStatistics,
        
        // Core laboratory methods
        fetchLaboratories,
        createLaboratory,
        updateLaboratory,
        deleteLaboratory,
        switchActiveLaboratory,
        
        // Settings management
        fetchLaboratorySettings,
        updateLaboratorySettings,
        
        // Analytics methods
        fetchLaboratoryAnalytics,
        
        // Validation methods
        validateLaboratory,
        
        // Configuration methods
        fetchLaboratoryConfiguration,
        
        // Search and filter methods
        setSearchQuery,
        setLaboratoryTypeFilter,
        setOrganizationFilter,
        setSorting,
        
        // Cache management
        clearCache,
        
        // Error handling
        clearErrors,
        
        // Store management
        initializeStore,
        resetStore,
    };
});