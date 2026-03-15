import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { identifier } from './identifier';

describe('identifier', () => {
    it('should parse valid identifiers', () => {
        {
            const result = identifier('variable_name');

            assertSuccess<string>(result, 'variable_name', '');
        }
        {
            const result = identifier('_private');

            assertSuccess<string>(result, '_private', '');
        }
        {
            const result = identifier('camelCase');

            assertSuccess<string>(result, 'camelCase', '');
        }
        {
            const result = identifier('PascalCase');

            assertSuccess<string>(result, 'PascalCase', '');
        }
        {
            const result = identifier('name123');

            assertSuccess<string>(result, 'name123', '');
        }
    });

    it('should fail on invalid identifiers', () => {
        {
            const result = identifier('123invalid');

            assertFailure<string>(result);
        }
        {
            const result = identifier('invalid-name');

            assertFailure<string>(result);
        }
        {
            const result = identifier('invalid.name');

            assertFailure<string>(result);
        }
        {
            const result = identifier('valid_name!');

            assertFailure<string>(result);
        }
        {
            const result = identifier('test.property');

            assertFailure<string>(result);
        }
    });

    it('should handle single character identifiers', () => {
        {
            const result = identifier('a');

            assertSuccess<string>(result, 'a', '');
        }
        {
            const result = identifier('_');

            assertSuccess<string>(result, '_', '');
        }
    });
});
