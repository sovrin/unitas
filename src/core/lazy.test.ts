import { describe, expect, it } from 'vitest';

import type { Parser } from '../core/parser';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from './failure';
import { lazy } from './lazy';
import { create } from './parser';
import { success } from './success';

describe('lazy', () => {
    it('should defer parser creation', () => {
        const parser1 = createTestParser('A');

        let called = false;
        const parser = lazy(() => {
            called = true;
            return parser1;
        });

        expect(called).toBe(false);
        const result = parser('ABC');

        assertSuccess<'A'>(result, 'A', 1);

        expect(called).toBe(true);
    });

    it('should enable recursive parsers', () => {
        const charParser = (expected: string) => {
            return create<string>((input, index = 0) => {
                if (input[index] === expected) {
                    return success(expected, index + 1);
                }
                return failure(index, expected);
            });
        };

        const parent: Parser<string> = lazy<string>(() => {
            const baseCase = charParser('x');

            const recursiveCase = create<string>((input, index = 0) => {
                if (input[index] !== '(') {
                    return failure(index, "'('");
                }

                const innerResult = parent(input, index + 1);
                if (!innerResult.ok) {
                    return innerResult;
                }

                const after = innerResult.index;
                if (input[after] !== ')') {
                    return failure(after, "')'");
                }

                return success(innerResult.value, after + 1);
            });

            // Try the recursive case first, then base case
            return create<string>((input, index = 0) => {
                const recursiveResult = recursiveCase(input, index);
                if (recursiveResult.ok) return recursiveResult;

                return baseCase(input, index);
            });
        });

        {
            const result = parent('x');
            assertSuccess<string>(result, 'x', 1);
        }
        {
            const result = parent('(x)');

            assertSuccess<string>(result, 'x', 3);
        }
        {
            const result = parent('((x))');

            assertSuccess<string>(result, 'x', 5);
        }
        {
            const result = parent('(((x)))');

            assertSuccess<string>(result, 'x', 7);
        }
    });

    it('should handle parser that fails', () => {
        const failureParser = create((_input, index = 0) => failure(index));
        const result = failureParser('goodbye');

        assertFailure<unknown>(result);
    });
});
