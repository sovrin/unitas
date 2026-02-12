import { describe, it } from 'vitest';
import { identifier } from './identifier';
import { assertResult } from '../../test/utils.test';

describe('identifier', () => {
    it('should parse valid identifiers', () => {
        {
            const result = identifier('variable_name');

            assertResult<string>(result, ['variable_name', '']);
        }
        {
            const result = identifier('_private');

            assertResult<string>(result, ['_private', '']);
        }
        {
            const result = identifier('camelCase');

            assertResult<string>(result, ['camelCase', '']);
        }
        {
            const result = identifier('PascalCase');

            assertResult<string>(result, ['PascalCase', '']);
        }
        {
            const result = identifier('name123');

            assertResult<string>(result, ['name123', '']);
        }
    });

    it('should fail on invalid identifiers', () => {
        {
            const result = identifier('123invalid');

            assertResult<string>(result);
        }
        {
            const result = identifier('invalid-name');

            assertResult<string>(result);
        }
        {
            const result = identifier('invalid.name');

            assertResult<string>(result);
        }
        {
            const result = identifier('valid_name!');

            assertResult<string>(result);
        }
        {
            const result = identifier('test.property');

            assertResult<string>(result);
        }
    });

    it('should handle single character identifiers', () => {
        {
            const result = identifier('a');

            assertResult<string>(result, ['a', '']);
        }
        {
            const result = identifier('_');

            assertResult<string>(result, ['_', '']);
        }
    });
});
