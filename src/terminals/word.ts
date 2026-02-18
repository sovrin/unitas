import { lexeme } from '../combinators/lexeme';
import { map } from '../combinators/map';
import { sequence } from '../combinators/sequence';
import { create } from '../core/create';
import { literal } from './literal';
import { regex } from './regex';

export const word = (targetWord: string) => {
    return create<string>(
        lexeme(
            map(sequence(literal(targetWord), regex(/^(?!\w)/)), ([w]) => w),
        ),
    );
};
