import { type Graphics, Texture } from 'pixi.js';
import { type Cells } from 'utils/data';

export function renderViewport({
    cells,
    viewport,
    intensity,
}: {
    cells: Cells;
    intensity: number;
    viewport: Graphics;
}) {
    console.info(`Rendering viewport with ${cells.size.toLocaleString()} cells`, {
        intensity,
    });

    viewport.clear();

    for (const cell of cells.values()) {
        const finalIntensity = cell.intensity + (100 - cell.intensity) * (intensity / 100);

        viewport.texture(
            Texture.WHITE,
            getColorWithRedIntensity(cell.color, finalIntensity),
            // cell.color,
            cell.x,
            cell.y,
            cell.width,
            cell.height,
        );
    }
}

export function getColorWithRedIntensity(baseColor: string, intensity: number): string {
    // Clamp intensity between 0 and 100
    intensity = Math.max(0, Math.min(100, intensity));

    // Calculate intensity factor as a scale from 0 to 255
    const intensityFactor = Math.floor((intensity / 100) * 255);

    // Parse the base color assuming hex format, e.g., "#RRGGBB"
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Blend red channel towards max intensity
    const newR = Math.min(255, r + intensityFactor);
    const newG = Math.floor(g * (1 - intensityFactor / 255));
    const newB = Math.floor(b * (1 - intensityFactor / 255));

    // Return the blended color in hex format
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
        .toString(16)
        .padStart(2, '0')}`;
}
