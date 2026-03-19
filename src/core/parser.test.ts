import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { failure } from './failure';
import { create } from './parser';
import { success } from './success';

describe('create', () => {
    it('should return the result of the parser function on success', () => {
        const parser = create((input) => success(input, ''));
        const result = parser('hello');

        assertSuccess<string>(result, 'hello', '');
    });

    it('should return null when the parser function fails', () => {
        const parser = create(() => failure());
        const result = parser('hello');

        assertFailure(result);
    });

    it('should pass the input through to the parser function', () => {
        const parser = create((input) => success(input.toUpperCase(), input));
        const result = parser('hello');

        assertSuccess<string>(result, 'HELLO', 'hello');
    });
});
