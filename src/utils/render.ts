import { type State } from 'App';
import { type Graphics, Texture } from 'pixi.js';

export function renderViewport({ viewport, width, height, data }: State & { viewport: Graphics }) {
    if (!data) {
        console.error('No data provided');

        return;
    }

    console.info(
        `Rendering viewport ${width}x${height}, ${(width * height).toLocaleString()} cells`,
    );

    viewport.clear();

    data.forEach((cellData) => {
        viewport.texture(
            Texture.WHITE,
            cellData.color,
            cellData.x,
            cellData.y,
            cellData.width,
            cellData.height,
        );
    });
}

export function getRandomColor(): string {
    let randomColor;

    do {
        randomColor = Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0');
    } while (parseInt(randomColor, 16) < 0x333333); // Threshold to exclude dark colors

    return `#${randomColor}`;
}

export function getRandomSize(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}
