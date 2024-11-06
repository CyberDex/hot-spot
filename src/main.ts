import { DevTools } from './plugins/DevTools';
import { App } from './App';

if (BUILD_TYPE === 'development') {
    // eslint-disable-next-line no-console
    console.info(`🐳 ${APP_NAME} | ${APP_VERSION} | ${BUILD_TYPE}`);
}

export const app = new App();
export const devTools = new DevTools();
