import { computed, ref, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEnhancedLaboratoryStore } from '@/stores/laboratory_enhanced';
import { useEnhancedAuthStore } from '@/stores/auth_enhanced';
import { LaboratoryType, DepartmentType } from '@/types/gql';

/**
 * Enhanced laboratory composable with comprehensive multi-tenant features
 */
export function useEnhancedLaboratory() {
    const laboratoryStore = useEnhancedLaboratoryStore();
    const authStore = useEnhancedAuthStore();
    const router = useRouter();
    const route = useRoute();
    
    // Reactive laboratory state
    const laboratories = computed(() => laboratoryStore.filteredLaboratories);
    const activeLaboratory = computed(() => laboratoryStore.store.activeLaboratory);
    const availableLaboratories = computed(() => laboratoryStore.store.availableLaboratories);
    const hasMultipleLaboratories = computed(() => laboratoryStore.hasMultipleLaboratories);
    const canSwitchLaboratories = computed(() => laboratoryStore.canSwitchLaboratories);
    
    // Laboratory state indicators
    const isLoading = computed(() => laboratoryStore.store.isLoading);
    const isCreating = computed(() => laboratoryStore.store.isCreating);
    const isUpdating = computed(() => laboratoryStore.store.isUpdating);
    const isDeleting = computed(() => laboratoryStore.store.isDeleting);
    const isSwitching = computed(() => laboratoryStore.store.isSwitching);
    const isValidating = computed(() => laboratoryStore.store.isValidating);
    
    // Laboratory data
    const laboratorySettings = computed(() => laboratoryStore.activeLaboratorySettings);
    const laboratoryAnalytics = computed(() => laboratoryStore.activeLaboratoryAnalytics);
    const laboratoryCompliance = computed(() => laboratoryStore.activeLaboratoryCompliance);
    const laboratoryConfiguration = computed(() => laboratoryStore.activeLaboratoryConfiguration);
    
    // Statistics and metrics
    const laboratoryStatistics = computed(() => laboratoryStore.laboratoryStatistics);
    const recentOperations = computed(() => laboratoryStore.recentOperations);
    
    // Error handling
    const lastError = computed(() => laboratoryStore.store.lastError);
    const errorHistory = computed(() => laboratoryStore.store.errorHistory);
    
    // Core laboratory operations
    const createLaboratory = async (laboratoryData: any, settingsData?: any) => {
        return await laboratoryStore.createLaboratory(laboratoryData, settingsData);
    };
    
    const updateLaboratory = async (laboratoryUid: string, updateData: any) => {
        return await laboratoryStore.updateLaboratory(laboratoryUid, updateData);
    };
    
    const deleteLaboratory = async (
        laboratoryUid: string, 
        forceDelete = false, 
        reassignUsersTo?: string
    ) => {
        return await laboratoryStore.deleteLaboratory(laboratoryUid, forceDelete, reassignUsersTo);
    };
    
    const switchLaboratory = async (laboratoryUid: string) => {
        const success = await laboratoryStore.switchActiveLaboratory(laboratoryUid);
        
        if (success) {
            // Update route if needed to reflect laboratory change
            const currentPath = route.path;
            const hasLabParam = route.params.laboratoryId;
            
            if (hasLabParam && hasLabParam !== laboratoryUid) {
                // Update route with new laboratory parameter
                const newPath = currentPath.replace(hasLabParam as string, laboratoryUid);
                await router.replace(newPath);
            }
        }
        
        return success;
    };
    
    const refreshLaboratories = async (forceRefresh = false) => {
        await laboratoryStore.fetchLaboratories(forceRefresh);
    };
    
    // Laboratory settings operations
    const getLaboratorySettings = async (laboratoryUid: string, forceRefresh = false) => {
        return await laboratoryStore.fetchLaboratorySettings(laboratoryUid, forceRefresh);
    };
    
    const updateLaboratorySettings = async (
        laboratoryUid: string, 
        settingsData: any
    ) => {
        return await laboratoryStore.updateLaboratorySettings(laboratoryUid, settingsData);
    };
    
    // Laboratory analytics operations
    const getLaboratoryAnalytics = async (laboratoryUid: string, forceRefresh = false) => {
        return await laboratoryStore.fetchLaboratoryAnalytics(laboratoryUid, forceRefresh);
    };
    
    const refreshAnalytics = async (laboratoryUid?: string) => {
        const targetUid = laboratoryUid || activeLaboratory.value?.uid;
        if (targetUid) {
            return await laboratoryStore.fetchLaboratoryAnalytics(targetUid, true);
        }
        return null;
    };
    
    // Laboratory validation operations
    const validateLaboratory = async (laboratoryUid: string) => {
        return await laboratoryStore.validateLaboratory(laboratoryUid);
    };
    
    const getLaboratoryConfiguration = async (
        laboratoryUid: string, 
        includeInherited = true
    ) => {
        return await laboratoryStore.fetchLaboratoryConfiguration(laboratoryUid, includeInherited);
    };
    
    // Search and filtering operations
    const setSearchQuery = (query: string) => {
        laboratoryStore.setSearchQuery(query);
    };
    
    const setLaboratoryTypeFilter = (type: string | null) => {
        laboratoryStore.setLaboratoryTypeFilter(type);
    };
    
    const setOrganizationFilter = (organizationUid: string | null) => {
        laboratoryStore.setOrganizationFilter(organizationUid);
    };
    
    const setSorting = (
        sortBy: 'name' | 'created_at' | 'updated_at' | 'user_count', 
        sortOrder: 'asc' | 'desc'
    ) => {
        laboratoryStore.setSorting(sortBy, sortOrder);
    };
    
    // Laboratory access validation
    const canAccessLaboratory = (laboratoryUid: string) => {
        return availableLaboratories.value.some(lab => lab.uid === laboratoryUid);
    };
    
    const hasLaboratoryPermission = (permission: string, laboratoryUid?: string) => {
        const targetUid = laboratoryUid || activeLaboratory.value?.uid;
        if (!targetUid) return false;
        
        return authStore.auth.laboratoryContext.contextPermissions[targetUid]?.includes(permission) || false;
    };
    
    const isLaboratoryAdmin = computed(() => {
        return hasLaboratoryPermission('admin') || authStore.auth.user?.isAdmin || false;
    });
    
    const canManageLaboratory = computed(() => {
        return hasLaboratoryPermission('manage_laboratory') || isLaboratoryAdmin.value;
    });
    
    const canCreateLaboratory = computed(() => {
        return hasLaboratoryPermission('create_laboratory') || authStore.auth.user?.isSuperuser || false;
    };
    
    const canDeleteLaboratory = computed(() => {
        return hasLaboratoryPermission('delete_laboratory') || authStore.auth.user?.isSuperuser || false;
    });
    
    // Laboratory selection helpers
    const getLaboratoryByUid = (laboratoryUid: string): LaboratoryType | undefined => {
        return laboratories.value.find(lab => lab.uid === laboratoryUid);
    };
    
    const getLaboratoryByCode = (code: string): LaboratoryType | undefined => {
        return laboratories.value.find(lab => lab.code === code);
    };
    
    const getFrequentLaboratories = computed(() => {
        // This would come from laboratory history/usage data
        return availableLaboratories.value.slice(0, 3);
    });
    
    const getRecentLaboratories = computed(() => {
        // This would come from recent access history
        return availableLaboratories.value.slice(0, 5);
    });
    
    // Laboratory metadata helpers
    const getLaboratoryDisplayName = (laboratory: LaboratoryType) => {
        return laboratory.name || laboratory.code || 'Unnamed Laboratory';
    };
    
    const getLaboratoryDescription = (laboratory: LaboratoryType) => {
        const parts = [];
        if (laboratory.laboratory_type) {
            parts.push(laboratory.laboratory_type.charAt(0).toUpperCase() + laboratory.laboratory_type.slice(1));
        }
        if (laboratory.address) {
            parts.push(laboratory.address);
        }
        return parts.join(' • ') || 'Laboratory';
    };
    
    const getLaboratoryStatusIndicator = (laboratory: LaboratoryType) => {
        return {
            status: laboratory.is_active ? 'active' : 'inactive',
            color: laboratory.is_active ? 'green' : 'gray',
            text: laboratory.is_active ? 'Active' : 'Inactive'
        };
    };
    
    // Route protection helpers
    const requiresLaboratoryContext = computed(() => {
        return route.meta?.requiresLaboratory === true;
    });
    
    const validateRouteAccess = () => {
        const routeLabId = route.params.laboratoryId as string;
        
        if (routeLabId && !canAccessLaboratory(routeLabId)) {
            router.push('/unauthorized');
            return false;
        }
        
        if (requiresLaboratoryContext.value && !activeLaboratory.value) {
            router.push('/select-laboratory');
            return false;
        }
        
        return true;
    };
    
    // Cache management
    const clearLaboratoryCache = (laboratoryUid?: string) => {
        if (laboratoryUid) {
            laboratoryStore.clearCache(`settings_${laboratoryUid}`);
            laboratoryStore.clearCache(`analytics_${laboratoryUid}`);
            laboratoryStore.clearCache(`config_${laboratoryUid}`);
        } else {
            laboratoryStore.clearCache();
        }
    };
    
    const refreshLaboratoryData = async (laboratoryUid?: string, forceRefresh = true) => {
        const targetUid = laboratoryUid || activeLaboratory.value?.uid;
        if (!targetUid) return;
        
        await Promise.all([
            laboratoryStore.fetchLaboratorySettings(targetUid, forceRefresh),
            laboratoryStore.fetchLaboratoryAnalytics(targetUid, forceRefresh),
            laboratoryStore.fetchLaboratoryConfiguration(targetUid, true),
        ]);
    };
    
    // Error handling
    const clearErrors = () => {
        laboratoryStore.clearErrors();
    };
    
    const getLastError = () => {
        return lastError.value;
    };
    
    const getErrorHistory = (limit = 10) => {
        return errorHistory.value.slice(0, limit);
    };
    
    // Bulk operations helpers
    const performBulkOperation = async (
        operation: 'activate' | 'deactivate' | 'delete',
        laboratoryUids: string[]
    ) => {
        const results = [];
        
        for (const uid of laboratoryUids) {
            try {
                let result;
                switch (operation) {
                    case 'activate':
                        result = await updateLaboratory(uid, { is_active: true });
                        break;
                    case 'deactivate':
                        result = await updateLaboratory(uid, { is_active: false });
                        break;
                    case 'delete':
                        result = await deleteLaboratory(uid);
                        break;
                }
                results.push({ uid, success: !!result, result });
            } catch (error) {
                results.push({ uid, success: false, error: String(error) });
            }
        }
        
        return results;
    };
    
    // Export/Import helpers
    const exportLaboratoryData = async (laboratoryUid: string, format: 'json' | 'csv' = 'json') => {
        const laboratory = getLaboratoryByUid(laboratoryUid);
        const settings = await getLaboratorySettings(laboratoryUid);
        const analytics = await getLaboratoryAnalytics(laboratoryUid);
        const configuration = await getLaboratoryConfiguration(laboratoryUid);
        
        const exportData = {
            laboratory,
            settings,
            analytics,
            configuration,
            exportedAt: new Date().toISOString(),
            exportedBy: authStore.auth.user?.uid,
        };
        
        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        } else {
            // Convert to CSV format
            return convertToCSV(exportData);
        }
    };
    
    const convertToCSV = (data: any): string => {
        // Simple CSV conversion for laboratory data
        const headers = Object.keys(data.laboratory || {});
        const csvHeaders = headers.join(',');
        const csvRow = headers.map(header => data.laboratory[header] || '').join(',');
        return `${csvHeaders}\n${csvRow}`;
    };
    
    // Real-time updates (placeholder for WebSocket integration)
    const subscribeLaboratoryUpdates = (laboratoryUid: string, callback: (update: any) => void) => {
        // This would set up WebSocket or Server-Sent Events subscription
        console.log(`Subscribing to updates for laboratory: ${laboratoryUid}`);
        
        // Return unsubscribe function
        return () => {
            console.log(`Unsubscribing from updates for laboratory: ${laboratoryUid}`);
        };
    };
    
    // Watchers for automatic behaviors
    watch(activeLaboratory, (newLab, oldLab) => {
        if (newLab && newLab.uid !== oldLab?.uid) {
            // Clear cache and refresh data when switching laboratories
            nextTick(() => {
                refreshLaboratoryData(newLab.uid);
            });
        }
    });
    
    // Route validation watcher
    watch(() => route.params.laboratoryId, (newLabId) => {
        if (newLabId && typeof newLabId === 'string') {
            validateRouteAccess();
        }
    }, { immediate: true });
    
    return {
        // Laboratory state
        laboratories,
        activeLaboratory,
        availableLaboratories,
        hasMultipleLaboratories,
        canSwitchLaboratories,
        
        // Loading states
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isSwitching,
        isValidating,
        
        // Laboratory data
        laboratorySettings,
        laboratoryAnalytics,
        laboratoryCompliance,
        laboratoryConfiguration,
        laboratoryStatistics,
        recentOperations,
        
        // Error handling
        lastError,
        errorHistory,
        
        // Core operations
        createLaboratory,
        updateLaboratory,
        deleteLaboratory,
        switchLaboratory,
        refreshLaboratories,
        
        // Settings operations
        getLaboratorySettings,
        updateLaboratorySettings,
        
        // Analytics operations
        getLaboratoryAnalytics,
        refreshAnalytics,
        
        // Validation operations
        validateLaboratory,
        getLaboratoryConfiguration,
        
        // Search and filtering
        setSearchQuery,
        setLaboratoryTypeFilter,
        setOrganizationFilter,
        setSorting,
        
        // Access control
        canAccessLaboratory,
        hasLaboratoryPermission,
        isLaboratoryAdmin,
        canManageLaboratory,
        canCreateLaboratory,
        canDeleteLaboratory,
        
        // Selection helpers
        getLaboratoryByUid,
        getLaboratoryByCode,
        getFrequentLaboratories,
        getRecentLaboratories,
        
        // Metadata helpers
        getLaboratoryDisplayName,
        getLaboratoryDescription,
        getLaboratoryStatusIndicator,
        
        // Route protection
        requiresLaboratoryContext,
        validateRouteAccess,
        
        // Cache management
        clearLaboratoryCache,
        refreshLaboratoryData,
        
        // Error handling
        clearErrors,
        getLastError,  
        getErrorHistory,
        
        // Bulk operations
        performBulkOperation,
        
        // Export/Import
        exportLaboratoryData,
        
        // Real-time updates
        subscribeLaboratoryUpdates,
    };
}

/**
 * Laboratory management composable for administrative operations
 */
export function useLaboratoryManager() {
    const {
        laboratories,
        laboratoryStatistics,
        isCreating,
        isUpdating,
        isDeleting,
        createLaboratory,
        updateLaboratory,
        deleteLaboratory,
        performBulkOperation,
        exportLaboratoryData,
        canCreateLaboratory,
        canDeleteLaboratory,
    } = useEnhancedLaboratory();
    
    // Administrative operations
    const createLaboratoryWithDefaults = async (basicData: {
        name: string;
        code?: string;
        organization_uid: string;
        laboratory_type?: string;
    }) => {
        const laboratoryData = {
            ...basicData,
            laboratory_type: basicData.laboratory_type || 'clinical',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            is_active: true,
            create_default_settings: true,
            default_departments: ['Clinical', 'Microbiology', 'Chemistry'],
        };
        
        const defaultSettings = {
            password_lifetime: 90,
            inactivity_log_out: 30,
            allow_self_verification: false,
            require_two_factor: false,
            allow_patient_registration: true,
            allow_sample_registration: true,
            allow_worksheet_creation: true,
            qc_frequency: 'daily',
            qc_percentage: 5.0,
            require_qc_approval: true,
            default_report_format: 'pdf',
            require_result_verification: true,
            currency: 'USD',
            payment_terms_days: 30,
            sample_retention_days: 3650,
            result_retention_days: 2555,
            audit_retention_days: 2555,
        };
        
        return await createLaboratory(laboratoryData, defaultSettings);
    };
    
    const cloneLaboratory = async (sourceUid: string, newName: string, organizationUid: string) => {
        // This would call the clone laboratory mutation
        // For now, we'll simulate by getting source data and creating new
        const sourceLab = laboratories.value.find(lab => lab.uid === sourceUid);
        if (!sourceLab) {
            throw new Error('Source laboratory not found');
        }
        
        const cloneData = {
            name: newName,
            code: `${sourceLab.code || newName.slice(0, 3).toUpperCase()}_CLONE`,
            organization_uid: organizationUid,
            laboratory_type: sourceLab.laboratory_type,
            email: sourceLab.email,
            timezone: sourceLab.timezone,
            is_active: true,
            create_default_settings: true,
        };
        
        return await createLaboratory(cloneData);
    };
    
    const archiveLaboratory = async (laboratoryUid: string) => {
        return await updateLaboratory(laboratoryUid, { 
            is_active: false,
            archived_at: new Date().toISOString(),
        });
    };
    
    const restoreLaboratory = async (laboratoryUid: string) => {
        return await updateLaboratory(laboratoryUid, { 
            is_active: true,
            archived_at: null,
        });
    };
    
    const generateLaboratoryReport = async (laboratoryUids: string[]) => {
        const reports = [];
        
        for (const uid of laboratoryUids) {
            const data = await exportLaboratoryData(uid);
            reports.push({
                laboratory_uid: uid,
                data: JSON.parse(data),
            });
        }
        
        return {
            generated_at: new Date().toISOString(),
            laboratory_count: reports.length,
            reports,
        };
    };
    
    return {
        // State
        laboratories,
        laboratoryStatistics,
        isCreating,
        isUpdating,
        isDeleting,
        
        // Permissions
        canCreateLaboratory,
        canDeleteLaboratory,
        
        // Operations
        createLaboratoryWithDefaults,
        cloneLaboratory,
        archiveLaboratory,
        restoreLaboratory,
        performBulkOperation,
        generateLaboratoryReport,
    };
}

/**
 * Laboratory context composable for component-level operations
 */
export function useLaboratoryContext() {
    const {
        activeLaboratory,
        hasMultipleLaboratories,
        canSwitchLaboratories,
        switchLaboratory,
        getFrequentLaboratories,
        getRecentLaboratories,
    } = useEnhancedLaboratory();
    
    const showLaboratorySelector = ref(false);
    
    const openLaboratorySelector = () => {
        showLaboratorySelector.value = true;
    };
    
    const closeLaboratorySelector = () => {
        showLaboratorySelector.value = false;
    };
    
    const selectLaboratory = async (laboratoryUid: string) => {
        const success = await switchLaboratory(laboratoryUid);
        if (success) {
            closeLaboratorySelector();
        }
        return success;
    };
    
    return {
        // State
        activeLaboratory,
        hasMultipleLaboratories,
        canSwitchLaboratories,
        showLaboratorySelector,
        
        // Quick access
        frequentLaboratories: getFrequentLaboratories,
        recentLaboratories: getRecentLaboratories,
        
        // Operations
        openLaboratorySelector,
        closeLaboratorySelector,
        selectLaboratory,
        switchLaboratory,
    };
}