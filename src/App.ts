import ls from 'localstorage-slim';
import { pixi } from './main';
import { config, defaultState } from './conf/config';
import deepcopy from 'deepcopy';
import { Container, Graphics } from 'pixi.js';
import { runAndMeasure } from 'utils/measure';
import { renderViewport } from 'utils/render';

export class App extends Container {
    private viewPort = new Graphics();
    private isDragging = false;
    #state!: State;

    constructor() {
        super();

        this.addEvents();
        this.restoreState();
        pixi.stage.addChild(this);
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
            this.reset();
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
            runAndMeasure(renderViewport, {
                ...this.#state,
                viewport: this.viewPort,
            });
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

    reset() {
        const { width, height } = pixi.getAppSize();

        this.state = {
            ...defaultState,
            pos: {
                x: (width - this.viewPort.width) / 2,
                y: (height - this.viewPort.height) / 2,
            },
            scale: {
                x: 1,
                y: 1,
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
