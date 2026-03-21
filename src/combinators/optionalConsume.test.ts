import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { optionalConsume } from './optionalConsume';

describe('optionalConsume', () => {
    it('should consume input on success', () => {
        const parser1 = createTestParser('A');
        const parser = optionalConsume(parser1);
        const result = parser('ABCD');

        assertSuccess<void>(result, undefined, 'BCD');
    });

    it('should not consume input on failure', () => {
        const failureParser = create(() => failure());
        const parser = optionalConsume(failureParser);
        const result = parser('ABCD');

        assertSuccess<void>(result, undefined, 'ABCD');
    });
});
