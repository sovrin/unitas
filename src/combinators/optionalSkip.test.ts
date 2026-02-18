import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { optionalSkip } from './optionalSkip';

describe('optionalSkip', () => {
    it('should consume input on success', () => {
        const parser1 = createTestParser('A');
        const parser = optionalSkip(parser1);
        const result = parser('ABCD');

        assertResult<void>(result, [undefined, 'BCD']);
    });

    it('should not consume input on failure', () => {
        const parser1 = create(() => failure());
        const parser = optionalSkip(parser1);
        const result = parser('ABCD');

        assertResult<void>(result, [undefined, 'ABCD']);
    });
});
