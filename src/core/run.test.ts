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

    it('should return null result', () => {
        expect(() => {
            run(parser, 'B');
        }).toThrowError('Parsing failed: Unexpected error');
    });

    it('should throw error for not remaining input', () => {
        expect(() => {
            run(parser, 'AB');
        }).toThrowError('Not all input consumed');
    });

    it('should throw error with message', () => {
        expect(() => {
            run(
                create(() => failure('Something weird happened')),
                'AB',
            );
        }).toThrowError('Something weird happened');
    });
});
