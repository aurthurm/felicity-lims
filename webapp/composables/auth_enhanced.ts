import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEnhancedAuthStore } from '@/stores/auth_enhanced';
import { LaboratoryType, UserType } from '@/types/gql';

/**
 * Enhanced authentication composable with comprehensive multi-tenant features
 */
export function useEnhancedAuth() {
    const authStore = useEnhancedAuthStore();
    const router = useRouter();
    const route = useRoute();
    
    // Reactive authentication state
    const isAuthenticated = computed(() => authStore.auth.isAuthenticated);
    const user = computed(() => authStore.auth.user);
    const isProcessing = computed(() => authStore.auth.processing);
    const lastError = computed(() => authStore.auth.lastError);
    
    // Laboratory context
    const activeLaboratory = computed(() => authStore.auth.laboratoryContext.activeLaboratory);
    const availableLaboratories = computed(() => authStore.auth.laboratoryContext.availableLaboratories);
    const hasMultipleLaboratories = computed(() => authStore.hasMultipleLaboratories);
    const canSwitchLaboratories = computed(() => authStore.canSwitchLaboratories);
    const isSwitchingLaboratory = computed(() => authStore.auth.laboratoryContext.switchingInProgress);
    
    // Session information
    const sessionInfo = computed(() => authStore.auth.sessionInfo);
    const sessionTimeRemaining = computed(() => authStore.sessionTimeRemaining);
    const isSessionExpiring = computed(() => authStore.isSessionExpiring);
    
    // Token information
    const tokenExpiresAt = computed(() => authStore.tokenExpiresAt);
    const isTokenExpiring = computed(() => authStore.isTokenExpiring);
    
    // User preferences
    const userPreferences = computed(() => authStore.auth.userPreferences);
    const securitySettings = computed(() => authStore.auth.securitySettings);
    
    // Analytics
    const authAnalytics = computed(() => authStore.auth.analytics);
    const performanceMetrics = computed(() => authStore.auth.performanceMetrics);
    
    // Authentication methods
    const login = async (username: string, password: string) => {
        return await authStore.authenticate({ username, password });
    };
    
    const logout = async (reason?: string) => {
        await authStore.logout(reason);
    };
    
    const refreshAuthToken = async () => {
        return await authStore.refreshToken();
    };
    
    // Laboratory context methods
    const switchLaboratory = async (laboratoryUid: string) => {
        return await authStore.switchActiveLaboratory(laboratoryUid);
    };
    
    const refreshLaboratories = async () => {
        await authStore.refreshLaboratories();
    };
    
    const getFrequentLaboratories = computed(() => {
        return authStore.auth.laboratoryContext.frequentLaboratories;
    });
    
    const getRecentLaboratories = computed(() => {
        return authStore.auth.laboratoryContext.recentLaboratories;
    });
    
    const getLaboratoryHistory = computed(() => {
        return authStore.auth.laboratoryContext.laboratoryHistory;
    });
    
    // User preferences methods
    const updatePreferences = (preferences: Partial<typeof userPreferences.value>) => {
        authStore.updateUserPreferences(preferences);
    };
    
    const updateSecuritySettings = (settings: Partial<typeof securitySettings.value>) => {
        authStore.updateSecuritySettings(settings);
    };
    
    // Security and validation helpers
    const hasPermission = (permission: string, laboratoryUid?: string) => {
        const contextPermissions = authStore.auth.laboratoryContext.contextPermissions;
        const targetLab = laboratoryUid || activeLaboratory.value?.uid;
        
        if (!targetLab) return false;
        
        return contextPermissions[targetLab]?.includes(permission) || false;
    };
    
    const isLabAdmin = computed(() => {
        return hasPermission('admin') || user.value?.isAdmin || false;
    });
    
    const isSuperUser = computed(() => {
        return user.value?.isSuperuser || false;
    });
    
    const canAccessLaboratory = (laboratoryUid: string) => {
        return availableLaboratories.value.some(lab => lab.uid === laboratoryUid);
    };
    
    // Password reset methods
    const requestPasswordReset = async (email: string) => {
        await authStore.resetPasswordRequest(email);
    };
    
    const validateResetToken = async (token: string) => {
        await authStore.validatePasswordResetToken(token);
    };
    
    const resetPassword = async (password: string, confirmPassword: string) => {
        await authStore.resetPassword(password, confirmPassword);
    };
    
    const forgotPasswordState = computed(() => ({
        forgotPassword: authStore.auth.forgotPassword,
        receivedToken: authStore.auth.receivedToken,
        resetData: authStore.auth.resetData
    }));
    
    // Route protection helpers
    const requiresAuthentication = computed(() => {
        return route.meta?.requiresAuth !== false;
    });
    
    const requiresLaboratoryContext = computed(() => {
        return route.meta?.requiresLaboratory === true;
    });
    
    const redirectToLogin = (returnUrl?: string) => {
        const url = returnUrl || route.fullPath;
        router.push({
            path: '/auth/login',
            query: { returnUrl: url }
        });
    };
    
    const redirectToLaboratorySelection = () => {
        router.push({
            path: '/select-laboratory',
            query: { returnUrl: route.fullPath }
        });
    };
    
    // Session management
    const extendSession = () => {
        authStore.updateSessionActivity();
    };
    
    const getSessionStatus = computed(() => ({
        isActive: isAuthenticated.value,
        timeRemaining: sessionTimeRemaining.value,
        isExpiring: isSessionExpiring.value,
        sessionInfo: sessionInfo.value
    }));
    
    // Analytics helpers
    const getUsageStatistics = computed(() => ({
        loginCount: authAnalytics.value.loginCount,
        lastLoginAt: authAnalytics.value.lastLoginAt,
        averageSessionDuration: authAnalytics.value.averageSessionDuration,
        mostUsedLaboratory: authAnalytics.value.mostUsedLaboratory,
        laboratoryUsageStats: authAnalytics.value.laboratoryUsageStats
    }));
    
    const getSecurityEvents = (limit = 10) => {
        return authAnalytics.value.securityEvents.slice(0, limit);
    };
    
    const recordCustomEvent = async (type: string, details: Record<string, any>, severity: 'low' | 'medium' | 'high' = 'low') => {
        await authStore.recordSecurityEvent(type as any, details, severity);
    };
    
    // Biometric authentication helpers (placeholder for future implementation)
    const isBiometricAvailable = computed(() => {
        return 'credentials' in navigator && 'create' in navigator.credentials;
    });
    
    const isBiometricEnabled = computed(() => {
        return authStore.auth.biometricEnabled && isBiometricAvailable.value;
    });
    
    const enableBiometric = async () => {
        // Placeholder for biometric enrollment
        console.log('Biometric authentication enrollment would be implemented here');
    };
    
    const authenticateWithBiometric = async () => {
        // Placeholder for biometric authentication
        console.log('Biometric authentication would be implemented here');
    };
    
    // Theme and accessibility helpers
    const currentTheme = computed(() => userPreferences.value.theme);
    const currentLanguage = computed(() => userPreferences.value.language);
    const accessibilitySettings = computed(() => userPreferences.value.accessibility);
    
    const setTheme = (theme: 'light' | 'dark' | 'system') => {
        updatePreferences({ theme });
    };
    
    const setLanguage = (language: string) => {
        updatePreferences({ language });
    };
    
    const toggleAccessibilityFeature = (feature: keyof typeof accessibilitySettings.value) => {
        const current = accessibilitySettings.value[feature];
        updatePreferences({
            accessibility: {
                ...accessibilitySettings.value,
                [feature]: !current
            }
        });
    };
    
    // Watchers for automatic behaviors
    watch(isSessionExpiring, (expiring) => {
        if (expiring) {
            console.warn('Session is expiring soon!');
            // Could show a warning notification here
        }
    });
    
    watch(isTokenExpiring, (expiring) => {
        if (expiring) {
            console.warn('Token is expiring soon!');
            // Could show a warning notification here
        }
    });
    
    // Auto logout on tab visibility change (security feature)
    const handleVisibilityChange = () => {
        if (document.hidden) {
            // Record when user left the tab
            sessionStorage.setItem('tabHiddenAt', Date.now().toString());
        } else {
            // Check if too much time passed while tab was hidden
            const hiddenAt = sessionStorage.getItem('tabHiddenAt');
            if (hiddenAt) {
                const timeAway = Date.now() - parseInt(hiddenAt);
                const maxAwayTime = securitySettings.value.sessionTimeout;
                
                if (timeAway > maxAwayTime) {
                    logout('tab_away_timeout');
                } else {
                    extendSession();
                }
                
                sessionStorage.removeItem('tabHiddenAt');
            }
        }
    };
    
    // Lifecycle management
    onMounted(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Auto-extend session on user activity
        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handleActivity = () => extendSession();
        
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
        
        // Cleanup function
        onUnmounted(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            activityEvents.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        });
    });
    
    return {
        // Authentication state
        isAuthenticated,
        user,
        isProcessing,
        lastError,
        
        // Laboratory context
        activeLaboratory,
        availableLaboratories,
        hasMultipleLaboratories,
        canSwitchLaboratories,
        isSwitchingLaboratory,
        getFrequentLaboratories,
        getRecentLaboratories,
        getLaboratoryHistory,
        
        // Session management
        sessionInfo,
        sessionTimeRemaining,
        isSessionExpiring,
        getSessionStatus,
        extendSession,
        
        // Token management
        tokenExpiresAt,
        isTokenExpiring,
        
        // User preferences
        userPreferences,
        securitySettings,
        currentTheme,
        currentLanguage,
        accessibilitySettings,
        
        // Analytics
        authAnalytics,
        performanceMetrics,
        getUsageStatistics,
        getSecurityEvents,
        
        // Authentication methods
        login,
        logout,
        refreshAuthToken,
        
        // Laboratory methods
        switchLaboratory,
        refreshLaboratories,
        canAccessLaboratory,
        
        // Permission helpers
        hasPermission,
        isLabAdmin,
        isSuperUser,
        
        // Password reset
        requestPasswordReset,
        validateResetToken,
        resetPassword,
        forgotPasswordState,
        
        // Route protection
        requiresAuthentication,
        requiresLaboratoryContext,
        redirectToLogin,
        redirectToLaboratorySelection,
        
        // Preferences management
        updatePreferences,
        updateSecuritySettings,
        setTheme,
        setLanguage,
        toggleAccessibilityFeature,
        
        // Biometric authentication
        isBiometricAvailable,
        isBiometricEnabled,
        enableBiometric,
        authenticateWithBiometric,
        
        // Utility methods
        recordCustomEvent,
    };
}

/**
 * Authentication guard composable for route protection
 */
export function useAuthGuard() {
    const { 
        isAuthenticated, 
        activeLaboratory, 
        requiresAuthentication, 
        requiresLaboratoryContext,
        redirectToLogin,
        redirectToLaboratorySelection
    } = useEnhancedAuth();
    
    const checkAuthentication = () => {
        if (requiresAuthentication.value && !isAuthenticated.value) {
            redirectToLogin();
            return false;
        }
        return true;
    };
    
    const checkLaboratoryContext = () => {
        if (requiresLaboratoryContext.value && !activeLaboratory.value) {
            redirectToLaboratorySelection();
            return false;
        }
        return true;
    };
    
    const checkAccess = () => {
        return checkAuthentication() && checkLaboratoryContext();
    };
    
    return {
        checkAuthentication,
        checkLaboratoryContext,
        checkAccess
    };
}

/**
 * Session monitoring composable
 */
export function useSessionMonitor() {
    const { sessionTimeRemaining, isSessionExpiring, extendSession, logout } = useEnhancedAuth();
    
    const sessionWarningThreshold = 5 * 60 * 1000; // 5 minutes
    const showWarning = ref(false);
    
    watch(sessionTimeRemaining, (remaining) => {
        if (remaining <= sessionWarningThreshold && remaining > 0) {
            showWarning.value = true;
        } else {
            showWarning.value = false;
        }
        
        if (remaining <= 0) {
            logout('session_expired');
        }
    });
    
    const dismissWarning = () => {
        showWarning.value = false;
        extendSession();
    };
    
    const formatTimeRemaining = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return {
        sessionTimeRemaining,
        isSessionExpiring,
        showWarning: computed(() => showWarning.value),
        dismissWarning,
        extendSession,
        formatTimeRemaining
    };
}