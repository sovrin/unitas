import { describe, expect, it } from 'vitest';
import {
    char,
    choice,
    consume,
    lexeme,
    literal,
    oneOf,
    Parser,
    regex,
    sequence,
    skipMany,
    skipMany1,
    until,
} from '../src';
import { anyChar } from '../src/primitives';

describe('terminals', () => {
    describe('until', () => {
        it('should parse items until terminator is found', () => {
            const parser = until(anyChar, char(';'));
            const result = parser('hello;world');
            expect(result).toEqual([['h', 'e', 'l', 'l', 'o'], ';world']);
        });

        it('should return empty array when terminator is at start', () => {
            const parser = until(anyChar, char(';'));
            const result = parser(';hello');
            expect(result).toEqual([[], ';hello']);
        });

        it('should fail when terminator is never found and parser fails', () => {
            const digitParser = oneOf('0123456789');
            const parser = until(digitParser, char(';'));
            const result = parser('123abc'); // 'a' will fail the digit parser
            expect(result).toBeNull();
        });

        it('should handle complex parsers', () => {
            const wordParser = lexeme(regex(/\w+/));
            const parser = until(wordParser, literal('END'));
            const result = parser('hello world test END remaining');
            expect(result).toEqual([['hello', 'world', 'test'], 'END remaining']);
        });

        it('should work with whitespace terminators', () => {
            const letterParser = oneOf('abcdefghijklmnopqrstuvwxyz');
            const parser = until(letterParser, char(' '));
            const result = parser('hello world');
            expect(result).toEqual([['h', 'e', 'l', 'l', 'o'], ' world']);
        });

        it('should handle nested structures', () => {
            const parser = until(choice(char('('), char(')'), oneOf('abcd')), literal('END'));
            const result = parser('a(b)cEND');
            expect(result).toEqual([['a', '(', 'b', ')', 'c'], 'END']);
        });

        it('should work when terminator appears multiple times', () => {
            const parser = until(anyChar, char('.'));
            const result = parser('hello.world.end');
            expect(result).toEqual([['h', 'e', 'l', 'l', 'o'], '.world.end']);
        });

        it('should handle empty input with immediate terminator match', () => {
            const parser = until(anyChar, regex(/^$/)); // matches empty string
            const result = parser('');
            expect(result).toEqual([[], '']);
        });

        it('should parse quoted strings', () => {
            const contentParser = regex(/[^"]/); // anything except quote
            const parser = until(contentParser, char('"'));
            const result = parser('hello world"rest');
            expect(result).toEqual([['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'], '"rest']);
        });

        it('should handle complex terminator patterns', () => {
            const parser = until(anyChar, literal('-->'));
            const result = parser('some comment text-->after');
            expect(result).toEqual([
                ['s', 'o', 'm', 'e', ' ', 'c', 'o', 'm', 'm', 'e', 'n', 't', ' ', 't', 'e', 'x', 't'],
                '-->after',
            ]);
        });
    });

    describe('skipMany', () => {
        it('should skip many occurrences and return null', () => {
            const parser = skipMany(char('a'));
            const result = parser('aaabbb');
            expect(result).toEqual([null, 'bbb']);
        });

        it('should return null even when no matches found', () => {
            const parser = skipMany(char('a'));
            const result = parser('bbb');
            expect(result).toEqual([null, 'bbb']);
        });

        it('should skip all matching characters', () => {
            const parser = skipMany(oneOf(' \t\n'));
            const result = parser('   \t\n  hello');
            expect(result).toEqual([null, 'hello']);
        });

        it('should work with complex parsers', () => {
            const commentParser = sequence(literal('//'), regex(/[^\n]*/), char('\n'));
            const parser = skipMany(commentParser);
            const result = parser('// comment 1\n// comment 2\ncode');
            expect(result).toEqual([null, 'code']);
        });

        it('should handle empty input', () => {
            const parser = skipMany(char('a'));
            const result = parser('');
            expect(result).toEqual([null, '']);
        });

        it('should skip whitespace effectively', () => {
            const whitespace = skipMany(oneOf(' \t\r\n'));
            const result = whitespace('   \t\r\n   actual content');
            expect(result).toEqual([null, 'actual content']);
        });
    });

    describe('skipMany1', () => {
        it('should skip one or more occurrences and return null', () => {
            const parser = skipMany1(char('a'));
            const result = parser('aaabbb');
            expect(result).toEqual([null, 'bbb']);
        });

        it('should fail when no matches found', () => {
            const parser = skipMany1(char('a'));
            const result = parser('bbb');
            expect(result).toBeNull();
        });

        it('should succeed with single match', () => {
            const parser = skipMany1(char('a'));
            const result = parser('abbb');
            expect(result).toEqual([null, 'bbb']);
        });

        it('should work with whitespace', () => {
            const parser = skipMany1(oneOf(' \t'));
            expect(parser('   hello')).toEqual([null, 'hello']);
            expect(parser('hello')).toBeNull();
        });

        it('should handle complex parsers', () => {
            const digitParser = oneOf('0123456789');
            const parser = skipMany1(digitParser);
            expect(parser('123abc')).toEqual([null, 'abc']);
            expect(parser('abc123')).toBeNull();
        });

        it('should require at least one match', () => {
            const parser = skipMany1(literal('test'));
            expect(parser('testtesttest')).toEqual([null, '']);
            expect(parser('testother')).toEqual([null, 'other']);
            expect(parser('other')).toBeNull();
        });
    });

    describe('consume', () => {
        it('should consume parser result and return null', () => {
            const parser = consume(literal('hello'));
            const result = parser('hello world');
            expect(result).toEqual([null, ' world']);
        });

        it('should fail when underlying parser fails', () => {
            const parser = consume(literal('hello'));
            const result = parser('goodbye world');
            expect(result).toBeNull();
        });

        it('should work with complex parsers', () => {
            const numberParser = regex(/\d+/);
            const parser = consume(numberParser);
            const result = parser('12345abc');
            expect(result).toEqual([null, 'abc']);
        });

        it('should consume entire parser result', () => {
            const sequenceParser = sequence(literal('hello'), char(' '), literal('world'));
            const parser = consume(sequenceParser);
            const result = parser('hello world!');
            expect(result).toEqual([null, '!']);
        });

        it('should work with any parser type', () => {
            const choiceParser = choice(literal('yes'), literal('no'), literal('maybe'));
            const parser = consume(choiceParser);
            expect(parser('yes sir')).toEqual([null, ' sir']);
            expect(parser('no way')).toEqual([null, ' way']);
            expect(parser('hello')).toBeNull();
        });

        it('should handle empty matches', () => {
            const emptyParser = regex(/\d*/); // matches zero or more digits
            const parser = consume(emptyParser);
            const result = parser('abc');
            expect(result).toEqual([null, 'abc']); // empty match consumed
        });
    });

    describe('integration tests', () => {
        it('should combine until with skip operations', () => {
            // Parse content until a terminator, skipping whitespace
            const contentParser = sequence(
                skipMany(oneOf(' \t')), // skip leading whitespace
                until(
                    choice(regex(/\w/), oneOf(' \t')), // words and whitespace
                    char(';'),
                ),
                consume(char(';')), // consume the semicolon
            );

            const result = contentParser('  hello world ;rest');
            expect(result).toEqual([
                [null, ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' '], null],
                'rest',
            ]);
        });

        it('should parse C-style comments', () => {
            const singleLineComment = sequence(literal('//'), until(anyChar, choice(char('\n'), regex(/$/))));

            const result = singleLineComment('// this is a comment\ncode');
            expect(result).toEqual([
                ['//', [' ', 't', 'h', 'i', 's', ' ', 'i', 's', ' ', 'a', ' ', 'c', 'o', 'm', 'm', 'e', 'n', 't']],
                '\ncode',
            ]);
        });

        it('should parse quoted strings with escapes', () => {
            // Simple version - parse until closing quote
            const stringContent = until(
                choice(
                    sequence<any>(char('\\'), anyChar), // escaped character
                    regex(/[^"\\]/), // any character except quote or backslash
                ),
                char('"'),
            );

            const result = stringContent('hello \\"world\\"!"remaining');
            expect(result).toEqual([
                ['h', 'e', 'l', 'l', 'o', ' ', ['\\', '"'], 'w', 'o', 'r', 'l', 'd', ['\\', '"'], '!'],
                '"remaining',
            ]);
        });

        it('should implement a simple lexer pattern', () => {
            // Skip whitespace, then consume a token
            const token = (tokenParser: Parser) => sequence(skipMany(oneOf(' \t\n\r')), tokenParser);

            const identifier = token(regex(/[a-zA-Z][a-zA-Z0-9]*/));
            const number = token(regex(/\d+/));
            const operator = token(oneOf('+-*/'));

            expect(identifier('  hello  ')).toEqual([[null, 'hello'], '  ']);
            expect(number('\n\t42\n')).toEqual([[null, '42'], '\n']);
            expect(operator('  +  ')).toEqual([[null, '+'], '  ']);
        });

        it('should parse until multiple possible terminators', () => {
            const terminators = choice(char(';'), char(','), char('\n'));
            const parser = until(regex(/[^\s;,\n]/), terminators);

            expect(parser('hello;world')).toEqual([['h', 'e', 'l', 'l', 'o'], ';world']);
            expect(parser('test,more')).toEqual([['t', 'e', 's', 't'], ',more']);
            expect(parser('line\nnext')).toEqual([['l', 'i', 'n', 'e'], '\nnext']);
        });
    });
});
