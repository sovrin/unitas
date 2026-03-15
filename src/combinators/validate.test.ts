import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { validate } from './validate';

describe('validate', () => {
    it('should succeed when parser succeeds and predicate returns true', () => {
        const parser1 = createTestParser('A');
        const parser = validate(parser1, (value) => value === 'A');
        const result = parser('AAA');

        assertSuccess<'A'>(result, 'A', 'AA');
    });

    it('should fail when parser succeeds but predicate returns false', () => {
        const parser1 = createTestParser('A');
        const parser = validate(parser1, (value) => value !== 'A');
        const result = parser('AAA');

        assertFailure<'A'>(result);
    });

    it('should fail when underlying parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = validate(parser1, () => true);
        const result = parser('BBB');

        assertFailure<'A'>(result);
    });
});
