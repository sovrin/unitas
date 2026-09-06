import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { pure } from './pure';

describe('pure', () => {
    it('should return value without consuming input', () => {
        const parser = pure(42);
        const result = parser('abc');

        assertSuccess<number>(result, 42, 0);
    });

    it('should work on empty input', () => {
        const parser = pure('ok');
        const result = parser('');

        assertSuccess<string>(result, 'ok', 0);
    });

    it('should work with any type', () => {
        const parser = pure({ x: 1 });
        const result = parser('xyz');

        assertSuccess<{ x: number }>(result, { x: 1 }, 0);
    });
});
