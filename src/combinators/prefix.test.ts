import { describe, it } from 'vitest';

import type { Parser } from '../core/parser';

import { digits } from '../../test/helpers';
import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { prefix } from './prefix';

describe('prefix', () => {
    const unaryOps: Parser<(value: number) => number> = (input, index = 0) => {
        if (input.startsWith('-', index)) {
            return success((value) => -value, index + 1);
        }
        if (input.startsWith('+', index)) {
            return success((value) => Math.abs(value), index + 1);
        }
        return failure(index);
    };

    it('should handle atom without prefix operators', () => {
        const parser = prefix(unaryOps, digits);
        const result = parser('42');

        assertSuccess<number>(result, 42, 2);
    });

    it('should apply single prefix operator', () => {
        const parser = prefix(unaryOps, digits);
        {
            const result = parser('-5');

            assertSuccess<number>(result, -5, 2);
        }
        {
            const result = parser('+5');

            assertSuccess<number>(result, 5, 2); // abs(5) = 5
        }
    });

    it('should apply multiple prefix operators right-to-left', () => {
        const parser = prefix(unaryOps, digits);
        {
            const result = parser('--5');

            assertSuccess<number>(result, 5, 3); // -(-5) = 5
        }
        {
            const result = parser('+-5');

            assertSuccess<number>(result, 5, 3); // +(-5) = abs(-5) = 5
        }
    });

    it('should fail when atom parser fails', () => {
        const parser = prefix(unaryOps, digits);
        const result = parser('-abc');

        assertFailure<number>(result);
    });

    it('should handle long chains of prefix operators', () => {
        const parser = prefix(unaryOps, digits);
        const result = parser('---5');

        assertSuccess<number>(result, -5, 4); // -(-(- 5)) = -5
    });

    it('should handle operators that consume no input when none match', () => {
        const parser = prefix(unaryOps, digits);
        const result = parser('123*');

        assertSuccess<number>(result, 123, 3);
    });
});
