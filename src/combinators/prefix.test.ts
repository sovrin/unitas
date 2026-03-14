import { describe, it } from 'vitest';

import type { Parser } from '../types';

import { assertResult, numberParser } from '../../test/utils.test';
import { prefix } from './prefix';

describe('prefix', () => {
    const unaryOps: Parser<(value: number) => number> = (input) => {
        if (input.startsWith('-')) {
            return [(value) => -value, input.slice(1)];
        }
        if (input.startsWith('+')) {
            return [(value) => Math.abs(value), input.slice(1)];
        }
        return null;
    };

    it('should handle atom without prefix operators', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('42');

        assertResult<number>(result, [42, '']);
    });

    it('should apply single prefix operator', () => {
        const parser = prefix(unaryOps, numberParser);
        {
            const result = parser('-5');

            assertResult<number>(result, [-5, '']);
        }
        {
            const result = parser('+5');

            assertResult<number>(result, [5, '']); // abs(5) = 5
        }
    });

    it('should apply multiple prefix operators right-to-left', () => {
        const parser = prefix(unaryOps, numberParser);
        {
            const result = parser('--5');

            assertResult<number>(result, [5, '']); // -(-5) = 5
        }
        {
            const result = parser('+-5');

            assertResult<number>(result, [5, '']); // +(-5) = abs(-5) = 5
        }
    });

    it('should fail when atom parser fails', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('-abc');

        assertResult<number>(result);
    });

    it('should handle long chains of prefix operators', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('---5');

        assertResult<number>(result, [-5, '']); // -(-(- 5)) = -5
    });

    it('should handle operators that consume no input when none match', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('123*');

        assertResult<number>(result, [123, '*']);
    });
});
