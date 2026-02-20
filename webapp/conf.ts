// Authentication configuration
export const STORAGE_AUTH_KEY = '__beak_lims__';
export const PLATFORM_STORAGE_AUTH_KEY = '__beak_platform__';
export const ENCRYPT_AUTH_KEY = import.meta.env.VITE_AUTH_ENCRYPT_KEY || 'beak';

// API endpoints
export const REST_BASE_URL = import.meta.env.VITE_BASE_URL || '';
export const GQL_BASE_URL = `${REST_BASE_URL}/beak-gql`;
export const PLATFORM_API_BASE_URL = `${REST_BASE_URL}/api/v1/platform`;

const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
export const APP_MODE: 'tenant' | 'platform' = hostname.startsWith('platform.')
    || hostname === 'platform.localtest.me'
    ? 'platform'
    : 'tenant';

// WebSocket configuration
export let WS_BASE_URL: string;
if (REST_BASE_URL?.includes('http')) {
    WS_BASE_URL = `ws://${REST_BASE_URL.replace('http://', '')}/beak-gql`;
} else {
    WS_BASE_URL = `ws://${window.location.host}/beak-gql`;
}
