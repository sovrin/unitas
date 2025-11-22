import { Failure, Success } from './types';
import { create } from './combinators';

export const success = <T>(value: T, remaining: string): Success<T> => [
    value,
    remaining,
];

export const failure = (): Failure => null;

export const fail = <T>() => create<T>(() => failure());
