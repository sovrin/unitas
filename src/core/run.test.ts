import { describe, expect, it } from 'vitest';

import { createTestParser } from '../../test/utils';
import { failure } from './failure';
import { create } from './parser';
import { run } from './run';

describe('run', () => {
    const parser = createTestParser('A');

    it('should successfully return parsed result', () => {
        const result = run(parser, 'A');

        expect(result).toBe('A');
    });

    it('should report the expectation and position on failure', () => {
        expect(() => {
            run(parser, 'B');
        }).toThrowError("1:1 expected A, found 'B'");
    });

    it('should throw error for unconsumed input', () => {
        expect(() => {
            run(parser, 'AB');
        }).toThrowError("1:2 expected end of input, found 'B'");
    });

    it('should throw error with the expectation the parser recorded', () => {
        expect(() => {
            run(
                create((_input, index = 0) =>
                    failure(undefined, index, 'something weird'),
                ),
                'AB',
            );
        }).toThrowError('expected something weird');
    });

    /** Records 'A' the way a real terminal does, then discards the failure. */
    const swallowing = (...expected: string[]) => {
        return create((_input, index = 0, ctx) => {
            failure(ctx, index, 'A');

            return failure(ctx, index, ...expected);
        });
    };

    it('should fall back to the context when the failure names nothing', () => {
        expect(() => {
            run(swallowing(), 'B');
        }).toThrowError("1:1 expected A, found 'B'");
    });

    it('should combine the context and the failure at the same offset', () => {
        expect(() => {
            run(swallowing('B'), 'C');
        }).toThrowError("1:1 expected A or B, found 'C'");
    });
});
