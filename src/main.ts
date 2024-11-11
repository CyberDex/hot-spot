import { pixi } from 'plugins/Pixi';
import { app } from './App';
import { devTools } from './plugins/DevTools';

if (BUILD_TYPE === 'development') {
    // eslint-disable-next-line no-console
    console.info(`🐳 ${APP_NAME} | ${APP_VERSION} | ${BUILD_TYPE}`);
}

(async () => {
    await pixi.initiate();
    await app.init();
    await devTools.init();
})();
