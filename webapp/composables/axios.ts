import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthData } from '@/auth';
import { REST_BASE_URL, GQL_BASE_URL, STORAGE_AUTH_KEY } from '@/conf';

// Define TypeScript interfaces for better type safety
interface AuthData {
  auth?: {
    token?: string;
    refresh?: string;
  };
}

interface RefreshTokenResponse {
  data: {
    refresh: {
      token: string;
      tokenType: string;
      user: {
        uid: string;
        firstName: string;
        lastName: string;
        groups: Array<{
          uid: string;
          name: string;
          keyword: string;
          pages: string[];
          permissions: Array<{
            uid: string;
            action: string;
            target: string;
          }>;
        }>;
        preference: {
          uid: string;
          expandedMenu: boolean;
          theme: string;
          departments: Array<{
            uid: string;
            name: string;
          }>;
        };
      };
    };
  };
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${REST_BASE_URL}/api/v1/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authData: AuthData = getAuthData();
    if (authData?.auth?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${authData.auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const authData: AuthData = getAuthData();
        const response: RefreshTokenResponse = await axiosInstance.post(
          '',
          {
            query: `
              mutation refresh($refreshToken: String!) {
                refresh(refreshToken: $refreshToken) {
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
                    preference {
                      uid
                      expandedMenu
                      theme
                      departments {
                        uid
                        name
                      }
                    }
                  }
                }
              }
            `,
            variables: { refreshToken: authData?.auth?.refresh }
          },
          {
            baseURL: GQL_BASE_URL
          }
        );

        // Update localStorage with new auth data
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(response.data.refresh));
        
        // Retry the original request with new token
        return axiosInstance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);
export default axiosInstance;
