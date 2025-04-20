import { ENCRYPT_AUTH_KEY, STORAGE_AUTH_KEY } from '@/conf';
import { IUser } from '@/models/auth';
import { decrypter, decrypterSync, encrypter } from '@/utils';

interface AuthData {
    token?: string;
    tokenType?: string;
    user?: IUser;
}

// Store encrypted auth data in localStorage
const authToStorage = async (data: AuthData): Promise<void> => {
    const crypted = await encrypter(data, ENCRYPT_AUTH_KEY);
    localStorage.setItem(STORAGE_AUTH_KEY, crypted);
};

// Retrieve and decrypt auth data from localStorage (async)
const authFromStorage = async (): Promise<AuthData> => {
    return await decrypter(localStorage.getItem(STORAGE_AUTH_KEY), ENCRYPT_AUTH_KEY);
};

// Retrieve and decrypt auth data from localStorage (sync)
const authFromStorage2 = (): AuthData => {
    return decrypterSync(localStorage.getItem(STORAGE_AUTH_KEY), ENCRYPT_AUTH_KEY);
};

// Remove auth data from localStorage
const authLogout = (): void => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
};

// Get raw auth data from localStorage
const getAuthData = (): { auth?: AuthData } => {
    let data: { auth?: AuthData } = {};
    if (localStorage.getItem(STORAGE_AUTH_KEY)) {
        const auth = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!);
        data = { auth };
    }
    return data;
};

export { authToStorage, authFromStorage, authFromStorage2, authLogout, getAuthData };
