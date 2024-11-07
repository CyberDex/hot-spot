import { GUI } from 'dat.gui';
import { config } from 'conf/config';
import { state } from 'plugins/State';

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

    addObjectController(object: any, property: string, min: number, max: number, step: number) {
        return this.add(object, property, min, max, step);
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

        const appState = state.data;

        this.add(appState, 'width', minAmountHor, maxAmountHor, amountStep).onFinishChange(
            (width) => state.set({ width }),
        );

        this.add(appState, 'height', minAmountVer, maxAmountVer, amountStep).onFinishChange(
            (height) => state.set({ height }),
        );

        this.add(appState, 'size', 1, maxSize).onFinishChange((size) => state.set({ size }));

        this.add(appState, 'dist', 0, maxDist).onFinishChange((dist) => state.set({ dist }));
    }
}
