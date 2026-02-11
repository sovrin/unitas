import { describe, expect, it } from 'vitest';
import { success } from './success';

describe('success', () => {
    it('should create successful parse result', () => {
        const result = success('test', 'remaining');
        expect(result).toEqual(['test', 'remaining']);
    });
});
