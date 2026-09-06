import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { identifier } from './identifier';

describe('identifier', () => {
    it('should parse valid identifiers', () => {
        {
            const result = identifier('variable_name');

            assertSuccess<string>(result, 'variable_name', 13);
        }
        {
            const result = identifier('_private');

            assertSuccess<string>(result, '_private', 8);
        }
        {
            const result = identifier('camelCase');

            assertSuccess<string>(result, 'camelCase', 9);
        }
        {
            const result = identifier('PascalCase');

            assertSuccess<string>(result, 'PascalCase', 10);
        }
        {
            const result = identifier('name123');

            assertSuccess<string>(result, 'name123', 7);
        }
        {
            const result = identifier('some-name');

            assertSuccess<string>(result, 'some', 4);
        }
        {
            const result = identifier('some.name');

            assertSuccess<string>(result, 'some', 4);
        }
        {
            const result = identifier('some_name!');

            assertSuccess<string>(result, 'some_name', 9);
        }
    });

    it('should fail on invalid identifiers', () => {
        {
            const result = identifier('123invalid');

            assertFailure<string>(result);
        }

        {
            const result = identifier('');

            assertFailure<string>(result);
        }
    });

    it('should handle single character identifiers', () => {
        {
            const result = identifier('a');

            assertSuccess<string>(result, 'a', 1);
        }
        {
            const result = identifier('_');

            assertSuccess<string>(result, '_', 1);
        }
    });
});
