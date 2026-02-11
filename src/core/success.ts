import { Success } from '../types';

export const success = <T>(value: T, remaining: string): Success<T> => [
    value,
    remaining,
];
