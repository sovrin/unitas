import type { Parser } from '../core/parser';

import { map } from './map';
import { sequence } from './sequence';

/**
 * Create a node from parser fields.
 *
 * @example
 * node('binop', { left: digits, op: char('+'), right: digits })('1+2') // { ok: true, value: { type: 'binop', left: 1, op: '+', right: 2 }, remaining: '' }
 * node('number', { value: digits })('123') // { ok: true, value: { type: 'number', value: 123 }, remaining: '' }
 */
export const node = <T extends string>(
    type: T,
    fields: Record<string, Parser<any>>,
) => {
    const entries = Object.entries(fields);
    const parsers = entries.map(([, p]) => p);
    const keys = entries.map(([k]) => k);

    return map(sequence(...parsers), (values) => {
        const result: Record<string, any> = { type };
        keys.forEach((key, i) => {
            result[key] = values[i];
        });

        return result;
    });
};
