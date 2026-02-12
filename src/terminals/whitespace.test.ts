import { describe, it } from 'vitest';
import { whitespace } from './whitespace';
import { assertResult } from '../../test/utils.test';

describe('whitespace', () => {
    it('should parse whitespace', () => {
        const result = whitespace(' ');

        assertResult<' '>(result, [' ', '']);
    });

    it('should parse only one whitespace', () => {
        const result = whitespace('   ');

        assertResult<' '>(result, [' ', '  ']);
    });

    it('should fail on non-whitespace', () => {
        const result = whitespace('ABC');

        assertResult<' '>(result);
    });
});
