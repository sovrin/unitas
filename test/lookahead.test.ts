import { describe, expect, it } from 'vitest';
import { char, followedBy, literal, lookahead, notFollowedBy, peek, regex, sequence } from '../src';

describe('lookahead', () => {
    describe('lookahead', () => {
        it('should succeed when lookahead parser matches without consuming input', () => {
            const parser = lookahead(literal('hello'));
            const result = parser('hello world');

            expect(result).toEqual(['hello', 'hello world']);
        });

        it('should fail when lookahead parser does not match', () => {
            const parser = lookahead(literal('hello'));
            const result = parser('goodbye world');

            expect(result).toBeNull();
        });

        it('should not consume input even on successful match', () => {
            const parser = lookahead(char('a'));
            const result = parser('abc');

            expect(result).toEqual(['a', 'abc']);
        });

        it('should work with complex parsers', () => {
            const parser = lookahead(sequence(literal('if'), literal(' ')));
            const result = parser('if (condition)');

            expect(result).toEqual([['if', ' '], 'if (condition)']);
        });

        it('should handle empty input', () => {
            const parser = lookahead(literal('test'));
            const result = parser('');

            expect(result).toBeNull();
        });
    });

    describe('notFollowedBy', () => {
        it('should succeed when parser does not match', () => {
            const parser = notFollowedBy(literal('bad'));
            const result = parser('good input');

            expect(result).toEqual([undefined, 'good input']);
        });

        it('should fail when parser matches', () => {
            const parser = notFollowedBy(literal('bad'));
            const result = parser('bad input');

            expect(result).toBeNull();
        });

        it('should not consume input on success', () => {
            const parser = notFollowedBy(char('x'));
            const result = parser('abc');

            expect(result).toEqual([undefined, 'abc']);
        });

        it('should work with complex parsers', () => {
            const parser = notFollowedBy(sequence(literal('end'), literal('ing')));
            const result = parser('ending');

            expect(result).toBeNull();
        });

        it('should succeed when complex parser partially matches but fails', () => {
            const parser = notFollowedBy(sequence(literal('end'), literal('ing')));
            const result = parser('end of line');

            expect(result).toEqual([undefined, 'end of line']);
        });

        it('should handle empty input', () => {
            const parser = notFollowedBy(literal('anything'));
            const result = parser('');

            expect(result).toEqual([undefined, '']);
        });

        it('should work with character-based negative lookahead', () => {
            const parser = notFollowedBy(char('z'));
            const result = parser('abc');

            expect(result).toEqual([undefined, 'abc']);
        });
    });

    describe('lookahead and notFollowedBy integration', () => {
        it('should work together for complex parsing logic', () => {
            // Parse 'if' but only if not followed by 'def' (like 'ifdef')
            const ifParser = sequence(literal('if'), notFollowedBy(literal('def')));

            const result1 = ifParser('if (condition)');
            expect(result1).toEqual([['if', undefined], ' (condition)']);

            const result2 = ifParser('ifdef MACRO');
            expect(result2).toBeNull();
        });

        it('should handle keyword disambiguation', () => {
            // Parse 'in' but not when it's part of 'int'
            const inParser = sequence(literal('in'), notFollowedBy(char('t')));

            const result1 = inParser('in array');
            expect(result1).toEqual([['in', undefined], ' array']);

            const result2 = inParser('int value');
            expect(result2).toBeNull();
        });

        it('should combine with regular parsers', () => {
            // Parse identifier followed by lookahead for '('
            const funcCallParser = sequence(literal('func'), lookahead(char('(')));

            const result1 = funcCallParser('func()');
            expect(result1).toEqual([['func', '('], '()']);

            const result2 = funcCallParser('funcVar');
            expect(result2).toBeNull();
        });

        it('should handle multiple lookaheads', () => {
            const parser = sequence(lookahead(char('a')), lookahead(literal('abc')));

            const result = parser('abcd');
            expect(result).toEqual([['a', 'abc'], 'abcd']);
        });

        it('should handle multiple negative lookaheads', () => {
            const parser = sequence(notFollowedBy(char('x')), notFollowedBy(literal('bad')));

            const result1 = parser('good');
            expect(result1).toEqual([[undefined, undefined], 'good']);

            const result2 = parser('xgood');
            expect(result2).toBeNull();

            const result3 = parser('bad');
            expect(result3).toBeNull();
        });
    });

    describe('peek', () => {
        it('should match without consuming input', () => {
            const parser = peek(char('a'));
            const result = parser('abc');

            expect(result).toEqual(['a', 'abc']);
        });

        it('should fail when parser fails', () => {
            const parser = peek(char('x'));
            const result = parser('abc');

            expect(result).toBeNull();
        });

        it('should work with complex parsers', () => {
            const parser = peek(literal('hello'));
            const result = parser('hello world');

            expect(result).toEqual(['hello', 'hello world']);
        });

        it('should fail when complex parser fails', () => {
            const parser = peek(literal('goodbye'));
            const result = parser('hello world');

            expect(result).toBeNull();
        });

        it('should work with regex parsers', () => {
            const parser = peek(regex(/^\d+/));
            const result = parser('123abc');

            expect(result).toEqual(['123', '123abc']);
        });

        it('should handle empty input', () => {
            const parser = peek(char('a'));
            const result = parser('');

            expect(result).toBeNull();
        });
    });

    describe('followedBy', () => {
        it('should succeed when parser matches without consuming input', () => {
            const parser = followedBy(char('a'));
            const result = parser('abc');

            expect(result).toEqual([undefined, 'abc']);
        });

        it('should fail when parser fails', () => {
            const parser = followedBy(char('x'));
            const result = parser('abc');

            expect(result).toBeNull();
        });

        it('should work with literal parsers', () => {
            const parser = followedBy(literal('hello'));
            const result = parser('hello world');

            expect(result).toEqual([undefined, 'hello world']);
        });

        it('should fail when literal parser fails', () => {
            const parser = followedBy(literal('goodbye'));
            const result = parser('hello world');

            expect(result).toBeNull();
        });

        it('should work with regex parsers', () => {
            const parser = followedBy(regex(/^\w+/));
            const result = parser('word123');

            expect(result).toEqual([undefined, 'word123']);
        });

        it('should handle empty input appropriately', () => {
            const parser = followedBy(char('a'));
            const result = parser('');

            expect(result).toBeNull();
        });

        it('should be useful for keyword recognition in sequences', () => {
            // Example: parse 'if' keyword only when followed by whitespace or '('
            const ifParser = sequence(literal('if'), followedBy(regex(/^[\s(]/)));

            expect(ifParser('if (condition)')).toBeTruthy();
            expect(ifParser('if\tcondition')).toBeTruthy();
            expect(ifParser('condition')).toBeNull();
        });
    });
});
