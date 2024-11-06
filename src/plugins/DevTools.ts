import ls from 'localstorage-slim';
import { UPDATE_PRIORITY } from '@pixi/core';
import { GUI } from 'dat.gui';
import { type StatsJSAdapter, addStats } from 'pixi-stats';
import { pixi } from './Pixi';
import { app } from '../main';
import { config, defaultSetup } from 'conf/config';
import { type SpritesGeneratorConfig } from 'utils/viewport';

export class DevTools extends GUI {
    private pixiStats!: StatsJSAdapter | null;
    private setup: SpritesGeneratorConfig = defaultSetup;

    constructor() {
        super({
            name: 'Dev Tools',
            width: 200,
            closeOnTop: true,
            autoPlace: false,
        });

        (globalThis as any).__PIXI_APP__ = app;
    }

    init() {
        document.body.appendChild(this.domElement);

        this.applyStyles();

        this.addStats();
        this.addControls();
    }

    private addStats() {
        this.pixiStats = addStats(document, pixi as any);
        pixi.ticker.add(this.pixiStats.update, this.pixiStats, UPDATE_PRIORITY.UTILITY);
    }

    private addControls() {
        if (localStorage.getItem('setup')) {
            this.setup = ls.get('setup') as SpritesGeneratorConfig;
        }

        const {
            minAmountHor,
            maxAmountHor,
            minAmountVer,
            maxAmountVer,
            amountStep,
            maxSize,
            maxDist,
        } = config;

        this.add(this.setup, 'width', minAmountHor, maxAmountHor, amountStep).onFinishChange(() => {
            this.generateSprites();
        });

        this.add(this.setup, 'height', minAmountVer, maxAmountVer, amountStep).onFinishChange(
            () => {
                this.generateSprites();
            },
        );

        this.add(this.setup, 'size', 1, maxSize).onFinishChange(() => {
            this.generateSprites();
        });

        this.add(this.setup, 'dist', 0, maxDist).onFinishChange(() => {
            this.generateSprites();
        });

        this.generateSprites();
    }

    private generateSprites() {
        ls.set('setup', this.setup);

        app.generateSprites({
            width: this.setup.width,
            height: this.setup.height,
            size: this.setup.size,
            dist: this.setup.dist,
        });
    }

    private applyStyles() {
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = '0px';
    }
}
