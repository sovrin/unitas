import { Parser } from './types';
import { create } from './core';
import { map, sequence } from './combinators';

export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) =>
    create<A>(map(sequence(parserA, parserB), ([a]) => a));

export const right = <A, B>(parserA: Parser<A>, parserB: Parser<B>) =>
    create<B>(map(sequence(parserA, parserB), ([, b]) => b));

export const middle = <A, B, C>(parserA: Parser<A>, parserB: Parser<B>, parserC: Parser<C>) =>
    create<B>(map(sequence(parserA, parserB, parserC), ([, b]) => b));

export const between = <T, U, V>(prefix: Parser<U>, content: Parser<T>, suffix: Parser<V>) =>
    create<T>(map(sequence(prefix, content, suffix), ([, value]) => value));

export const surrounded = <T>(delimiter: Parser, content: Parser<T>) =>
    create<T>(between(delimiter, content, delimiter));

/**
 * Parse A then ignore B
 */
export const before = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => create<A>(left(parserA, parserB));

/**
 * Parse B then ignore A
 */
export const after = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => create<B>(right(parserA, parserB));
