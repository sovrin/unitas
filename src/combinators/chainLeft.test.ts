import { describe, it } from 'vitest';
import { chainLeft } from './chainLeft';
import {
    assertResult,
    numberParser,
    operatorParser,
} from '../../test/utils.test';

describe('chainLeft', () => {
    it('should return default value when parser fails', () => {
        const parser = chainLeft(numberParser, operatorParser, 999);
        const result = parser('abc');

        assertResult<number>(result, [999, 'abc']);
    });

    it('should parse successful chain', () => {
        const parser = chainLeft(numberParser, operatorParser, 0);
        const result = parser('1+2+3');

        assertResult<number>(result, [6, '']);
    });

    it('should return single value without default when successful', () => {
        const parser = chainLeft(numberParser, operatorParser, 999);
        const result = parser('42');

        assertResult<number>(result, [42, '']);
    });

    it('should handle empty input with default', () => {
        const parser = chainLeft(numberParser, operatorParser, 0);
        const result = parser('');

        assertResult<number>(result, [0, '']);
    });
});
