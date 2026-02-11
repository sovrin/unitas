import { surrounded } from '../combinators/surrounded';
import { literal } from './literal';
import { Parser } from '../types';

export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(literal('('), content, literal(')'));
};
