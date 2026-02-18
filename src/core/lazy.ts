import type { Parser } from '../types';
import { create } from './create';

export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};
