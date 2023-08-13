import axios from 'axios';
import { getAuthData, authLogout } from '../auth';
// import router from "../router";

import { REST_BASE_URL } from '../conf';

const getAuthHeaders = async () => {
    const authData = getAuthData();

    if (authData?.auth?.token) {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            ...(authData?.auth?.token && {
                Authorization: `Bearer ${authData?.auth?.token}`,
            }),
        };
    }
    authLogout();
    // router.push("/auth")
};

const axiosInstance = axios.create({
    baseURL: REST_BASE_URL + '/api/v1/',
    timeout: 1000,
    headers: await getAuthHeaders(),
});

// NEW
axios.interceptors.response.use(undefined, function (error) {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            authLogout();
            // return router.push("/auth")
        }
    }
});

export default axiosInstance;
