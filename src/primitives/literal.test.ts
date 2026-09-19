import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { literal } from './literal';

describe('literal', () => {
    it('should parse valid literals', () => {
        {
            const result = literal('foo');

            assertSuccess<string>(result, 'foo', 3);
        }
        {
            const result = literal('123f');

            assertSuccess<string>(result, '123f', 4);
        }
        {
            const result = literal('foo-bar');

            assertSuccess<string>(result, 'foo-bar', 7);
        }
        {
            const result = literal('_private');

            assertSuccess<string>(result, '_private', 8);
        }
        {
            const result = literal('a');

            assertSuccess<string>(result, 'a', 1);
        }
        {
            const result = literal('_');

            assertSuccess<string>(result, '_', 1);
        }
        {
            const result = literal('foo_bar');

            assertSuccess<string>(result, 'foo_bar', 7);
        }
        {
            const result = literal('foo-bar_baz');

            assertSuccess<string>(result, 'foo-bar_baz', 11);
        }
    });

    it('should fail on invalid literals', () => {
        const result = literal('');

        assertFailure<string>(result);
    });
});
