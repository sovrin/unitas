import type { Parser } from '../core/parser';

import { surrounded } from '../combinators/surrounded';
import { literal } from './literal';

export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(literal('('), content, literal(')'));
};
