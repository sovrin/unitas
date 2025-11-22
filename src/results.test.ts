import { describe, expect, it } from 'vitest';
import { fail, failure, success } from './results';
import { run } from './core';

describe('results', () => {
    describe('success and failure helpers', () => {
        it('should create successful parse result', () => {
            const result = success('test', 'remaining');
            expect(result).toEqual(['test', 'remaining']);
        });
    });

    describe('failure', () => {
        it('should create failed parse result', () => {
            const result = failure();
            expect(result).toBeNull();
        });
    });

    describe('fail', () => {
        it('should fail', () => {
            const result = run(fail(), 'remaining');
            expect(result).toBeNull();
        });
    });
});
