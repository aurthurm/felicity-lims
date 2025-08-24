// Authentication configuration
export const STORAGE_AUTH_KEY = '__fel_lis__';
export const ENCRYPT_AUTH_KEY = import.meta.env.VITE_AUTH_ENCRYPT_KEY || 'felicity';

// API endpoints
export const REST_BASE_URL = import.meta.env.VITE_BASE_URL || '';
export const GQL_BASE_URL = `${REST_BASE_URL}/felicity-gql`;

// Third-party licenses
export const VITE_SYNCFUSION_LICENSE = import.meta.env.VITE_SYNCFUSION_LICENSE || '';

// WebSocket configuration
export let WS_BASE_URL: string;
if (REST_BASE_URL?.includes('http')) {
    WS_BASE_URL = `ws://${REST_BASE_URL.replace('http://', '')}/felicity-gql`;
} else {
    WS_BASE_URL = `ws://${window.location.host}/felicity-gql`;
}

// Other
export const VITE_USE_MEGA_MENU = import.meta.env.VITE_USE_MEGA_MENU || false;