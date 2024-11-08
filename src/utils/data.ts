import { getRandomColor, getRandomSize } from 'utils/render';

export function generateData({ minSize, maxSize, dist, width, height }: DataSetup): Data {
    const data: Data = new Map();

    let x = 0;
    let y = 0;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const id = `${j}${i}`;
            const color = getRandomColor();
            const width = getRandomSize(minSize, maxSize);
            const height = getRandomSize(minSize, maxSize);
            const cell: Cell = {
                x,
                y,
                color,
                width,
                height,
            };

            data.set(id, cell);

            x += width + dist;
        }
        x = 0;
        y += maxSize + dist;
    }

    return data;
}

export type Data = Map<string, Cell>;
export type Cell = {
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
};
export type DataSetup = {
    width: number;
    height: number;
    minSize: number;
    maxSize: number;
    dist: number;
};
