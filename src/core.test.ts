import { assertType, describe, expect, it } from 'vitest';
import { grammar, run } from './core';
import { literal } from './terminals';
import { sequence } from './combinators';

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
});
