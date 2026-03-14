import { assertType, describe, expect, it } from 'vitest';

import { choice } from '../combinators/choice';
import { map } from '../combinators/map';
import { sequence } from '../combinators/sequence';
import { surrounded } from '../combinators/surrounded';
import { char } from '../terminals/char';
import { literal } from '../terminals/literal';
import { regex } from '../terminals/regex';
import { grammar } from './grammar';
import { run } from './run';

describe('grammar', () => {
    it('should create recursive parsers', () => {
        type Grammar = {
            foo: 'foo';
            bar: 'bar';
            expression: ['foo', 'bar'];
        };

        const { expression } = grammar<Grammar>({
            foo: () => literal('foo'),
            bar: () => literal('bar'),
            expression: ({ foo, bar }) => sequence(foo, bar),
        });

        const parsed = run(expression, 'foobar');
        expect(parsed).toEqual(['foo', 'bar']);

        assertType<['foo', 'bar'] | null>(parsed);
    });

    it('should handle circular references', () => {
        type Grammar = {
            a: 'a';
            b: 'b';
        };

        const { a, b } = grammar<Grammar>({
            a: () => literal('a'),
            b: () => literal('b'),
        });

        expect(a('abc')).toEqual(['a', 'bc']);
        expect(b('bcd')).toEqual(['b', 'cd']);
    });

    it('should handle the example', () => {
        const { expr, term, number, add } = grammar({
            expr: (p) => choice(p.add, p.term),
            add: (p) => {
                return map(
                    sequence(p.term, char('+'), p.expr),
                    ([left, , right]) => (left as number) + (right as number),
                );
            },
            term: (p) => {
                return choice(
                    p.number,
                    surrounded(literal('('), p.expr, literal(')')),
                );
            },
            number: () => map(regex(/\d+/), (d) => parseInt(d, 10)),
        });

        {
            const result = add('2+3');
            expect(result).toEqual([5, '']);
        }

        {
            const result = number('5');
            expect(result).toEqual([5, '']);
        }

        {
            const result = term('(2+3)');
            expect(result).toEqual([5, '']);
        }

        {
            const result = expr('1+(2+3)'); // [6, '']
            expect(result).toEqual([6, '']);
        }
    });
});
