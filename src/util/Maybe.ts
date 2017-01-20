
export default class Maybe<T> {
    value: T;

    static from<T>(val: T) {
        return new Maybe<T>(val);
    }

    constructor(val: T) {
        this.value = val;
    }

    isNone(): boolean {
        return typeof this.value === 'undefined';
    }

    isSome(): boolean {
        return !this.isNone();
    }

    unwrap(): T {
        if (this.isNone()) throw new TypeError(`Value of Maybe<${typeof this.value}> is None!`);
        return this.value;
    }

    unwrapOr(def: T): T {
        return this.isNone()
            ? def
            : this.value;
    }

    unwrapOrElse(fn: () => T): T {
        return this.isNone()
            ? fn()
            : this.value;
    }

    expect(message: string): T {
        if (this.isNone()) throw new TypeError(message);
        return this.value;
    }

    map<U>(fn: (T) => U): Maybe<U> {
        return this.isNone()
            ? new Maybe<U>(undefined)
            : new Maybe(fn(this.value));
    }

    mapOr<U>(def: U, fn: (T) => U): U {
        return this.isNone()
            ? def
            : fn(this.value);
    }

    mapOrElse<U>(def: () => U, fn: (T) => U): U {
        return this.isNone()
            ? def()
            : fn(this.value);
    }

    and<U>(optb: Maybe<U>): Maybe<U> {
        return this.isNone()
            ? new Maybe<U>(undefined)
            : optb;
    }

    andThen<U>(fn: (T) => Maybe<U>): Maybe<U> {
        return this.isNone()
            ? new Maybe<U>(undefined)
            : fn(this.value);
    }

    or(optb: Maybe<T>): Maybe<T> {
        return this.isNone()
            ? optb
            : this;
    }

    orElse(fn: () => Maybe<T>): Maybe<T> {
        return this.isNone()
            ? fn()
            : this;
    }

    take(): Maybe<T> {
        const newMaybe = new Maybe(this.value);
        this.value = undefined;
        return newMaybe;
    }
}
