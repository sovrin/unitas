import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { bind } from './bind';

describe('bind', () => {
    it('should run the first parser, then the second with the result', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser = bind(parser1, (a) =>
            bind(parser2, (b) => create((_input, index = 0) => success(`${a}${b}`, index))),
        );

        const result = parser('ABCD');

        assertSuccess<string>(result, 'AB', 2);
    });

    it('should fail if the first parser fails', () => {
        const failingParser = create((_input, index = 0) => failure(index));
        const parser = bind(failingParser, (_x) => createTestParser('B'));

        const result = parser('ABC');

        assertFailure(result);
    });

    it('should fail if the second parser fails', () => {
        const parser1 = createTestParser('A');
        const failingSecond = create((_input, index = 0) => failure(index));
        const parser = bind(parser1, () => failingSecond);

        const result = parser('ABC');

        assertFailure(result);
    });

    it('should allow the second parser to depend on the first result', () => {
        const countParser = create<number>((input, index = 0) => {
            const match = input.slice(index).match(/^(\d+)/);
            if (!match) return failure(index);
            return success(parseInt(match[1]), index + match[1].length);
        });
        const parser = bind(countParser, (count) =>
            create<string>((input, index = 0) => {
                const taken = input.slice(index, index + count);
                return success(taken, index + count);
            }),
        );

        const result = parser('3abc');

        assertSuccess<string>(result, 'abc', 4);
    });

    it('should handle nested bind chains', () => {
        const parser = bind(createTestParser('A'), (a) =>
            bind(createTestParser('B'), (b) =>
                bind(createTestParser('C'), (c) =>
                    create((input) => success(`${a}${b}${c}`, input.length)),
                ),
            ),
        );

        const result = parser('ABC');

        assertSuccess<string>(result, 'ABC', 3);
    });
});
