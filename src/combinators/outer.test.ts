import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { outer } from './outer';

describe('outer', () => {
    const parserA = createTestParser('A');
    const parserB = createTestParser('B');
    const parserC = createTestParser('C');

    it('should return the outer parser results as a tuple', () => {
        const parser = outer(parserA, parserB, parserC);
        const result = parser('ABC');

        assertSuccess<['A', 'C']>(result, ['A', 'C'], '');
    });

    it('should fail if first parser fails', () => {
        const parser = outer(parserA, parserB, parserC);
        const result = parser('XBC');

        assertFailure<['A', 'C']>(result);
    });

    it('should fail if middle parser fails', () => {
        const parser = outer(parserA, parserB, parserC);
        const result = parser('AXC');

        assertFailure<['A', 'C']>(result);
    });

    it('should fail if last parser fails', () => {
        const parser = outer(parserA, parserB, parserC);
        const result = parser('ABX');

        assertFailure<['A', 'C']>(result);
    });
});
