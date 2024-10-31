import { getAppSize } from './utils/getAppSize';
import { pixi } from './plugins/Pixi';
import { DevTools } from './plugins/DevTools';
import { App } from './App';

export const app = new App();

class Application {
    static init() {
        this.addSubscriptions();
        new DevTools().init();

        pixi.stage.addChild(app);
    }

    static addSubscriptions() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    static resize() {
        const { width, height } = getAppSize();

        // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
        pixi.renderer.view.style.width = `${window.innerWidth}px`;
        pixi.renderer.view.style.height = `${window.innerHeight}px`;
        window.scrollTo(0, 0);

        // Update renderer  and navigation screens dimensions
        pixi.renderer.resize(width, height);
        app.resize(width, height);
    }
}

Application.init();
