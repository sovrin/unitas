import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { uppercases } from './uppercases';

describe('uppercases', () => {
    it('should parse a run of uppercase letters', () => {
        {
            const result = uppercases('ABCdef');

            assertSuccess<string>(result, 'ABC', 3);
        }
        {
            const result = uppercases('HELLO world');

            assertSuccess<string>(result, 'HELLO', 5);
        }
        {
            const result = uppercases('ABC');

            assertSuccess<string>(result, 'ABC', 3);
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

        assertSuccess<string>(result, 'A', 1);
    });
});
