import { describe, it, expect } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { digits } from '../primitives/digits';
import { letters } from '../primitives/letters';
import { char } from '../terminals/char';
import { takeWhile } from '../terminals/takeWhile';
import { choice } from './choice';
import { node } from './node';
import { quoted } from './quoted';

describe('node', () => {
    it('should create node with single field', () => {
        const parser = node('number', { value: digits });
        const result = parser('123');

        assertSuccess(result, { type: 'number', value: 123 }, '');
    });

    it('should create node with multiple fields', () => {
        const parser = node('binop', {
            left: digits,
            op: char('+'),
            right: digits,
        });
        const result = parser('1+2');

        assertSuccess(
            result,
            { type: 'binop', left: 1, op: '+', right: 2 },
            '',
        );
    });

    it('should handle nested nodes', () => {
        const inner = node('number', { value: digits });
        const outer = node('expr', { value: inner });
        const result = outer('123');

        assertSuccess(
            result,
            {
                type: 'expr',
                value: { type: 'number', value: 123 },
            },
            '',
        );
    });

    it('should work with choice for tagged unions', () => {
        const value = choice(
            node('number', { value: digits }),
            node('string', { value: quoted(takeWhile((c) => c !== '"')) }),
        );

        const result1 = value('123');
        expect(result1.ok).toBe(true);
        if (result1.ok) {
            expect(result1.value).toEqual({ type: 'number', value: 123 });
        }
        const result2 = value('"abc"');
        expect(result2.ok).toBe(true);
        if (result2.ok) {
            expect(result2.value).toEqual({
                type: 'string',
                value: 'abc',
            });
        }
    });

    it('should create node with string field', () => {
        const parser = node('word', { value: letters });
        const result = parser('hello');

        assertSuccess(result, { type: 'word', value: 'hello' }, '');
    });

    it('should handle empty fields object', () => {
        const parser = node('empty', {});
        const result = parser('');

        assertSuccess(result, { type: 'empty' }, '');
    });

    it('should work with multiple different field types', () => {
        const parser = node('mixed', {
            num: digits,
            str: letters,
            char: char('.'),
        });
        const result = parser('42hello.');

        assertSuccess(
            result,
            { type: 'mixed', num: 42, str: 'hello', char: '.' },
            '',
        );
    });

    it('should parse partial input and leave remaining', () => {
        const parser = node('binop', {
            left: digits,
            op: char('+'),
            right: digits,
        });
        const result = parser('1+2 extra');

        assertSuccess(
            result,
            { type: 'binop', left: 1, op: '+', right: 2 },
            ' extra',
        );
    });
});
