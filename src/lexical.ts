import { Parser } from './types';
import { create, literal, regex } from './core';
import { map, sequence } from './combinators';

export const lexeme = <T>(parser: Parser<T>) => create<T>(map(sequence(parser, regex(/^\s*/)), ([value]) => value));

export const symbol = (str: string) => create<string>(lexeme(literal(str)));

// keyword?
