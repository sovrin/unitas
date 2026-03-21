import type { Parser } from '../core/parser';

import { literal } from '../terminals/literal';
import { surrounded } from './surrounded';

export const braced = <T>(content: Parser<T>) => {
    return surrounded(literal('{'), content, literal('}'));
};
