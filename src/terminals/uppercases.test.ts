import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { uppercases } from './uppercases';

describe('uppercases', () => {
    it('should parse a run of uppercase letters', () => {
        {
            const result = uppercases('ABCdef');

            assertSuccess<string>(result, 'ABC', 'def');
        }
        {
            const result = uppercases('HELLO world');

            assertSuccess<string>(result, 'HELLO', ' world');
        }
        {
            const result = uppercases('ABC');

            assertSuccess<string>(result, 'ABC', '');
        }
    });

    it('should fail when no uppercase letters found', () => {
        {
            const result = uppercases('abc');

            assertFailure<string>(result);
        }
        {
            const result = uppercases('123');

            assertFailure<string>(result);
        }
        {
            const result = uppercases('');

            assertFailure<string>(result);
        }
    });

    it('should handle single uppercase letter', () => {
        const result = uppercases('Abc');

        assertSuccess<string>(result, 'A', 'bc');
    });
});
