import { describe, it, expect } from 'vitest';

import { grammar, run } from '../src';
import {
    choice,
    inner,
    map,
    outer,
    quoted,
    separatedBy,
    sequence,
} from '../src/combinators';
import { bool, letters, nl } from '../src/primitives';
import { char, string, regex } from '../src/terminals';
import { pick } from '../src/utils';
import { digits } from './helpers';

describe('quick start', () => {
    describe('csv parser', () => {
        const csv = grammar({
            row: (p) => separatedBy(p.value, char(',')),
            value: (p) => choice(p.quoted, p.unquoted),
            quoted: () => inner(char('"'), regex(/^[^"]*/), char('"')),
            unquoted: () => letters,
        });

        it('parse correctly', () => {
            {
                const result = run(csv.row, 'a,b,c');
                expect(result).toEqual(['a', 'b', 'c']);
            }
            {
                const result = run(csv.row, '"a,b",c');
                expect(result).toEqual(['a,b', 'c']);
            }
            {
                const result = run(csv.row, 'hello,world');
                expect(result).toEqual(['hello', 'world']);
            }
        });
    });

    describe('json value parser', () => {
        const json = grammar({
            value: (p) => choice(p.string, p.number, p.bool, p.null),
            string: () => quoted(letters),
            number: () => digits,
            bool: () => bool,
            null: () => map(string('null'), () => null),
        });

        it('parse correctly', () => {
            {
                const result = run(json.value, '"hello"');
                expect(result).toEqual('hello');
            }
            {
                const result = run(json.value, '42');
                expect(result).toEqual(42);
            }
            {
                const result = run(json.value, 'true');
                expect(result).toEqual(true);
            }
            {
                const result = run(json.value, 'null');
                expect(result).toEqual(null);
            }
        });
    });

    describe('query string parser', () => {
        type Query = {
            params: Record<string, string>;
            param: [string, string];
            key: string;
            value: string;
        };

        const query = grammar<Query>({
            params: (p) =>
                map(separatedBy(p.param, char('&')), (pairs) =>
                    Object.fromEntries(pairs),
                ),
            param: (p) => outer(p.key, char('='), p.value),
            key: () => letters,
            value: () => letters,
        });

        it('parse correctly', () => {
            const result = run(query.params, 'foo=bar&baz=qux');
            expect(result).toEqual({ foo: 'bar', baz: 'qux' });
        });
    });

    describe('ini parser', () => {
        const ini = grammar({
            section: (p) =>
                map(
                    sequence(char('['), p.name, char(']'), nl, p.entry),
                    pick(1, 4),
                    ([name, entry]) => ({ name, entry }),
                ),
            name: () => letters,
            entry: (p) => outer(p.key, char('='), p.value),
            key: () => letters,
            value: () => regex(/^[^\n]+/),
        });

        it('parse correctly', () => {
            const result = run(ini.section, '[database]\nhost=localhost');
            expect(result).toEqual({
                name: 'database',
                entry: ['host', 'localhost'],
            });
        });
    });
});
