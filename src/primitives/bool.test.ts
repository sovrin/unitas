import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { bool } from './bool';

describe('bool', () => {
    it('should parse true', () => {
        {
            const result = bool('true');

            assertSuccess<boolean>(result, true, '');
        }
        {
            const result = bool('trueabc');

            assertSuccess<boolean>(result, true, 'abc');
        }
    });

    it('should parse false', () => {
        {
            const result = bool('false');

            assertSuccess<boolean>(result, false, '');
        }
        {
            const result = bool('falseabc');

            assertSuccess<boolean>(result, false, 'abc');
        }
    });

    it('should fail on non-boolean input', () => {
        {
            const result = bool('abc');

            assertFailure<boolean>(result);
        }
        {
            const result = bool('tru');

            assertFailure<boolean>(result);
        }
        {
            const result = bool('fals');

            assertFailure<boolean>(result);
        }
        {
            const result = bool('');

            assertFailure<boolean>(result);
        }
    });
});
