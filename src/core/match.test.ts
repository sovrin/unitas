import { describe, expect, it } from 'vitest';

import { failure } from './failure';
import { match } from './match';
import { success } from './success';

describe('match', () => {
    it('should call success branch with value and offset', () => {
        const result = success('test', 4);
        let capturedValue = '';
        let capturedIndex = -1;

        match(result, {
            success: (value, index) => {
                capturedValue = value;
                capturedIndex = index;
            },
            failure: () => {},
        });

        expect(capturedValue).toBe('test');
        expect(capturedIndex).toBe(4);
    });

    it('should call failure branch with offset and expectations', () => {
        const result = failure(undefined, 2, 'digit');
        let capturedIndex = -1;
        let capturedExpected: readonly string[] = [];

        match(result, {
            success: () => {},
            failure: (index, expected) => {
                capturedIndex = index;
                capturedExpected = expected;
            },
        });

        expect(capturedIndex).toBe(2);
        expect(capturedExpected).toEqual(['digit']);
    });

    it('should call failure branch with no expectations when none were recorded', () => {
        const result = failure(undefined, 0);
        let capturedExpected: readonly string[] = ['not called'];

        match(result, {
            success: () => {},
            failure: (_index, expected) => {
                capturedExpected = expected;
            },
        });

        expect(capturedExpected).toEqual([]);
    });
});
