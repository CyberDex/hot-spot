import eslintPlugin from '@nabla/vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    const eslintPluginSettings = {
        failOnWarning: false,
        failOnError: false,
    };

    const plugins = [eslintPlugin(eslintPluginSettings)];

    return {
        build: {
            minify: false,
            emptyOutDir: true,
            sourcemap: true,
        },
        plugins,
        server: {
            host: true,
            port: 4200,
            https: true,
        },
        define: {
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
            APP_NAME: JSON.stringify(process.env.npm_package_name),
        },
        base: '/',
        resolve: {
            alias: {
                plugins: '/src/plugins',
                utils: '/src/utils',
            },
        },
    };
});
