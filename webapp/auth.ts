import { ENCRYPT_AUTH_KEY, STORAGE_AUTH_KEY, USER_GROUP_OVERRIDE } from './conf';
import { IUser } from './models/auth';
import { decrypter, decrypter2, encrypter } from './utils';

const authToStorage = async (data: any) => {
    const crypted = await encrypter(data, ENCRYPT_AUTH_KEY);
    await localStorage.setItem(STORAGE_AUTH_KEY, crypted);
};

const authFromStorage = async (): Promise<{
    token?: string;
    tokenType?: string;
    user?: IUser;
}> => {
    const data = await decrypter(localStorage.getItem(STORAGE_AUTH_KEY), ENCRYPT_AUTH_KEY);
    if (USER_GROUP_OVERRIDE.length > 0) {
        await data?.user?.groups?.forEach(group => {
            group.name = USER_GROUP_OVERRIDE;
        });
    }
    return data;
};

const authFromStorage2 = (): {
    token?: string;
    tokenType?: string;
    user?: IUser;
} => {
    const data = decrypter2(localStorage.getItem(STORAGE_AUTH_KEY), ENCRYPT_AUTH_KEY);
    if (USER_GROUP_OVERRIDE.length > 0) {
        data?.user?.groups?.forEach(group => {
            group.name = USER_GROUP_OVERRIDE;
        });
    }
    return data;
};

const authLogout = () => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
};

const getAuthData = () => {
    let data: any = {};
    if (localStorage.getItem(STORAGE_AUTH_KEY)) {
        const auth = JSON.parse(localStorage.getItem(STORAGE_AUTH_KEY)!);
        data = { auth };
    }
    return data;
};

export { authToStorage, authFromStorage, authFromStorage2, authLogout, getAuthData };
