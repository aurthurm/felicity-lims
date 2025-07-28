import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { AuthenticatedData, LaboratoryType, UserType } from '@/types/gql';
import { STORAGE_AUTH_KEY } from '@/conf';
import {
    AuthenticateUserDocument, AuthenticateUserMutation, AuthenticateUserMutationVariables,
    TokenRefreshDocument, TokenRefreshMutation, TokenRefreshMutationVariables,
    RequestPassResetDocument, RequestPassResetMutation, RequestPassResetMutationVariables,
    PasswordResetDocument, PasswordResetMutation, PasswordResetMutationVariables,
    ValidatePassResetTokenDocument, ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables,
    SwitchActiveLaboratoryDocument, SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables,
} from '@/graphql/operations/_mutations';
import useApiUtil from '@/composables/api_util';
import jwtDecode from 'jwt-decode';
import { authFromStorageSync, authToStorage } from '@/auth';

const { withClientMutation } = useApiUtil();

// Enhanced interfaces for comprehensive auth management
interface IUserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        desktop: boolean;
    };
    dashboard: {
        layout: 'grid' | 'list';
        widgets: string[];
        refreshInterval: number;
    };
    accessibility: {
        highContrast: boolean;
        largeText: boolean;
        screenReader: boolean;
        reducedMotion: boolean;
    };
}

interface ISecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    allowMultipleSessions: boolean;
    ipWhitelist: string[];
    lastPasswordChange: Date | null;
    passwordExpiryWarning: boolean;
    loginAlertsEnabled: boolean;
    securityQuestions: Array<{
        question: string;
        answer: string;
    }>;
}

interface ILaboratoryContext {
    activeLaboratory: LaboratoryType | null;
    availableLaboratories: LaboratoryType[];
    laboratoryHistory: Array<{
        laboratory: LaboratoryType;
        accessedAt: Date;
        duration: number;
    }>;
    frequentLaboratories: LaboratoryType[];
    recentLaboratories: LaboratoryType[];
    switchingInProgress: boolean;
    lastSwitchAt: Date | null;
    contextPermissions: Record<string, string[]>;
}

interface ISessionInfo {
    sessionId: string;
    startTime: Date;
    lastActivity: Date;
    ipAddress: string;
    userAgent: string;
    location?: {
        country: string;
        city: string;
        region: string;
    };
    deviceInfo: {
        platform: string;
        browser: string;
        version: string;
        isMobile: boolean;
    };
}

interface IAuthAnalytics {
    loginCount: number;
    lastLoginAt: Date | null;
    averageSessionDuration: number;
    mostUsedLaboratory: string | null;
    laboratoryUsageStats: Record<string, {
        count: number;
        totalDuration: number;
        lastAccess: Date;
    }>;
    securityEvents: Array<{
        type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'token_refresh' | 'laboratory_switch';
        timestamp: Date;
        details: Record<string, any>;
        severity: 'low' | 'medium' | 'high';
    }>;
}

interface IEnhancedAuth {
    // Core authentication
    token?: string;
    refresh?: string;
    tokenType?: string;
    user?: UserType;
    isAuthenticated: boolean;
    processing: boolean;
    refreshTokenTimeout: any;
    
    // Password reset
    forgotPassword: boolean;
    receivedToken: boolean;
    resetData: {
        canReset: boolean;
        username?: string;
    };
    
    // Laboratory context
    laboratoryContext: ILaboratoryContext;
    
    // User preferences and settings
    userPreferences: IUserPreferences;
    securitySettings: ISecuritySettings;
    
    // Session management
    sessionInfo: ISessionInfo | null;
    activeSessions: ISessionInfo[];
    
    // Authentication analytics
    analytics: IAuthAnalytics;
    
    // Advanced features
    biometricEnabled: boolean;
    rememberMe: boolean;
    autoSwitchLaboratory: boolean;
    offlineMode: boolean;
    
    // Error handling
    lastError: string | null;
    errorHistory: Array<{
        error: string;
        timestamp: Date;
        context: string;
    }>;
    
    // Performance monitoring
    performanceMetrics: {
        authenticationTime: number;
        tokenRefreshTime: number;
        laboratorySwitchTime: number;
    };
}

const STORAGE_PREFERENCES_KEY = 'felicity_user_preferences';
const STORAGE_SECURITY_KEY = 'felicity_security_settings';
const STORAGE_ANALYTICS_KEY = 'felicity_auth_analytics';

export const useEnhancedAuthStore = defineStore('enhancedAuth', () => {
    const router = useRouter();
    
    // Default configurations
    const defaultPreferences: IUserPreferences = {
        theme: 'system',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: {
            email: true,
            push: true,
            sms: false,
            desktop: true,
        },
        dashboard: {
            layout: 'grid',
            widgets: ['overview', 'recent_samples', 'pending_results'],
            refreshInterval: 30000, // 30 seconds
        },
        accessibility: {
            highContrast: false,
            largeText: false,
            screenReader: false,
            reducedMotion: false,
        },
    };

    const defaultSecuritySettings: ISecuritySettings = {
        twoFactorEnabled: false,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        allowMultipleSessions: true,
        ipWhitelist: [],
        lastPasswordChange: null,
        passwordExpiryWarning: false,
        loginAlertsEnabled: true,
        securityQuestions: [],
    };

    const defaultAnalytics: IAuthAnalytics = {
        loginCount: 0,
        lastLoginAt: null,
        averageSessionDuration: 0,
        mostUsedLaboratory: null,
        laboratoryUsageStats: {},
        securityEvents: [],
    };

    const initialState: IEnhancedAuth = {
        // Core authentication
        user: undefined,
        token: '',
        refresh: '',
        tokenType: '',
        isAuthenticated: false,
        processing: false,
        refreshTokenTimeout: undefined,
        
        // Password reset
        forgotPassword: false,
        receivedToken: false,
        resetData: {
            canReset: false,
            username: '',
        },
        
        // Laboratory context
        laboratoryContext: {
            activeLaboratory: null,
            availableLaboratories: [],
            laboratoryHistory: [],
            frequentLaboratories: [],
            recentLaboratories: [],
            switchingInProgress: false,
            lastSwitchAt: null,
            contextPermissions: {},
        },
        
        // User preferences and settings
        userPreferences: { ...defaultPreferences },
        securitySettings: { ...defaultSecuritySettings },
        
        // Session management
        sessionInfo: null,
        activeSessions: [],
        
        // Authentication analytics
        analytics: { ...defaultAnalytics },
        
        // Advanced features
        biometricEnabled: false,
        rememberMe: false,
        autoSwitchLaboratory: false,
        offlineMode: false,
        
        // Error handling
        lastError: null,
        errorHistory: [],
        
        // Performance monitoring
        performanceMetrics: {
            authenticationTime: 0,
            tokenRefreshTime: 0,
            laboratorySwitchTime: 0,
        },
    };

    const auth = ref<IEnhancedAuth>({ ...initialState });

    // Computed properties for enhanced functionality
    const isLabContextRequired = computed(() => {
        return router.currentRoute.value.meta?.requiresLaboratory || false;
    });

    const hasMultipleLaboratories = computed(() => {
        return auth.value.laboratoryContext.availableLaboratories.length > 1;
    });

    const canSwitchLaboratories = computed(() => {
        return hasMultipleLaboratories.value && !auth.value.laboratoryContext.switchingInProgress;
    });

    const sessionTimeRemaining = computed(() => {
        if (!auth.value.sessionInfo) return 0;
        
        const elapsed = Date.now() - auth.value.sessionInfo.lastActivity.getTime();
        const remaining = auth.value.securitySettings.sessionTimeout - elapsed;
        return Math.max(0, remaining);
    });

    const isSessionExpiring = computed(() => {
        return sessionTimeRemaining.value < 5 * 60 * 1000; // 5 minutes warning
    });

    const tokenExpiresAt = computed(() => {
        if (!auth.value.token) return null;
        
        try {
            const decoded: any = jwtDecode(auth.value.token);
            return new Date(decoded.exp * 1000);
        } catch {
            return null;
        }
    });

    const isTokenExpiring = computed(() => {
        if (!tokenExpiresAt.value) return false;
        
        const timeUntilExpiry = tokenExpiresAt.value.getTime() - Date.now();
        return timeUntilExpiry < 10 * 60 * 1000; // 10 minutes warning
    });

    // Core state management methods
    const resetState = () => {
        auth.value = { ...initialState };
    };

    const stopRefreshTokenTimer = () => {
        if (auth.value.refreshTokenTimeout) {
            clearTimeout(auth.value.refreshTokenTimeout);
            auth.value.refreshTokenTimeout = undefined;
        }
    };

    const reset = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        localStorage.removeItem(STORAGE_PREFERENCES_KEY);
        localStorage.removeItem(STORAGE_SECURITY_KEY);
        localStorage.removeItem(STORAGE_ANALYTICS_KEY);
        stopRefreshTokenTimer();
        resetState();
    };

    const logout = async (reason = 'user_initiated') => {
        const startTime = performance.now();
        
        try {
            // Record logout event
            await recordSecurityEvent('logout', { reason }, 'low');
            
            // Update session analytics
            if (auth.value.sessionInfo) {
                const sessionDuration = Date.now() - auth.value.sessionInfo.startTime.getTime();
                updateAnalytics({ sessionDuration });
            }
            
            // Clear all auth data
            reset();
            
            // Redirect to login if needed
            if (router.currentRoute.value.meta?.requiresAuth) {
                await router.push('/auth/login');
            }
            
        } catch (error) {
            console.error('Logout error:', error);
            reset(); // Force reset even if analytics fail
        } finally {
            auth.value.performanceMetrics.authenticationTime = performance.now() - startTime;
        }
    };

    // Enhanced token management
    const refreshToken = async (): Promise<boolean> => {
        if (!auth.value.refresh) {
            console.error('No refresh token available');
            return false;
        }
        
        if (auth.value.processing) {
            console.warn('Token refresh already in progress');
            return false;
        }
        
        const startTime = performance.now();
        auth.value.processing = true;
        
        try {
            const res = await withClientMutation<TokenRefreshMutation, TokenRefreshMutationVariables>(
                TokenRefreshDocument,
                { refreshToken: auth.value.refresh },
                'refresh'
            );
            
            if (!res) {
                console.warn('Token refresh returned no data');
                return false;
            }
            
            await persistAuth(res);
            await recordSecurityEvent('token_refresh', { success: true }, 'low');
            
            return true;
            
        } catch (err) {
            console.error('Token refresh failed:', err);
            await recordSecurityEvent('token_refresh', { success: false, error: String(err) }, 'medium');
            
            // If refresh fails, logout user
            await logout('token_refresh_failed');
            return false;
            
        } finally {
            auth.value.processing = false;
            auth.value.performanceMetrics.tokenRefreshTime = performance.now() - startTime;
        }
    };

    const startRefreshTokenTimer = () => {
        if (!auth.value.token) return;
        
        try {
            stopRefreshTokenTimer();
            
            const decodedToken: any = jwtDecode(auth.value.token);
            if (!decodedToken || !decodedToken.exp) {
                console.error('Invalid token format');
                return;
            }
            
            const expiresAt = new Date(decodedToken.exp * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // Refresh 5 minutes before expiry
            const refreshTime = 5 * 60 * 1000;
            const timeout = Math.max(0, timeUntilExpiry - refreshTime);
            
            if (timeout <= 0) {
                console.warn('Token is expired or about to expire, refreshing immediately');
                refreshToken();
                return;
            }
            
            console.log(`Setting refresh token timer for ${new Date(now.getTime() + timeout).toLocaleTimeString()}`);
            
            auth.value.refreshTokenTimeout = setTimeout(refreshToken, timeout);
            
        } catch (error) {
            console.error('Failed to start refresh token timer:', error);
        }
    };

    // Enhanced authentication
    const authenticate = async (payload: AuthenticateUserMutationVariables) => {
        const startTime = performance.now();
        auth.value.processing = true;
        auth.value.lastError = null;
        
        try {
            const res = await withClientMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(
                AuthenticateUserDocument,
                payload,
                'authenticateUser'
            );
            
            if (!res) {
                throw new Error('Authentication returned no data');
            }
            
            await persistAuth(res);
            
            // Initialize session info
            initializeSession();
            
            // Record successful login
            await recordSecurityEvent('login', { 
                username: payload.username,
                success: true 
            }, 'low');
            
            // Update analytics
            updateAnalytics({ 
                loginCount: auth.value.analytics.loginCount + 1,
                lastLoginAt: new Date()
            });
            
            return true;
            
        } catch (err) {
            const errorMessage = String(err);
            auth.value.lastError = errorMessage;
            
            // Record failed login
            await recordSecurityEvent('login', { 
                username: payload.username,
                success: false,
                error: errorMessage
            }, 'medium');
            
            console.error('Authentication failed:', err);
            return false;
            
        } finally {
            auth.value.processing = false;
            auth.value.performanceMetrics.authenticationTime = performance.now() - startTime;
        }
    };

    // Multi-tenant laboratory context management
    const switchActiveLaboratory = async (laboratoryUid: string): Promise<boolean> => {
        if (auth.value.laboratoryContext.switchingInProgress) {
            console.warn('Laboratory switch already in progress');
            return false;
        }
        
        const startTime = performance.now();
        auth.value.laboratoryContext.switchingInProgress = true;
        
        try {
            const res = await withClientMutation<SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables>(
                SwitchActiveLaboratoryDocument,
                { laboratoryUid },
                'switchActiveLaboratory'
            );
            
            if (!res) {
                throw new Error('Laboratory switch returned no data');
            }
            
            // Update auth state with new laboratory context
            await persistAuth(res);
            
            // Record laboratory switch
            const previousLab = auth.value.laboratoryContext.activeLaboratory;
            const newLab = auth.value.laboratoryContext.availableLaboratories.find(lab => lab.uid === laboratoryUid);
            
            if (newLab) {
                // Update laboratory context
                auth.value.laboratoryContext.activeLaboratory = newLab;
                auth.value.laboratoryContext.lastSwitchAt = new Date();
                
                // Update history
                if (previousLab) {
                    const historyEntry = {
                        laboratory: previousLab,
                        accessedAt: new Date(),
                        duration: auth.value.laboratoryContext.lastSwitchAt 
                            ? Date.now() - auth.value.laboratoryContext.lastSwitchAt.getTime() 
                            : 0
                    };
                    auth.value.laboratoryContext.laboratoryHistory.unshift(historyEntry);
                    
                    // Keep only last 10 entries
                    if (auth.value.laboratoryContext.laboratoryHistory.length > 10) {
                        auth.value.laboratoryContext.laboratoryHistory = 
                            auth.value.laboratoryContext.laboratoryHistory.slice(0, 10);
                    }
                }
                
                // Update recent laboratories
                updateRecentLaboratories(newLab);
                
                // Update usage statistics
                updateLaboratoryUsageStats(laboratoryUid);
                
                // Record security event
                await recordSecurityEvent('laboratory_switch', {
                    previousLaboratory: previousLab?.uid,
                    newLaboratory: laboratoryUid,
                    laboratoryName: newLab.name
                }, 'low');
            }
            
            return true;
            
        } catch (err) {
            console.error('Laboratory switch failed:', err);
            auth.value.lastError = String(err);
            
            await recordSecurityEvent('laboratory_switch', {
                laboratoryUid,
                success: false,
                error: String(err)
            }, 'medium');
            
            return false;
            
        } finally {
            auth.value.laboratoryContext.switchingInProgress = false;
            auth.value.performanceMetrics.laboratorySwitchTime = performance.now() - startTime;
        }
    };

    const refreshLaboratories = async (): Promise<void> => {
        // This would typically fetch updated laboratory list from API
        // For now, we'll simulate refreshing from current user data
        if (auth.value.user?.laboratories) {
            auth.value.laboratoryContext.availableLaboratories = auth.value.user.laboratories;
            updateFrequentLaboratories();
        }
    };

    const updateRecentLaboratories = (laboratory: LaboratoryType) => {
        const recent = auth.value.laboratoryContext.recentLaboratories;
        const existingIndex = recent.findIndex(lab => lab.uid === laboratory.uid);
        
        if (existingIndex > -1) {
            recent.splice(existingIndex, 1);
        }
        
        recent.unshift(laboratory);
        
        // Keep only last 5 recent laboratories
        if (recent.length > 5) {
            auth.value.laboratoryContext.recentLaboratories = recent.slice(0, 5);
        }
    };

    const updateFrequentLaboratories = () => {
        const stats = auth.value.analytics.laboratoryUsageStats;
        const frequent = Object.entries(stats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 3)
            .map(([uid]) => auth.value.laboratoryContext.availableLaboratories.find(lab => lab.uid === uid))
            .filter(Boolean) as LaboratoryType[];
        
        auth.value.laboratoryContext.frequentLaboratories = frequent;
    };

    const updateLaboratoryUsageStats = (laboratoryUid: string) => {
        const stats = auth.value.analytics.laboratoryUsageStats;
        
        if (!stats[laboratoryUid]) {
            stats[laboratoryUid] = {
                count: 0,
                totalDuration: 0,
                lastAccess: new Date()
            };
        }
        
        stats[laboratoryUid].count += 1;
        stats[laboratoryUid].lastAccess = new Date();
        
        // Update most used laboratory
        const mostUsed = Object.entries(stats)
            .sort(([, a], [, b]) => b.count - a.count)[0];
        
        if (mostUsed) {
            auth.value.analytics.mostUsedLaboratory = mostUsed[0];
        }
        
        updateFrequentLaboratories();
    };

    // Session management
    const initializeSession = () => {
        const sessionId = crypto.randomUUID();
        const now = new Date();
        
        auth.value.sessionInfo = {
            sessionId,
            startTime: now,
            lastActivity: now,
            ipAddress: '', // Would be set from server
            userAgent: navigator.userAgent,
            deviceInfo: {
                platform: navigator.platform,
                browser: getBrowserInfo().name,
                version: getBrowserInfo().version,
                isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
            }
        };
        
        // Start session timeout monitoring
        startSessionTimeoutMonitoring();
    };

    const updateSessionActivity = () => {
        if (auth.value.sessionInfo) {
            auth.value.sessionInfo.lastActivity = new Date();
        }
    };

    const startSessionTimeoutMonitoring = () => {
        const checkInterval = 60000; // Check every minute
        
        const timeoutCheck = setInterval(() => {
            if (!auth.value.isAuthenticated) {
                clearInterval(timeoutCheck);
                return;
            }
            
            if (sessionTimeRemaining.value <= 0) {
                clearInterval(timeoutCheck);
                logout('session_timeout');
            }
        }, checkInterval);
    };

    // User preferences management
    const updateUserPreferences = (preferences: Partial<IUserPreferences>) => {
        auth.value.userPreferences = { ...auth.value.userPreferences, ...preferences };
        saveUserPreferences();
    };

    const updateSecuritySettings = (settings: Partial<ISecuritySettings>) => {
        auth.value.securitySettings = { ...auth.value.securitySettings, ...settings };
        saveSecuritySettings();
    };

    const saveUserPreferences = () => {
        try {
            localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(auth.value.userPreferences));
        } catch (error) {
            console.error('Failed to save user preferences:', error);
        }
    };

    const saveSecuritySettings = () => {
        try {
            localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(auth.value.securitySettings));
        } catch (error) {
            console.error('Failed to save security settings:', error);
        }
    };

    const loadUserPreferences = () => {
        try {
            const stored = localStorage.getItem(STORAGE_PREFERENCES_KEY);
            if (stored) {
                const preferences = JSON.parse(stored);
                auth.value.userPreferences = { ...defaultPreferences, ...preferences };
            }
        } catch (error) {
            console.error('Failed to load user preferences:', error);
            auth.value.userPreferences = { ...defaultPreferences };
        }
    };

    const loadSecuritySettings = () => {
        try {
            const stored = localStorage.getItem(STORAGE_SECURITY_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                auth.value.securitySettings = { ...defaultSecuritySettings, ...settings };
            }
        } catch (error) {
            console.error('Failed to load security settings:', error);
            auth.value.securitySettings = { ...defaultSecuritySettings };
        }
    };

    // Analytics and security events management
    const recordSecurityEvent = async (
        type: IAuthAnalytics['securityEvents'][0]['type'],
        details: Record<string, any>,
        severity: 'low' | 'medium' | 'high'
    ) => {
        const event = {
            type,
            timestamp: new Date(),
            details,
            severity
        };
        
        auth.value.analytics.securityEvents.unshift(event);
        
        // Keep only last 50 events
        if (auth.value.analytics.securityEvents.length > 50) {
            auth.value.analytics.securityEvents = auth.value.analytics.securityEvents.slice(0, 50);
        }
        
        saveAnalytics();
        
        // Trigger alerts for high severity events
        if (severity === 'high') {
            console.warn('High severity security event:', event);
        }
    };

    const updateAnalytics = (updates: Partial<IAuthAnalytics>) => {
        auth.value.analytics = { ...auth.value.analytics, ...updates };
        saveAnalytics();
    };

    const saveAnalytics = () => {
        try {
            localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(auth.value.analytics));
        } catch (error) {
            console.error('Failed to save analytics:', error);
        }
    };

    const loadAnalytics = () => {
        try {
            const stored = localStorage.getItem(STORAGE_ANALYTICS_KEY);
            if (stored) {
                const analytics = JSON.parse(stored);
                auth.value.analytics = { ...defaultAnalytics, ...analytics };
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
            auth.value.analytics = { ...defaultAnalytics };
        }
    };

    // Initialize from storage
    const initializeFromStorage = () => {
        try {
            const storedAuth = authFromStorageSync();
            loadUserPreferences();
            loadSecuritySettings();
            loadAnalytics();
            
            if (storedAuth?.token && storedAuth?.user) {
                auth.value = {
                    ...auth.value,
                    ...storedAuth,
                    isAuthenticated: true,
                    processing: false,
                };
                
                // Initialize laboratory context
                if (storedAuth.user?.laboratories) {
                    auth.value.laboratoryContext.availableLaboratories = storedAuth.user.laboratories;
                    auth.value.laboratoryContext.activeLaboratory = storedAuth.user.activeLaboratory || null;
                    updateFrequentLaboratories();
                }
                
                initializeSession();
                startRefreshTokenTimer();
            } else {
                reset();
            }
        } catch (error) {
            console.error('Failed to initialize auth from storage:', error);
            reset();
        }
    };

    // Persist auth data
    const persistAuth = async (data: any) => {
        try {
            auth.value = {
                ...auth.value,
                ...data,
                isAuthenticated: true,
                processing: false,
            };
            
            // Update laboratory context if user data includes laboratories
            if (data.user?.laboratories) {
                auth.value.laboratoryContext.availableLaboratories = data.user.laboratories;
                auth.value.laboratoryContext.activeLaboratory = data.user.activeLaboratory || null;
                updateFrequentLaboratories();
            }
            
        } catch (error) {
            console.error('Failed to persist auth data:', error);
            reset();
        }
    };

    // Utility functions
    const getBrowserInfo = () => {
        const userAgent = navigator.userAgent;
        let name = 'Unknown';
        let version = 'Unknown';
        
        if (userAgent.includes('Chrome')) {
            name = 'Chrome';
            version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Firefox')) {
            name = 'Firefox';
            version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Safari')) {
            name = 'Safari';
            version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Edge')) {
            name = 'Edge';
            version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }
        
        return { name, version };
    };

    // Password reset methods (enhanced from original)
    const setForgotPassword = (v: boolean) => {
        auth.value.forgotPassword = v;
    };

    const setReceivedResetToken = (v: boolean) => {
        auth.value.receivedToken = v;
    };

    const resetPasswordRequest = async (email: string) => {
        auth.value.processing = true;
        try {
            await withClientMutation<RequestPassResetMutation, RequestPassResetMutationVariables>(
                RequestPassResetDocument,
                { email },
                'requestPasswordReset'
            );
            
            setReceivedResetToken(true);
            await recordSecurityEvent('password_reset_request', { email }, 'medium');
            
        } catch (err) {
            console.error('Password reset request failed:', err);
            auth.value.lastError = String(err);
        } finally {
            auth.value.processing = false;
        }
    };

    const validatePasswordResetToken = async (token: string) => {
        auth.value.processing = true;
        try {
            const res = await withClientMutation<ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables>(
                ValidatePassResetTokenDocument,
                { token },
                'validatePasswordResetToken'
            );
            
            auth.value.resetData = {
                canReset: !!res?.username,
                username: res?.username
            };
            
        } catch (err) {
            console.error('Token validation failed:', err);
            auth.value.lastError = String(err);
        } finally {
            auth.value.processing = false;
        }
    };

    const resetPassword = async (password: string, passwordc: string) => {
        if (!auth.value?.resetData?.username) {
            console.error('No username found for password reset');
            return;
        }

        auth.value.processing = true;
        try {
            await withClientMutation<PasswordResetMutation, PasswordResetMutationVariables>(
                PasswordResetDocument,
                {
                    userUid: auth.value.resetData.username,
                    password,
                    passwordc
                },
                'resetPassword'
            );
            
            setForgotPassword(false);
            await recordSecurityEvent('password_change', { method: 'reset' }, 'medium');
            
            // Update security settings
            auth.value.securitySettings.lastPasswordChange = new Date();
            saveSecuritySettings();
            
        } catch (err) {
            console.error('Password reset failed:', err);
            auth.value.lastError = String(err);
        } finally {
            auth.value.processing = false;
        }
    };

    // Initialize store
    initializeFromStorage();

    // Watch for auth state changes
    watch(() => auth.value, (authValue, oldValue) => {
        if ((authValue?.token !== oldValue?.token || authValue?.user !== oldValue?.user) && 
            authValue?.user && authValue?.token) {
            try {
                authToStorage(authValue as AuthenticatedData);
                updateSessionActivity();
            } catch (error) {
                console.error('Failed to persist auth state:', error);
                reset();
            }
        }
    }, { deep: true });

    // Watch for route changes to update session activity
    watch(() => router.currentRoute.value.path, () => {
        updateSessionActivity();
    });

    return {
        // State
        auth: computed(() => auth.value),
        
        // Computed properties
        isLabContextRequired,
        hasMultipleLaboratories,
        canSwitchLaboratories,
        sessionTimeRemaining,
        isSessionExpiring,
        tokenExpiresAt,
        isTokenExpiring,
        
        // Core authentication methods
        authenticate,
        logout,
        reset,
        persistAuth,
        refreshToken,
        
        // Laboratory context methods
        switchActiveLaboratory,
        refreshLaboratories,
        
        // Session management
        updateSessionActivity,
        
        // User preferences
        updateUserPreferences,
        updateSecuritySettings,
        
        // Analytics
        recordSecurityEvent,
        updateAnalytics,
        
        // Password reset methods
        setForgotPassword,
        setReceivedResetToken,
        resetPasswordRequest,
        validatePasswordResetToken,
        resetPassword,
    };
});