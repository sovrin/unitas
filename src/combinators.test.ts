import { assertType, describe, expect, it } from 'vitest';
import {
    choice,
    create,
    exactly,
    lazy,
    left,
    lexeme,
    many,
    many1,
    manyAtLeast,
    manyAtMost,
    manyBetween,
    map,
    middle,
    optional,
    optionalSkip,
    optionalWith,
    right,
    sequence,
    token,
    until
} from './combinators';
import { failure, success } from './results';
import { Parser, Result } from './types';

const createTestParser = <T extends string>(tester: T) =>
    create<T>((input) => {
        if (input.startsWith(tester)) {
            return success(tester, input.slice(tester.length));
        }

        return failure();
    });

describe('combinators', () => {
    describe('sequence', () => {
        it('should call parsers in order and collect results', () => {
            const parser1 = createTestParser('A');
            const parser2 = createTestParser('B');
            const parser3 = createTestParser('C');
            const parser = sequence(parser1, parser2, parser3);
            const result = parser('ABCDE');
            expect(result).toEqual([['A', 'B', 'C'], 'DE']);

            assertType<Result<['A', 'B', 'C'] | null>>(result);
        });

        it('should thread remaining input through parsers', () => {
            const parser1 = createTestParser('A');
            const parser2 = createTestParser('B');
            const parser = sequence(parser1, parser2);
            const result = parser('ABC');
            expect(result).toEqual([['A', 'B'], 'C']);

            assertType<Result<['A', 'B'] | null>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser1 = create(() => failure());
            const parser2 = createTestParser('B');
            const parser = sequence(parser1, parser2);
            const result = parser('xxx');
            expect(result).toBeNull();

            assertType<Result<[unknown, 'B']>>(result);
        });

        it('should fail if middle parser fails', () => {
            const parser1 = createTestParser('A');
            const parser2 = create(() => failure());
            const parser3 = createTestParser('C');
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
            const parser1 = createTestParser('A');

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

                // Try the recursive case first, then base case
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
            const parser1 = createTestParser('A');
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
            const parser1 = createTestParser('A');
            const parser = many(parser1);
            const result = parser('ABCD');
            expect(result).toEqual([['A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse multiple occurrences', () => {
            const parser1 = createTestParser('A');
            const parser = many(parser1);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should handle empty input', () => {
            const parser1 = createTestParser('A');
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
        const parser1 = createTestParser('A');

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

        describe('exactly', () => {
            const parser1 = createTestParser('A');

            it('should parse exactly n occurrences', () => {
                const parser = exactly(parser1, 3);
                const result = parser('AAABCD');
                expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should fail if fewer than n occurrences', () => {
                const parser = exactly(parser1, 3);
                const result = parser('AABCD');
                expect(result).toBeNull();

                assertType<Result<'A'[]>>(result);
            });

            it('should parse exactly n and leave remainder', () => {
                const parser = exactly(parser1, 2);
                const result = parser('AAAAA');
                expect(result).toEqual([['A', 'A'], 'AAA']);

                assertType<Result<'A'[]>>(result);
            });

            it('should handle count of zero', () => {
                const parser = exactly(parser1, 0);
                const result = parser('AAABCD');
                expect(result).toEqual([[], 'AAABCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should fail on empty input when count > 0', () => {
                const parser = exactly(parser1, 2);
                const result = parser('');
                expect(result).toBeNull();

                assertType<Result<'A'[]>>(result);
            });
        });

        describe('manyAtMost', () => {
            const parser1 = createTestParser('A');

            it('should parse up to n occurrences', () => {
                const parser = manyAtMost(parser1, 3);
                const result = parser('AABCD');
                expect(result).toEqual([['A', 'A'], 'BCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should parse exactly n occurrences when available', () => {
                const parser = manyAtMost(parser1, 3);
                const result = parser('AAABCD');
                expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should not parse more than n occurrences', () => {
                const parser = manyAtMost(parser1, 2);
                const result = parser('AAAAAA');
                expect(result).toEqual([['A', 'A'], 'AAAA']);

                assertType<Result<'A'[]>>(result);
            });

            it('should parse zero occurrences', () => {
                const parser = manyAtMost(parser1, 3);
                const result = parser('BCD');
                expect(result).toEqual([[], 'BCD']);

                assertType<Result<'A'[]>>(result);
            });

            it('should handle limit of zero', () => {
                const parser = manyAtMost(parser1, 0);
                const result = parser('AAABCD');
                expect(result).toEqual([[], 'AAABCD']);

                assertType<Result<'A'[]>>(result);
            });
        });
    });

    describe('manyAtLeast', () => {
        const parser1 = createTestParser('A');

        it('should parse at least n occurrences', () => {
            const parser = manyAtLeast(parser1, 2);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse exactly n occurrences', () => {
            const parser = manyAtLeast(parser1, 2);
            const result = parser('AABCD');
            expect(result).toEqual([['A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should fail if fewer than n occurrences', () => {
            const parser = manyAtLeast(parser1, 3);
            const result = parser('AABCD');
            expect(result).toBeNull();

            assertType<Result<'A'[]>>(result);
        });

        it('should handle minimum of zero', () => {
            const parser = manyAtLeast(parser1, 0);
            const result = parser('BCD');
            expect(result).toEqual([[], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse many more than minimum', () => {
            const parser = manyAtLeast(parser1, 2);
            const result = parser('AAAAAA');
            expect(result).toEqual([['A', 'A', 'A', 'A', 'A', 'A'], '']);

            assertType<Result<'A'[]>>(result);
        });
    });

    describe('manyBetween', () => {
        const parser1 = createTestParser('A');

        it('should parse within range', () => {
            const parser = manyBetween(parser1, 2, 4);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse minimum required', () => {
            const parser = manyBetween(parser1, 2, 4);
            const result = parser('AABCD');
            expect(result).toEqual([['A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should parse maximum allowed', () => {
            const parser = manyBetween(parser1, 2, 4);
            const result = parser('AAAABCD');
            expect(result).toEqual([['A', 'A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });

        it('should not parse more than maximum', () => {
            const parser = manyBetween(parser1, 1, 3);
            const result = parser('AAAAAA');
            expect(result).toEqual([['A', 'A', 'A'], 'AAA']);

            assertType<Result<'A'[]>>(result);
        });

        it('should fail if fewer than minimum', () => {
            const parser = manyBetween(parser1, 3, 5);
            const result = parser('AABCD');
            expect(result).toBeNull();

            assertType<Result<'A'[]>>(result);
        });

        it('should handle equal min and max', () => {
            const parser = manyBetween(parser1, 3, 3);
            const result = parser('AAABCD');
            expect(result).toEqual([['A', 'A', 'A'], 'BCD']);

            assertType<Result<'A'[]>>(result);
        });
    });

    describe('optional', () => {
        const parser1 = createTestParser('A');

        it('should return parsed value when parser succeeds', () => {
            const parser = optional(parser1);
            const result = parser('ABC');
            expect(result).toEqual(['A', 'BC']);

            assertType<Result<'A' | null>>(result);
        });

        it('should return null when parser fails', () => {
            const parser1 = create<'A'>(() => failure());
            const parser = optional(parser1);
            const result = parser('ABC');
            expect(result).toEqual([null, 'ABC']);

            assertType<Result<'A' | null>>(result);
        });
    });

    describe('optionalWith', () => {
        const parser1 = createTestParser('A');

        it('should return default value when parser fails', () => {
            const parser = optionalWith(parser1, 'default');
            const result = parser('BCD');
            expect(result).toEqual(['default', 'BCD']);

            assertType<Result<'A' | 'default'>>(result);
        });

        it('should not consume input when parser fails', () => {
            const parser1 = create<'A'>(() => failure());
            const parser = optionalWith(parser1, 'world');
            const result = parser('goodbye');
            expect(result).toEqual(['world', 'goodbye']);

            assertType<Result<'A' | 'world'>>(result);
        });

        it('should handle empty input', () => {
            const parser = optionalWith(parser1, 'empty');
            const result = parser('');
            expect(result).toEqual(['empty', '']);

            assertType<Result<'A' | 'empty'>>(result);
        });

        it('should work with complex default values', () => {
            const parser1 = create<string>(() => failure());
            const parser = optionalWith<
                { default: boolean; value: number } | string
            >(parser1, {
                default: true,
                value: 42,
            });
            const result = parser('y');
            expect(result).toEqual([{ default: true, value: 42 }, 'y']);

            assertType<Result<{ default: boolean; value: number } | string>>(
                result,
            );
        });
    });

    describe('optionalSkip', () => {
        it('should consume input on success', () => {
            const parser1 = createTestParser('A');
            const parser = optionalSkip(parser1);
            const result = parser('ABCD');
            expect(result).toEqual([undefined, 'BCD']);

            assertType<Result<void>>(result);
        });

        it('should not consume input on failure', () => {
            const parser1 = create(() => failure());
            const parser = optionalSkip(parser1);
            const result = parser('ABCD');
            expect(result).toEqual([undefined, 'ABCD']);

            assertType<Result<void>>(result);
        });
    });

    describe('left', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        it('should return the first parser result and ignore the second', () => {
            const parser = left(parser1, parser2);
            const result = parser('AB');
            expect(result).toEqual(['A', '']);

            assertType<Result<'A'>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser = left(parser1, parser2);
            const result = parser('goodbye world');
            expect(result).toBeNull();

            assertType<Result<'A'>>(result);
        });

        it('should fail if second parser fails', () => {
            const parser = left(parser1, parser2);
            const result = parser('hello universe');
            expect(result).toBeNull();

            assertType<Result<'A'>>(result);
        });
    });

    describe('right', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        it('should return the second parser result and ignore the first', () => {
            const parser = right(parser1, parser2);
            const result = parser('AB');
            expect(result).toEqual(['B', '']);

            assertType<Result<'B'>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser = right(parser1, parser2);
            const result = parser('goodbye world');
            expect(result).toBeNull();

            assertType<Result<'B'>>(result);
        });

        it('should fail if second parser fails', () => {
            const parser = right(parser1, parser2);
            const result = parser('hello universe');
            expect(result).toBeNull();

            assertType<Result<'B'>>(result);
        });
    });

    describe('middle', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser3 = createTestParser('C');

        it('should return the middle parser result', () => {
            const parser = middle(parser1, parser2, parser3);
            const result = parser('ABC');
            expect(result).toEqual(['B', '']);

            assertType<Result<'B'>>(result);
        });

        it('should fail if first parser fails', () => {
            const parser = middle(parser1, parser2, parser3);
            const result = parser('[content)');
            expect(result).toBeNull();

            assertType<Result<'B'>>(result);
        });

        it('should fail if middle parser fails', () => {
            const parser = middle(parser1, parser2, parser3);
            const result = parser('(wrong)');
            expect(result).toBeNull();

            assertType<Result<'B'>>(result);
        });

        it('should fail if last parser fails', () => {
            const parser = middle(parser1, parser2, parser3);
            const result = parser('(content]');
            expect(result).toBeNull();

            assertType<Result<'B'>>(result);
        });
    });

    describe('until', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        it('should parse items until terminator is found', () => {
            const parser = until(parser1, parser2);
            const result = parser('AAAABAAAA');
            expect(result).toEqual([['A', 'A', 'A', 'A'], 'BAAAA']);
        });

        it('should return empty array when terminator is at start', () => {
            const parser1 = create(() => failure());
            const parser = until(parser1, parser2);
            const result = parser('BAAAA');
            expect(result).toEqual([[], 'BAAAA']);
        });

        it('should fail when terminator is never found and parser fails', () => {
            const parser = until(parser1, parser2);
            const result = parser('AAAA');
            expect(result).toBeNull();
        });
    });

    describe('lexeme', () => {
        it('should parse a token and consume trailing whitespace', () => {
            const parser1 = createTestParser('A');
            const parser = lexeme(parser1);
            const result = parser('A       B');
            expect(result).toEqual(['A', 'B']);

            assertType<Result<'A'>>(result);
        });

        it('should parse a token with no trailing whitespace', () => {
            const parser1 = createTestParser('A');
            const parser = lexeme(parser1);
            const result = parser('AB');
            expect(result).toEqual(['A', 'B']);

            assertType<Result<'A'>>(result);
        });

        it('should consume various types of whitespace', () => {
            const parser1 = createTestParser('A');
            const parser = lexeme(parser1);
            const result = parser('A \t\n\r  B');
            expect(result).toEqual(['A', 'B']);

            assertType<Result<'A'>>(result);
        });

        it('should fail when the underlying parser fails', () => {
            const parser1 = createTestParser('A');
            const parser = lexeme(parser1);
            const result = parser('B');
            expect(result).toBeNull();

            assertType<Result<'A'>>(result);
        });

        it('should handle empty input after consuming whitespace', () => {
            const parser1 = createTestParser('A');
            const parser = lexeme(parser1);
            const result = parser('A   ');
            expect(result).toEqual(['A', '']);

            assertType<Result<'A'>>(result);
        });
    });

    describe('token', () => {
        it('should parse a symbol and consume trailing whitespace', () => {
            const parser = token('if');
            const result = parser('if   (condition)');
            expect(result).toEqual(['if', '(condition)']);

            assertType<Result<'if'>>(result);
        });

        it('should parse operators with whitespace', () => {
            const parser = token('==');
            const result = parser('==  value');
            expect(result).toEqual(['==', 'value']);

            assertType<Result<'=='>>(result);
        });

        it('should parse punctuation symbols', () => {
            const parser = token('(');
            const result = parser('(  )');
            expect(result).toEqual(['(', ')']);

            assertType<Result<'('>>(result);
        });

        it('should fail when symbol does not match', () => {
            const parser = token('while');
            const result = parser('if (condition)');
            expect(result).toBeNull();

            assertType<Result<'while'>>(result);
        });

        it('should parse symbol with no trailing whitespace', () => {
            const parser = token(';');
            const result = parser(';next');
            expect(result).toEqual([';', 'next']);

            assertType<Result<';'>>(result);
        });

        it('should handle multi-character symbols', () => {
            const parser = token('<=');
            const result = parser('<=  100');
            expect(result).toEqual(['<=', '100']);

            assertType<Result<'<='>>(result);
        });

        it('should work with empty string symbol', () => {
            const parser = token('');
            const result = parser('   anything');
            expect(result).toEqual(['', 'anything']);

            assertType<Result<''>>(result);
        });
    });
});
