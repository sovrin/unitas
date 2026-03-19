import type { Parser } from '../core/parser';

import { lexeme } from '../combinators/lexeme';
import { create } from '../core/parser';
import { literal } from './literal';

export const token = <T extends string>(str: T): Parser<T> => {
    return create<T>(lexeme(literal(str)));
};
