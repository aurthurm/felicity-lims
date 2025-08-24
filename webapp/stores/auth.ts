import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { AuthenticatedData, LaboratoryType, UserType } from '@/types/gql';
import { STORAGE_AUTH_KEY } from '@/conf';
import {
    AuthenticateUserDocument, AuthenticateUserMutation, AuthenticateUserMutationVariables,
    TokenRefreshDocument, TokenRefreshMutation, TokenRefreshMutationVariables,
    RequestPassResetDocument, RequestPassResetMutation, RequestPassResetMutationVariables,
    PasswordResetDocument, PasswordResetMutation, PasswordResetMutationVariables,
    ValidatePassResetTokenDocument, ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables, 
    SwitchActiveLaboratoryDocument
} from '@/graphql/operations/_mutations';
import useApiUtil  from '@/composables/api_util';
import jwtDecode from 'jwt-decode';
import { authFromStorageSync, authToStorage } from '@/auth';
import { SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables } from '@/types/gqlops';

const { withClientMutation } = useApiUtil();    

interface IAuth {
    token?: string;
    refresh?: string;
    tokenType?: string;
    user?: UserType;
    isAuthenticated: boolean;
    processing: boolean;
    refreshTokenTimeout: any;
    forgotPassword: boolean;
    receivedToken: boolean;
    resetData: {
        canReset: boolean;
        username?: string;
    };
    activeLaboratory?: LaboratoryType,
    laboratories?: LaboratoryType[]
}

export const useAuthStore = defineStore('auth', () => {
    const initialState: IAuth = {
        user: undefined,
        token: '',
        refresh: '',
        tokenType: '',
        isAuthenticated: false,
        processing: false,
        refreshTokenTimeout: undefined,
        forgotPassword: false,
        receivedToken: false,
        resetData: {
            canReset: false,
            username: '',
        },
        activeLaboratory: undefined,
        laboratories: undefined
    };

    const auth = ref({ ...initialState });

    const resetState = () => (auth.value = { ...initialState });

    // Define stopRefreshTokenTimer first
    const stopRefreshTokenTimer = () => {
        if (auth.value.refreshTokenTimeout) {
            clearTimeout(auth.value.refreshTokenTimeout);
            auth.value.refreshTokenTimeout = undefined;
        }
    };

    const reset = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        stopRefreshTokenTimer();
        resetState();
    };

    const logout = () => {
        reset();
    };

    const refreshToken = async (): Promise<void> => {
        if (!auth.value.refresh) {
            console.error('No refresh token available');
            return;
        }
        
        // Prevent multiple refresh attempts
        if (auth.value.processing) {
            console.warn('Token refresh already in progress');
            return;
        }
        
        auth.value.processing = true;
        
        try {
            const res = await withClientMutation<TokenRefreshMutation, TokenRefreshMutationVariables>(
                TokenRefreshDocument, 
                { refreshToken: auth.value.refresh }, 
                'refresh'
            );
            
            if (!res) {
                console.warn('Token refresh returned no data');
                return;
            }
            
            await persistAuth(res);
            // The watch function will handle starting a new timer
        } catch (err) {
            console.error('Token refresh failed:', err);
        } finally {
            auth.value.processing = false;
        }
    };

    const startRefreshTokenTimer = () => {
        
        if (!auth.value.token) return;
        
        try {
            // Clear any existing timer first
            stopRefreshTokenTimer();
            
            const decodedToken: any = jwtDecode(auth.value.token);
            if (!decodedToken || !decodedToken.exp) {
                console.error('Invalid token format');
                return;
            }
            
            // Calculate time until token expires (in milliseconds)
            const expiresAt = new Date(+(decodedToken.exp) * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // Refresh 5 minutes before expiry
            const refreshTime = 5 * 60 * 1000; // 5 minutes in milliseconds
            const timeout = Math.max(0, timeUntilExpiry - refreshTime);
            
            // If token is already expired or will expire in less than 5 minutes
            if (timeout <= 0) {
                console.warn('Token is expired or about to expire, refreshing immediately');
                refreshToken();
                return;
            }
            
            console.log(`Setting refresh token timer for ${new Date(now.getTime() + timeout).toLocaleTimeString()}`);
            
            // Set new timer
            auth.value.refreshTokenTimeout = setTimeout(() => {
                refreshToken();
            }, timeout);
        } catch (error) {
            console.error('Failed to start refresh token timer:', error);
        }
    };

    // Initialize auth state from storage
    const initializeFromStorage = () => {
        try {
            const storedAuth = authFromStorageSync();
            if (storedAuth?.token && storedAuth?.user) {
                auth.value = {
                    ...auth.value,
                    ...storedAuth,
                    isAuthenticated: true,
                    processing: false,
                };
            } else {
                reset();
            }
        } catch (error) {
            console.error('Failed to initialize auth from storage:', error);
            reset();
        }
    };

    // Initialize on store creation
    initializeFromStorage();

    // Watch for changes to auth state
    watch(() => auth.value, (authValue, oldValue) => {
        // Only update storage and start timer if token or user has changed
        if ((authValue?.token !== oldValue?.token || authValue?.user !== oldValue?.user) && 
            authValue?.user && authValue?.token) {
            try {
                authToStorage(authValue as AuthenticatedData);
                // startRefreshTokenTimer();
            } catch (error) {
                console.error('Failed to persist auth state:', error);
                reset();
            }
        }
    }, { deep: true });

    const persistAuth = async (data: any) => {
        try {
            auth.value = {
                ...data,
                isAuthenticated: true,
                processing: false,
            };
        } catch (error) {
            console.error('Failed to persist auth data:', error);
            reset();
        }
    };

    const authenticate = async (payload: AuthenticateUserMutationVariables) => {
        auth.value.processing = true;
        await withClientMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(
            AuthenticateUserDocument, 
            payload, 
            'authenticateUser'
        )
        .then(res => {
            if(!res) {
                auth.value.processing = false;
                return;
            }
            persistAuth(res);
        })
        .catch(err => {
            console.error('Authentication failed:', err);
            auth.value.processing = false;
        });
    };

    const setForgotPassword = (v: boolean) => {
        auth.value.forgotPassword = v;
    };

    const setReceivedResetToken = (v: boolean) => {
        auth.value.receivedToken = v;
    };

    const resetPasswordRequest = async (email: string) => {
        auth.value.processing = true;
        await withClientMutation<RequestPassResetMutation, RequestPassResetMutationVariables>(
            RequestPassResetDocument, 
            { email }, 
            'requestPasswordReset'
        )
        .then(({ message }) => {
            setReceivedResetToken(true);
            auth.value.processing = false;
        })
        .catch(err => {
            console.error('Password reset request failed:', err);
            auth.value.processing = false;
        });
    };

    const validatePasswordResetToken = async (token: string) => {
        auth.value.processing = true;
        await withClientMutation<ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables>(
            ValidatePassResetTokenDocument, 
            { token }, 
            'validatePasswordResetToken'
        )
        .then(res => {
            auth.value.resetData = {
                canReset: !!!res?.username,
                username: res?.username
            };
            auth.value.processing = false;
        })
        .catch(err => {
            console.error('Token validation failed:', err);
            auth.value.processing = false;
        });
    };

    const resetPassword = async (password: string, passwordc: string) => {
        if (!auth.value?.resetData?.username) {
            console.error('No username found for password reset');
            auth.value.processing = false;
            return;
        }

        auth.value.processing = true;
        await withClientMutation<PasswordResetMutation, PasswordResetMutationVariables>(
            PasswordResetDocument, 
            { 
                userUid: auth.value.resetData.username, 
                password, 
                passwordc 
            }, 
            'resetPassword'
        )
        .then(res => {
            setForgotPassword(false);
            auth.value.processing = false;
        })
        .catch(err => {
            console.error('Password reset failed:', err);
            auth.value.processing = false;
        });
    };

    return {
        auth,
        authenticate,
        validatePasswordResetToken,
        resetPasswordRequest,
        resetPassword,
        setReceivedResetToken,
        setForgotPassword,
        reset,
        persistAuth,
        logout
    };
});
