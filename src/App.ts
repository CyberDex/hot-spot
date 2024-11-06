import ls from 'localstorage-slim';
import { Container } from '@pixi/display';
import type { Sprite } from '@pixi/sprite';
import { pixi } from './plugins/Pixi';
import { addSpritesToViewPort, generateSprites } from 'utils/viewport';
import { runAndMeasure } from 'utils/measure';
import { config, defaultState } from './conf/config';
import deepcopy from 'deepcopy';

export class App extends Container {
    private viewPort!: Container;
    private isDragging = false;
    #state!: State;

    constructor() {
        super();

        this.addViewPort();
        this.addEvents();
        this.restoreState();
        pixi.stage.addChild(this);
    }

    private addViewPort() {
        if (this.viewPort) return;

        this.viewPort = new Container();

        this.viewPort.sortableChildren = false;
        this.viewPort.cullable = true;

        this.addChild(this.viewPort);
    }

    private addEvents() {
        const options: AddEventListenerOptions = {
            capture: true,
        };

        pixi.view.addEventListener('wheel', (event) => this.onZoom(event), options);
        pixi.view.addEventListener('pointerdown', (event) => this.onClick(event), options);
        pixi.view.addEventListener('pointerup', () => this.onDragEnd(), options);
        pixi.view.addEventListener('pointerupoutside', () => this.onDragEnd(), options);
        pixi.view.addEventListener('pointermove', (event) => this.onDrag(event), options);
    }

    private onZoom(event: WheelEvent) {
        const scaleAmount = config.scaleStep; // Adjust scale speed
        const direction = event.deltaY < 0 ? 1 : -1;

        // Scroll up or down
        this.viewPort.scale.x += scaleAmount * direction;
        this.viewPort.scale.y += scaleAmount * direction;

        const scale = Math.max(config.minScale, Math.min(this.viewPort.scale.x, config.maxScale));

        // Clamp the scale values to prevent excessive scaling
        this.viewPort.scale.x = scale;
        this.viewPort.scale.y = scale;

        this.state = {
            scale: {
                x: scale,
                y: scale,
            },
        };
    }

    private onClick(event: PointerEvent) {
        if (event.button === 0) {
            this.isDragging = true;
        }
    }

    private onDrag(event: PointerEvent) {
        if (!this.isDragging) return;

        this.viewPort.x += event.movementX;
        this.viewPort.y += event.movementY;
    }

    private onDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;

        this.state = {
            pos: {
                x: this.viewPort.x,
                y: this.viewPort.y,
            },
        };
    }

    private saveState() {
        ls.set(`${APP_NAME}-state`, this.state);
    }

    private restoreState() {
        const state = ls.get(`${APP_NAME}-state`) as State;

        if (state) {
            this.state = state;
        } else {
            this.resetState();
        }
    }

    set state(change: Partial<State>) {
        if (!change) return;

        const stateData: any = this.#state && deepcopy(this.#state);
        const prevValues: any = {};
        const changes: any = {};

        for (const valueKey in change) {
            const changeKey = valueKey as StateField;

            const prevVal = stateData && stateData[changeKey];
            const newVal = change[changeKey];

            if (newVal !== prevVal) {
                changes[changeKey] = newVal;
                prevValues[changeKey] = prevVal;
            }
        }

        const changesAmount = Object.keys(changes).length;

        if (changesAmount === 0) return;

        this.#state = {
            ...this.#state,
            ...changes,
        };

        if (changes && (changes.width || changes.height || changes.size || changes.dist)) {
            this.generateSprites();
        }

        this.resize();
        this.saveState();
    }

    get state(): State {
        return this.#state;
    }

    private resize() {
        this.viewPort.x = this.state.pos.x;
        this.viewPort.y = this.state.pos.y;

        this.viewPort.scale.x = this.state.scale.x;
        this.viewPort.scale.y = this.state.scale.y;
    }

    private generateSprites() {
        this.addViewPort();

        this.unfreezeViewport();
        this.viewPort.removeChildren();

        const sprites: Sprite[] = runAndMeasure(generateSprites, this.state);

        pixi.stop();

        runAndMeasure(addSpritesToViewPort, {
            sprites,
            viewPort: this.viewPort,
        });

        pixi.start();

        this.freezeViewport();
    }

    private freezeViewport() {
        (this.viewPort as any).cacheAsBitmap = false;
    }

    private unfreezeViewport() {
        (this.viewPort as any).cacheAsBitmap = true;
    }

    resetState() {
        this.state = defaultState;

        const { width, height } = pixi.getAppSize();

        this.state = {
            ...defaultState,
            pos: {
                x: width / 2,
                y: height / 2,
            },
        };
    }
}

export type State = {
    width: number;
    height: number;
    size: number;
    dist: number;
    pos: {
        x: number;
        y: number;
    };
    scale: {
        x: number;
        y: number;
    };
};
export type StateField = keyof State;
