import { describe, expect, it } from 'vitest';

import { context, record, union } from './context';

describe('context', () => {
    it('should start with nothing recorded', () => {
        expect(context()).toEqual({ furthest: -1, expected: [] });
    });
});

describe('record', () => {
    it('should keep the furthest failure', () => {
        const ctx = context();
        record(ctx, 3, ['digit']);
        record(ctx, 7, ['letter']);
        record(ctx, 5, ['comma']);

        expect(ctx).toEqual({ furthest: 7, expected: ['letter'] });
    });

    it('should union expectations recorded at the same offset', () => {
        const ctx = context();
        record(ctx, 4, ['digit']);
        record(ctx, 4, ['letter']);

        expect(ctx.expected).toEqual(['digit', 'letter']);
    });

    it('should not repeat an expectation', () => {
        const ctx = context();
        record(ctx, 4, ['digit']);
        record(ctx, 4, ['digit']);

        expect(ctx.expected).toEqual(['digit']);
    });

    it('should leave the caller array untouched when unioning', () => {
        const ctx = context();
        const first = ['digit'];
        record(ctx, 4, first);
        record(ctx, 4, ['letter']);

        expect(first).toEqual(['digit']);
    });

    it('should do nothing without a context', () => {
        expect(() => record(undefined, 4, ['digit'])).not.toThrow();
    });
});

describe('union', () => {
    it('should return the first array when it already covers the second', () => {
        const a = ['digit', 'letter'];

        expect(union(a, ['digit'])).toBe(a);
    });

    it('should combine disjoint sets', () => {
        expect(union(['digit'], ['letter'])).toEqual(['digit', 'letter']);
    });
});
