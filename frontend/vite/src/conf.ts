// Active User Credentials
export const activeUser = localStorage.getItem('fwt');
export const activeUserToken = localStorage.getItem('fwt');

export const GQL_BASE_URL = import.meta.env.VITE_BASE_GRAPHQL_URL;
export const WS_BASE_URL = import.meta.env.VITE_BASE_WS_URL;
export const REST_BASE_URL = import.meta.env.VITE_BASE_URL;