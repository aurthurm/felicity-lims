import axios from 'axios';
import { getAuthData, authLogout } from './auth';
import { REST_BASE_URL, GQL_BASE_URL, STORAGE_AUTH_KEY } from './conf';


const axiosInstance = axios.create({
    baseURL: REST_BASE_URL + '/api/v1/',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
      const authData = getAuthData();
      if (authData?.auth?.token && config.headers) {
            config.headers["Authorization"] = `Bearer ${authData?.auth?.token}`
      }
      return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const authData = getAuthData();
            const response = await axiosInstance.post("", 
                {
                    query: `refreshAccessToken($refreshToken: String!){
                        mutation refresh(refreshToken: $refreshToken) {             
                            token
                            tokenType
                            user {
                                uid
                                firstName
                                lastName
                                groups {
                                    permissions {
                                        uid
                                        action
                                        target
                                    }
                                    uid
                                    name
                                    keyword
                                    pages
                                }
                                preferenceUid
                                preference {
                                    expandedMenu
                                    theme
                                    departments {
                                        uid
                                        name
                                    }
                                }
                            }  
                        }
                    }`,
                    variables: { refreshToken: authData?.auth?.refresh }
                }, 
                { 
                    baseURL: GQL_BASE_URL 
                }
            );

            console.log(response.data);
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(response.data));
            
            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );

export default axiosInstance;
