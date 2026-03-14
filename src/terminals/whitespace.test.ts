import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { whitespace } from './whitespace';

describe('whitespace', () => {
    it('should parse whitespace', () => {
        const result = whitespace(' ');

        assertResult<string>(result, [' ', '']);
    });

    it('should parse only one whitespace', () => {
        const result = whitespace('   ');

        assertResult<string>(result, [' ', '  ']);
    });

    it('should fail on non-whitespace', () => {
        const result = whitespace('ABC');

        assertResult<string>(result);
    });
});
