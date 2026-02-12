import { describe, expect, it } from 'vitest';
import { lazy } from './lazy';
import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from './create';
import { success } from './success';
import { failure } from './failure';
import { Parser } from '../types';

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

        assertResult<'A'>(result, ['A', 'BC']);

        expect(called).toBe(true);
    });

    it('should enable recursive parsers', () => {
        const charParser = (expected: string) => {
            return create<string>((input) => {
                if (input.length > 0 && input[0] === expected) {
                    return success(expected, input.slice(1));
                }
                return failure();
            });
        };

        const parent: Parser<string> = lazy<string>(() => {
            const baseCase = charParser('x');

            const recursiveCase = create<string>((input) => {
                if (input.length === 0 || input[0] !== '(') {
                    return failure();
                }

                const innerResult = parent(input.slice(1));
                if (!innerResult) {
                    return failure();
                }

                const [innerValue, afterInner] = innerResult;
                if (afterInner.length === 0 || afterInner[0] !== ')') {
                    return failure();
                }

                return success(innerValue, afterInner.slice(1));
            });

            // Try the recursive case first, then base case
            return create<string>((input) => {
                const recursiveResult = recursiveCase(input);
                if (recursiveResult) return recursiveResult;
                return baseCase(input);
            });
        });

        {
            const result = parent('x');

            assertResult<string>(result, ['x', '']);
        }
        {
            const result = parent('(x)');

            assertResult<string>(result, ['x', '']);
        }
        {
            const result = parent('((x))');

            assertResult<string>(result, ['x', '']);
        }
        {
            const result = parent('(((x)))');

            assertResult<string>(result, ['x', '']);
        }
    });

    it('should handle parser that fails', () => {
        const parser1 = create(() => failure());
        const result = parser1('goodbye');

        assertResult<unknown>(result);
    });
});
