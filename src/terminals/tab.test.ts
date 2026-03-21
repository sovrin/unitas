import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { tab } from './tab';

describe('tab', () => {
    it('should parse tab character', () => {
        const result = tab('\tabc');

        assertSuccess<string>(result, '\t', 'abc');
    });

    it('should fail on non-tab characters', () => {
        {
            const result = tab(' abc');

            assertFailure<string>(result);
        }
        {
            const result = tab('abc');

            assertFailure<string>(result);
        }
        {
            const result = tab('');

            assertFailure<string>(result);
        }
    });
});
