import { surrounded } from '../combinators/surrounded';
import { literal } from './literal';
import type { Parser } from '../types';

export const braced = <T>(content: Parser<T>) => {
    return surrounded(literal('{'), content, literal('}'));
};
