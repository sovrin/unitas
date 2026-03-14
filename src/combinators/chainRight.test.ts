import { describe, expect, it } from 'vitest';

import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';
import { chainRight } from './chainRight';

describe('chainRight', () => {
    it('should return null when parser fails', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('abc');

        expect(result).toBeNull();
    });

    it('should parse successful chain', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('2**3');

        assertResult<number | null>(result, [8, '']);
    });

    it('should return single value when successful', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('5');

        assertResult<number | null>(result, [5, '']);
    });

    it('should handle empty input', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('');

        expect(result).toBeNull();
    });

    it('should demonstrate right associativity', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('10-3-2');

        assertResult<number | null>(result, [9, '']); // 10-(3-2)
    });
});
