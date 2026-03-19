import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { oneOf } from './oneOf';

describe('oneOf', () => {
    it('should match first string in the set', () => {
        const parser = oneOf(['foo', 'bar', 'baz'] as const);
        const result = parser('foorest');

        assertSuccess<'foo' | 'bar' | 'baz'>(result, 'foo', 'rest');
    });

    it('should match a later string in the set', () => {
        const parser = oneOf(['foo', 'bar', 'baz'] as const);
        const result = parser('barbarian');

        assertSuccess<'foo' | 'bar' | 'baz'>(result, 'bar', 'barian');
    });

    it('should fail when no string matches', () => {
        const parser = oneOf(['foo', 'bar', 'baz'] as const);
        const result = parser('qux');

        assertFailure<'foo' | 'bar' | 'baz'>(result);
    });

    it('should match and consume the full string leaving empty remainder', () => {
        const parser = oneOf(['foo', 'bar'] as const);
        const result = parser('foo');

        assertSuccess<'foo' | 'bar'>(result, 'foo', '');
    });

    it('should fail on empty input', () => {
        const parser = oneOf(['foo', 'bar'] as const);
        const result = parser('');

        assertFailure<'foo' | 'bar'>(result);
    });

    it('should work with a single-element tuple', () => {
        const parser = oneOf(['hello'] as const);
        const result = parser('hello world');

        assertSuccess<'hello'>(result, 'hello', ' world');
    });

    it('should match strings with multi-character tokens', () => {
        const parser = oneOf(['+=', '+', '='] as const);
        const result = parser('+=1');

        assertSuccess<'+=' | '+' | '='>(result, '+=', '1');
    });

    it('should match the first candidate even when a later one is also a prefix', () => {
        const parser = oneOf(['+', '+='] as const);
        const result = parser('+=1');

        assertSuccess<'+' | '+='>(result, '+', '=1');
    });

    it('should fail when input is a prefix of a candidate but not a full match', () => {
        const parser = oneOf(['foobar'] as const);
        const result = parser('foo');

        assertFailure<'foobar'>(result);
    });
});
