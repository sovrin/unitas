import { describe, expect, it } from 'vitest';
import { failure } from './failure';

describe('failure', () => {
    it('should create failed parse result', () => {
        const result = failure();
        expect(result).toBeNull();
    });
});
