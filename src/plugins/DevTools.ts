import { GUI, type GUIController } from 'dat.gui';
import { app } from '../main';
import { config } from 'conf/config';

export class DevTools extends GUI {
    constructor() {
        super({
            name: 'Dev Tools',
            width: 200,
            closeOnTop: true,
            autoPlace: false,
        });

        document.body.appendChild(this.domElement);

        this.applyStyles();
        this.addStateControls();
    }

    private applyStyles() {
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = '0px';
    }

    private addStateControls() {
        const {
            minAmountHor,
            maxAmountHor,
            minAmountVer,
            maxAmountVer,
            amountStep,
            maxSize,
            maxDist,
        } = config;

        const controllers: GUIController[] = [];

        const appState = app.state;

        controllers[1] = this.add(
            appState,
            'width',
            minAmountHor,
            maxAmountHor,
            amountStep,
        ).onFinishChange(() => {
            app.state = appState;
        });

        controllers[2] = this.add(
            appState,
            'height',
            minAmountVer,
            maxAmountVer,
            amountStep,
        ).onFinishChange(() => {
            app.state = appState;
        });

        controllers[3] = this.add(appState, 'size', 1, maxSize).onFinishChange(() => {
            app.state = appState;
        });

        controllers[4] = this.add(appState, 'dist', 0, maxDist).onFinishChange(() => {
            app.state = appState;
        });

        controllers[4] = this.add(appState, 'intensity', 0, maxDist).onChange(() => {
            app.state = appState;
        });

        controllers[5] = this.add(
            {
                Reset: () => {
                    app.reset();
                    controllers.forEach((controller) => this.remove(controller));
                    this.addStateControls();
                },
            },
            'Reset',
        );
    }
}
