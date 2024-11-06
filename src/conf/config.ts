import type { SpritesGeneratorConfig } from 'utils/viewport';

export const defaultSetup: SpritesGeneratorConfig = {
    width: 10,
    height: 10,
    size: 5,
    dist: 1,
};

export const config = {
    minScale: 0.1,
    maxScale: 10,
    defaultDist: 1,
    defaultSize: 5,
    defaultSetup,
    minAmountHor: 10,
    maxAmountHor: 1000,
    minAmountVer: 10,
    maxAmountVer: 500,
    amountStep: 100,
    maxSize: 100,
    maxDist: 100,
};
