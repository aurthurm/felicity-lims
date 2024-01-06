import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path'

export default defineConfig({
    plugins: [tsConfigPaths(), vue(), vueJsx()], // ,
    build: {
        target: 'esnext',
        // rollupOptions: {
        //     output:{
        //         manualChunks(id) {
        //             if (id.includes('node_modules')) {
        //                 return id.toString().split('node_modules/')[1].split('/')[0].toString();
        //             }
        //         }
        //     }
        // }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "webapp"),
        },
    },
});
