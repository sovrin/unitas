import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { forward } from '../core/forward';
import { create } from '../core/parser';

type ParserOutput<P> = P extends Parser<infer T> ? T : never;

export const choice = <const P extends readonly Parser<any>[]>(
    ...parsers: P
): Parser<ParserOutput<P[number]>> => {
    return create<ParserOutput<P[number]>>((input) => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result.ok) {
                return forward(result);
            }
        }

        return failure();
    });
};
