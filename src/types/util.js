// @flow

// eslint-disable-next-line no-unused-vars
type Return_<R, F: (...args: Array<any>) => R> = R;
export type Return<T> = Return_<*, T>;
