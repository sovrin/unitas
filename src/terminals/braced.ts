import type { Parser } from '../types';

import { surrounded } from '../combinators/surrounded';
import { literal } from './literal';

export const braced = <T>(content: Parser<T>) => {
    return surrounded(literal('{'), content, literal('}'));
};
