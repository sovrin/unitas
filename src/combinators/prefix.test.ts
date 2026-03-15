import { describe, it } from 'vitest';

import type { Parser } from '../types';

import {
    assertFailure,
    assertSuccess,
    numberParser,
} from '../../test/utils.test';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { prefix } from './prefix';

describe('prefix', () => {
    const unaryOps: Parser<(value: number) => number> = (input) => {
        if (input.startsWith('-')) {
            return success((value) => -value, input.slice(1));
        }
        if (input.startsWith('+')) {
            return success((value) => Math.abs(value), input.slice(1));
        }
        return failure();
    };

    it('should handle atom without prefix operators', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('42');

        assertSuccess<number>(result, 42, '');
    });

    it('should apply single prefix operator', () => {
        const parser = prefix(unaryOps, numberParser);
        {
            const result = parser('-5');

            assertSuccess<number>(result, -5, '');
        }
        {
            const result = parser('+5');

            assertSuccess<number>(result, 5, ''); // abs(5) = 5
        }
    });

    it('should apply multiple prefix operators right-to-left', () => {
        const parser = prefix(unaryOps, numberParser);
        {
            const result = parser('--5');

            assertSuccess<number>(result, 5, ''); // -(-5) = 5
        }
        {
            const result = parser('+-5');

            assertSuccess<number>(result, 5, ''); // +(-5) = abs(-5) = 5
        }
    });

    it('should fail when atom parser fails', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('-abc');

        assertFailure<number>(result);
    });

    it('should handle long chains of prefix operators', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('---5');

        assertSuccess<number>(result, -5, ''); // -(-(- 5)) = -5
    });

    it('should handle operators that consume no input when none match', () => {
        const parser = prefix(unaryOps, numberParser);
        const result = parser('123*');

        assertSuccess<number>(result, 123, '*');
    });
});
