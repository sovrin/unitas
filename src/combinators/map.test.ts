import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { map } from './map';

describe('map', () => {
    it('should transform parser result with single transform', () => {
        const parser1 = create<'42'>((_input, index = 0) => success('42', index + 2));
        const parser = map(parser1, parseInt);
        const result = parser('42abc');

        assertSuccess<number>(result, 42, 2);
    });

    it('should chain multiple transforms', () => {
        const parser1 = create<'24'>((_input, _index = 0) => success('24', 2));
        const parser = map(
            parser1,
            parseInt,
            (n: number) => n * 2,
            (n: number) => n.toString(),
        );
        const result = parser('21abc');

        assertSuccess<string>(result, '48', 2);
    });

    it('should fail if underlying parser fails', () => {
        const parser1 = create<string>((_input, _index = 0) => failure(0));
        const parser = map(parser1, (s) => s.toUpperCase());
        const result = parser('goodbye');

        assertFailure<string>(result);
    });

    it('should handle complex transformations', () => {
        const parser1 = create((_input, index = 0) =>
            success(['count', '=', '5'] as const, index + 7),
        );
        const parser = map(
            parser1 as never,
            ([key, , value]: ['count', '=', '5']) => ({
                [key]: parseInt(value),
            }),
        );
        const result = parser('count=5;');

        // :O, surprising!
        assertSuccess<{ count: number }>(result, { count: 5 }, 7);
    });

    it('should maintain original input consumption', () => {
        const parser1 = create<'test'>((_input, index = 0) => success('test', index + 4));
        const parser = map(parser1, (s) => s.length);
        const result = parser('testing');

        assertSuccess<number>(result, 4, 4);
    });
});
