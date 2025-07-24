import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { REST_BASE_URL, GQL_BASE_URL } from '@/conf';
import useNotifyToast from './alert_toast';
import { authToStorage, getAuthData, generateRequestId } from '@/auth';
import { AuthenticatedData } from '@/types/gql';

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


const { toastError } = useNotifyToast();

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
  (config: InternalAxiosRequestConfig) => {
    const auth = getAuthData();
    if(config.headers) {
      config.headers["X-Request-ID"] = generateRequestId()
      if (auth?.token) {
        config.headers['Authorization'] = `Bearer ${auth.token}`;
      }
      if (auth?.activeLaboratory) {
        config.headers['X-Laboratory-ID'] = auth?.activeLaboratory?.uid;
      }
    }
    
    return config;
  },
  (error) => {
    toastError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const auth = getAuthData();
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
            variables: { refreshToken: auth?.refresh }
          },
          {
            baseURL: GQL_BASE_URL
          }
        );

        // Update localStorage with new auth data
        authToStorage(response.data as unknown as AuthenticatedData);
        
        // Retry the original request with new token
        return axiosInstance(originalConfig);
      } catch (error) {
        toastError('Session expired. Please log in again.');
        return Promise.reject(error);
      }
    }
    
    // Handle other errors
    const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
    toastError(errorMessage);
    return Promise.reject(err);
  }
);

export default axiosInstance;
