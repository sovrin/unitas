import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { node } from './node';

describe('node', () => {
    const aParser = createTestParser('A');
    const bParser = createTestParser('B');

    it('should create node with single field', () => {
        const parser = node<{ value: 'A' }>('word', { value: aParser });
        const result = parser('A');

        assertSuccess(result, { type: 'word', value: 'A' }, '');
    });

    it('should create node with multiple fields', () => {
        const parser = node<{ left: 'A'; right: 'B' }>('pair', {
            left: aParser,
            right: bParser,
        });
        const result = parser('AB');

        assertSuccess(result, { type: 'pair', left: 'A', right: 'B' }, '');
    });

    it('should handle nested nodes', () => {
        const inner = node<{ value: 'A' }>('inner', { value: aParser });
        const outer = node<{ child: { type: string; value: 'A' } }>('outer', {
            child: inner,
        });
        const result = outer('A');

        assertSuccess(
            result,
            { type: 'outer', child: { type: 'inner', value: 'A' } },
            '',
        );
    });

    it('should produce different type tags for discriminated unions', () => {
        const alpha = node<{ value: 'A' }>('alpha', { value: aParser });
        const beta = node<{ value: 'B' }>('beta', { value: bParser });

        assertSuccess(alpha('A'), { type: 'alpha', value: 'A' }, '');
        assertSuccess(beta('B'), { type: 'beta', value: 'B' }, '');
    });

    it('should handle empty fields', () => {
        const parser = node<Record<never, never>>('empty', {});
        const result = parser('');

        assertSuccess(result, { type: 'empty' }, '');
    });

    it('should parse partial input and leave remaining', () => {
        const parser = node<{ left: 'A'; right: 'B' }>('pair', {
            left: aParser,
            right: bParser,
        });
        const result = parser('AB rest');

        assertSuccess(result, { type: 'pair', left: 'A', right: 'B' }, ' rest');
    });
});
