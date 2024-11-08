import { type State } from 'App';
import { type Graphics, Texture } from 'pixi.js';

export function renderViewport({
    viewport,
    width,
    height,
    size,
    dist,
    intensity,
}: State & { viewport: Graphics }) {
    console.info(
        `Rendering viewport ${width}x${height}, ${(width * height).toLocaleString()} cells`,
    );

    viewport.clear();

    const colors: string[] = generateColors(`#565656`, 200, intensity);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const sizeWithDist = size + dist;
            const x = sizeWithDist * i;
            const y = sizeWithDist * j;

            viewport.texture(Texture.WHITE, getRandomColor(colors), x, y, size, size);
        }
    }
}

function getRandomColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateColors(baseColor: string, count: number, maxIntensity: number): string[] {
    const colors: string[] = [];

    // Ensure maxIntensity is between 1 and 100
    maxIntensity = Math.max(1, Math.min(100, maxIntensity));

    // Convert maxIntensity from 1-100 range to 0-255 scale
    const maxRedValue = Math.floor((maxIntensity / 100) * 255);

    // Helper to blend towards red
    function blendTowardsRed(baseColor: string, redIntensity: number): string {
        // Parse the base color assuming hex format, e.g., "#RRGGBB"
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        // Blend red channel towards the max intensity red value
        const newR = Math.min(255, r + redIntensity);
        const newG = Math.floor(g * (1 - redIntensity / 255));
        const newB = Math.floor(b * (1 - redIntensity / 255));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
            .toString(16)
            .padStart(2, '0')}`;
    }

    for (let i = 0; i < count; i++) {
        if (i < count / 2) {
            // 50% of colors are the base color
            colors.push(baseColor);
        } else {
            // The other 50% are random intensities towards red
            const randomRedIntensity = Math.floor(Math.random() * maxRedValue);
            colors.push(blendTowardsRed(baseColor, randomRedIntensity));
        }
    }

    return colors;
}
