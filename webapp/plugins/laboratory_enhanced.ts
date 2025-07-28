import { App } from 'vue';
import { Router } from 'vue-router';
import { useEnhancedLaboratoryStore } from '@/stores/laboratory_enhanced';
import { useEnhancedAuthStore } from '@/stores/auth_enhanced';
import { useEnhancedLaboratory, useLaboratoryManager, useLaboratoryContext } from '@/composables/laboratory_enhanced';

// Enhanced laboratory plugin configuration
interface LaboratoryPluginOptions {
    router: Router;
    enableRouteProtection?: boolean;
    enableAutoSwitch?: boolean;
    enableAnalytics?: boolean;
    enableRealTimeUpdates?: boolean;
    defaultLaboratoryRoute?: string;
    laboratorySelectionRoute?: string;
    cacheExpiry?: number; // milliseconds
}

// Global properties added to Vue app instance
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $laboratory: ReturnType<typeof useEnhancedLaboratory>;
        $laboratoryManager: ReturnType<typeof useLaboratoryManager>;
        $laboratoryContext: ReturnType<typeof useLaboratoryContext>;
    }
}

// Laboratory route guard context
interface LaboratoryRouteGuardContext {
    isAuthenticated: boolean;
    activeLaboratory: any;
    availableLaboratories: any[];
    hasMultipleLaboratories: boolean;
    canAccessLaboratory: (labId: string) => boolean;
    hasLaboratoryPermission: (permission: string, labId?: string) => boolean;
}

/**
 * Enhanced laboratory plugin for Vue with comprehensive multi-tenant support
 */
export function createLaboratoryPlugin(options: LaboratoryPluginOptions) {
    const {
        router,
        enableRouteProtection = true,
        enableAutoSwitch = true,
        enableAnalytics = true,
        enableRealTimeUpdates = false,
        defaultLaboratoryRoute = '/dashboard',
        laboratorySelectionRoute = '/select-laboratory',
        cacheExpiry = 5 * 60 * 1000, // 5 minutes
    } = options;

    return {
        install(app: App) {
            // Initialize laboratory store
            const laboratoryStore = useEnhancedLaboratoryStore();
            const authStore = useEnhancedAuthStore();
            
            // Make laboratory composables globally available
            app.config.globalProperties.$laboratory = useEnhancedLaboratory();
            app.config.globalProperties.$laboratoryManager = useLaboratoryManager();
            app.config.globalProperties.$laboratoryContext = useLaboratoryContext();
            
            // Provide laboratory store to all components
            app.provide('laboratoryStore', laboratoryStore);
            app.provide('laboratoryOptions', options);
            
            // Setup route protection if enabled
            if (enableRouteProtection) {
                setupLaboratoryRouteGuards(router, {
                    defaultLaboratoryRoute,
                    laboratorySelectionRoute,
                });
            }
            
            // Setup analytics if enabled
            if (enableAnalytics) {
                setupLaboratoryAnalytics();
            }
            
            // Setup real-time updates if enabled
            if (enableRealTimeUpdates) {
                setupRealTimeUpdates();
            }
            
            // Setup laboratory auto-switching if enabled
            if (enableAutoSwitch) {
                setupAutoSwitch();
            }
            
            // Setup global error handling for laboratory operations
            setupLaboratoryErrorHandling(app);
            
            // Setup performance monitoring
            setupLaboratoryPerformanceMonitoring();
            
            // Initialize plugin
            initializeLaboratoryPlugin();
        }
    };
}

/**
 * Setup laboratory route guards for navigation protection
 */
function setupLaboratoryRouteGuards(
    router: Router,
    config: {
        defaultLaboratoryRoute: string;
        laboratorySelectionRoute: string;
    }
) {
    router.beforeEach(async (to, from, next) => {
        const authStore = useEnhancedAuthStore();
        const laboratoryStore = useEnhancedLaboratoryStore();
        
        // Create guard context
        const guardContext: LaboratoryRouteGuardContext = {
            isAuthenticated: authStore.auth.isAuthenticated,
            activeLaboratory: authStore.auth.laboratoryContext.activeLaboratory,
            availableLaboratories: authStore.auth.laboratoryContext.availableLaboratories,
            hasMultipleLaboratories: authStore.auth.laboratoryContext.availableLaboratories.length > 1,
            canAccessLaboratory: (labId: string) => {
                return authStore.auth.laboratoryContext.availableLaboratories.some(lab => lab.uid === labId);
            },
            hasLaboratoryPermission: (permission: string, labId?: string) => {
                const contextPermissions = authStore.auth.laboratoryContext.contextPermissions;
                const targetLab = labId || authStore.auth.laboratoryContext.activeLaboratory?.uid;
                return targetLab ? contextPermissions[targetLab]?.includes(permission) || false : false;
            },
        };
        
        // Skip guard for non-authenticated users (handled by auth guard)
        if (!guardContext.isAuthenticated) {
            next();
            return;
        }
        
        // Handle laboratory selection requirement
        const requiresLaboratory = to.meta?.requiresLaboratory === true;
        if (requiresLaboratory && !guardContext.activeLaboratory) {
            if (guardContext.availableLaboratories.length === 1) {
                // Auto-select single laboratory
                const singleLab = guardContext.availableLaboratories[0];
                try {
                    await laboratoryStore.switchActiveLaboratory(singleLab.uid);
                    next();
                } catch (error) {
                    console.error('Failed to auto-switch to single laboratory:', error);
                    next(config.laboratorySelectionRoute);
                }
            } else {
                next({
                    path: config.laboratorySelectionRoute,
                    query: { returnUrl: to.fullPath }
                });
            }
            return;
        }
        
        // Handle laboratory-specific routes
        const routeLaboratoryId = to.params.laboratoryId as string;
        if (routeLaboratoryId) {
            if (!guardContext.canAccessLaboratory(routeLaboratoryId)) {
                console.warn(`Access denied to laboratory: ${routeLaboratoryId}`);
                next({
                    path: '/unauthorized',
                    query: { reason: 'laboratory_access_denied' }
                });
                return;
            }
            
            // Auto-switch to route laboratory if different from active
            if (guardContext.activeLaboratory?.uid !== routeLaboratoryId) {
                try {
                    await laboratoryStore.switchActiveLaboratory(routeLaboratoryId);
                } catch (error) {
                    console.error('Failed to switch to route laboratory:', error);
                    next({
                        path: '/error',
                        query: { reason: 'laboratory_switch_failed' }
                    });
                    return;
                }
            }
        }
        
        // Handle laboratory permission requirements
        const requiredPermission = to.meta?.laboratoryPermission as string;
        if (requiredPermission && !guardContext.hasLaboratoryPermission(requiredPermission)) {
            console.warn(`Laboratory permission denied: ${requiredPermission}`);
            next({
                path: '/unauthorized',
                query: { reason: 'insufficient_laboratory_permissions' }
            });
            return;
        }
        
        // Handle laboratory type restrictions
        const requiredLabType = to.meta?.laboratoryType as string;
        if (requiredLabType && guardContext.activeLaboratory) {
            const labType = guardContext.activeLaboratory.laboratory_type;
            if (labType !== requiredLabType) {
                console.warn(`Laboratory type mismatch. Required: ${requiredLabType}, Current: ${labType}`);
                next({
                    path: '/unauthorized',
                    query: { reason: 'laboratory_type_mismatch' }
                });
                return;
            }
        }
        
        next();
    });
    
    // After each navigation, update document title with laboratory context
    router.afterEach((to, from) => {
        const authStore = useEnhancedAuthStore();
        const activeLab = authStore.auth.laboratoryContext.activeLaboratory;
        
        if (activeLab) {
            const pageTitle = to.meta?.title as string || to.name as string || 'Page';
            document.title = `${pageTitle} - ${activeLab.name} - Felicity LIMS`;
        }
    });
}

/**
 * Setup laboratory analytics and monitoring
 */
function setupLaboratoryAnalytics() {
    const laboratoryStore = useEnhancedLaboratoryStore();
    const authStore = useEnhancedAuthStore();
    
    // Track laboratory access patterns
    let laboratoryAccessStartTime: number | null = null;
    
    const trackLaboratoryAccess = (laboratoryUid: string, action: 'enter' | 'exit') => {
        const timestamp = Date.now();
        
        if (action === 'enter') {
            laboratoryAccessStartTime = timestamp;
        } else if (action === 'exit' && laboratoryAccessStartTime) {
            const duration = timestamp - laboratoryAccessStartTime;
            
            // Update laboratory usage analytics
            console.log(`Laboratory ${laboratoryUid} accessed for ${duration}ms`);
            
            // This would typically send analytics to backend
            recordLaboratoryUsage(laboratoryUid, duration);
        }
    };
    
    const recordLaboratoryUsage = (laboratoryUid: string, duration: number) => {
        // Record usage in local analytics
        const analytics = laboratoryStore.store.laboratoryAnalytics[laboratoryUid];
        if (analytics) {
            analytics.usage_statistics.average_session_duration = 
                (analytics.usage_statistics.average_session_duration + duration) / 2;
            analytics.last_updated = new Date();
        }
    };
    
    // Watch for laboratory switches
    let previousLab: string | null = null;
    
    const watchLaboratorySwitches = () => {
        const activeLab = authStore.auth.laboratoryContext.activeLaboratory;
        const currentLabUid = activeLab?.uid || null;
        
        if (previousLab && previousLab !== currentLabUid) {
            trackLaboratoryAccess(previousLab, 'exit');
        }
        
        if (currentLabUid && currentLabUid !== previousLab) {
            trackLaboratoryAccess(currentLabUid, 'enter');
        }
        
        previousLab = currentLabUid;
    };
    
    // Set up watcher
    setInterval(watchLaboratorySwitches, 1000);
    
    // Track page views per laboratory
    window.addEventListener('beforeunload', () => {
        if (previousLab) {
            trackLaboratoryAccess(previousLab, 'exit');
        }
    });
}

/**
 * Setup real-time updates for laboratory data
 */
function setupRealTimeUpdates() {
    const laboratoryStore = useEnhancedLaboratoryStore();
    
    // WebSocket connection for real-time updates
    let websocket: WebSocket | null = null;
    
    const connectWebSocket = () => {
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/laboratory`;
        
        try {
            websocket = new WebSocket(wsUrl);
            
            websocket.onopen = () => {
                console.log('Laboratory WebSocket connected');
            };
            
            websocket.onmessage = (event) => {
                try {
                    const update = JSON.parse(event.data);
                    handleRealTimeUpdate(update);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            
            websocket.onclose = () => {
                console.log('Laboratory WebSocket disconnected');
                // Attempt reconnection after delay
                setTimeout(connectWebSocket, 5000);
            };
            
            websocket.onerror = (error) => {
                console.error('Laboratory WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Failed to connect to Laboratory WebSocket:', error);
        }
    };
    
    const handleRealTimeUpdate = (update: any) => {
        switch (update.type) {
            case 'laboratory_created':
                laboratoryStore.store.laboratories.push(update.laboratory);
                break;
                
            case 'laboratory_updated':
                const updateIndex = laboratoryStore.store.laboratories.findIndex(
                    lab => lab.uid === update.laboratory.uid
                );
                if (updateIndex > -1) {
                    laboratoryStore.store.laboratories[updateIndex] = update.laboratory;
                }
                break;
                
            case 'laboratory_deleted':
                laboratoryStore.store.laboratories = laboratoryStore.store.laboratories.filter(
                    lab => lab.uid !== update.laboratory_uid
                );
                break;
                
            case 'laboratory_settings_updated':
                if (laboratoryStore.store.laboratorySettings[update.laboratory_uid]) {
                    laboratoryStore.store.laboratorySettings[update.laboratory_uid] = {
                        ...laboratoryStore.store.laboratorySettings[update.laboratory_uid],
                        ...update.settings,
                    };
                }
                break;
                
            case 'laboratory_analytics_updated':
                laboratoryStore.store.laboratoryAnalytics[update.laboratory_uid] = update.analytics;
                break;
                
            default:
                console.log('Unknown laboratory update type:', update.type);
        }
    };
    
    // Initialize WebSocket connection
    connectWebSocket();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (websocket) {
            websocket.close();
        }
    });
}

/**
 * Setup automatic laboratory switching based on user preferences
 */
function setupAutoSwitch() {
    const authStore = useEnhancedAuthStore();
    const laboratoryStore = useEnhancedLaboratoryStore();
    
    // Auto-switch to most frequently used laboratory
    const autoSwitchToFrequent = async () => {
        const availableLabs = authStore.auth.laboratoryContext.availableLaboratories;
        const currentLab = authStore.auth.laboratoryContext.activeLaboratory;
        
        if (!currentLab && availableLabs.length > 0) {
            // Get user's most used laboratory from analytics
            const mostUsed = authStore.auth.analytics.mostUsedLaboratory;
            const targetLab = mostUsed 
                ? availableLabs.find(lab => lab.uid === mostUsed)
                : availableLabs[0];
            
            if (targetLab) {
                try {
                    await laboratoryStore.switchActiveLaboratory(targetLab.uid);
                    console.log(`Auto-switched to laboratory: ${targetLab.name}`);
                } catch (error) {
                    console.error('Auto-switch failed:', error);
                }
            }
        }
    };
    
    // Watch for authentication changes
    const watchAuthChanges = () => {
        if (authStore.auth.isAuthenticated && !authStore.auth.laboratoryContext.activeLaboratory) {
            autoSwitchToFrequent();
        }
    };
    
    // Set up watcher with debounce
    let autoSwitchTimeout: NodeJS.Timeout;
    const debouncedWatch = () => {
        clearTimeout(autoSwitchTimeout);
        autoSwitchTimeout = setTimeout(watchAuthChanges, 1000);
    };
    
    // Initial check and periodic monitoring
    debouncedWatch();
    setInterval(debouncedWatch, 5000);
}

/**
 * Setup global error handling for laboratory operations
 */
function setupLaboratoryErrorHandling(app: App) {
    const laboratoryStore = useEnhancedLaboratoryStore();
    
    // Global error handler for laboratory-related errors
    const originalErrorHandler = app.config.errorHandler;
    
    app.config.errorHandler = (err, instance, info) => {
        // Check if error is laboratory-related
        if (info.includes('laboratory') || String(err).toLowerCase().includes('laboratory')) {
            console.error('Laboratory operation error:', err, info);
            
            // Record error in laboratory store
            laboratoryStore.store.errorHistory.unshift({
                error: String(err),
                timestamp: new Date(),
                context: info,
            });
            
            // Keep only last 50 errors
            if (laboratoryStore.store.errorHistory.length > 50) {
                laboratoryStore.store.errorHistory = laboratoryStore.store.errorHistory.slice(0, 50);
            }
        }
        
        // Call original error handler if it exists
        if (originalErrorHandler) {
            originalErrorHandler(err, instance, info);
        }
    };
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        if (String(event.reason).toLowerCase().includes('laboratory')) {
            console.error('Unhandled laboratory promise rejection:', event.reason);
            
            laboratoryStore.store.errorHistory.unshift({
                error: String(event.reason),
                timestamp: new Date(),
                context: 'unhandled_promise_rejection',
            });
        }
    });
}

/**
 * Setup performance monitoring for laboratory operations
 */
function setupLaboratoryPerformanceMonitoring() {
    const laboratoryStore = useEnhancedLaboratoryStore();
    
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('laboratory')) {
                    // Record laboratory-related performance metrics
                    console.log(`Laboratory performance: ${entry.name} took ${entry.duration}ms`);
                    
                    // Update performance metrics in store
                    if (entry.name.includes('load')) {
                        laboratoryStore.store.performanceMetrics.laboratory_load_time = entry.duration;
                    } else if (entry.name.includes('settings')) {
                        laboratoryStore.store.performanceMetrics.settings_load_time = entry.duration;
                    } else if (entry.name.includes('analytics')) {
                        laboratoryStore.store.performanceMetrics.analytics_load_time = entry.duration;
                    }
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
    
    // Custom performance markers
    const markLaboratoryOperation = (operation: string, duration: number) => {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(`laboratory-${operation}-${Date.now()}`);
        }
        
        // Update performance metrics
        laboratoryStore.store.performanceMetrics.operation_execution_time = 
            (laboratoryStore.store.performanceMetrics.operation_execution_time + duration) / 2;
    };
    
    // Export performance marker utility
    (window as any).__markLaboratoryOperation = markLaboratoryOperation;
}

/**
 * Initialize laboratory plugin
 */
function initializeLaboratoryPlugin() {
    console.log('Enhanced Laboratory Plugin initialized');
    
    // Set up global laboratory utilities
    (window as any).__laboratoryPlugin = {
        version: '1.0.0',
        initialized: true,
        timestamp: new Date(),
    };
    
    // Custom event for plugin initialization
    window.dispatchEvent(new CustomEvent('laboratory-plugin-initialized', {
        detail: {
            version: '1.0.0',
            features: [
                'multi-tenant-support',
                'route-protection',
                'analytics',
                'real-time-updates',
                'auto-switching',
                'performance-monitoring',
            ],
        },
    }));
}

/**
 * Laboratory utilities for components
 */
export const LaboratoryUtils = {
    /**
     * Format laboratory display name
     */
    formatLaboratoryName(laboratory: any): string {
        return laboratory?.name || laboratory?.code || 'Unknown Laboratory';
    },
    
    /**
     * Get laboratory status badge
     */
    getLaboratoryStatusBadge(laboratory: any): { text: string; color: string; variant: string } {
        if (!laboratory) {
            return { text: 'Unknown', color: 'gray', variant: 'outline' };
        }
        
        if (laboratory.is_active) {
            return { text: 'Active', color: 'green', variant: 'solid' };
        } else {
            return { text: 'Inactive', color: 'red', variant: 'outline' };
        }
    },
    
    /**
     * Check if laboratory supports feature
     */
    supportsFeature(laboratory: any, feature: string): boolean {
        const settings = laboratory?.settings;
        if (!settings) return false;
        
        switch (feature) {
            case 'billing':
                return settings.allow_billing || false;
            case 'self_verification':
                return settings.allow_self_verification || false;
            case 'two_factor':
                return settings.require_two_factor || false;
            case 'patient_registration':
                return settings.allow_patient_registration || false;
            case 'sample_registration':
                return settings.allow_sample_registration || false;
            default:
                return false;
        }
    },
    
    /**
     * Generate laboratory code
     */
    generateLaboratoryCode(name: string, existingCodes: string[] = []): string {
        let code = name.substring(0, 3).toUpperCase();
        let counter = 1;
        
        while (existingCodes.includes(code)) {
            code = `${name.substring(0, 2).toUpperCase()}${counter}`;
            counter++;
        }
        
        return code;
    },
    
    /**
     * Validate laboratory data
     */
    validateLaboratoryData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Laboratory name must be at least 2 characters long');
        }
        
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Invalid email format');
        }
        
        if (!data.organization_uid) {
            errors.push('Organization is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
        };
    },
};

// Export types for TypeScript support
export type { LaboratoryPluginOptions, LaboratoryRouteGuardContext };