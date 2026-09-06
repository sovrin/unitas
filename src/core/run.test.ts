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
                    failure(index, 'something weird'),
                ),
                'AB',
            );
        }).toThrowError('expected something weird');
    });
});
