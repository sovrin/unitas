import { describe, expect, it } from 'vitest';

import { failure } from './failure';
import { match } from './match';
import { success } from './success';

describe('match', () => {
    it('should call success branch with value and remaining', () => {
        const result = success('test', 'rest');
        let capturedValue = '';
        let capturedRemaining = '';

        match(result, {
            success: (value, remaining) => {
                capturedValue = value;
                capturedRemaining = remaining;
            },
            failure: () => {},
        });

        expect(capturedValue).toBe('test');
        expect(capturedRemaining).toBe('rest');
    });

    it('should call failure branch with error', () => {
        const result = failure('test error');
        let capturedError = 'not called';

        match(result, {
            success: () => {},
            failure: (error) => {
                capturedError = error ?? 'no error';
            },
        });

        expect(capturedError).toBe('test error');
    });

    it('should call failure branch with undefined when no error', () => {
        const result = failure();
        let capturedError = 'not called';

        match(result, {
            success: () => {},
            failure: (error) => {
                capturedError = error ?? 'no error';
            },
        });

        expect(capturedError).toBe('no error');
    });
});
