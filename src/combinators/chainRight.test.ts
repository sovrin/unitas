import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    numberParser,
    operatorParser,
} from '../../test/utils.test';
import { chainRight } from './chainRight';

describe('chainRight', () => {
    it('should return null when parser fails', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('abc');

        assertFailure(result);
    });

    it('should parse successful chain', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('2**3');

        assertSuccess<number | null>(result, 8, '');
    });

    it('should return single value when successful', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('5');

        assertSuccess<number | null>(result, 5, '');
    });

    it('should handle empty input', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('');

        assertFailure(result);
    });

    it('should demonstrate right associativity', () => {
        const parser = chainRight(numberParser, operatorParser);
        const result = parser('10-3-2');

        assertSuccess<number | null>(result, 9, ''); // 10-(3-2)
    });
});
