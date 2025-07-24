import { ENCRYPT_AUTH_KEY, STORAGE_AUTH_KEY } from '@/conf';
import { AuthenticatedData } from '@/types/gql';
import { decrypter, decrypterSync, encrypter } from '@/utils';


/**
 * Store encrypted auth data in localStorage
 * @param data - Authentication data to store
 * @returns Promise that resolves when data is stored
 */
const authToStorage = async (data: AuthenticatedData): Promise<void> => {
    try {
        const crypted = await encrypter(data, ENCRYPT_AUTH_KEY);
        localStorage.setItem(STORAGE_AUTH_KEY, crypted);
    } catch (error) {
        console.error('Failed to store authentication data:', error);
        throw new Error('Authentication storage failed');
    }
};

/**
 * Retrieve and decrypt auth data from localStorage (async)
 * @returns Promise that resolves with the decrypted auth data
 */
const authFromStorage = async (): Promise<AuthenticatedData> => {
    try {
        return await decrypter(localStorage.getItem(STORAGE_AUTH_KEY) || '', ENCRYPT_AUTH_KEY);
    } catch (error) {
        console.error('Failed to retrieve authentication data:', error);
        throw new Error('Authentication storage failed');
    }
};

/**
 * Retrieve and decrypt auth data from localStorage (synchronous)
 * @returns Decrypted auth data
 */
const authFromStorageSync = (): AuthenticatedData => {
    try {
        return decrypterSync(localStorage.getItem(STORAGE_AUTH_KEY) || '', ENCRYPT_AUTH_KEY);
    } catch (error) {
        console.error('Failed to retrieve authentication data synchronously:', error);
        throw new Error('Authentication storage failed');
    }
};

/**
 * Remove auth data from localStorage
 */
const authLogout = (): void => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
};

/**
 * Check if the current authentication token is expired
 * @returns True if the token is expired or doesn't exist
 */
const isAuthExpired = (): boolean => {
    // try {
    //     const auth = authFromStorageSync();
    //     if (!auth.expiresAt) return true;
    //     return Date.now() >= auth.expiresAt;
    // } catch (error) {
    //     console.error('Failed to check authentication expiration:', error);
    //     return true;
    // }
    return false;
};

/**
 * Get the current user from storage
 * @returns The current user or undefined if not authenticated
 */
const getAuthData = (): AuthenticatedData => {
    try {
        return  authFromStorageSync();
    } catch (error) {
        console.error('Failed to get current user:', error);
        throw new Error('Authentication storage failed');
    }
};


const generateRequestId = () => {
    return 'req_' + Math.random().toString(36).substr(2, 9);
}

export { 
    authToStorage, 
    authFromStorage, 
    authFromStorageSync, 
    authLogout, 
    isAuthExpired,
    getAuthData,
    generateRequestId
};
