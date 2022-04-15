import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { IUser } from "../models/auth";
import { STORAGE_AUTH_KEY, USER_GROUP_OVERRIDE } from "../conf";
import { AUTHENTICATE_USER } from "../graphql/_mutations";
import { useNotifyToast, useApiUtil, userPreferenceComposable } from "../composables";

const { withClientMutation } = useApiUtil();
const { toastInfo } = useNotifyToast();
const { initPreferences } = userPreferenceComposable()

interface IAuth {
    token?: string,
    tokenType?: string,
    user?: IUser,
    isAuthenticated: boolean,
    authenticating: boolean,
}

export const useAuthStore = defineStore('auth', () => {

    const initialState: IAuth = {
        user: undefined,        
        token: "",
        tokenType: "",
        isAuthenticated: false,
        authenticating: false
    }

    const auth = ref({ ...initialState });

    const resetState = () => auth.value = { ...initialState }

    const reset = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY)
        resetState()
    }

    const logout = () => {
        toastInfo("Good bye " + auth.value.user?.firstName)
        localStorage.removeItem(STORAGE_AUTH_KEY)
        reset()
    }

    const upsertPermission = () => {
        if(USER_GROUP_OVERRIDE.length > 0) { 
            auth.value.user?.groups?.forEach(group => ({ ...group, name: USER_GROUP_OVERRIDE }))
        }
    }

    if(localStorage.getItem(STORAGE_AUTH_KEY)){
        const data = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!)
        auth.value = { ...auth.value, ...data, isAuthenticated: true, authenticating: false }
        upsertPermission()
    } else {
        // logout()
    }

    watch(auth, (authValue) => {
        if(authValue && authValue.user && authValue.token){
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authValue))
            upsertPermission()
        }
    })

    const persistAuth = async (data) => {
        auth.value = data
        auth.value.isAuthenticated = true;
        auth.value.authenticating = false
    }

    const authenticate = async (payload) => {
        auth.value.authenticating = true
        await withClientMutation(AUTHENTICATE_USER, payload, "authenticateUser").then((res) => {
            toastInfo("Welcome back " + res?.user?.firstName);
            initPreferences(res.user?.preference);
            persistAuth(res)
            // .then((_) => router.push({ name: "DASHBOARD" }));
        }).catch(err => auth.value.authenticating = false);
    }

    return { 
        auth, 
        authenticate,
        reset,
        persistAuth,
        logout
    }
})