import ls from 'localstorage-slim';
import { UPDATE_PRIORITY } from '@pixi/core';
import { GUI } from 'dat.gui';
import { type StatsJSAdapter, addStats } from 'pixi-stats';
import { pixi } from './Pixi';
import { app } from '../main';

export class DevTools extends GUI {
    private pixiStats!: StatsJSAdapter | null;

    constructor() {
        super({
            name: 'Dev Tools',
            width: 200,
            closeOnTop: true,
            autoPlace: false,
        });

        this.addStats();
        this.addAmountSlider();
    }

    private addStats() {
        this.pixiStats = addStats(document, pixi as any);
        pixi.ticker.add(this.pixiStats.update, this.pixiStats, UPDATE_PRIORITY.UTILITY);
    }

    private addAmountSlider() {
        const amount = { x: 0, y: 0 };

        const savedAmount = ls.get('amount');

        if (savedAmount) {
            Object.assign(amount, savedAmount);
        }

        this.add(amount, 'x', 0, 1000).onChange(() => {
            app.generateSprites(amount);
            ls.set('amount', amount);
        });

        this.add(amount, 'y', 0, 500).onChange(() => {
            app.generateSprites(amount);
            ls.set('amount', amount);
        });

        app.generateSprites(amount ?? { x: 0, y: 0 });
    }

    init() {
        document.body.appendChild(this.domElement);

        this.applyStyles();
    }

    private applyStyles() {
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = '0px';
    }
}
