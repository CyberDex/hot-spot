import { DevTools } from './plugins/DevTools';
import { App } from './App';

if (BUILD_TYPE === 'development') {
    console.info(`🐳 ${APP_NAME} | ${APP_VERSION} | ${BUILD_TYPE}`);
}

export const app = new App();
new DevTools().init();
