import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    define: {
        __BASE__URL__: JSON.stringify('null'),
    },
    resolve: {
        alias: {
            '@assets': path.join(__dirname, './src/assets'),
            '@pages': path.join(__dirname, './src/pages'),
            '@app': path.join(__dirname, './src/app'),
        }
    }
});