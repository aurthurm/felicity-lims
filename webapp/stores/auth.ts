import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { AuthenticatedData, LaboratoryType, UserType } from '@/types/gql';
import { STORAGE_AUTH_KEY } from '@/conf';
import {
    AuthenticateUserDocument,
    AuthenticateUserMutation,
    AuthenticateUserMutationVariables,
    TokenRefreshDocument,
    TokenRefreshMutation,
    TokenRefreshMutationVariables,
    RequestPassResetDocument,
    RequestPassResetMutation,
    RequestPassResetMutationVariables,
    PasswordResetDocument,
    PasswordResetMutation,
    PasswordResetMutationVariables,
    ValidatePassResetTokenDocument,
    ValidatePassResetTokenMutation,
    ValidatePassResetTokenMutationVariables,
    SwitchActiveLaboratoryDocument,
} from '@/graphql/operations/_mutations';
import useApiUtil from '@/composables/api_util';
import { jwtDecode } from 'jwt-decode';
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
        userUid?: string;
    };
    activeLaboratory?: LaboratoryType;
    laboratories?: LaboratoryType[];
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
            userUid: '',
        },
        activeLaboratory: undefined,
        laboratories: undefined,
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
            return;
        }

        // Prevent multiple refresh attempts
        if (auth.value.processing) {
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
                return;
            }

            await persistAuth(res);
            // The watch function will handle starting a new timer
        } catch {} finally {
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
                return;
            }

            // Calculate time until token expires (in milliseconds)
            const expiresAt = new Date(+decodedToken.exp * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();

            // Refresh 5 minutes before expiry
            const refreshTime = 5 * 60 * 1000; // 5 minutes in milliseconds
            const timeout = Math.max(0, timeUntilExpiry - refreshTime);

            // If token is already expired or will expire in less than 5 minutes
            if (timeout <= 0) {
                refreshToken();
                return;
            }


            // Set new timer
            auth.value.refreshTokenTimeout = setTimeout(() => {
                refreshToken();
            }, timeout);
        } catch {}
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
            reset();
        }
    };

    // Initialize on store creation
    initializeFromStorage();

    // Watch for changes to auth state
    watch(
        () => auth.value,
        (authValue, oldValue) => {
            // Only update storage and start timer if token or user has changed
            if ((authValue?.token !== oldValue?.token || authValue?.user !== oldValue?.user) && authValue?.user && authValue?.token) {
                try {
                    authToStorage(authValue as AuthenticatedData);
                    // startRefreshTokenTimer();
                } catch (error) {
                    reset();
                }
            }
        },
        { deep: true }
    );

    const persistAuth = async (data: any) => {
        try {
            const newAuth = {
                ...data,
                isAuthenticated: true,
                processing: false,
            };
            // Persist to localStorage BEFORE updating store so urql's getAuthData()
            // (which reads from localStorage) has the token when watchers fire
            await authToStorage(newAuth as AuthenticatedData);
            auth.value = newAuth;
        } catch (error) {
            reset();
        }
    };

    const authenticate = async (payload: AuthenticateUserMutationVariables) => {
        auth.value.processing = true;
        try {
            const res = await withClientMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(
                AuthenticateUserDocument,
                payload,
                'authenticateUser'
            );
            if (!res) {
                return;
            }
            await persistAuth(res);
        } catch (err) {
            // Error handled by withClientMutation
        } finally {
            auth.value.processing = false;
        }
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
                    canReset: !!res?.username,
                    username: res?.username,
                    userUid: res?.userUid,
                };
                auth.value.processing = false;
            })
            .catch(err => {
                auth.value.processing = false;
            });
    };

    const resetPassword = async (password: string, passwordc: string) => {
        if (!auth.value?.resetData?.userUid) {
            auth.value.processing = false;
            return;
        }

        auth.value.processing = true;
        await withClientMutation<PasswordResetMutation, PasswordResetMutationVariables>(
            PasswordResetDocument,
            {
                userUid: auth.value.resetData.userUid,
                password,
                passwordc,
            },
            'resetPassword'
        )
            .then(res => {
                setForgotPassword(false);
                auth.value.processing = false;
            })
            .catch(err => {
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
        logout,
    };
});
