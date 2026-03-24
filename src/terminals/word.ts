import { lexeme } from '../combinators/lexeme';
import { map } from '../combinators/map';
import { sequence } from '../combinators/sequence';
import { create } from '../core/parser';
import { regex } from './regex';
import { string } from './string';

/**
 * Parses a specific word and ensures it is not followed by word characters.
 * Use this when parsing keywords that should not be part of a longer identifier.
 *
 * @example
 * word('let')('let x') // { ok: true, value: 'let', remaining: 'x' }
 * word('let')('let1') // { ok: false }
 * word('if')('if (x)') // { ok: true, value: 'if', remaining: '(x)' }
 */
export const word = (targetWord: string) => {
    return create<string>(
        lexeme(map(sequence(string(targetWord), regex(/^(?!\w)/)), ([w]) => w)),
    );
};
