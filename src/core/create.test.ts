import { describe, expect, it } from 'vitest';

import { create } from './create';
import { success } from './success';

describe('create', () => {
    it('should return the result of the parser function on success', () => {
        const parser = create((input) => success(input, ''));
        const result = parser('hello');

        expect(result).toEqual(['hello', '']);
    });

    it('should return null when the parser function fails', () => {
        const parser = create(() => null);
        const result = parser('hello');

        expect(result).toBeNull();
    });

    it('should pass the input through to the parser function', () => {
        const parser = create((input) => success(input.toUpperCase(), input));
        const result = parser('hello');

        expect(result).toEqual(['HELLO', 'hello']);
    });
});
