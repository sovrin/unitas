import { describe, expect, it } from 'vitest';

import { create } from '../core/parser';
import { success } from '../core/success';
import { pipe } from './pipe';

describe('pipe', () => {
    it('should compose transform functions with parser context', () => {
        const transform = pipe(
            (n: number) => n + 1,
            (n: number) => n * 2,
        );

        const parser = create<number>(() => success(5, 'abc'));
        const result = transform.call(parser, 5);

        expect(result).toBe(12);
    });

    it('should compose three transform functions', () => {
        const transform = pipe(
            (n: number) => n + 1,
            (n: number) => n * 2,
            (n: number) => n - 3,
        );

        const parser = create<number>(() => success(5, 'abc'));
        const result = transform.call(parser, 5);

        expect(result).toBe(9);
    });

    it('should work with a single function', () => {
        const transform = pipe((n: number) => n * 2);

        const parser = create<number>(() => success(5, 'abc'));
        const result = transform.call(parser, 5);

        expect(result).toBe(10);
    });

    it('should handle string transformations', () => {
        const transform = pipe(
            (s: string) => s.trim(),
            (s: string) => s.toUpperCase(),
            (s: string) => s + '!',
        );

        const parser = create<string>(() => success('  hello  ', '!'));
        const result = transform.call(parser, '  hello  ');

        expect(result).toBe('HELLO!');
    });

    it('should allow accessing parser state via this', () => {
        const parser = create<number>(() => success(100, 'abc'));

        const transform = pipe(function (n: number) {
            return n + (this ? 1 : 0);
        });

        const result = transform.call(parser, 5);
        expect(result).toBe(6);
    });
});
