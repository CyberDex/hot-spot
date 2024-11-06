import { defineConfig } from 'vite';

export default defineConfig(() => ({
    base: '/',
    resolve: {
        alias: {
            plugins: '/src/plugins',
            utils: '/src/utils',
            conf: '/src/conf',
        },
    },
}));
