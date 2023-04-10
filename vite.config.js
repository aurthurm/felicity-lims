import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    plugins: [tsConfigPaths(), vue(), vueJsx()], // ,
    build: {
        target: 'esnext',
    },
});
