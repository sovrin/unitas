import { choice } from '../combinators/choice';
import { Parser } from '../types';
import { literal } from './literal';
import { surrounded } from '../combinators/surrounded';

export const quoted = <T>(content: Parser<T>) => {
    return choice(
        surrounded(literal('"'), content),
        surrounded(literal("'"), content),
    );
};
