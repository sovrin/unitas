import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { tab } from './tab';

describe('tab', () => {
    it('should parse tab character', () => {
        const result = tab('\tabc');

        assertResult<string>(result, ['\t', 'abc']);
    });

    it('should fail on non-tab characters', () => {
        {
            const result = tab(' abc');

            assertResult<string>(result);
        }
        {
            const result = tab('abc');

            assertResult<string>(result);
        }
        {
            const result = tab('');

            assertResult<string>(result);
        }
    });
});
