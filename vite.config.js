import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    plugins: [tsConfigPaths(), vue(), vueJsx(), tailwindcss()],
    build: {
        target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : process.env.TAURI_ENV_PLATFORM ? 'safari13' : 'esnext',
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
        base: process.env.TAURI_ENV_PLATFORM ? './' : undefined,
    },
    server: {
        port: 5173,
        strictPort: true,
        host: host || false,
        hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
        watch: {
            ignored: ['**/src-tauri/**'],
        },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './webapp'),
            '@tw': path.resolve(__dirname, './webapp/assets/css/style.css'),
        },
    },
});
