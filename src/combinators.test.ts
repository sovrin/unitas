import { assertType, describe, expect, it } from 'vitest';
import { create, sequence } from './combinators';
import { failure, success } from './results';
import { Result } from './types';

describe('combinators', () => {
    describe('sequence', () => {
        it('should call parsers in order and collect results', () => {
            const parser1 = create<string>((input) =>
                success('A', input.slice(1)),
            );
            const parser2 = create<string>((input) =>
                success('B', input.slice(1)),
            );
            const parser3 = create<string>((input) =>
                success('C', input.slice(1)),
            );

            const parser = sequence(parser1, parser2, parser3);
            const result = parser('xxxxx');
            expect(result).toEqual([['A', 'B', 'C'], 'xx']);

            assertType<Result<[string, string, string] | null>>(result);
        });

        it('should thread remaining input through parsers', () => {
            const parser1 = create<string>((input) =>
                success('first', input.slice(2)),
            );
            const parser2 = create<string>((input) =>
                success('second', input.slice(3)),
            );

            const parser = sequence(parser1, parser2);
            const result = parser('12345678');
            expect(result).toEqual([['first', 'second'], '678']);

            assertType<Result<[string, string] | null>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser1 = create<string>(() => failure());
            const parser2 = create<string>((input) =>
                success('B', input.slice(1)),
            );

            const parser = sequence(parser1, parser2);
            const result = parser('xxx');
            expect(result).toBeNull();

            assertType<Result<[string | null, string] | null>>(result);
        });

        it('should fail if middle parser fails', () => {
            const parser1 = create<string>((input) =>
                success('A', input.slice(1)),
            );
            const parser2 = create<null>(() => failure());
            const parser3 = create<string>((input) =>
                success('C', input.slice(1)),
            );

            const parser = sequence(parser1, parser2, parser3);
            const result = parser('xxx');
            expect(result).toBeNull();

            assertType<Result<[string, null, string] | null>>(result);
        });

        it('should handle empty sequence', () => {
            const parser = sequence();
            const result = parser('anything');
            expect(result).toEqual([[], 'anything']);

            assertType<Result<[] | null>>(result);
        });

        it('should preserve parser result types', () => {
            const strParser = create<string>((input) =>
                success('text', input.slice(1)),
            );
            const numParser = create<number>((input) =>
                success(42, input.slice(1)),
            );

            const parser = sequence(strParser, numParser);
            const result = parser('xx');
            expect(result).toEqual([['text', 42], '']);

            assertType<Result<[string, number] | null>>(result);
        });
    });
});
