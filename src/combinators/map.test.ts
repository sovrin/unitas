import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { map } from './map';

describe('map', () => {
    it('should transform parser result with single transform', () => {
        const parser1 = create<'42'>(() => success('42', 'abc'));
        const parser = map(parser1, parseInt);
        const result = parser('42abc');

        assertSuccess<number>(result, 42, 'abc');
    });

    it('should chain multiple transforms', () => {
        const parser1 = create<'24'>(() => success('24', 'abc'));
        const parser = map(
            parser1,
            parseInt,
            (n: number) => n * 2,
            (n: number) => n.toString(),
        );
        const result = parser('21abc');

        assertSuccess<string>(result, '48', 'abc');
    });

    it('should fail if underlying parser fails', () => {
        const parser1 = create<string>(() => failure());
        const parser = map(parser1, (s) => s.toUpperCase());
        const result = parser('goodbye');

        assertFailure<string>(result);
    });

    it('should handle complex transformations', () => {
        const parser1 = create(() =>
            success(['count', '=', '5'] as const, ';'),
        );
        const parser = map(
            parser1 as never,
            ([key, , value]: ['count', '=', '5']) => ({
                [key]: parseInt(value),
            }),
        );
        const result = parser('count=5;');

        // :O, surprising!
        assertSuccess<{ count: number }>(result, { count: 5 }, ';');
    });

    it('should maintain original input consumption', () => {
        const parser1 = create<'test'>(() => success('test', 'ing'));
        const parser = map(parser1, (s) => s.length);
        const result = parser('testing');

        assertSuccess<number>(result, 4, 'ing');
    });
});
