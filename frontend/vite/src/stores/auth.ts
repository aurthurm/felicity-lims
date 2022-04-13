import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { IUser } from "../models/auth";
import { STORAGE_AUTH_KEY, USER_GROUP_OVERRIDE } from "../conf";
import { useNotifyToast } from "../composables";
const { toastInfo } = useNotifyToast();

interface IAuth {
    token?: string,
    tokenType?: string,
    user?: IUser,
    isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', () => {

    const initialState: IAuth = {
        user: undefined,        
        token: "",
        tokenType: "",
        isAuthenticated: false
    }

    const auth = ref({ ...initialState })

    const resetState = () => auth.value = { ...initialState }

    const reset = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY)
        resetState()
    }

    const logout = () => {
        toastInfo("Good bye " + auth.value.user?.firstName)
        localStorage.removeItem(STORAGE_AUTH_KEY)
        reset()
        location.replace("/auth")
        // this.$router.push({ name: 'Home' }); 
    }

    const upsertPermission = () => {
        if(USER_GROUP_OVERRIDE.length > 0) { 
            auth.value.user?.groups?.forEach(group => ({ ...group, name: USER_GROUP_OVERRIDE }))
        }
    }

    if(localStorage.getItem(STORAGE_AUTH_KEY)){
        const data = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!)
        auth.value = { ...auth.value, ...data, isAuthenticated: true }
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

    const persistAuth = async (data): Promise<boolean> => {
        auth.value = data
        return true
    }

    return { 
        auth, 
        reset,
        persistAuth,
        logout
    }
})