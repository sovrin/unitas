import { describe, it } from 'vitest';
import { chainRight } from './chainRight';
import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';

describe('chainRight', () => {
    it('should return default value when parser fails', () => {
        const parser = chainRight(numberParser, operatorParser, 1);
        const result = parser('abc');

        assertResult<number>(result, [1, 'abc']);
    });

    it('should parse successful chain', () => {
        const parser = chainRight(numberParser, operatorParser, 1);
        const result = parser('2**3');

        assertResult<number>(result, [8, '']);
    });

    it('should return single value without default when successful', () => {
        const parser = chainRight(numberParser, operatorParser, 999);
        const result = parser('5');

        assertResult<number>(result, [5, '']);
    });

    it('should handle empty input with default', () => {
        const parser = chainRight(numberParser, operatorParser, 1);
        const result = parser('');

        assertResult<number>(result, [1, '']);
    });

    it('should demonstrate right associativity with default', () => {
        const parser = chainRight(numberParser, operatorParser, 0);
        const result = parser('10-3-2');

        assertResult<number>(result, [9, '']); // 10-(3-2)
    });
});
