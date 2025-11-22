import { assertType, describe, expect, it } from 'vitest';
import { choice, create, sequence } from './combinators';
import { failure, success } from './results';
import { Result } from './types';

describe('combinators', () => {
    describe('sequence', () => {
        it('should call parsers in order and collect results', () => {
            const parser1 = create<'A'>((input) =>
                success('A', input.slice(1)),
            );
            const parser2 = create<'B'>((input) =>
                success('B', input.slice(1)),
            );
            const parser3 = create<'C'>((input) =>
                success('C', input.slice(1)),
            );

            const parser = sequence(parser1, parser2, parser3);
            const result = parser('ABCDE');
            expect(result).toEqual([['A', 'B', 'C'], 'DE']);

            assertType<Result<['A', 'B', 'C'] | null>>(result);
        });

        it('should thread remaining input through parsers', () => {
            const parser1 = create<'A'>((input) =>
                success('A', input.slice(1)),
            );
            const parser2 = create<'B'>((input) =>
                success('B', input.slice(1)),
            );

            const parser = sequence(parser1, parser2);
            const result = parser('ABC');
            expect(result).toEqual([['A', 'B'], 'C']);

            assertType<Result<['A', 'B'] | null>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser1 = create(() => failure());
            const parser2 = create<'B'>((input) =>
                success('B', input.slice(1)),
            );

            const parser = sequence(parser1, parser2);
            const result = parser('xxx');
            expect(result).toBeNull();

            assertType<Result<[unknown, 'B']>>(result);
        });

        it('should fail if middle parser fails', () => {
            const parser1 = create<'A'>((input) =>
                success('A', input.slice(1)),
            );
            const parser2 = create(() => failure());
            const parser3 = create<'C'>((input) =>
                success('C', input.slice(1)),
            );

            const parser = sequence(parser1, parser2, parser3);
            const result = parser('xxx');
            expect(result).toBeNull();

            assertType<Result<['A', unknown, 'C']>>(result);
        });

        it('should handle empty sequence', () => {
            const parser = sequence();
            const result = parser('anything');
            expect(result).toEqual([[], 'anything']);

            assertType<Result<[] | null>>(result);
        });

        it('should preserve parser result types', () => {
            const strParser = create<'text'>(() => success('text', ''));
            const numParser = create<42>(() => success(42, ''));
            const parser = sequence(strParser, numParser);
            const result = parser('xx');
            expect(result).toEqual([['text', 42], '']);

            assertType<Result<[string, number]>>(result);
        });
    });

    describe('choice', () => {
        it('should try parsers in order and return first success', () => {
            const parserA = create<'A'>(() => failure());
            const parserB = create<'B'>((input) =>
                success('B', input.slice(1)),
            );
            const parserC = create<'C'>((input) =>
                success('C', input.slice(1)),
            );

            const parser = choice(parserA, parserB, parserC);
            const result = parser('ABC');
            expect(result).toEqual(['B', 'BC']);

            assertType<Result<'A' | 'B' | 'C'>>(result);
        });

        it('should try all parsers if earlier ones fail', () => {
            const parserA = create<'A'>(() => failure());
            const parserB = create<'B'>(() => failure());
            const parserC = create<'C'>((input) =>
                success('C', input.slice(1)),
            );

            const parser = choice(parserA, parserB, parserC);
            const result = parser('C D');
            expect(result).toEqual(['C', ' D']);

            assertType<Result<'A' | 'B' | 'C'>>(result);
        });

        it('should fail if all parsers fail', () => {
            const parser = choice(
                () => failure(),
                () => failure(),
                () => failure(),
            );

            const result = parser('D');
            expect(result).toBeNull();

            assertType<Result<unknown>>(result);
        });

        it('should handle single parser', () => {
            const parser1 = create<'A'>((input) =>
                success('A', input.slice(1)),
            );

            const parser = choice(parser1);
            const result = parser('ABCD');
            expect(result).toEqual(['A', 'BCD']);

            assertType<Result<'A'>>(result);
        });

        it('should handle empty choices', () => {
            const parser = choice();
            const result = parser('anything');
            expect(result).toBeNull();

            assertType<Result<unknown>>(result);
        });
    });
});
