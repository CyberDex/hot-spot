import { GUI } from 'dat.gui';
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

    // TODO: abstract this
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

        const appState = { ...app.state };

        this.add(appState, 'width', minAmountHor, maxAmountHor, amountStep).onFinishChange(() => {
            app.state = appState;
        });

        this.add(appState, 'height', minAmountVer, maxAmountVer, amountStep).onFinishChange(() => {
            app.state = appState;
        });

        this.add(appState, 'size', 1, maxSize).onFinishChange(() => {
            app.state = appState;
        });

        this.add(appState, 'dist', 0, maxDist).onFinishChange(() => {
            app.state = appState;
        });
    }
}
