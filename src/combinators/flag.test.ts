import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { flag } from './flag';

describe('flag', () => {
    const aParser = createTestParser('A');

    it('should return true when parser succeeds', () => {
        const parser = flag(aParser);
        const result = parser('ABC');

        assertSuccess<boolean>(result, true, 1);
    });

    it('should return false when parser fails', () => {
        const parser = flag(create<'A'>((_input, index = 0) => failure(index)));
        const result = parser('ABC');

        assertSuccess<boolean>(result, false, 0);
    });

    it('should not consume input on failure', () => {
        const parser = flag(aParser);
        const result = parser('XYZ');

        assertSuccess<boolean>(result, false, 0);
    });
});
