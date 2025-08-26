import { describe, expect, it } from 'vitest';
import { char, commit, guard, literal, not, oneOf, recover, regex, transform, unless, validate } from '../src';

describe('control', () => {
    describe('guard', () => {
        it('should run parser and consume input when condition is true', () => {
            const parser = guard(true, literal('hello'));
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should return null and consume no input when condition is false', () => {
            const parser = guard(false, literal('hello'));
            const result = parser('hello world');
            expect(result).toEqual([null, 'hello world']);
        });

        it('should propagate parser failure when condition is true but parser fails', () => {
            const parser = guard(true, literal('hello'));
            const result = parser('goodbye world');
            expect(result).toBeNull();
        });

        it('should handle complex parsers', () => {
            const parser = guard(true, regex(/\d+/));
            expect(parser('123abc')).toEqual(['123', 'abc']);
            expect(guard(false, regex(/\d+/))('123abc')).toEqual([null, '123abc']);
        });
    });

    describe('unless', () => {
        it('should run parser and consume input when condition is false', () => {
            const parser = unless(false, literal('hello'));
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should return null and consume no input when condition is true', () => {
            const parser = unless(true, literal('hello'));
            const result = parser('hello world');
            expect(result).toEqual([null, 'hello world']);
        });

        it('should propagate parser failure when condition is false but parser fails', () => {
            const parser = unless(false, literal('hello'));
            const result = parser('goodbye world');
            expect(result).toBeNull();
        });

        it('should be opposite of guard', () => {
            const condition = true;
            const input = 'test input';
            const testParser = literal('test');

            const guardResult = guard(condition, testParser)(input);
            const unlessResult = unless(!condition, testParser)(input);

            expect(guardResult).toEqual(unlessResult);
        });
    });

    describe('recover', () => {
        it('should return parser result when parser succeeds', () => {
            const parser = recover(literal('hello'), 'default');
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should return fallback value when parser fails', () => {
            const parser = recover(literal('hello'), 'default');
            const result = parser('goodbye world');
            expect(result).toEqual(['default', 'goodbye world']);
        });

        it('should not consume input when using fallback', () => {
            const parser = recover(literal('missing'), 'fallback');
            const result = parser('present text');
            expect(result).toEqual(['fallback', 'present text']);
        });

        it('should work with different fallback types', () => {
            const numberParser = recover(regex(/\d+/), '0');
            expect(numberParser('123')).toEqual(['123', '']);
            expect(numberParser('abc')).toEqual(['0', 'abc']);
        });

        it('should handle complex fallback values', () => {
            const parser = recover<object | string>(regex(/\d+/), { error: true, value: -1 });

            expect(parser('123')).toEqual(['123', '']);
            expect(parser('abc')).toEqual([{ error: true, value: -1 }, 'abc']);
        });
    });

    describe('commit', () => {
        it('should behave like the underlying parser on success', () => {
            const parser = commit(literal('test'));
            const result = parser('testing');
            expect(result).toEqual(['test', 'ing']);
        });

        it('should behave like the underlying parser on failure', () => {
            const parser = commit(literal('test'));
            const result = parser('hello');
            expect(result).toBeNull();
        });

        it('should work with complex parsers', () => {
            const parser = commit(regex(/\w+/));
            expect(parser('hello123')).toEqual(['hello123', '']);
            expect(parser('123abc')).toEqual(['123abc', '']);
            expect(parser('!@#')).toBeNull();
        });

        it('should not change parser behavior in this implementation', () => {
            const originalParser = literal('test');
            const committedParser = commit(literal('test'));

            const input = 'testing';
            expect(originalParser(input)).toEqual(committedParser(input));

            const failInput = 'hello';
            expect(originalParser(failInput)).toEqual(committedParser(failInput));
        });
    });

    describe('validate', () => {
        it('should succeed when parser succeeds and predicate returns true', () => {
            const parser = validate(regex(/\d+/), (value) => parseInt(value) > 10);
            const result = parser('25abc');
            expect(result).toEqual(['25', 'abc']);
        });

        it('should fail when parser succeeds but predicate returns false', () => {
            const parser = validate(regex(/\d+/), (value) => parseInt(value) > 10);
            const result = parser('5abc');
            expect(result).toBeNull();
        });

        it('should fail when underlying parser fails', () => {
            const parser = validate(literal('hello'), () => true);
            const result = parser('goodbye');
            expect(result).toBeNull();
        });

        it('should work with string validation', () => {
            const parser = validate(regex(/\w+/), (value) => value.length >= 3);

            expect(parser('hello')).toEqual(['hello', '']);
            expect(parser('hi')).toBeNull();
        });

        it('should work with complex validation logic', () => {
            const parser = validate(regex(/[a-zA-Z]+/), (value) => /^[A-Z]/.test(value) && value.length <= 5);

            expect(parser('Hello')).toEqual(['Hello', '']);
            expect(parser('hello')).toBeNull(); // doesn't start with capital
            expect(parser('TOOLONG')).toBeNull(); // too long
        });
    });

    describe('transform', () => {
        it('should transform successful parser result', () => {
            const parser = transform(regex(/\d+/), (value) => parseInt(value) * 2);
            const result = parser('21abc');
            expect(result).toEqual([42, 'abc']);
        });

        it('should fail when transformer returns null', () => {
            const parser = transform(regex(/\d+/), (value) => (parseInt(value) > 10 ? parseInt(value) : null));

            expect(parser('25abc')).toEqual([25, 'abc']);
            expect(parser('5abc')).toBeNull();
        });

        it('should fail when underlying parser fails', () => {
            const parser = transform(literal('hello'), (value) => value.toUpperCase());
            const result = parser('goodbye');
            expect(result).toBeNull();
        });

        it('should handle complex transformations', () => {
            const parser = transform(regex(/(\w+)=(\d+)/), (match) => {
                const parts = match.split('=');
                if (parts.length !== 2) return null;
                return { key: parts[0], value: parseInt(parts[1]) };
            });

            expect(parser('count=42;')).toEqual([{ key: 'count', value: 42 }, ';']);
        });

        it('should handle transformation that can fail', () => {
            const parser = transform(regex(/\w+/), (value) => {
                const num = parseInt(value);
                return isNaN(num) ? null : num;
            });

            expect(parser('123abc')).toEqual([123, '']);
            expect(parser('abc123')).toBeNull();
        });
    });

    describe('not', () => {
        it('should succeed when underlying parser fails', () => {
            const parser = not(literal('hello'));
            const result = parser('goodbye');
            expect(result).toEqual(['g', 'oodbye']);
        });

        it('should fail when underlying parser succeeds', () => {
            const parser = not(literal('hello'));
            const result = parser('hello world');
            expect(result).toBeNull();
        });

        it('should fail on empty input', () => {
            const parser = not(literal('hello'));
            const result = parser('');
            expect(result).toBeNull();
        });

        it('should consume exactly one character when successful', () => {
            const parser = not(char('a'));
            expect(parser('bcd')).toEqual(['b', 'cd']);
            expect(parser('xyz')).toEqual(['x', 'yz']);
        });

        it('should work with complex parsers', () => {
            const parser = not(regex(/\d/));
            expect(parser('abc')).toEqual(['a', 'bc']);
            expect(parser('123')).toBeNull();
        });

        it('should be useful for negative lookahead', () => {
            // Parse any character that's not followed by a digit
            const parser = not(oneOf('0123456789'));
            expect(parser('a1')).toEqual(['a', '1']);
            expect(parser('51')).toBeNull();
        });
    });

    describe('integration tests', () => {
        it('should combine validation and transformation', () => {
            const parser = transform(
                validate(regex(/\d+/), (value) => parseInt(value) >= 0),
                (value) => parseInt(value) * 2,
            );

            expect(parser('25')).toEqual([50, '']);
            expect(parser('abc')).toBeNull(); // parser fails
        });

        it('should chain multiple control combinators', () => {
            const parser = transform(
                validate(recover(regex(/\d+/), '0'), (value) => value !== '0'),
                (value) => `Number: ${value}`,
            );

            expect(parser('42')).toEqual(['Number: 42', '']);
            expect(parser('abc')).toBeNull(); // recovery gives '0', validation fails
        });
    });
});
