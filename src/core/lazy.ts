import type { Parser } from '../core/parser';

import { create } from './parser';

export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};
