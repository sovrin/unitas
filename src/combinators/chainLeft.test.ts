import { describe, expect, it } from 'vitest';

import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';
import { chainLeft } from './chainLeft';

describe('chainLeft', () => {
    it('should return null when parser fails', () => {
        const parser = chainLeft(numberParser, operatorParser);
        const result = parser('abc');

        expect(result).toBeNull();
    });

    it('should parse successful chain', () => {
        const parser = chainLeft(numberParser, operatorParser);
        const result = parser('1+2+3');

        assertResult<number | null>(result, [6, '']);
    });

    it('should return single value when successful', () => {
        const parser = chainLeft(numberParser, operatorParser);
        const result = parser('42');

        assertResult<number | null>(result, [42, '']);
    });

    it('should handle empty input', () => {
        const parser = chainLeft(numberParser, operatorParser);
        const result = parser('');

        expect(result).toBeNull();
    });
});
