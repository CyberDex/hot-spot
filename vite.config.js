import { defineConfig } from 'vite';
import appData from './package.json';

export default defineConfig(({ command, mode }) => {
    console.log(
        `%c 🐳 ${command}: ${appData.name} | ${appData.version} | ${mode}`,
        'color:green; font-size:20px;',
    );

    const isDev = mode === 'development';

    return {
        base: isDev ? '/' : '/hot-spot',
        resolve: {
            alias: {
                plugins: '/src/plugins',
                utils: '/src/utils',
                conf: '/src/conf',
            },
        },
    };
});
