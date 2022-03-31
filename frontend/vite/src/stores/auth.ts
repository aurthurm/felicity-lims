import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { IUser } from "../models/auth";
import { STORAGE_AUTH_KEY, USER_GROUP_OVERRIDE } from "../conf";

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

    const logout = () => {
        localStorage.removeItem(STORAGE_AUTH_KEY)
        resetState()
        const router = useRouter()
        router.push({ name: 'login' })
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
        logout()
    }

    watch(auth, (authValue) => {
        if(authValue && authValue.user && authValue.token){
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authValue))
            upsertPermission()
        } else {
            logout()
        }
    })

    const persistAuth = (data) => auth.value = data

    return { 
        auth, 
        persistAuth,
        logout
    }
})