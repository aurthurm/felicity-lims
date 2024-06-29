import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IUser } from '@/models/auth';
import { STORAGE_AUTH_KEY, USER_GROUP_OVERRIDE } from '@/conf';
import { AUTHENTICATE_USER, REFRESH_TOKEN, REQUEST_PASSWORD_RESET, RESET_PASSWORD, VALIDATE_PASSWORD_RESET_TOKEN } from '@/graphql/operations/_mutations';
import { useAuthenticateUserMutation } from '@/graphql/graphql';
import { useNotifyToast, useApiUtil, userPreferenceComposable } from '@/composables';
import jwtDecode from 'jwt-decode';

const { withClientMutation } = useApiUtil();
const { toastInfo } = useNotifyToast();
const { initPreferences } = userPreferenceComposable();

interface IAuth {
    token?: string;
    refresh?: string;
    tokenType?: string;
    user?: IUser;
    isAuthenticated: boolean;
    processing: boolean;
    refreshTokenTimeout: any;
    forgotPassword: boolean;
    receivedToken: boolean;
    resetData: {
        canReset: boolean;
        username?: string;
        authUid?: string
    }
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
            authUid: ''
        }
    };

    const auth = ref({ ...initialState });

    const resetState = () => (auth.value = { ...initialState });

    const reset = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        stopRefreshTokenTimer()
        resetState();
    };

    const logout = () => {
        toastInfo('Good bye ' + auth.value.user?.firstName);
        reset();
    };

    const upsertPermission = () => {
        if (USER_GROUP_OVERRIDE.length > 0) {
            auth.value.user?.groups?.forEach(group => ({
                ...group,
                name: USER_GROUP_OVERRIDE,
            }));
        }
    };

    if (localStorage.getItem(STORAGE_AUTH_KEY)) {
        const data = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!);
        auth.value = {
            ...auth.value,
            ...data,
            isAuthenticated: true,
            processing: false,
        };
        upsertPermission();
    } else {
        // logout()
    }

    watch(() => auth.value, authValue => {
        if (authValue?.user && authValue?.token) {
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authValue));
            upsertPermission();
            // startRefreshTokenTimer();
        }
    });

    const persistAuth = async data => {
        auth.value = data;
        auth.value.isAuthenticated = true;
        auth.value.processing = false;
    };

    const authenticate = async payload => {
        auth.value.processing = true;

        // typescript-urql
        // const [{ data, fetching, error }, authenticate]  = useAuthenticateUserMutation();
        // authenticate({password: "", username: ""})
        // auth.value.authenticating = fetching;

        // typescript-vue-urql
        // useAuthenticateUserMutation().executeMutation({username: "", password: ""}, {requestPolicy: "network-only"}).then(res => {
        // }).catch(err => {
        // }).finally(() => (auth.value.authenticating = false));

        // const { operation } = useAuthenticateUserMutation({username: "", password: ""});
        
        await withClientMutation(AUTHENTICATE_USER, payload, 'authenticateUser')
            .then(res => {
                if(!res) {
                    auth.value.processing = false;
                    return
                };
                persistAuth(res);
            })
            .catch(err => (auth.value.processing = false));
    };

    const setForgotPassword = (v: boolean) => {
        auth.value.forgotPassword = v
    }

    const setReceivedResetToken = (v: boolean) => {
        auth.value.receivedToken = v
    }

    const resetPasswordRequest = async (email: string) => {
        auth.value.processing = true;
        await withClientMutation(REQUEST_PASSWORD_RESET, { email }, 'requestPasswordReset')
        .then(({ message }) => {
            setReceivedResetToken(true);
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }

    const validatePasswordResetToken = async (token: string) => {
        auth.value.processing = true;
        await withClientMutation(VALIDATE_PASSWORD_RESET_TOKEN, { token }, 'validatePasswordResetToken')
        .then(res => {
            auth.value.resetData = {
                canReset: res?.authUid && res?.username,
                authUid: res?.authUid,
                username:res?.username
            }
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }

    const resetPassword = async (password: string, passwordc: string) => {
        auth.value.processing = true;
        await withClientMutation(RESET_PASSWORD, { 
            username: auth.value?.resetData?.username, 
            authUid: auth.value?.resetData?.authUid, 
            password, passwordc 
        }, 'resetPassword')
        .then(res => {
            setForgotPassword(false)
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }
    
    const refreshToken = async (): Promise<void> => {
        await withClientMutation(REFRESH_TOKEN, { refreshToken: auth.value.refresh }, 'refresh')
        .then(res => {
            if(!res) {
                return
            };
            persistAuth(res);
        })
        .catch(err => (auth.value.processing = false));
    };

    const startRefreshTokenTimer = async () => {

        const decodedToken: any = jwtDecode(auth.value.token!)
        // refresh the token a minute before it expires
        const expires = new Date(+(decodedToken.exp) * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        //
        auth.value.refreshTokenTimeout = setTimeout(() => {
            refreshToken()
        }, timeout);
    };

    const stopRefreshTokenTimer = () => {
        clearTimeout(auth.value.refreshTokenTimeout);
    }

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
