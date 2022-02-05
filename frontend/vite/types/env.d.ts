interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_BASE_GRAPHQL_URL: string
  readonly VITE_BASE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}