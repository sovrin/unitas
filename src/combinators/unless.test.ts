import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { unless } from './unless';

describe('unless', () => {
    it('should run parser and consume input when condition is false', () => {
        const parser = unless(false, createTestParser('A'));
        const result = parser('AAA');

        assertSuccess<'A' | null>(result, 'A', 'AA');
    });

    it('should return null and consume no input when condition is true', () => {
        const parser = unless(true, createTestParser('A'));
        const result = parser('AAA');

        assertSuccess<'A' | null>(result, null, 'AAA');
    });

    it('should fail when condition is false but parser fails', () => {
        const parser = unless(false, createTestParser('A'));
        const result = parser('BBB');

        assertFailure<'A' | null>(result);
    });
});
