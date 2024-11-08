import { type State } from 'App';
import { config } from 'conf/config';
import {} from 'utils/render';

export type Cells = Map<string, Cell>;
export type Cell = {
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
    intensity: number;
};

export function generateCells({ width, height, size, dist }: State): Cells {
    console.info(`Generating cells for ${width}x${height} grid`);

    const cells: Cells = new Map();

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const sizeWithDist = size + dist;
            const x = sizeWithDist * i;
            const y = sizeWithDist * j;

            // random intensity from 0 to intensity
            const randomIntensity = Math.floor(Math.random() * 50);

            cells.set(`${i}.${j}`, {
                x,
                y,
                intensity: randomIntensity,
                color: config.elementBaseColor,
                width: size,
                height: size,
            });
        }
    }

    return cells;
}

export function updateCells({
    cells,
    width,
    height,
    size,
    dist,
}: State & {
    cells: Cells;
}) {
    console.info(`Updating cells for ${width}x${height} grid`);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const sizeWithDist = size + dist;
            const x = sizeWithDist * i;
            const y = sizeWithDist * j;

            // random intensity from 0 to intensity
            const randomIntensity = Math.floor(Math.random() * 50);

            cells.set(`${i}.${j}`, {
                x,
                y,
                intensity: randomIntensity,
                color: config.elementBaseColor,
                width: size,
                height: size,
            });
        }
    }
}
