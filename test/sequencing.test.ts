import { describe, expect, it } from 'vitest';
import {
    after,
    before,
    between,
    char,
    left,
    lexeme,
    literal,
    middle,
    regex,
    right,
    sequence,
    surrounded,
} from '../src';

describe('sequencing', () => {
    describe('left', () => {
        it('should return the first parser result and ignore the second', () => {
            const parser = left(literal('hello'), literal(' world'));
            const result = parser('hello world');

            expect(result).toEqual(['hello', '']);
        });

        it('should fail if first parser fails', () => {
            const parser = left(literal('hello'), literal(' world'));
            const result = parser('goodbye world');

            expect(result).toBeNull();
        });

        it('should fail if second parser fails', () => {
            const parser = left(literal('hello'), literal(' world'));
            const result = parser('hello universe');

            expect(result).toBeNull();
        });

        it('should work with character parsers', () => {
            const parser = left(char('a'), char('b'));
            const result = parser('abc');

            expect(result).toEqual(['a', 'c']);
        });
    });

    describe('right', () => {
        it('should return the second parser result and ignore the first', () => {
            const parser = right(literal('hello'), literal(' world'));
            const result = parser('hello world');

            expect(result).toEqual([' world', '']);
        });

        it('should fail if first parser fails', () => {
            const parser = right(literal('hello'), literal(' world'));
            const result = parser('goodbye world');

            expect(result).toBeNull();
        });

        it('should fail if second parser fails', () => {
            const parser = right(literal('hello'), literal(' world'));
            const result = parser('hello universe');

            expect(result).toBeNull();
        });

        it('should work with character parsers', () => {
            const parser = right(char('a'), char('b'));
            const result = parser('abc');

            expect(result).toEqual(['b', 'c']);
        });
    });

    describe('middle', () => {
        it('should return the middle parser result', () => {
            const parser = middle(char('('), literal('content'), char(')'));
            const result = parser('(content)');

            expect(result).toEqual(['content', '']);
        });

        it('should fail if first parser fails', () => {
            const parser = middle(char('('), literal('content'), char(')'));
            const result = parser('[content)');

            expect(result).toBeNull();
        });

        it('should fail if middle parser fails', () => {
            const parser = middle(char('('), literal('content'), char(')'));
            const result = parser('(wrong)');

            expect(result).toBeNull();
        });

        it('should fail if last parser fails', () => {
            const parser = middle(char('('), literal('content'), char(')'));
            const result = parser('(content]');

            expect(result).toBeNull();
        });

        it('should work with different types', () => {
            const parser = middle(literal('start'), char('x'), literal('end'));
            const result = parser('startxend');

            expect(result).toEqual(['x', '']);
        });
    });

    describe('between', () => {
        it('should parse content between delimiters', () => {
            const parser = between(char('('), literal('value'), char(')'));
            const result = parser('(value)');

            expect(result).toEqual(['value', '']);
        });

        it('should work with quotes', () => {
            const parser = between(char('"'), literal('text'), char('"'));
            const result = parser('"text"');

            expect(result).toEqual(['text', '']);
        });

        it('should fail if opening delimiter fails', () => {
            const parser = between(char('['), literal('content'), char(']'));
            const result = parser('(content]');

            expect(result).toBeNull();
        });

        it('should fail if content fails', () => {
            const parser = between(char('['), literal('expected'), char(']'));
            const result = parser('[wrong]');

            expect(result).toBeNull();
        });

        it('should fail if closing delimiter fails', () => {
            const parser = between(char('['), literal('content'), char(']'));
            const result = parser('[content)');

            expect(result).toBeNull();
        });

        it('should leave remaining input', () => {
            const parser = between(char('{'), literal('data'), char('}'));
            const result = parser('{data} more');

            expect(result).toEqual(['data', ' more']);
        });
    });

    describe('surrounded', () => {
        it('should parse content surrounded by same delimiter', () => {
            const parser = surrounded(char('"'), literal('quoted'));
            const result = parser('"quoted"');

            expect(result).toEqual(['quoted', '']);
        });

        it('should work with single quotes', () => {
            const parser = surrounded(char("'"), literal('text'));
            const result = parser("'text'");

            expect(result).toEqual(['text', '']);
        });

        it('should work with asterisks', () => {
            const parser = surrounded(char('*'), literal('bold'));
            const result = parser('*bold*');

            expect(result).toEqual(['bold', '']);
        });

        it('should fail if opening delimiter fails', () => {
            const parser = surrounded(char('"'), literal('content'));
            const result = parser('\'content"');

            expect(result).toBeNull();
        });

        it('should fail if content fails', () => {
            const parser = surrounded(char('"'), literal('expected'));
            const result = parser('"wrong"');

            expect(result).toBeNull();
        });

        it('should fail if closing delimiter fails', () => {
            const parser = surrounded(char('"'), literal('content'));
            const result = parser('"content\'');

            expect(result).toBeNull();
        });

        it('should leave remaining input', () => {
            const parser = surrounded(char('|'), literal('pipe'));
            const result = parser('|pipe| rest');

            expect(result).toEqual(['pipe', ' rest']);
        });
    });

    describe('before', () => {
        it('should work the same as left', () => {
            const leftParser = left(literal('first'), literal('second'));
            const beforeParser = before(literal('first'), literal('second'));
            const input = 'firstsecond';

            const leftResult = leftParser(input);
            const beforeResult = beforeParser(input);

            expect(beforeResult).toEqual(leftResult);
            expect(beforeResult).toEqual(['first', '']);
        });

        it('should parse A and ignore B', () => {
            const parser = before(char('x'), char('y'));
            const result = parser('xyz');

            expect(result).toEqual(['x', 'z']);
        });
    });

    describe('after', () => {
        it('should work the same as right', () => {
            const rightParser = right(literal('first'), literal('second'));
            const afterParser = after(literal('first'), literal('second'));
            const input = 'firstsecond';

            const rightResult = rightParser(input);
            const afterResult = afterParser(input);

            expect(afterResult).toEqual(rightResult);
            expect(afterResult).toEqual(['second', '']);
        });

        it('should ignore A and parse B', () => {
            const parser = after(char('x'), char('y'));
            const result = parser('xyz');

            expect(result).toEqual(['y', 'z']);
        });
    });

    describe('integration tests', () => {
        it('should combine multiple sequencing operations', () => {
            // Parse JSON-like object: {"key": "value"}
            const openBrace = char('{');
            const closeBrace = char('}');
            const quote = char('"');
            const colon = lexeme(char(':'));

            const key = surrounded(quote, regex(/\w+/));
            const value = surrounded(quote, regex(/\w+/));
            const pair = sequence(key, right(colon, value));
            const object = between(openBrace, pair, closeBrace);

            const result = object('{"key": "value"}');
            expect(result).toEqual([['key', 'value'], '']);
        });

        it('should handle nested structures', () => {
            // Parse (content) with extra text
            const innerParser = between(char('('), literal('inner'), char(')'));
            const outerParser = between(char('['), innerParser, char(']'));

            const result = outerParser('[(inner)]');
            expect(result).toEqual(['inner', '']);
        });

        it('should work with complex delimiter combinations', () => {
            // Parse HTML-like tags: <tag>content</tag>
            const openTag = between(char('<'), literal('div'), char('>'));
            const closeTag = literal('</div>');
            const content = literal('Hello World');

            const htmlParser = middle(openTag, content, closeTag);
            const result = htmlParser('<div>Hello World</div>');

            expect(result).toEqual(['Hello World', '']);
        });

        it('should handle multiple before/after operations', () => {
            // Parse: prefix_main_suffix and return only main
            const prefix = literal('prefix_');
            const main = literal('main');
            const suffix = literal('_suffix');

            const parser = before(after(prefix, main), suffix);
            const result = parser('prefix_main_suffix');

            expect(result).toEqual(['main', '']);
        });
    });
});
