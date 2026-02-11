import { create } from './create';
import type { Parser } from '../types';

export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};
