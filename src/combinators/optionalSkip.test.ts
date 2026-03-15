import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { optionalSkip } from './optionalSkip';

describe('optionalSkip', () => {
    it('should consume input on success', () => {
        const parser1 = createTestParser('A');
        const parser = optionalSkip(parser1);
        const result = parser('ABCD');

        assertSuccess<void>(result, undefined, 'BCD');
    });

    it('should not consume input on failure', () => {
        const failureParser = create(() => failure());
        const parser = optionalSkip(failureParser);
        const result = parser('ABCD');

        assertSuccess<void>(result, undefined, 'ABCD');
    });
});
