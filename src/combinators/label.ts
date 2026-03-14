import type { Parser } from '../types';

export const label = <T>(parser: Parser<T>, _label: string): Parser<T> => {
    return parser;
};
