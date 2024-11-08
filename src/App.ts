import { pixi } from './main';
import { config, defaultState } from './conf/config';
import deepcopy from 'deepcopy';
import { Container, Graphics } from 'pixi.js';
import { runAndMeasure } from 'utils/measure';
import { renderViewport } from 'utils/render';
import { get, set, del } from 'idb-keyval';
import { generateCells, updateCells, type Cells } from 'utils/data';

export class App extends Container {
    private viewPort = new Graphics();
    private isDragging = false;
    #state!: State;
    private cells!: Cells;

    async init(): Promise<App> {
        await this.restoreState();

        this.addEvents();
        pixi.stage.addChild(this);
        this.addChild(this.viewPort);

        return this;
    }

    private addEvents() {
        const options: AddEventListenerOptions = {
            capture: true,
        };

        pixi.canvas.addEventListener('wheel', (event) => this.onZoom(event), options);
        pixi.canvas.addEventListener('pointerdown', (event) => this.onClick(event), options);
        pixi.canvas.addEventListener('pointerup', () => this.onDragEnd(), options);
        pixi.canvas.addEventListener('pointerupoutside', () => this.onDragEnd(), options);
        pixi.canvas.addEventListener('pointermove', (event) => this.onDrag(event), options);
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

    private async saveState() {
        await set(`state`, this.state);
        await set('cells', this.cells);
    }

    private async restoreState() {
        const state = await get('state');
        const cells = await get('cells');

        if (state) {
            console.warn('state', state);
            this.state = state;
        } else {
            await this.resetState();
        }

        if (cells) {
            console.warn('cells', cells);
            this.cells = cells;

            runAndMeasure(renderViewport, {
                cells: this.cells,
                intensity: this.state.intensity,
                viewport: this.viewPort,
            });
        } else {
            await this.resetCells();
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
            this.resetCells();
        }

        if (changes && changes.intensity) {
            this.updateViewport();
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

    async resetState() {
        await del('state');
        this.state = defaultState;

        console.error('resetState', this.state);
    }

    async resetCells() {
        await del('cells');

        this.cells = runAndMeasure(generateCells, this.state);

        await this.saveState();

        console.error('resetCells', this.cells);

        runAndMeasure(renderViewport, {
            cells: this.cells,
            intensity: this.state.intensity,
            viewport: this.viewPort,
        });
    }

    private updateViewport() {
        console.info('!!! Updating viewport !!!');

        if (!this.cells) return;

        runAndMeasure(renderViewport, {
            cells: this.cells,
            intensity: this.state.intensity,
            viewport: this.viewPort,
        });
    }
}

export type State = {
    width: number;
    height: number;
    size: number;
    dist: number;
    intensity: number;
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
