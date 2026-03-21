import { lexeme } from '../combinators/lexeme';
import { map } from '../combinators/map';
import { sequence } from '../combinators/sequence';
import { create } from '../core/parser';
import { literal } from './literal';
import { regex } from './regex';

/**
 * Parses a specific word and ensures it is not followed by word characters.
 *
 * @example
 * word('let')('let x') // { ok: true, value: 'let', remaining: 'x' }
 */
export const word = (targetWord: string) => {
    return create<string>(
        lexeme(
            map(sequence(literal(targetWord), regex(/^(?!\w)/)), ([w]) => w),
        ),
    );
};
