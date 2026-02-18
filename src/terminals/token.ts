import { lexeme } from '../combinators/lexeme';
import { create } from '../core/create';
import type { Parser } from '../types';
import { literal } from './literal';

export const token = <T extends string>(str: T): Parser<T> => {
    return create<T>(lexeme(literal(str)));
};
