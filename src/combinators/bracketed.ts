import type { Parser } from '../core/parser';

import { literal } from '../terminals/literal';
import { surrounded } from './surrounded';

export const bracketed = <T>(content: Parser<T>) => {
    return surrounded(literal('['), content, literal(']'));
};
