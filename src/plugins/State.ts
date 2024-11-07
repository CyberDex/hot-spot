// import { openDB, deleteDB, wrap, unwrap, type IDBPDatabase } from 'idb';
import deepcopy from 'deepcopy';
import ls from 'localstorage-slim';

export const defaultState: StateData = {
    width: 10,
    height: 10,
    size: 5,
    dist: 1,
    pos: {
        x: 0,
        y: 0,
    },
    scale: 1,
};

class State {
    // private db!: IDBPDatabase;
    private state!: StateData;
    protected subscriptions: Map<string, Callback[]> = new Map();

    constructor() {
        this.createDB();
        this.restore();
    }

    private async createDB() {
        // this.db = await openDB(APP_NAME);
    }

    save() {
        ls.set(`${APP_NAME}-state`, this.state);
    }

    restore() {
        const state = ls.get(`${APP_NAME}-state`) as StateData;

        if (state) {
            this.set(state);
        } else {
            this.reset();
        }
    }

    reset() {
        this.state = defaultState;
    }

    set(change: Change) {
        if (!change) return;

        const stateData: any = this.state && deepcopy(this.state);
        const prevValues: any = {};
        const changes: any = {};

        for (const valueKey in change) {
            const changeKey = valueKey as StateField;

            const prevVal = stateData && stateData[changeKey];
            const newVal = change[changeKey];

            if (newVal !== prevVal) {
                changes[changeKey] = newVal;
                prevValues[changeKey] = prevVal;
            }
        }

        const changesAmount = Object.keys(changes).length;

        if (changesAmount === 0) return;

        this.state = {
            ...this.state,
            ...changes,
        };

        // eslint-disable-next-line no-console
        console.info('🖥️', changes, prevValues);

        if (this.subscriptions.has('any')) {
            this.subscriptions.get('any')?.forEach((callback) => callback(changes, prevValues));
        }

        this.subscriptions.forEach((callbacks, field) => {
            if (changes[field] !== undefined) {
                callbacks.forEach((callback) => callback(changes, prevValues));
            }
        });

        this.save();
    }

    get(field: StateField): StateData[StateField] {
        return this.state[field];
    }

    onChange(callback: Callback) {
        const callBackParams = callback
            .toString()
            .split(')')[0]
            .match(/[^{}]+(?=\})/g)
            ?.map((field) => field.replace(/\s/g, ''));

        let subscribeFields: string[] = [];

        if (callBackParams) {
            subscribeFields = callBackParams[0].split(',');
            subscribeFields = subscribeFields.map((field) => field.split(':')[0]);
        }

        subscribeFields.length
            ? this.subscribe(subscribeFields as StateField[], callback)
            : this.addSubscription('any', callback);
    }

    subscribe(subscribeFields: StateField[], callback: Callback) {
        subscribeFields.forEach((subscribeField) => {
            this.addSubscription(subscribeField, callback);
        });
    }

    get data(): StateData {
        return this.state;
    }

    private addSubscription(subscribeField: StateField | 'any', callback: Callback) {
        if (this.subscriptions.has(subscribeField)) {
            this.subscriptions.get(subscribeField)?.push(callback);
        } else {
            this.subscriptions.set(subscribeField, [callback]);
        }
    }
}

export type Change = Partial<StateData>;
export type Callback = (change: Change, prevVal: Change) => void;
export type StateData = {
    width: number;
    height: number;
    size: number;
    dist: number;
    scale: number;
    pos: Point;
};
export type Point = {
    x: number;
    y: number;
};
export type StateField = keyof StateData;

export const state = new State();
