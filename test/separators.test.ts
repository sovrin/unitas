import { describe, expect, it } from 'vitest';
import {
    char,
    delimited,
    delimitedBy,
    endBy,
    endBy1,
    interleaved,
    lexeme,
    literal,
    map,
    regex,
    sepBy,
    sepBy1,
    sepEndBy,
    sepEndBy1,
} from '../src';
import { identifier, naturalNumber } from '../src/primitives';

describe('separators', () => {
    describe('sepBy', () => {
        it('should parse zero elements when first parser fails', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('abc')).toEqual([[], 'abc']);
        });

        it('should parse single element without separator', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('42abc')).toEqual([[42], 'abc']);
        });

        it('should parse multiple elements separated by separator', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('1,2,3,4')).toEqual([[1, 2, 3, 4], '']);
        });

        it('should handle trailing separator by not consuming it', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('1,2,3,')).toEqual([[1, 2, 3], ',']);
        });

        it('should handle separator without following element', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('1,2,abc')).toEqual([[1, 2], ',abc']);
        });

        it('should work with string parsers', () => {
            const parser = sepBy(identifier, literal(' '));
            expect(parser('hello world test')).toEqual([['hello', 'world', 'test'], '']);
        });

        it('should handle complex separators', () => {
            const parser = sepBy(naturalNumber, literal(' AND '));
            expect(parser('1 AND 2 AND 3')).toEqual([[1, 2, 3], '']);
        });

        it('should backtrack properly on separator match but parser fail', () => {
            const parser = sepBy(naturalNumber, char(','));
            expect(parser('1,2,x')).toEqual([[1, 2], ',x']);
        });
    });

    describe('sepBy1', () => {
        it('should require at least one element', () => {
            const parser = sepBy1(naturalNumber, char(','));
            expect(parser('abc')).toBeNull();
        });

        it('should parse single element', () => {
            const parser = sepBy1(naturalNumber, char(','));
            expect(parser('42abc')).toEqual([[42], 'abc']);
        });

        it('should parse multiple elements', () => {
            const parser = sepBy1(naturalNumber, char(','));
            expect(parser('1,2,3,4')).toEqual([[1, 2, 3, 4], '']);
        });

        it('should handle trailing separator', () => {
            const parser = sepBy1(naturalNumber, char(','));
            expect(parser('1,2,3,')).toEqual([[1, 2, 3], ',']);
        });

        it('should work with different types', () => {
            const parser = sepBy1(identifier, literal(' | '));
            expect(parser('first | second | third')).toEqual([['first', 'second', 'third'], '']);
        });

        it('should fail on empty input', () => {
            const parser = sepBy1(naturalNumber, char(','));
            expect(parser('')).toBeNull();
        });
    });

    describe('sepEndBy', () => {
        it('should parse empty list', () => {
            const parser = sepEndBy(naturalNumber, char(','));
            expect(parser('abc')).toEqual([[], 'abc']);
        });

        it('should parse elements without trailing separator', () => {
            const parser = sepEndBy(naturalNumber, char(','));
            expect(parser('1,2,3')).toEqual([[1, 2, 3], '']);
        });

        it('should parse elements with trailing separator', () => {
            const parser = sepEndBy(naturalNumber, char(','));
            expect(parser('1,2,3,')).toEqual([[1, 2, 3], '']);
        });

        it('should handle single element with separator', () => {
            const parser = sepEndBy(naturalNumber, char(','));
            expect(parser('42,')).toEqual([[42], '']);
        });

        it('should handle single element without separator', () => {
            const parser = sepEndBy(naturalNumber, char(','));
            expect(parser('42abc')).toEqual([[42], 'abc']);
        });

        it('should work with complex patterns', () => {
            const parser = sepEndBy(identifier, literal(';'));
            expect(parser('first;second;third;')).toEqual([['first', 'second', 'third'], '']);
            expect(parser('first;second;third')).toEqual([['first', 'second', 'third'], '']);
        });
    });

    describe('sepEndBy1', () => {
        it('should require at least one element', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('abc')).toBeNull();
        });

        it('should parse single element without separator', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('42abc')).toEqual([[42], 'abc']);
        });

        it('should parse single element with separator', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('42,')).toEqual([[42], '']);
        });

        it('should parse multiple elements with trailing separator', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('1,2,3,')).toEqual([[1, 2, 3], '']);
        });

        it('should parse multiple elements without trailing separator', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('1,2,3')).toEqual([[1, 2, 3], '']);
        });

        it('should fail on empty input', () => {
            const parser = sepEndBy1(naturalNumber, char(','));
            expect(parser('')).toBeNull();
        });
    });

    describe('endBy', () => {
        it('should parse elements each followed by terminator', () => {
            const parser = endBy(naturalNumber, char(';'));
            expect(parser('1;2;3;')).toEqual([[1, 2, 3], '']);
        });

        it('should parse empty list when no elements', () => {
            const parser = endBy(naturalNumber, char(';'));
            expect(parser('abc')).toEqual([[], 'abc']);
        });

        it('should require terminator after each element', () => {
            const parser = endBy(naturalNumber, char(';'));
            expect(parser('1;2;3')).toEqual([[1, 2], '3']);
        });

        it('should handle single element with terminator', () => {
            const parser = endBy(naturalNumber, char(';'));
            expect(parser('42;')).toEqual([[42], '']);
        });

        it('should work with complex terminators', () => {
            const parser = endBy(regex(/first|second/), lexeme(literal(' END')));
            expect(parser('first END second END')).toEqual([['first', 'second'], '']);
        });

        it('should handle empty input', () => {
            const parser = endBy(naturalNumber, char(';'));
            expect(parser('')).toEqual([[], '']);
        });
    });

    describe('endBy1', () => {
        it('should require at least one element', () => {
            const parser = endBy1(naturalNumber, char(';'));
            expect(parser('abc')).toBeNull();
        });

        it('should parse single element with terminator', () => {
            const parser = endBy1(naturalNumber, char(';'));
            expect(parser('42;')).toEqual([[42], '']);
        });

        it('should parse multiple elements each with terminator', () => {
            const parser = endBy1(naturalNumber, char(';'));
            expect(parser('1;2;3;')).toEqual([[1, 2, 3], '']);
        });

        it('should fail when element lacks terminator', () => {
            const parser = endBy1(naturalNumber, char(';'));
            expect(parser('1;2;3')).toEqual([[1, 2], '3']);
        });

        it('should fail on empty input', () => {
            const parser = endBy1(naturalNumber, char(';'));
            expect(parser('')).toBeNull();
        });

        it('should work with string elements', () => {
            const parser = endBy1(identifier, literal(';\n'));
            expect(parser('first;\nsecond;\n')).toEqual([['first', 'second'], '']);
        });
    });

    describe('interleaved', () => {
        it('should parse alternating items and separators', () => {
            const parser = interleaved(naturalNumber, char(','));
            expect(parser('1,2,3,4')).toEqual([[1, ',', 2, ',', 3, ',', 4], '']);
        });

        it('should handle single item', () => {
            const parser = interleaved(naturalNumber, char(','));
            expect(parser('42abc')).toEqual([[42], 'abc']);
        });

        it('should handle empty input', () => {
            const parser = interleaved(naturalNumber, char(','));
            expect(parser('abc')).toEqual([[], 'abc']);
        });

        it('should stop when separator has no following item', () => {
            const parser = interleaved(naturalNumber, char(','));
            expect(parser('1,2,abc')).toEqual([[1, ',', 2], ',abc']);
        });

        it('should preserve separator values', () => {
            const parser = interleaved(identifier, literal(' AND '));
            expect(parser('first AND second AND third')).toEqual([['first', ' AND ', 'second', ' AND ', 'third'], '']);
        });

        it('should work with complex separators', () => {
            const operatorParser = map(regex(/[+\-*/]/), (op) => op);
            const parser = interleaved(naturalNumber, operatorParser);
            expect(parser('1+2*3-4')).toEqual([[1, '+', 2, '*', 3, '-', 4], '']);
        });
    });

    describe('delimited', () => {
        it('should parse separated elements followed by terminator', () => {
            const parser = delimited(naturalNumber, char(','), char(';'));
            expect(parser('1,2,3;')).toEqual([[1, 2, 3], '']);
        });

        it('should handle single element with terminator', () => {
            const parser = delimited(naturalNumber, char(','), char(';'));
            expect(parser('42;')).toEqual([[42], '']);
        });

        it('should handle empty list with terminator', () => {
            const parser = delimited(naturalNumber, char(','), char(';'));
            expect(parser(';')).toEqual([[], '']);
        });

        it('should fail without terminator', () => {
            const parser = delimited(naturalNumber, char(','), char(';'));
            expect(parser('1,2,3')).toBeNull();
        });

        it('should work with complex patterns', () => {
            const parser = delimited(identifier, literal(' | '), literal(' END'));
            expect(parser('first | second | third END')).toEqual([['first', 'second', 'third'], '']);
        });

        it('should fail on malformed input', () => {
            const parser = delimited(naturalNumber, char(','), char(';'));
            expect(parser('1,2,abc;')).toBeNull();
        });
    });

    describe('delimitedBy', () => {
        it('should parse content between delimiters', () => {
            const parser = delimitedBy('(', ')', naturalNumber);
            expect(parser('(42)')).toEqual([42, '']);
        });

        it('should work with string content', () => {
            const contentParser = regex(/[^)]*/);
            const parser = delimitedBy('(', ')', contentParser);
            expect(parser('(hello world)')).toEqual(['hello world', '']);
        });

        it('should fail with mismatched delimiters', () => {
            const parser = delimitedBy('(', ')', naturalNumber);
            expect(parser('(42]')).toBeNull();
        });

        it('should handle different delimiter types', () => {
            const contentParser = regex(/\w+/);
            expect(delimitedBy('{', '}', contentParser)('{content}')).toEqual(['content', '']);
            expect(delimitedBy('[', ']', contentParser)('[content]')).toEqual(['content', '']);
            expect(delimitedBy('"', '"', contentParser)('"content"')).toEqual(['content', '']);
        });

        it('should handle empty content', () => {
            const contentParser = regex(/[^)]*/);
            const parser = delimitedBy('(', ')', contentParser);
            expect(parser('()')).toEqual(['', '']);
        });

        it('should work with complex delimiters', () => {
            const contentParser = regex(/[^>]*/);
            const parser = delimitedBy('<<', '>>', contentParser);
            expect(parser('<<content>>')).toEqual(['content', '']);
        });
    });

    describe('integration tests', () => {
        it('should parse CSV-like data', () => {
            const csvParser = sepBy(regex(/[^,\n]+/), char(','));

            expect(csvParser('name,age,city')).toEqual([['name', 'age', 'city'], '']);
            expect(csvParser('John,30,NYC')).toEqual([['John', '30', 'NYC'], '']);
        });

        it('should parse function call syntax', () => {
            const argParser = sepBy(identifier, literal(', '));
            const funcCallParser = delimitedBy('(', ')', argParser);

            expect(funcCallParser('()')).toEqual([[], '']);
            expect(funcCallParser('(arg1)')).toEqual([['arg1'], '']);
            expect(funcCallParser('(arg1, arg2, arg3)')).toEqual([['arg1', 'arg2', 'arg3'], '']);
        });

        it('should parse array literals', () => {
            const arrayParser = delimitedBy('[', ']', sepBy(naturalNumber, literal(', ')));

            expect(arrayParser('[]')).toEqual([[], '']);
            expect(arrayParser('[1]')).toEqual([[1], '']);
            expect(arrayParser('[1, 2, 3]')).toEqual([[1, 2, 3], '']);
        });

        it('should parse statement lists', () => {
            const statementParser = endBy(identifier, char(';'));

            expect(statementParser('stmt1;stmt2;stmt3;')).toEqual([['stmt1', 'stmt2', 'stmt3'], '']);
            expect(statementParser('')).toEqual([[], '']);
        });

        it('should parse mathematical expressions with interleaved operators', () => {
            const numberParser = naturalNumber;
            const operatorParser = map(regex(/[+\-]/), (op) => op);
            const exprParser = interleaved(numberParser, operatorParser);

            expect(exprParser('1+2-3+4')).toEqual([[1, '+', 2, '-', 3, '+', 4], '']);
        });

        it('should handle nested delimited structures', () => {
            const innerParser = sepBy(naturalNumber, char(','));
            const outerParser = delimitedBy('(', ')', innerParser);
            const listParser = sepBy(outerParser, char(' '));

            expect(listParser('(1,2) (3,4) (5,6)')).toEqual([
                [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                ],
                '',
            ]);
        });

        it('should parse key-value pairs', () => {
            const charBlock = regex(/\w+/);
            const keyValueParser = map(sepBy(charBlock, char('=')), ([key, value]) => ({ key, value }));
            const pairsParser = sepBy(keyValueParser, char('&'));

            expect(pairsParser('name=John&age=123')).toEqual([
                [
                    { key: 'name', value: 'John' },
                    { key: 'age', value: '123' },
                ],
                '',
            ]);
        });
    });
});
