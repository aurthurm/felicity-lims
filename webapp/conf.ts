// Active User Credentials
export const STORAGE_AUTH_KEY = '__fel_lis__';
export const ENCRYPT_AUTH_KEY = 'felicity';
// development purposes only
export const USER_GROUP_OVERRIDE = ''; // 'ADMINISTRATOR'

export const REST_BASE_URL = import.meta.env.VITE_BASE_URL || "";
export const GQL_BASE_URL = `${REST_BASE_URL}/felicity-gql`;


export let WS_BASE_URL;
if (REST_BASE_URL?.includes("http")) {
    WS_BASE_URL = `ws://${REST_BASE_URL.replace("http://", "")}/felicity-gql`;
} else {
    WS_BASE_URL = `ws://${window.location.host}/felicity-gql`;
}