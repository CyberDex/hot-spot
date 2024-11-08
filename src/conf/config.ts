import { type State } from 'App';

export const defaultState: State = {
    width: 50,
    height: 50,
    size: 5,
    dist: 1,
    intensity: 0,
    pos: {
        x: 1,
        y: 1,
    },
    scale: {
        x: 1,
        y: 1,
    },
};

export const config = {
    minScale: 0.01,
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
    elementBaseColor: '#565656',
};
