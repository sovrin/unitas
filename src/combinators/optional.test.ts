import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { optional } from './optional';

describe('optional', () => {
    const parser1 = createTestParser('A');

    it('should return parsed value when parser succeeds', () => {
        const parser = optional(parser1);
        const result = parser('ABC');

        assertResult<'A' | null>(result, ['A', 'BC']);
    });

    it('should return null when parser fails', () => {
        const parser1 = create<'A'>(() => failure());
        const parser = optional(parser1);
        const result = parser('ABC');

        assertResult<'A' | null>(result, [null, 'ABC']);
    });
});
