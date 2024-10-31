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
        const amount = JSON.parse(localStorage.getItem('amount') || '{ "w": 100, "h": 100 }');

        this.add(amount, 'w', 0, 1000, 100).onFinishChange(() => {
            app.generateSprites(amount);
            localStorage.setItem('amount', JSON.stringify(amount));
        });

        this.add(amount, 'h', 0, 500, 100).onFinishChange(() => {
            app.generateSprites(amount);
            localStorage.setItem('amount', JSON.stringify(amount));
        });

        app.generateSprites(amount);
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
