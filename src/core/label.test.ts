import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { sequence } from '../combinators/sequence';
import { char } from '../terminals/char';
import { string } from '../terminals/string';
import { label } from './label';

describe('label', () => {
    it('should return success with parsed value', () => {
        const parser = createTestParser('A');
        const labeled = label(parser, 'letter');
        const result = labeled('ABC');

        assertSuccess(result, 'A', 1);
    });

    it('should include label in error message on failure', () => {
        const parser = createTestParser('A');
        const labeled = label(parser, 'letter');
        const result = labeled('BCD');

        assertFailure(result, 0, ['letter']);
    });

    it('should keep the inner error once the parser has consumed input', () => {
        const parser = label(sequence(string('aa'), char('!')), 'a bang');
        const result = parser('aab');

        assertFailure(result, 2, ["'!'"]);
    });
});
