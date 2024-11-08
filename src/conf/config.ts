import { type State } from 'App';

export const defaultState: State = {
    width: 100,
    height: 100,
    size: 5,
    dist: 1,
    pos: {
        x: 0,
        y: 0,
    },
    scale: {
        x: 1,
        y: 1,
    },
};

export const config = {
    minScale: 0.05,
    maxScale: 10,
    defaultDist: 1,
    defaultSize: 5,
    minAmountHor: 10,
    maxAmountHor: 1000,
    minAmountVer: 10,
    maxAmountVer: 1000,
    amountStep: 10,
    maxSize: 100,
    maxDist: 100,
    scaleStep: 0.1,
};
