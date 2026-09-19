import { describe, expect, it } from 'vitest';

import { choice } from '../combinators/choice';
import { many } from '../combinators/many';
import { separatedBy } from '../combinators/separatedBy';
import { sequence } from '../combinators/sequence';
import { digits } from '../primitives/digits';
import { letters } from '../primitives/letters';
import { char } from '../terminals/char';
import { string } from '../terminals/string';
import { createTestParser } from '../../test/utils';
import { failure } from './failure';
import { create } from './parser';
import { run } from './run';

describe('run', () => {
    const parser = createTestParser('A');

    it('should successfully return parsed result', () => {
        const result = run(parser, 'A');

        expect(result).toBe('A');
    });

    it('should report the expectation and position on failure', () => {
        expect(() => {
            run(parser, 'B');
        }).toThrowError("1:1 expected A, found 'B'");
    });

    it('should throw error for unconsumed input', () => {
        expect(() => {
            run(parser, 'AB');
        }).toThrowError("1:2 expected end of input, found 'B'");
    });

    it('should throw error with the expectation the parser recorded', () => {
        expect(() => {
            run(
                create((_input, index = 0) =>
                    failure(undefined, index, 'something weird'),
                ),
                'AB',
            );
        }).toThrowError('expected something weird');
    });

    /** Records 'A' the way a real terminal does, then discards the failure. */
    const swallowing = (...expected: string[]) => {
        return create((_input, index = 0, ctx) => {
            failure(ctx, index, 'A');

            return failure(ctx, index, ...expected);
        });
    };

    it('should fall back to the context when the failure names nothing', () => {
        expect(() => {
            run(swallowing(), 'B');
        }).toThrowError("1:1 expected A, found 'B'");
    });

    it('should combine the context and the failure at the same offset', () => {
        expect(() => {
            run(swallowing('B'), 'C');
        }).toThrowError("1:1 expected A or B, found 'C'");
    });

    it('should report a branch that reached further than the failure', () => {
        // choice fails at 0, but the first alternative got to offset 2.
        const alternatives = choice(sequence(string('aa'), char('!')), char('z'));

        expect(() => run(alternatives, 'aab')).toThrowError("1:3 expected '!'");
    });

    it('should report a branch that reached further than a partial success', () => {
        // separatedBy succeeds with one pair and stops, but the failure that
        // actually matters is inside the pair it backtracked over.
        const pairs = separatedBy(sequence(letters, char('='), digits), char(','));

        expect(() => run(pairs, 'a=1,b=x')).toThrowError('1:7 expected digit');
    });

    it('should ask for end of input when nothing reached further', () => {
        expect(() => run(many(char('a')), 'aab')).toThrowError(
            "1:3 expected 'a' or end of input",
        );
    });
});
