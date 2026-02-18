import { describe, expect, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { guard } from './guard';

describe('guard', () => {
    it('should run parser and consume input when condition is true', () => {
        const parser1 = createTestParser('A');
        const parser = guard(true, parser1);
        const result = parser('AAA');

        assertResult<'A' | null>(result, ['A', 'AA']);
    });

    it('should return null and consume no input when condition is false', () => {
        const parser1 = createTestParser('A');
        const parser = guard(false, parser1);
        const result = parser('BBB');
        expect(result).toEqual([null, 'BBB']);

        assertResult<'A' | null>(result, [null, 'BBB']);
    });

    it('should propagate parser failure when condition is true but parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = guard(true, parser1);
        const result = parser('BBB');
        expect(result).toBeNull();

        assertResult<'A' | null>(result);
    });
});
