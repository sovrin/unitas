import { describe, expect, it } from 'vitest';
import {
    alphaNum,
    anyChar,
    crlf,
    digit,
    digits,
    endOfLine,
    eof,
    float,
    hexNumber,
    identifier,
    integer,
    letter,
    lower,
    naturalNumber,
    newline,
    position,
    rest,
    space,
    tab,
    upper,
    whitespace,
} from '../src/primitives';
import { add, literal, multiply } from '../src';

describe('primitives', () => {
    describe('digit', () => {
        it('should parse single digit and return number', () => {
            expect(digit('5abc')).toEqual([5, 'abc']);
            expect(digit('0xyz')).toEqual([0, 'xyz']);
            expect(digit('9')).toEqual([9, '']);
        });

        it('should fail on non-digit characters', () => {
            expect(digit('abc')).toBeNull();
            expect(digit('!')).toBeNull();
            expect(digit('')).toBeNull();
        });

        it('should only parse first digit', () => {
            expect(digit('123')).toEqual([1, '23']);
        });
    });

    describe('digits', () => {
        it('should parse multiple digits and return number', () => {
            expect(digits('123abc')).toEqual([123, 'abc']);
            expect(digits('42')).toEqual([42, '']);
            expect(digits('007xyz')).toEqual([7, 'xyz']);
        });

        it('should fail when no digits found', () => {
            expect(digits('abc')).toBeNull();
            expect(digits('')).toBeNull();
        });

        it('should handle single digit', () => {
            expect(digits('5abc')).toEqual([5, 'abc']);
        });

        it('should handle large numbers', () => {
            expect(digits('1234567890')).toEqual([1234567890, '']);
        });
    });

    describe('letter', () => {
        it('should parse alphabetic characters', () => {
            expect(letter('abc')).toEqual(['a', 'bc']);
            expect(letter('Zyx')).toEqual(['Z', 'yx']);
        });

        it('should fail on non-letter characters', () => {
            expect(letter('123')).toBeNull();
            expect(letter('!')).toBeNull();
            expect(letter('')).toBeNull();
        });

        it('should only parse first character', () => {
            expect(letter('hello')).toEqual(['h', 'ello']);
        });
    });

    describe('alphaNum', () => {
        it('should parse alphanumeric characters', () => {
            expect(alphaNum('a123')).toEqual(['a', '123']);
            expect(alphaNum('5abc')).toEqual(['5', 'abc']);
            expect(alphaNum('Z')).toEqual(['Z', '']);
        });

        it('should fail on non-alphanumeric characters', () => {
            expect(alphaNum('!')).toBeNull();
            expect(alphaNum(' abc')).toBeNull();
            expect(alphaNum('')).toBeNull();
        });
    });

    describe('upper', () => {
        it('should parse uppercase letters', () => {
            expect(upper('ABC')).toEqual(['A', 'BC']);
            expect(upper('Zabc')).toEqual(['Z', 'abc']);
        });

        it('should fail on non-uppercase characters', () => {
            expect(upper('abc')).toBeNull();
            expect(upper('123')).toBeNull();
            expect(upper('')).toBeNull();
        });
    });

    describe('lower', () => {
        it('should parse lowercase letters', () => {
            expect(lower('abc')).toEqual(['a', 'bc']);
            expect(lower('zABC')).toEqual(['z', 'ABC']);
        });

        it('should fail on non-lowercase characters', () => {
            expect(lower('ABC')).toBeNull();
            expect(lower('123')).toBeNull();
            expect(lower('')).toBeNull();
        });
    });

    describe('space', () => {
        it('should parse whitespace characters', () => {
            expect(space(' abc')).toEqual([' ', 'abc']);
            expect(space('\tabc')).toEqual(['\t', 'abc']);
            expect(space('\nabc')).toEqual(['\n', 'abc']);
            expect(space('\rabc')).toEqual(['\r', 'abc']);
        });

        it('should fail on non-whitespace characters', () => {
            expect(space('abc')).toBeNull();
            expect(space('123')).toBeNull();
            expect(space('')).toBeNull();
        });
    });

    describe('tab', () => {
        it('should parse tab character', () => {
            expect(tab('\tabc')).toEqual(['\t', 'abc']);
        });

        it('should fail on non-tab characters', () => {
            expect(tab(' abc')).toBeNull();
            expect(tab('abc')).toBeNull();
            expect(tab('')).toBeNull();
        });
    });

    describe('newline', () => {
        it('should parse newline character', () => {
            expect(newline('\nabc')).toEqual(['\n', 'abc']);
        });

        it('should fail on non-newline characters', () => {
            expect(newline('\rabc')).toBeNull();
            expect(newline(' abc')).toBeNull();
            expect(newline('abc')).toBeNull();
        });
    });

    describe('crlf', () => {
        it('should parse CRLF sequence', () => {
            expect(crlf('\r\nabc')).toEqual(['\r\n', 'abc']);
        });

        it('should fail on single CR or LF', () => {
            expect(crlf('\rabc')).toBeNull();
            expect(crlf('\nabc')).toBeNull();
        });

        it('should fail on other characters', () => {
            expect(crlf('abc')).toBeNull();
        });
    });

    describe('endOfLine', () => {
        it('should parse various line endings', () => {
            expect(endOfLine('\nabc')).toEqual(['\n', 'abc']);
            expect(endOfLine('\r\nabc')).toEqual(['\r\n', 'abc']);
        });

        it('should handle end of file', () => {
            expect(endOfLine('')).toEqual(['', '']);
        });

        it('should prefer CRLF over individual characters', () => {
            expect(endOfLine('\r\n')).toEqual(['\r\n', '']);
        });
    });

    describe('whitespace', () => {
        it('should parse zero or more whitespace characters', () => {
            expect(whitespace('   abc')).toEqual(['   ', 'abc']);
            expect(whitespace('\t\n  abc')).toEqual(['\t\n  ', 'abc']);
            expect(whitespace('abc')).toEqual(['', 'abc']);
        });

        it('should handle empty input', () => {
            expect(whitespace('')).toEqual(['', '']);
        });

        it('should parse all types of whitespace', () => {
            expect(whitespace(' \t\n\r\fabc')).toEqual([' \t\n\r\f', 'abc']);
        });
    });

    describe('identifier', () => {
        it('should parse valid identifiers', () => {
            expect(identifier('variable_name')).toEqual(['variable_name', '']);
            expect(identifier('_private')).toEqual(['_private', '']);
            expect(identifier('camelCase')).toEqual(['camelCase', '']);
            expect(identifier('PascalCase')).toEqual(['PascalCase', '']);
            expect(identifier('name123')).toEqual(['name123', '']);
        });

        it('should fail on invalid identifiers', () => {
            expect(identifier('123invalid')).toBeNull();
            expect(identifier('invalid-name')).toEqual(['invalid', '-name']);
            expect(identifier('invalid.name')).toEqual(['invalid', '.name']);
        });

        it('should stop at non-identifier characters', () => {
            expect(identifier('valid_name!')).toEqual(['valid_name', '!']);
            expect(identifier('test.property')).toEqual(['test', '.property']);
        });

        it('should handle single character identifiers', () => {
            expect(identifier('a')).toEqual(['a', '']);
            expect(identifier('_')).toEqual(['_', '']);
        });
    });

    describe('naturalNumber', () => {
        it('should parse natural numbers', () => {
            expect(naturalNumber('123')).toEqual([123, '']);
            expect(naturalNumber('0')).toEqual([0, '']);
            expect(naturalNumber('456abc')).toEqual([456, 'abc']);
        });

        it('should fail on non-numeric input', () => {
            expect(naturalNumber('abc')).toBeNull();
            expect(naturalNumber('')).toBeNull();
        });

        it('should handle leading zeros', () => {
            expect(naturalNumber('007')).toEqual([7, '']);
            expect(naturalNumber('00123')).toEqual([123, '']);
        });

        it('should parse large numbers', () => {
            expect(naturalNumber('1234567890')).toEqual([1234567890, '']);
        });
    });

    describe('anyChar', () => {
        it('should match any single character', () => {
            const result = anyChar('abc');
            expect(result).toEqual(['a', 'bc']);
        });

        it('should match special characters', () => {
            const result = anyChar('@#$');
            expect(result).toEqual(['@', '#$']);
        });

        it('should fail on empty input', () => {
            const result = anyChar('');
            expect(result).toBeNull();
        });
    });

    describe('rest', () => {
        it('should return all remaining input', () => {
            const result = rest('hello world');
            expect(result).toEqual(['hello world', '']);
        });

        it('should handle empty input', () => {
            const result = rest('');
            expect(result).toEqual(['', '']);
        });
    });

    describe('position', () => {
        it('should return current position (input length)', () => {
            const result = position('hello');
            expect(result).toEqual([5, 'hello']);
        });

        it('should return 0 for empty input', () => {
            const result = position('');
            expect(result).toEqual([0, '']);
        });
    });

    describe('hexNumber', () => {
        it('should parse hexadecimal numbers', () => {
            expect(hexNumber('0x1a')).toEqual([26, '']);
            expect(hexNumber('0X1A')).toEqual([26, '']);
            expect(hexNumber('0xff')).toEqual([255, '']);
            expect(hexNumber('0xFF')).toEqual([255, '']);
        });

        it('should fail on invalid hex numbers', () => {
            expect(hexNumber('1a')).toBeNull();
            expect(hexNumber('0xgg')).toBeNull();
            expect(hexNumber('abc')).toBeNull();
        });

        it('should handle mixed case', () => {
            expect(hexNumber('0xDeAdBeEf')).toEqual([3735928559, '']);
        });

        it('should stop at non-hex characters', () => {
            expect(hexNumber('0x123xyz')).toEqual([291, 'xyz']);
        });

        it('should handle zero', () => {
            expect(hexNumber('0x0')).toEqual([0, '']);
        });
    });

    describe('integer', () => {
        it('should parse positive integers', () => {
            expect(integer('123')).toEqual([123, '']);
            expect(integer('42abc')).toEqual([42, 'abc']);
            expect(integer('0')).toEqual([0, '']);
        });

        it('should parse integers with explicit positive sign', () => {
            expect(integer('+123')).toEqual([123, '']);
            expect(integer('+42abc')).toEqual([42, 'abc']);
            expect(integer('+0')).toEqual([0, '']);
        });

        it('should parse negative integers', () => {
            expect(integer('-123')).toEqual([-123, '']);
            expect(integer('-42abc')).toEqual([-42, 'abc']);
            expect(integer('-0')).toEqual([-0, '']); // -0 becomes 0
        });

        it('should handle integers without explicit sign', () => {
            expect(integer('456')).toEqual([456, '']);
            expect(integer('999xyz')).toEqual([999, 'xyz']);
        });

        it('should fail on non-numeric input', () => {
            expect(integer('abc')).toBeNull();
            expect(integer('')).toBeNull();
            expect(integer('+')).toBeNull(); // sign without digits
            expect(integer('-')).toBeNull(); // sign without digits
        });

        it('should handle leading zeros', () => {
            expect(integer('007')).toEqual([7, '']);
            expect(integer('+0042')).toEqual([42, '']);
            expect(integer('-0123')).toEqual([-123, '']);
        });

        it('should parse large integers', () => {
            expect(integer('1234567890')).toEqual([1234567890, '']);
            expect(integer('-987654321')).toEqual([-987654321, '']);
        });

        it('should stop at decimal point', () => {
            expect(integer('123.456')).toEqual([123, '.456']);
            expect(integer('-42.5')).toEqual([-42, '.5']);
        });

        it('should stop at non-digit characters', () => {
            expect(integer('123abc')).toEqual([123, 'abc']);
            expect(integer('456 789')).toEqual([456, ' 789']);
            expect(integer('789!')).toEqual([789, '!']);
        });
    });

    describe('float', () => {
        it('should parse integer values as floats', () => {
            expect(float('123')).toEqual([123, '']);
            expect(float('42abc')).toEqual([42, 'abc']);
            expect(float('0')).toEqual([0, '']);
        });

        it('should parse decimal numbers', () => {
            expect(float('123.456')).toEqual([123.456, '']);
            expect(float('3.14159')).toEqual([3.14159, '']);
            expect(float('0.5')).toEqual([0.5, '']);
        });

        it('should parse numbers with positive sign', () => {
            expect(float('+123')).toEqual([123, '']);
            expect(float('+3.14')).toEqual([3.14, '']);
            expect(float('+0.1')).toEqual([0.1, '']);
        });

        it('should parse negative numbers', () => {
            expect(float('-123')).toEqual([-123, '']);
            expect(float('-3.14')).toEqual([-3.14, '']);
            expect(float('-0.5')).toEqual([-0.5, '']);
        });

        it('should parse scientific notation', () => {
            expect(float('1e5')).toEqual([100000, '']);
            expect(float('1E5')).toEqual([100000, '']);
            expect(float('2.5e3')).toEqual([2500, '']);
            expect(float('1.23e-4')).toEqual([0.000123, '']);
        });

        it('should parse scientific notation with signs', () => {
            expect(float('1e+5')).toEqual([100000, '']);
            expect(float('1e-3')).toEqual([0.001, '']);
            expect(float('-2.5e+2')).toEqual([-250, '']);
            expect(float('-1.5e-2')).toEqual([-0.015, '']);
        });

        it('should handle edge cases in scientific notation', () => {
            expect(float('0e0')).toEqual([0, '']);
            expect(float('1e0')).toEqual([1, '']);
            expect(float('5.0e1')).toEqual([50, '']);
        });

        it('should fail on invalid input', () => {
            expect(float('abc')).toBeNull();
            expect(float('')).toBeNull();
            expect(float('.')).toBeNull();
            expect(float('e5')).toBeNull();
            expect(float('ee5')).toBeNull();
        });

        it('should handle very small and very large numbers', () => {
            expect(float('1e-10')).toEqual([1e-10, '']);
            expect(float('1e+10')).toEqual([1e10, '']);
            expect(float('3.14159e-100')).toEqual([3.14159e-100, '']);
        });

        it('should stop at invalid characters', () => {
            expect(float('123.45abc')).toEqual([123.45, 'abc']);
            expect(float('1e5xyz')).toEqual([100000, 'xyz']);
            expect(float('3.14!')).toEqual([3.14, '!']);
        });

        it('should handle numbers starting with decimal point', () => {
            // Note: This depends on the regex pattern - current pattern requires digit before decimal
            expect(float('.5')).toBeNull(); // Current implementation doesn't support this
        });

        it('should parse complex scientific notation', () => {
            expect(float('6.022e23')).toEqual([6.022e23, '']); // Avogadro's number
            expect(float('-1.602e-19')).toEqual([-1.602e-19, '']); // Electron charge
        });
    });

    describe('eof', () => {
        it('should succeed on empty input', () => {
            const result = eof('');
            expect(result).toEqual([null, '']);
        });

        it('should fail on non-empty input', () => {
            const result = eof('abc');
            expect(result).toBeNull();
        });
    });

    describe('integration tests', () => {
        it('should combine text parsers effectively', () => {
            // Test parsing a simple assignment: identifier = number
            const parseAssignment = (input: string) => {
                const idResult = identifier(input);
                if (!idResult) return null;

                const wsResult = whitespace(idResult[1]);
                if (!wsResult) return null;

                const eqResult = literal('=')(wsResult[1]);
                if (!eqResult) return null;

                const ws2Result = whitespace(eqResult[1]);
                if (!ws2Result) return null;

                const numResult = naturalNumber(ws2Result[1]);
                if (!numResult) return null;

                return [
                    {
                        identifier: idResult[0],
                        value: numResult[0],
                    },
                    numResult[1],
                ];
            };

            expect(parseAssignment('myVar = 42')).toEqual([{ identifier: 'myVar', value: 42 }, '']);
        });

        it('should combine text parsers effectively', () => {
            // Test parsing a simple assignment: identifier = number
            const parseAssignment = (input: string) => {
                const idResult = identifier(input);
                if (!idResult) return null;

                const wsResult = whitespace(idResult[1]);
                if (!wsResult) return null;

                const eqResult = literal('=')(wsResult[1]);
                if (!eqResult) return null;

                const ws2Result = whitespace(eqResult[1]);
                if (!ws2Result) return null;

                const numResult = naturalNumber(ws2Result[1]);
                if (!numResult) return null;

                return [
                    {
                        identifier: idResult[0],
                        value: numResult[0],
                    },
                    numResult[1],
                ];
            };

            expect(parseAssignment('myVar = 42')).toEqual([{ identifier: 'myVar', value: 42 }, '']);
        });

        it('should work together for arithmetic operations', () => {
            expect(integer('5')).toEqual([5, '']);
            expect(add(5, 3)).toBe(8);
            expect(multiply(4, 2)).toBe(8);
        });

        it('should parse and calculate expressions', () => {
            const [num1] = integer('12')!;
            const [num2] = float('3.5')!;

            const result = add(num1, num2);

            expect(result).toBe(15.5);
        });

        it('should handle complex number parsing scenarios', () => {
            // Parse scientific notation and perform operations
            const floatResult = float('1.5e2');
            expect(floatResult).toEqual([150, '']);

            if (floatResult) {
                const result = multiply(floatResult[0], 2);
                expect(result).toBe(300);
            }
        });

        it('should handle number parsing edge cases', () => {
            // Test various number formats
            const testCases = [
                { input: '0', expected: 0 },
                { input: '-0', expected: -0 },
                { input: '+42', expected: 42 },
                { input: '1.23e-4', expected: 0.000123 },
                { input: '-2.5e+3', expected: -2500 },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = float(input);
                expect(result).toEqual([expected, '']);
            });
        });
    });
});
