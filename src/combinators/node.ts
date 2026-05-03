import type { Parser } from '../core/parser';

import { map } from './map';
import { sequence } from './sequence';

type FieldParsers<U extends Record<string, unknown>> = {
    [K in keyof U]: Parser<U[K]>;
};

type Node<T extends string, U extends Record<string, unknown>> = {
    type: T;
} & U;

/**
 * Create a node from parser fields.
 *
 * @example
 * node('binop', { left: digits, op: char('+'), right: digits })('1+2') // { ok: true, value: { type: 'binop', left: 1, op: '+', right: 2 }, remaining: '' }
 * node('number', { value: digits })('123') // { ok: true, value: { type: 'number', value: 123 }, remaining: '' }
 */
export function node<
    U extends Record<string, unknown>,
    T extends string = string,
>(type: T, fields: FieldParsers<U>): Parser<Node<T, U>> {
    const entries = Object.entries(fields);
    const parsers = entries.map(([, p]) => p);
    const keys = entries.map(([k]) => k);

    return map(sequence(...parsers), (values) => {
        const result: Record<string, unknown> = { type };

        keys.forEach((key, i) => {
            result[key] = values[i];
        });

        return result as Node<T, U>;
    });
}
