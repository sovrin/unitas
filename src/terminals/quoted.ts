import { choice } from '../combinators/choice';
import { surrounded } from '../combinators/surrounded';
import type { Parser } from '../types';
import { literal } from './literal';

export const quoted = <T>(content: Parser<T>) => {
    return choice(
        surrounded(literal('"'), content),
        surrounded(literal("'"), content),
    );
};
