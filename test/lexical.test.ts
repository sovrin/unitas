import { describe, expect, it } from 'vitest';
import { char, lexeme, literal, symbol } from '../src';

describe('lexical', () => {
    describe('lexeme', () => {
        it('should parse a token and consume trailing whitespace', () => {
            const parser = lexeme(literal('hello'));
            const result = parser('hello   world');

            expect(result).toEqual(['hello', 'world']);
        });

        it('should parse a token with no trailing whitespace', () => {
            const parser = lexeme(literal('hello'));
            const result = parser('helloworld');

            expect(result).toEqual(['hello', 'world']);
        });

        it('should consume various types of whitespace', () => {
            const parser = lexeme(literal('test'));
            const result = parser('test \t\n\r  remaining');

            expect(result).toEqual(['test', 'remaining']);
        });

        it('should fail when the underlying parser fails', () => {
            const parser = lexeme(literal('hello'));
            const result = parser('world');

            expect(result).toBeNull();
        });

        it('should work with character parsers', () => {
            const parser = lexeme(char('a'));
            const result = parser('a   b');

            expect(result).toEqual(['a', 'b']);
        });

        it('should handle empty input after consuming whitespace', () => {
            const parser = lexeme(literal('end'));
            const result = parser('end   ');

            expect(result).toEqual(['end', '']);
        });
    });

    describe('symbol', () => {
        it('should parse a symbol and consume trailing whitespace', () => {
            const parser = symbol('if');
            const result = parser('if   (condition)');

            expect(result).toEqual(['if', '(condition)']);
        });

        it('should parse operators with whitespace', () => {
            const parser = symbol('==');
            const result = parser('==  value');

            expect(result).toEqual(['==', 'value']);
        });

        it('should parse punctuation symbols', () => {
            const parser = symbol('(');
            const result = parser('(  )');

            expect(result).toEqual(['(', ')']);
        });

        it('should fail when symbol does not match', () => {
            const parser = symbol('while');
            const result = parser('if (condition)');

            expect(result).toBeNull();
        });

        it('should parse symbol with no trailing whitespace', () => {
            const parser = symbol(';');
            const result = parser(';next');

            expect(result).toEqual([';', 'next']);
        });

        it('should handle multi-character symbols', () => {
            const parser = symbol('<=');
            const result = parser('<=  100');

            expect(result).toEqual(['<=', '100']);
        });

        it('should work with empty string symbol', () => {
            const parser = symbol('');
            const result = parser('   anything');

            expect(result).toEqual(['', 'anything']);
        });
    });

    describe('lexeme and symbol integration', () => {
        it('should allow chaining multiple symbols', () => {
            const ifParser = symbol('if');
            const openParen = symbol('(');

            let remaining = 'if   (   condition   )   body';

            const ifResult = ifParser(remaining);
            expect(ifResult).toBeTruthy();
            expect(ifResult![0]).toBe('if');
            remaining = ifResult![1];

            const openResult = openParen(remaining);
            expect(openResult).toBeTruthy();
            expect(openResult![0]).toBe('(');
            remaining = openResult![1];

            expect(remaining).toBe('condition   )   body');
        });

        it('should handle mixed lexemes and symbols', () => {
            const numberParser = lexeme(literal('123'));
            const plusSymbol = symbol('+');

            let remaining = '123   +   456';

            const numResult = numberParser(remaining);
            expect(numResult).toBeTruthy();
            expect(numResult![0]).toBe('123');
            remaining = numResult![1];

            const plusResult = plusSymbol(remaining);
            expect(plusResult).toBeTruthy();
            expect(plusResult![0]).toBe('+');
            expect(plusResult![1]).toBe('456');
        });
    });
});
