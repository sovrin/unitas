import { describe, expect, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { guard } from './guard';
import { unless } from './unless';

describe('unless', () => {
    it('should run parser and consume input when condition is false', () => {
        const parser1 = createTestParser('A');
        const parser = unless(false, parser1);
        const result = parser('AAA');

        assertSuccess<'A' | null>(result, 'A', 'AA');
    });

    it('should return null and consume no input when condition is true', () => {
        const parser1 = createTestParser('A');
        const parser = unless(true, parser1);
        const result = parser('AAA');

        assertSuccess<'A' | null>(result, null, 'AAA');
    });

    it('should propagate parser failure when condition is false but parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = unless(false, parser1);
        const result = parser('BBB');

        assertFailure<'A' | null>(result);
    });

    it('should be opposite of guard', () => {
        const condition = true;
        const input = 'A';
        const parser1 = createTestParser('A');

        const guardResult = guard(condition, parser1)(input);
        const unlessResult = unless(!condition, parser1)(input);

        expect(guardResult).toEqual(unlessResult);
    });
});
