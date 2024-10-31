declare module '*.glsl' {
    const value: string;

    export default value;
}

/** Injected by ViteJS define plugin */
declare const APP_VERSION: string;

declare const APP_NAME: string;

type ConstructorType<T> = new (...args: any[]) => T;
