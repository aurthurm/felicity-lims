import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { IUser } from '@/models/auth';
import { STORAGE_AUTH_KEY } from '@/conf';
import {
    AuthenticateUserDocument, AuthenticateUserMutation, AuthenticateUserMutationVariables,
    TokenRefreshDocument, TokenRefreshMutation, TokenRefreshMutationVariables,
    RequestPassResetDocument, RequestPassResetMutation, RequestPassResetMutationVariables,
    PasswordResetDocument, PasswordResetMutation, PasswordResetMutationVariables,
    ValidatePassResetTokenDocument, ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables 
} from '@/graphql/operations/_mutations';
import useApiUtil  from '@/composables/api_util';
import jwtDecode from 'jwt-decode';

const { withClientMutation } = useApiUtil();    

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
        reset();
    };

    if (localStorage.getItem(STORAGE_AUTH_KEY)) {
        const data = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!);
        auth.value = {
            ...auth.value,
            ...data,
            isAuthenticated: true,
            processing: false,
        };
    } else {
        // logout()
    }

    watch(() => auth.value, authValue => {
        if (authValue?.user && authValue?.token) {
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authValue));
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
        
        await withClientMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(AuthenticateUserDocument, payload, 'authenticateUser')
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
        await withClientMutation<RequestPassResetMutation, RequestPassResetMutationVariables>(RequestPassResetDocument, { email }, 'requestPasswordReset')
        .then(({ message }) => {
            setReceivedResetToken(true);
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }

    const validatePasswordResetToken = async (token: string) => {
        auth.value.processing = true;
        await withClientMutation<ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables>(ValidatePassResetTokenDocument, { token }, 'validatePasswordResetToken')
        .then(res => {
            auth.value.resetData = {
                canReset: !!!res?.username,
                username:res?.username
            }
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }

    const resetPassword = async (password: string, passwordc: string) => {
        auth.value.processing = true;
        await withClientMutation<PasswordResetMutation, PasswordResetMutationVariables>(PasswordResetDocument, { 
            username: auth.value?.resetData?.username, 
            password, passwordc 
        }, 'resetPassword')
        .then(res => {
            setForgotPassword(false)
            auth.value.processing = false;
        })
        .catch(err => (auth.value.processing = false));
    }
    
    const refreshToken = async (): Promise<void> => {
        await withClientMutation<TokenRefreshMutation, TokenRefreshMutationVariables>(TokenRefreshDocument, { refreshToken: auth.value.refresh }, 'refresh')
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
