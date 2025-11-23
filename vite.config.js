import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    plugins: [tsConfigPaths(), vue(), vueJsx(), tailwindcss()],
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './webapp'),
        },
    },
});
