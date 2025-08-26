import { create, failure, literal, regex, success } from './core';
import { choice, map, sequence } from './combinators';
import { Parser } from './types';
import { delimitedBy } from './separators';
import { lexeme } from './lexical';

export const string = (str: string) => create<string>(literal(str));

export const stringCI = (str: string) =>
    create<string>((input) => {
        const lowerInput = input.slice(0, str.length).toLowerCase();
        const lowerStr = str.toLowerCase();

        return lowerInput === lowerStr ? success(input.slice(0, str.length), input.slice(str.length)) : failure();
    });

export const word = (targetWord: string) =>
    create<string>(lexeme(map(sequence(literal(targetWord), regex(/^(?!\w)/)), ([w]) => w)));

export const quoted = <T>(content: Parser<T>) => choice(delimitedBy('"', '"', content), delimitedBy("'", "'", content));

export const parenthesized = <T>(content: Parser<T>) => delimitedBy('(', ')', content);

export const braced = <T>(content: Parser<T>) => delimitedBy('{', '}', content);

export const bracketed = <T>(content: Parser<T>) => delimitedBy('[', ']', content);
