import { assertType, describe, expect, it } from 'vitest';
import { choice, create, lazy, many, many1, map, sequence, times } from './combinators';
import { failure, success } from './results';
import { Parser, Result } from './types';

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

    describe('lazy', () => {
        it('should defer parser creation', () => {
            const parser1 = create<'A'>((input) =>
                success('A', input.slice(1)),
            );

            let called = false;
            const parser = lazy(() => {
                called = true;
                return parser1;
            });

            expect(called).toBe(false);
            const result = parser('ABC');
            expect(called).toBe(true);
            expect(result).toEqual(['A', 'BC']);
        });

        it('should enable recursive parsers', () => {
            const charParser = (expected: string) =>
                create<string>((input) => {
                    if (input.length > 0 && input[0] === expected) {
                        return success(expected, input.slice(1));
                    }
                    return failure();
                });

            const paren: Parser<string> = lazy<string>(() => {
                const baseCase = charParser('x');

                const recursiveCase = create<string>((input) => {
                    if (input.length === 0 || input[0] !== '(') {
                        return failure();
                    }

                    const innerResult = paren(input.slice(1));
                    if (!innerResult) {
                        return failure();
                    }

                    const [innerValue, afterInner] = innerResult;
                    if (afterInner.length === 0 || afterInner[0] !== ')') {
                        return failure();
                    }

                    return success(innerValue, afterInner.slice(1));
                });

                // Try recursive case first, then base case
                return create<string>((input) => {
                    const recursiveResult = recursiveCase(input);
                    if (recursiveResult) return recursiveResult;
                    return baseCase(input);
                });
            });

            expect(paren('x')).toEqual(['x', '']);
            expect(paren('(x)')).toEqual(['x', '']);
            expect(paren('((x))')).toEqual(['x', '']);
            expect(paren('(((x)))')).toEqual(['x', '']);
        });

        it('should handle parser that fails', () => {
            const parser1 = create(() => failure());
            const result = parser1('goodbye');
            expect(result).toBeNull();
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

    describe('map', () => {
        it('should transform parser result with single transform', () => {
            const parser1 = create<'42'>(() => success('42', 'abc'));
            const parser = map(parser1, parseInt);
            const result = parser('42abc');
            expect(result).toEqual([42, 'abc']);

            assertType<Result<number>>(result);
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
            expect(result).toEqual(['48', 'abc']);

            assertType<Result<string>>(result);
        });

        it('should fail if underlying parser fails', () => {
            const parser1 = create<string>(() => failure());

            const parser = map(parser1, (s) => s.toUpperCase());
            const result = parser('goodbye');
            expect(result).toBeNull();
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
            expect(result).toEqual([{ count: 5 }, ';']);

            // :O, surprising!
            assertType<Result<{ count: number }>>(result);
        });

        it('should maintain original input consumption', () => {
            const parser1 = create<'test'>(() => success('test', 'ing'));
            const parser = map(parser1, (s) => s.length);
            const result = parser('testing');
            expect(result).toEqual([4, 'ing']);

            assertType<Result<number>>(result);
        });
    });

    describe('many', () => {
        it('should parse zero occurrences', () => {
            const parser1 = create(() => failure());

            const parser = many(parser1);
            const result = parser('BCD');
            expect(result).toEqual([[], 'BCD']);

            assertType<Result<unknown>>(result);
        });

        it('should parse one occurrence', () => {
            const parser1 = create<'A'>((input) => {
                if (input.startsWith('A')) {
                    return success('A', input.slice(1));
                }

                return failure();
            });
            const parser = many(parser1);
            const result = parser('ABCD');
            expect(result).toEqual([['A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse multiple occurrences', () => {
            const parser1 = create<'A'>((input) => {
                if (input.startsWith('A')) {
                    return success('A', input.slice(1));
                }

                return failure();
            });
            const parser = many(parser1);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should handle empty input', () => {
            const parser1 = create<'A'>((input) => {
                if (input.startsWith('A')) {
                    return success('A', input.slice(1));
                }

                return failure();
            });
            const parser = many(parser1);
            const result = parser('');
            expect(result).toEqual([[], '']);

            assertType<Result<'A'[]>>(result);
        });

        it('should prevent infinite loops with non-consuming parsers', () => {
            const nonConsumingParser = () => ['', 'AB'] as [string, string];
            const parser = many(nonConsumingParser);
            const result = parser('AB');
            expect(result).toEqual([[], 'AB']);

            assertType<Result<string[]>>(result);
        });
    });

    describe('many1', () => {
        const parser1 = create<'A'>((input) => {
            if (input.startsWith('A')) {
                return success('A', input.slice(1));
            }

            return failure();
        });

        it('should fail on zero occurrences', () => {
            const parser = many1(parser1);
            const result = parser('BCD');
            expect(result).toBeNull();

            assertType<Result<'A'[]>>(result);
        });

        it('should parse one occurrence', () => {
            const parser = many1(parser1);
            const result = parser('ABCD');
            expect(result).toEqual([['A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse multiple occurrences', () => {
            const parser = many1(parser1);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should fail on empty input', () => {
            const parser = many1(parser1);
            const result = parser('');
            expect(result).toBeNull();

            assertType<Result<'A'[]>>(result);
        });

        describe('times', () => {
            const parser1 = create<'A'>((input) => {
                if (input.startsWith('A')) {
                    return success('A', input.slice(1));
                }

                return failure();
            });

            it('should parse exactly n occurrences', () => {
                const parser = times(parser1, 3);
                const result = parser('AAABCD');
                expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should fail if fewer than n occurrences', () => {
                const parser = times(parser1, 3);
                const result = parser('AABCD');
                expect(result).toBeNull();

                assertType<Result<'A'[]>>(result);
            });

            it('should parse exactly n and leave remainder', () => {
                const parser = times(parser1, 2);
                const result = parser('AAAAA');
                expect(result).toEqual([['A', 'A'], 'AAA']);

                assertType<Result<'A'[]>>(result);
            });

            it('should handle count of zero', () => {
                const parser = times(parser1, 0);
                const result = parser('AAABCD');
                expect(result).toEqual([[], 'AAABCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should fail on empty input when count > 0', () => {
                const parser = times(parser1, 2);
                const result = parser('');
                expect(result).toBeNull();

                assertType<Result<'A'[]>>(result);
            });
        });
    });
});
