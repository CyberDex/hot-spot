import { type State } from 'App';
import { type Graphics, Texture } from 'pixi.js';

export function renderViewport({
    viewport,
    width,
    height,
    size,
    dist,
}: State & { viewport: Graphics }) {
    console.info(
        `Rendering viewport ${width}x${height}, ${(width * height).toLocaleString()} cells`,
    );

    const scale = 1;

    viewport.clear();

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            viewport.scaleTransform(scale, scale);

            const sizeWithDist = size + dist;
            const x = (-sizeWithDist * width) / 2;
            const y = (-sizeWithDist * height) / 2;

            viewport.texture(
                Texture.WHITE,
                getRandomColor(),
                x + i * sizeWithDist,
                y + j * sizeWithDist,
                size,
                size,
            );

            viewport.scaleTransform(1 / scale, 1 / scale);
        }
    }
}

function getRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    return `#${randomColor.padStart(6, '0')}`; // Ensure it's always 6 digits
}
