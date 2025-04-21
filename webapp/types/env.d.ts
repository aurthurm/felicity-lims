/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_BASE_GRAPHQL_URL: string
  readonly VITE_BASE_WS_URL: string
  readonly VITE_SYNCFUSION_LICENSE: string
  readonly VITE_AUTH_ENCRYPT_KEY: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 

