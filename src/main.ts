import { DevTools } from './plugins/DevTools';
import { App } from './App';
import { Pixi } from 'plugins/Pixi';

if (BUILD_TYPE === 'development') {
    // eslint-disable-next-line no-console
    console.info(`🐳 ${APP_NAME} | ${APP_VERSION} | ${BUILD_TYPE}`);
}

export const pixi = await new Pixi().initiate();
export const app = await new App().init();
export const devTools = new DevTools();
