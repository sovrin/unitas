import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { literal } from './literal';

describe('literal', () => {
    it('should parse valid literals', () => {
        {
            const result = literal('foo');

            assertSuccess<string>(result, 'foo', '');
        }
        {
            const result = literal('123f');

            assertSuccess<string>(result, '123f', '');
        }
        {
            const result = literal('foo-bar');

            assertSuccess<string>(result, 'foo-bar', '');
        }
        {
            const result = literal('_private');

            assertSuccess<string>(result, '_private', '');
        }
        {
            const result = literal('a');

            assertSuccess<string>(result, 'a', '');
        }
        {
            const result = literal('_');

            assertSuccess<string>(result, '_', '');
        }
        {
            const result = literal('foo_bar');

            assertSuccess<string>(result, 'foo_bar', '');
        }
        {
            const result = literal('foo-bar_baz');

            assertSuccess<string>(result, 'foo-bar_baz', '');
        }
    });

    it('should fail on invalid literals', () => {
        const result = literal('');

        assertFailure<string>(result);
    });
});
