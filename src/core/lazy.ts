import { create, type Parser } from './parser';

/**
 * Defers parser creation, useful for recursive grammars.
 *
 * @example
 * lazy(() => char('a'))('abc') // { ok: true, value: 'a', index: 1 }
 */
export const lazy = <T>(thunk: () => Parser<T>) => {
    let parser: Parser<T> | undefined;

    return create<T>((input, index = 0, ctx) =>
        (parser ??= thunk())(input, index, ctx),
    );
};
