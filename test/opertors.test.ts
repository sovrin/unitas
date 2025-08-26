import { describe, expect, it } from 'vitest';
import { chainl, chainl1, chainr, chainr1, char, choice, leftAssoc, literal, map, postfix, prefix, regex, rightAssoc, sequence, } from '../src';
import { naturalNumber } from '../src/primitives';

describe('operators', () => {
    // Helper parsers for testing
    const numberParser = naturalNumber;

    const addOp = map(char('+'), () => (a: number, b: number) => a + b);
    const subOp = map(char('-'), () => (a: number, b: number) => a - b);
    const mulOp = map(char('*'), () => (a: number, b: number) => a * b);
    const divOp = map(char('/'), () => (a: number, b: number) => a / b);
    const powOp = map(literal('**'), () => (a: number, b: number) => Math.pow(a, b));

    const addSubOp = choice(addOp, subOp);
    const mulDivOp = choice(mulOp, divOp);

    const negateOp = map(char('-'), () => (n: number) => -n);
    const absOp = map(char('+'), () => (n: number) => Math.abs(n));
    const unaryOps = choice(negateOp, absOp);

    const factorialOp = map(char('!'), () => (n: number) => {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    });
    const squareOp = map(literal('²'), () => (n: number) => n * n);
    const postfixOps = choice(factorialOp, squareOp);

    describe('leftAssoc', () => {
        it('should handle single operand', () => {
            const parser = leftAssoc(numberParser, addOp);
            expect(parser('42')).toEqual([42, '']);
        });

        it('should parse left-associative operations', () => {
            const parser = leftAssoc(numberParser, addOp);
            expect(parser('1+2+3')).toEqual([6, '']); // ((1+2)+3)
        });

        it('should handle mixed operations with same precedence', () => {
            const parser = leftAssoc(numberParser, addSubOp);
            expect(parser('10-3+2')).toEqual([9, '']); // ((10-3)+2)
        });

        it('should stop when operator is not found', () => {
            const parser = leftAssoc(numberParser, addOp);
            expect(parser('1+2*3')).toEqual([3, '*3']); // 1+2, then stops
        });

        it('should handle multiplication and division', () => {
            const parser = leftAssoc(numberParser, mulDivOp);
            expect(parser('8/2*3')).toEqual([12, '']); // ((8/2)*3)
            expect(parser('24/3/2')).toEqual([4, '']); // ((24/3)/2)
        });

        it('should fail when first operand fails', () => {
            const parser = leftAssoc(numberParser, addOp);
            expect(parser('abc')).toBeNull();
        });

        it('should handle trailing operators gracefully', () => {
            const parser = leftAssoc(numberParser, addOp);
            expect(parser('1+2+')).toEqual([3, '+']); // Stops at incomplete operation
        });
    });

    describe('rightAssoc', () => {
        it('should handle single operand', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('2')).toEqual([2, '']);
        });

        it('should parse right-associative operations', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('2**3**2')).toEqual([512, '']); // 2**(3**2) = 2**9 = 512
        });

        it('should demonstrate right associativity vs left', () => {
            const rightParser = rightAssoc(numberParser, subOp);
            const leftParser = leftAssoc(numberParser, subOp);

            expect(rightParser('10-3-2')).toEqual([9, '']); // 10-(3-2) = 9
            expect(leftParser('10-3-2')).toEqual([5, '']); // (10-3)-2 = 5
        });

        it('should stop when operator is not found', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('2**3+4')).toEqual([8, '+4']); // 2**3, then stops
        });

        it('should handle complex right-associative chains', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('2**2**3')).toEqual([256, '']); // 2**(2**3) = 2**8 = 256
        });

        it('should fail when first operand fails', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('abc')).toBeNull();
        });

        it('should handle incomplete operations', () => {
            const parser = rightAssoc(numberParser, powOp);
            expect(parser('2**')).toEqual([2, '**']); // Stops at incomplete operation
        });
    });

    describe('chainl', () => {
        it('should return default value when parser fails', () => {
            const parser = chainl(numberParser, addOp, 999);
            expect(parser('abc')).toEqual([999, 'abc']);
        });

        it('should parse successful chain', () => {
            const parser = chainl(numberParser, addOp, 0);
            expect(parser('1+2+3')).toEqual([6, '']);
        });

        it('should return single value without default when successful', () => {
            const parser = chainl(numberParser, addOp, 999);
            expect(parser('42')).toEqual([42, '']);
        });

        it('should handle empty input with default', () => {
            const parser = chainl(numberParser, addOp, 0);
            expect(parser('')).toEqual([0, '']);
        });

        it('should work with different default types', () => {
            const stringParser = map(regex(/\w+/), (s) => s);
            const concatOp = map(char('+'), () => (a: string, b: string) => a + b);
            const parser = chainl(stringParser, concatOp, 'empty');

            expect(parser('hello+world')).toEqual(['helloworld', '']);
            expect(parser('!@#')).toEqual(['empty', '!@#']); // Non-word characters fail regex
            expect(parser('')).toEqual(['empty', '']); // Empty string fails regex
            expect(parser('hello')).toEqual(['hello', '']); // Single item, no operator
        });
    });

    describe('chainl1', () => {
        it('should require at least one operand', () => {
            const parser = chainl1(numberParser, addOp);
            expect(parser('abc')).toBeNull();
        });

        it('should parse single operand', () => {
            const parser = chainl1(numberParser, addOp);
            expect(parser('42')).toEqual([42, '']);
        });

        it('should parse left-associative chain', () => {
            const parser = chainl1(numberParser, addOp);
            expect(parser('1+2+3+4')).toEqual([10, '']);
        });

        it('should be equivalent to leftAssoc', () => {
            const chainParser = chainl1(numberParser, addSubOp);
            const leftAssocParser = leftAssoc(numberParser, addSubOp);

            const input = '10-3+2-1';
            expect(chainParser(input)).toEqual(leftAssocParser(input));
        });

        it('should handle mixed operations', () => {
            const parser = chainl1(numberParser, mulDivOp);
            expect(parser('24/3*2/4')).toEqual([4, '']); // (((24/3)*2)/4)
        });
    });

    describe('chainr', () => {
        it('should return default value when parser fails', () => {
            const parser = chainr(numberParser, powOp, 1);
            expect(parser('abc')).toEqual([1, 'abc']);
        });

        it('should parse successful chain', () => {
            const parser = chainr(numberParser, powOp, 1);
            expect(parser('2**3')).toEqual([8, '']);
        });

        it('should return single value without default when successful', () => {
            const parser = chainr(numberParser, powOp, 999);
            expect(parser('5')).toEqual([5, '']);
        });

        it('should handle empty input with default', () => {
            const parser = chainr(numberParser, powOp, 1);
            expect(parser('')).toEqual([1, '']);
        });

        it('should demonstrate right associativity with default', () => {
            const parser = chainr(numberParser, subOp, 0);
            expect(parser('10-3-2')).toEqual([9, '']); // 10-(3-2)
        });
    });

    describe('chainr1', () => {
        it('should require at least one operand', () => {
            const parser = chainr1(numberParser, powOp);
            expect(parser('abc')).toBeNull();
        });

        it('should parse single operand', () => {
            const parser = chainr1(numberParser, powOp);
            expect(parser('3')).toEqual([3, '']);
        });

        it('should parse right-associative chain', () => {
            const parser = chainr1(numberParser, powOp);
            expect(parser('2**3**2')).toEqual([512, '']); // 2**(3**2)
        });

        it('should be equivalent to rightAssoc', () => {
            const chainParser = chainr1(numberParser, powOp);
            const rightAssocParser = rightAssoc(numberParser, powOp);

            const input = '2**2**3';
            expect(chainParser(input)).toEqual(rightAssocParser(input));
        });

        it('should handle complex right-associative expressions', () => {
            const parser = chainr1(numberParser, subOp);
            expect(parser('100-20-10-5')).toEqual([85, '']); // 100-(20-(10-5))
        });
    });

    describe('prefix', () => {
        it('should handle atom without prefix operators', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('42')).toEqual([42, '']);
        });

        it('should apply single prefix operator', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('-5')).toEqual([-5, '']);
            expect(parser('+5')).toEqual([5, '']); // abs(5) = 5
        });

        it('should apply multiple prefix operators right-to-left', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('--5')).toEqual([5, '']); // -(-5) = 5
            expect(parser('+-5')).toEqual([5, '']); // +(-5) = abs(-5) = 5
        });

        it('should fail when atom parser fails', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('-abc')).toBeNull();
        });

        it('should handle long chains of prefix operators', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('---5')).toEqual([-5, '']); // -(-(- 5)) = -5
        });

        it('should work with different operator types', () => {
            const notOp = map(char('!'), () => (b: boolean) => !b);
            const boolParser = choice(
                map(literal('true'), () => true),
                map(literal('false'), () => false),
            );
            const parser = prefix(notOp, boolParser);

            expect(parser('true')).toEqual([true, '']);
            expect(parser('!true')).toEqual([false, '']);
            expect(parser('!!true')).toEqual([true, '']);
        });

        it('should handle operators that consume no input when none match', () => {
            const parser = prefix(unaryOps, numberParser);
            expect(parser('123*')).toEqual([123, '*']);
        });
    });

    describe('postfix', () => {
        it('should handle atom without postfix operators', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('5')).toEqual([5, '']);
        });

        it('should apply single postfix operator', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('5!')).toEqual([120, '']); // 5! = 120
            expect(parser('3²')).toEqual([9, '']); // 3² = 9
        });

        it('should apply multiple postfix operators left-to-right', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('3²!')).toEqual([362880, '']); // (3²)! = 9! = 362880
        });

        it('should fail when atom parser fails', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('abc!')).toBeNull();
        });

        it('should handle long chains of postfix operators', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('2²²')).toEqual([16, '']); // (2²)² = 4² = 16
        });

        it('should stop when no more operators match', () => {
            const parser = postfix(numberParser, postfixOps);
            expect(parser('3!+')).toEqual([6, '+']); // 3! = 6, stops at +
        });

        it('should work with different operator types', () => {
            const incrementOp = map(literal('++'), () => (n: number) => n + 1);
            const decrementOp = map(literal('--'), () => (n: number) => n - 1);
            const incDecOps = choice(incrementOp, decrementOp);
            const parser = postfix(numberParser, incDecOps);

            expect(parser('5++')).toEqual([6, '']);
            expect(parser('5--')).toEqual([4, '']);
            expect(parser('5++++')).toEqual([7, '']); // ((5++)++)
        });
    });

    describe('integration tests', () => {
        it('should build a complete arithmetic expression parser', () => {
            // Simple calculator with precedence:
            // 1. Numbers and parentheses (highest)
            // 2. Unary prefix operators
            // 3. Postfix operators
            // 4. Multiplication/Division
            // 5. Addition/Subtraction (lowest)

            const parenParser = map(
                sequence(
                    literal('('),
                    numberParser, // Simplified - in real implementation this would be recursive
                    literal(')'),
                ),
                ([, num]) => num,
            );

            const factor = choice(numberParser, parenParser);
            const unaryExpr = prefix(unaryOps, factor);
            const postfixExpr = postfix(unaryExpr, postfixOps);
            const mulDivExpr = leftAssoc(postfixExpr, mulDivOp);
            const addSubExpr = leftAssoc(mulDivExpr, addSubOp);

            // Test basic operations
            expect(addSubExpr('2+3*4')).toEqual([14, '']); // 2+(3*4)
            expect(mulDivExpr('8/2*3')).toEqual([12, '']); // (8/2)*3
            expect(parenParser('(42)')).toEqual([42, '']);
        });

        it('should handle complex expression with all operator types', () => {
            const unaryExpr = prefix(unaryOps, numberParser);
            const postfixExpr = postfix(unaryExpr, postfixOps);
            const mulDivExpr = leftAssoc(postfixExpr, mulDivOp);
            const addSubExpr = leftAssoc(mulDivExpr, addSubOp);

            expect(unaryExpr('-3²')).toEqual([-3, '²']);
            expect(postfixExpr('10² remainder')).toEqual([100, ' remainder']);
            expect(postfixExpr('4!')).toEqual([24, '']);
            expect(mulDivExpr('24/2')).toEqual([12, '']);
            expect(addSubExpr('-9+12')).toEqual([3, '']);
        });

        it('should demonstrate precedence and associativity combinations', () => {
            // Test that left and right associative operations work together
            const powerExpr = rightAssoc(numberParser, powOp); // Right associative
            const mulExpr = leftAssoc(powerExpr, mulOp); // Left associative, higher precedence
            const addExpr = leftAssoc(mulExpr, addOp); // Left associative, lower precedence

            // 2**3**2 = 2**(3**2) = 512 (right associative)
            expect(powerExpr('2**3**2')).toEqual([512, '']);

            // 2*3*4 = (2*3)*4 = 24 (left associative)
            expect(mulExpr('2*3*4')).toEqual([24, '']);

            // 1+2+3 = (1+2)+3 = 6 (left associative)
            expect(addExpr('1+2+3')).toEqual([6, '']);
        });

        it('should handle operator precedence in realistic scenarios', () => {
            // Simulate a simple expression evaluator
            const term = leftAssoc(numberParser, mulDivOp);
            const expr = leftAssoc(term, addSubOp);

            expect(expr('2+3*4-1')).toEqual([13, '']); // 2+(3*4)-1 = 2+12-1 = 13
            expect(expr('10/2+3*4')).toEqual([17, '']); // (10/2)+(3*4) = 5+12 = 17
            expect(expr('1+2*3+4')).toEqual([11, '']); // 1+(2*3)+4 = 1+6+4 = 11
        });

        it('should work with non-numeric types', () => {
            const stringParser = regex(/\w+/);
            const concatOp = map(char('+'), () => (a: string, b: string) => a + b);
            const repeatOp = map(char('*'), () => (s: string, n: string) => s.repeat(parseInt(n) || 1));

            const stringTerm = leftAssoc(stringParser, repeatOp);
            const stringExpr = leftAssoc(stringTerm, concatOp);

            expect(stringExpr('hello+world')).toEqual(['helloworld', '']);
        });
    });
});
