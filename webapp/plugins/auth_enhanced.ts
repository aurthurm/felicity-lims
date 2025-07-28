import { App } from 'vue';
import { Router } from 'vue-router';
import { useEnhancedAuthStore } from '@/stores/auth_enhanced';
import { useEnhancedAuth, useAuthGuard } from '@/composables/auth_enhanced';

// Enhanced auth plugin configuration
interface AuthPluginOptions {
    router: Router;
    requireAuthByDefault?: boolean;
    publicRoutes?: string[];
    loginRoute?: string;
    laboratorySelectionRoute?: string;
    homeRoute?: string;
    enableAutoLogout?: boolean;
    sessionTimeoutWarning?: number; // minutes before session expires to show warning
    enableBiometric?: boolean;
    enableAnalytics?: boolean;
}

// Global properties added to Vue app instance
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $auth: ReturnType<typeof useEnhancedAuth>;
        $authGuard: ReturnType<typeof useAuthGuard>;
    }
}

// Navigation guard types
interface RouteGuardContext {
    isAuthenticated: boolean;
    activeLaboratory: any;
    hasPermission: (permission: string) => boolean;
    canAccessLaboratory: (labId: string) => boolean;
}

/**
 * Enhanced authentication plugin for Vue with comprehensive multi-tenant support
 */
export function createAuthPlugin(options: AuthPluginOptions) {
    const {
        router,
        requireAuthByDefault = true,
        publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/'],
        loginRoute = '/auth/login',
        laboratorySelectionRoute = '/select-laboratory',
        homeRoute = '/dashboard',
        enableAutoLogout = true,
        sessionTimeoutWarning = 5,
        enableBiometric = false,
        enableAnalytics = true
    } = options;

    return {
        install(app: App) {
            // Initialize auth store
            const authStore = useEnhancedAuthStore();
            
            // Make auth composables globally available
            app.config.globalProperties.$auth = useEnhancedAuth();
            app.config.globalProperties.$authGuard = useAuthGuard();
            
            // Provide auth store to all components
            app.provide('authStore', authStore);
            
            // Setup global navigation guards
            setupNavigationGuards(router, {
                requireAuthByDefault,
                publicRoutes,
                loginRoute,
                laboratorySelectionRoute,
                homeRoute
            });
            
            // Setup session monitoring
            if (enableAutoLogout) {
                setupSessionMonitoring(sessionTimeoutWarning);
            }
            
            // Setup analytics if enabled
            if (enableAnalytics) {
                setupAnalytics();
            }
            
            // Setup biometric authentication if enabled
            if (enableBiometric) {
                setupBiometricAuth();
            }
            
            // Setup global error handling
            setupErrorHandling(app);
            
            // Setup performance monitoring
            setupPerformanceMonitoring();
        }
    };
}

/**
 * Setup navigation guards for route protection
 */
function setupNavigationGuards(
    router: Router,
    config: {
        requireAuthByDefault: boolean;
        publicRoutes: string[];
        loginRoute: string;
        laboratorySelectionRoute: string;
        homeRoute: string;
    }
) {
    router.beforeEach(async (to, from, next) => {
        const authStore = useEnhancedAuthStore();
        const auth = authStore.auth;
        
        // Update session activity
        authStore.updateSessionActivity();
        
        // Create guard context
        const guardContext: RouteGuardContext = {
            isAuthenticated: auth.isAuthenticated,
            activeLaboratory: auth.laboratoryContext.activeLaboratory,
            hasPermission: (permission: string) => {
                const contextPermissions = auth.laboratoryContext.contextPermissions;
                const labUid = auth.laboratoryContext.activeLaboratory?.uid;
                return labUid ? contextPermissions[labUid]?.includes(permission) || false : false;
            },
            canAccessLaboratory: (labId: string) => {
                return auth.laboratoryContext.availableLaboratories.some(lab => lab.uid === labId);
            }
        };
        
        // Check if route is public
        const isPublicRoute = config.publicRoutes.includes(to.path) || 
                             to.meta?.public === true ||
                             to.meta?.requiresAuth === false;
        
        // Check authentication requirement
        const requiresAuth = config.requireAuthByDefault && !isPublicRoute || 
                            to.meta?.requiresAuth === true;
        
        // Handle authentication requirement
        if (requiresAuth && !guardContext.isAuthenticated) {
            // Record attempted access to protected route
            await authStore.recordSecurityEvent('unauthorized_access_attempt', {
                attemptedRoute: to.path,
                fromRoute: from.path
            }, 'medium');
            
            next({
                path: config.loginRoute,
                query: { returnUrl: to.fullPath }
            });
            return;
        }
        
        // Handle laboratory context requirement
        const requiresLaboratory = to.meta?.requiresLaboratory === true;
        if (requiresLaboratory && guardContext.isAuthenticated && !guardContext.activeLaboratory) {
            next({
                path: config.laboratorySelectionRoute,
                query: { returnUrl: to.fullPath }
            });
            return;
        }
        
        // Handle laboratory-specific routes
        const requiredLaboratory = to.params.laboratoryId as string;
        if (requiredLaboratory && !guardContext.canAccessLaboratory(requiredLaboratory)) {
            await authStore.recordSecurityEvent('laboratory_access_denied', {
                requestedLaboratory: requiredLaboratory,
                availableLaboratories: auth.laboratoryContext.availableLaboratories.map(lab => lab.uid)
            }, 'high');
            
            next({
                path: '/unauthorized',
                query: { reason: 'laboratory_access_denied' }
            });
            return;
        }
        
        // Handle permission-based route protection
        const requiredPermission = to.meta?.permission as string;
        if (requiredPermission && !guardContext.hasPermission(requiredPermission)) {
            await authStore.recordSecurityEvent('permission_denied', {
                requiredPermission,
                route: to.path
            }, 'medium');
            
            next({
                path: '/unauthorized',
                query: { reason: 'insufficient_permissions' }
            });
            return;
        }
        
        // Handle role-based route protection
        const requiredRoles = to.meta?.roles as string[];
        if (requiredRoles && auth.user) {
            const userRoles = auth.user.roles || [];
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            
            if (!hasRequiredRole) {
                await authStore.recordSecurityEvent('role_access_denied', {
                    requiredRoles,
                    userRoles,
                    route: to.path
                }, 'medium');
                
                next({
                    path: '/unauthorized',
                    query: { reason: 'insufficient_role' }
                });
                return;
            }
        }
        
        // Handle redirect for authenticated users trying to access auth pages
        if (guardContext.isAuthenticated && to.path === config.loginRoute) {
            next(config.homeRoute);
            return;
        }
        
        // Record successful navigation
        if (guardContext.isAuthenticated) {
            await authStore.recordSecurityEvent('route_access', {
                route: to.path,
                fromRoute: from.path,
                laboratory: guardContext.activeLaboratory?.uid
            }, 'low');
        }
        
        next();
    });
    
    // After each navigation
    router.afterEach((to, from) => {
        const authStore = useEnhancedAuthStore();
        
        // Update document title with laboratory context
        if (authStore.auth.laboratoryContext.activeLaboratory) {
            const labName = authStore.auth.laboratoryContext.activeLaboratory.name;
            const pageTitle = to.meta?.title as string || to.name as string || 'Page';
            document.title = `${pageTitle} - ${labName} - Felicity LIMS`;
        }
        
        // Update session activity
        authStore.updateSessionActivity();
    });
}

/**
 * Setup session monitoring and auto-logout
 */
function setupSessionMonitoring(warningMinutes: number) {
    const authStore = useEnhancedAuthStore();
    let warningTimeout: NodeJS.Timeout;
    let logoutTimeout: NodeJS.Timeout;
    
    const checkSession = () => {
        if (!authStore.auth.isAuthenticated) return;
        
        const remaining = authStore.sessionTimeRemaining;
        const warningTime = warningMinutes * 60 * 1000;
        
        // Clear existing timeouts
        clearTimeout(warningTimeout);
        clearTimeout(logoutTimeout);
        
        if (remaining <= warningTime && remaining > 0) {
            // Show session expiry warning
            showSessionWarning(remaining);
            
            // Set timeout for auto-logout
            logoutTimeout = setTimeout(() => {
                authStore.logout('session_timeout');
            }, remaining);
        } else if (remaining > warningTime) {
            // Set timeout for warning
            warningTimeout = setTimeout(() => {
                showSessionWarning(warningTime);
            }, remaining - warningTime);
            
            // Set timeout for auto-logout
            logoutTimeout = setTimeout(() => {
                authStore.logout('session_timeout');
            }, remaining);
        }
    };
    
    const showSessionWarning = (timeRemaining: number) => {
        // This would typically show a modal or notification
        console.warn(`Session expires in ${Math.floor(timeRemaining / 60000)} minutes`);
        
        // Could emit a global event here for components to listen to
        window.dispatchEvent(new CustomEvent('session-warning', {
            detail: { timeRemaining }
        }));
    };
    
    // Check session every minute
    setInterval(checkSession, 60000);
    
    // Initial check
    checkSession();
}

/**
 * Setup analytics and monitoring
 */
function setupAnalytics() {
    const authStore = useEnhancedAuthStore();
    
    // Track page views
    window.addEventListener('beforeunload', () => {
        if (authStore.auth.isAuthenticated && authStore.auth.sessionInfo) {
            const sessionDuration = Date.now() - authStore.auth.sessionInfo.startTime.getTime();
            authStore.updateAnalytics({
                averageSessionDuration: (authStore.auth.analytics.averageSessionDuration + sessionDuration) / 2
            });
        }
    });
    
    // Track errors
    window.addEventListener('error', (event) => {
        authStore.recordSecurityEvent('javascript_error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        }, 'low');
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        authStore.recordSecurityEvent('unhandled_promise_rejection', {
            reason: event.reason?.toString() || 'Unknown'
        }, 'medium');
    });
}

/**
 * Setup biometric authentication
 */
function setupBiometricAuth() {
    // Check if WebAuthn is supported
    if (!('credentials' in navigator) || !('create' in navigator.credentials)) {
        console.warn('Biometric authentication not supported in this browser');
        return;
    }
    
    console.log('Biometric authentication available');
    
    // Additional biometric setup would go here
    // This is a placeholder for future implementation
}

/**
 * Setup global error handling
 */
function setupErrorHandling(app: App) {
    app.config.errorHandler = (err, instance, info) => {
        console.error('Global error:', err, info);
        
        // Record error in analytics
        const authStore = useEnhancedAuthStore();
        authStore.recordSecurityEvent('vue_error', {
            error: err?.toString() || 'Unknown error',
            info,
            component: instance?.$options.name || 'Unknown'
        }, 'medium');
    };
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
    const authStore = useEnhancedAuthStore();
    
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const navigationEntry = entry as PerformanceNavigationTiming;
                    
                    // Record page load performance
                    authStore.recordSecurityEvent('performance_metric', {
                        type: 'page_load',
                        loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
                        domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
                        firstContentfulPaint: navigationEntry.loadEventEnd - navigationEntry.fetchStart
                    }, 'low');
                }
            }
        });
        
        observer.observe({ entryTypes: ['navigation', 'paint'] });
    }
}

/**
 * Auth utilities for components
 */
export const AuthUtils = {
    /**
     * Check if user has specific permission in current laboratory context
     */
    hasPermission(permission: string, laboratoryUid?: string): boolean {
        const authStore = useEnhancedAuthStore();
        const contextPermissions = authStore.auth.laboratoryContext.contextPermissions;
        const targetLab = laboratoryUid || authStore.auth.laboratoryContext.activeLaboratory?.uid;
        
        if (!targetLab) return false;
        
        return contextPermissions[targetLab]?.includes(permission) || false;
    },
    
    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        const authStore = useEnhancedAuthStore();
        const userRoles = authStore.auth.user?.roles || [];
        
        return roles.some(role => userRoles.includes(role));
    },
    
    /**
     * Get user's role in specific laboratory
     */
    getLaboratoryRole(laboratoryUid: string): string | null {
        const authStore = useEnhancedAuthStore();
        const user = authStore.auth.user;
        
        // This would typically come from user's laboratory assignments
        // For now, return a placeholder
        return user?.isAdmin ? 'admin' : 'user';
    },
    
    /**
     * Format user's display name
     */
    getUserDisplayName(): string {
        const authStore = useEnhancedAuthStore();
        const user = authStore.auth.user;
        
        if (!user) return 'Guest';
        
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.username || 'User';
    },
    
    /**
     * Get user's avatar URL or initials
     */
    getUserAvatar(): { type: 'url' | 'initials'; value: string } {
        const authStore = useEnhancedAuthStore();
        const user = authStore.auth.user;
        
        if (!user) return { type: 'initials', value: 'G' };
        
        if (user.avatar) {
            return { type: 'url', value: user.avatar };
        }
        
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 
                        user.email?.charAt(0).toUpperCase() || 
                        'U';
        
        return { type: 'initials', value: initials };
    }
};

// Export types for TypeScript support
export type { AuthPluginOptions, RouteGuardContext };