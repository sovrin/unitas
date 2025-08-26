import { describe, expect, it } from 'vitest';
import {
    char,
    fail,
    first,
    last,
    literal,
    many,
    map,
    nth,
    oneOf,
    reduce,
    reduceRight,
    regex,
    sepBy,
    sequence,
} from '../src';

describe('functional', () => {
    describe('first', () => {
        it('should return first element of array parser result', () => {
            const arrayParser = map(sequence(literal('a'), literal('b'), literal('c')), (arr) => arr);
            const parser = first(arrayParser);
            const result = parser('abc');
            expect(result).toEqual(['a', '']);
        });

        it('should return undefined for empty array', () => {
            const emptyArrayParser = map(many(literal('x')), (arr) => arr);
            const parser = first(emptyArrayParser);
            const result = parser('abc');
            expect(result).toEqual([undefined, 'abc']);
        });

        it('should work with many parser', () => {
            const parser = first(many(char('a')));
            expect(parser('aaabbb')).toEqual(['a', 'bbb']);
            expect(parser('bbb')).toEqual([undefined, 'bbb']);
        });

        it('should work with single element array', () => {
            const singleParser = map(literal('hello'), (s) => [s]);
            const parser = first(singleParser);
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should handle complex array structures', () => {
            const numbersParser = many(map(regex(/\d/), parseInt));
            const parser = first(numbersParser);
            expect(parser('123abc')).toEqual([1, 'abc']);
            expect(parser('abc')).toEqual([undefined, 'abc']);
        });
    });

    describe('last', () => {
        it('should return last element of array parser result', () => {
            const arrayParser = map(sequence(literal('a'), literal('b'), literal('c')), (arr) => arr);
            const parser = last(arrayParser);
            const result = parser('abc');
            expect(result).toEqual(['c', '']);
        });

        it('should return undefined for empty array', () => {
            const emptyArrayParser = map(many(literal('x')), (arr) => arr);
            const parser = last(emptyArrayParser);
            const result = parser('abc');
            expect(result).toEqual([undefined, 'abc']);
        });

        it('should work with many parser', () => {
            const parser = last(many(char('a')));
            expect(parser('aaabbb')).toEqual(['a', 'bbb']);
            expect(parser('bbb')).toEqual([undefined, 'bbb']);
        });

        it('should work with single element array', () => {
            const singleParser = map(literal('hello'), (s) => [s]);
            const parser = last(singleParser);
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should handle complex array structures', () => {
            const numbersParser = many(map(regex(/\d/), parseInt));
            const parser = last(numbersParser);
            expect(parser('123abc')).toEqual([3, 'abc']);
            expect(parser('abc')).toEqual([undefined, 'abc']);
        });
    });

    describe('nth', () => {
        it('should return element at specified index', () => {
            const arrayParser = map(sequence(literal('a'), literal('b'), literal('c')), (arr) => arr);

            expect(nth(arrayParser, 0)('abc')).toEqual(['a', '']);
            expect(nth(arrayParser, 1)('abc')).toEqual(['b', '']);
            expect(nth(arrayParser, 2)('abc')).toEqual(['c', '']);
        });

        it('should return undefined for out-of-bounds index', () => {
            const arrayParser = map(sequence(literal('a'), literal('b')), (arr) => arr);

            expect(nth(arrayParser, 5)('ab')).toEqual([undefined, '']);
            expect(nth(arrayParser, -1)('ab')).toEqual([undefined, '']);
        });

        it('should work with negative indices (JavaScript behavior)', () => {
            const arrayParser = map(sequence(literal('a'), literal('b'), literal('c')), (arr) => arr);

            // JavaScript arrays return undefined for negative indices
            expect(nth(arrayParser, -1)('abc')).toEqual([undefined, '']);
        });

        it('should work with many parser', () => {
            const numbersParser = many(map(regex(/\d/), parseInt));

            expect(nth(numbersParser, 0)('123abc')).toEqual([1, 'abc']);
            expect(nth(numbersParser, 1)('123abc')).toEqual([2, 'abc']);
            expect(nth(numbersParser, 2)('123abc')).toEqual([3, 'abc']);
            expect(nth(numbersParser, 3)('123abc')).toEqual([undefined, 'abc']);
        });

        it('should handle empty arrays', () => {
            const emptyParser = map(many(literal('x')), (arr) => arr);
            expect(nth(emptyParser, 0)('abc')).toEqual([undefined, 'abc']);
        });
    });

    describe('reduce', () => {
        it('should fold left over parsed items', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduce(digitParser, 0, (acc, digit) => acc + digit);

            const result = parser('123abc');
            expect(result).toEqual([6, 'abc']); // 0 + 1 + 2 + 3
        });

        it('should work with empty input (return initial value)', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduce(digitParser, 42, (acc, digit) => acc + digit);

            const result = parser('abc');
            expect(result).toEqual([42, 'abc']);
        });

        it('should handle string concatenation', () => {
            const letterParser = oneOf('abcdefghijklmnopqrstuvwxyz');
            const parser = reduce(letterParser, '', (acc, char) => acc + char.toUpperCase());

            const result = parser('hello123');
            expect(result).toEqual(['HELLO', '123']);
        });

        it('should work with complex accumulator types', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduce(digitParser, { sum: 0, count: 0 }, (acc, digit) => ({
                sum: acc.sum + digit,
                count: acc.count + 1,
            }));

            const result = parser('123abc');
            expect(result).toEqual([{ sum: 6, count: 3 }, 'abc']);
        });

        it('should handle single item', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduce(digitParser, 10, (acc, digit) => acc * digit);

            const result = parser('5abc');
            expect(result).toEqual([50, 'abc']); // 10 * 5
        });

        it('should work with array building', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduce(digitParser, [] as number[], (acc, digit) => [...acc, digit * 2]);

            const result = parser('123abc');
            expect(result).toEqual([[2, 4, 6], 'abc']);
        });

        it('should fail when reduce parser fails', () => {
            const parser = reduce(fail(), 0, (acc, _) => acc + 1);
            const result = parser('abc'); // no 'x' characters
            expect(result).toBe(null);
        });
    });

    describe('reduceRight', () => {
        it('should fold right over parsed items', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduceRight(digitParser, 0, (digit, acc) => digit - acc);

            const result = parser('123abc');
            // Right fold: 1 - (2 - (3 - 0)) = 1 - (2 - 3) = 1 - (-1) = 2
            expect(result).toEqual([2, 'abc']);
        });

        it('should work with empty input (return initial value)', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduceRight(digitParser, 42, (digit, acc) => digit + acc);

            const result = parser('abc');
            expect(result).toEqual([42, 'abc']);
        });

        it('should handle string building (right associative)', () => {
            const letterParser = oneOf('abcdefghijklmnopqrstuvwxyz');
            const parser = reduceRight(letterParser, '', (char, acc) => char + acc);

            const result = parser('hello123');
            expect(result).toEqual(['hello', '123']); // Builds string from right
        });

        it('should demonstrate difference from reduce', () => {
            const digitParser = map(regex(/\d/), parseInt);

            const reduceParser = reduce(digitParser, [], (acc, digit) => [...acc, digit] as any);
            const reduceRightParser = reduceRight(digitParser, [], (digit, acc) => [digit, ...acc] as any);

            expect(reduceParser('123abc')).toEqual([[1, 2, 3], 'abc']);
            expect(reduceRightParser('123abc')).toEqual([[1, 2, 3], 'abc']);

            // Better example showing the difference
            const reduceSub = reduce(digitParser, 0, (acc, digit) => acc - digit);
            const reduceRightSub = reduceRight(digitParser, 0, (digit, acc) => digit - acc);

            expect(reduceSub('123abc')).toEqual([-6, 'abc']); // ((0-1)-2)-3 = -6
            expect(reduceRightSub('123abc')).toEqual([2, 'abc']); // 1-(2-(3-0)) = 2
        });

        it('should work with complex operations', () => {
            const digitParser = map(regex(/\d/), parseInt);
            const parser = reduceRight(digitParser, { value: 1, multiplier: 1 }, (digit, acc) => ({
                value: digit * acc.multiplier + acc.value,
                multiplier: acc.multiplier * 10,
            }));

            const result = parser('123abc');
            // Right fold builds number: 3*1 + (2*10 + (1*100 + 1)) = 3 + (20 + 101) = 124
            expect(result).toEqual([{ value: 124, multiplier: 1000 }, 'abc']);
        });
    });

    describe('integration tests', () => {
        it('should combine first with sequence parsing', () => {
            const csvRow = sepBy(regex(/[^,]+/), literal(','));
            const firstColumn = first(csvRow);

            const result = firstColumn('name,age,city rest');
            expect(result).toEqual(['name', '']);
        });

        it('should use nth to extract specific elements', () => {
            const numbers = many(map(regex(/\d/), parseInt));
            const thirdDigit = nth(numbers, 2);

            expect(thirdDigit('12345abc')).toEqual([3, 'abc']);
        });

        it('should combine reduce operations', () => {
            const digitParser = map(regex(/\d/), parseInt);

            // Calculate both sum and product
            const sumParser = reduce(digitParser, 0, (acc, digit) => acc + digit);
            const productParser = reduce(digitParser, 1, (acc, digit) => acc * digit);

            expect(sumParser('123abc')).toEqual([6, 'abc']);
            expect(productParser('123abc')).toEqual([6, 'abc']);
        });

        it('should work with complex parser combinations', () => {
            // Parse a list of numbers and get statistics
            const numberParser = map(regex(/\d+/), parseInt);
            const numbersParser = sepBy(numberParser, literal(','));

            const sum = reduce(numbersParser, 0, (acc, digit) => {
                return acc + digit.reduce((sum, num) => sum + num, 0);
            });
            const count = map(numbersParser, (arr) => arr.length);
            const firstNum = first(numbersParser);
            const lastNum = last(numbersParser);

            const input = '10,20,30,40';
            expect(sum(input)).toEqual([100, '']);
            expect(count(input)).toEqual([4, '']);
            expect(firstNum(input)).toEqual([10, '']);
            expect(lastNum(input)).toEqual([40, '']);
        });
    });
});
