import { create } from '../core/create';
import type { Parser } from '../types';
import { map } from './map';
import { sequence } from './sequence';
import { regex } from '../terminals/regex';

export const lexeme = <T>(parser: Parser<T>) => {
    return create<T>(map(sequence(parser, regex(/^\s*/)), ([value]) => value));
};
