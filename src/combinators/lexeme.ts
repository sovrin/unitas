import type { Parser } from '../types';

import { create } from '../core/create';
import { regex } from '../terminals/regex';
import { map } from './map';
import { sequence } from './sequence';

export const lexeme = <T>(parser: Parser<T>) => {
    return create<T>(map(sequence(parser, regex(/^\s*/)), ([value]) => value));
};
