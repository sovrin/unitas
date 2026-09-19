import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { choice } from '../combinators/choice';
import { many } from '../combinators/many';
import { not } from '../combinators/not';
import { optional } from '../combinators/optional';
import { separatedBy } from '../combinators/separatedBy';
import { sequence } from '../combinators/sequence';
import { char } from '../terminals/char';
import { string } from '../terminals/string';
import { context } from './context';
import { label } from './label';
import { memoize } from './memoize';
import { type Parser } from './parser';

/**
 * A combinator that calls a parser without passing the context on will
 * silently lose expectations: the parse still succeeds or fails the same way,
 * only the error message gets worse. Nothing else would catch that, so the
 * call sites are checked directly.
 */
describe('context is forwarded at every parser call site', () => {
    const roots = ['combinators', 'primitives', 'terminals'];
    const files = roots.flatMap((dir) => {
        const full = path.join(process.cwd(), 'src', dir);

        return fs
            .readdirSync(full)
            .filter(
                (f) =>
                    f.endsWith('.ts') &&
                    !f.endsWith('.test.ts') &&
                    f !== 'index.ts',
            )
            .map((f) => path.join('src', dir, f));
    });

    // `foo(input, bar)` / `foo(\n input,\n bar,\n)` — a parser being invoked.
    const CALL = /\(\s*input,\s*[^()]*?\)/gs;

    it.each(files)('%s', (file) => {
        const source = fs
            .readFileSync(path.join(process.cwd(), file), 'utf-8')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*/g, '');

        const offenders = [...source.matchAll(CALL)]
            .map((m) => m[0])
            .filter((call) => !/\bctx\b/.test(call))
            // parser *declarations* legitimately omit it when unused
            .filter((call) => !/index = 0/.test(call));

        expect(offenders, `parser call without ctx in ${file}`).toEqual([]);
    });
});

describe('expectations survive backtracking', () => {
    // Succeeds on 'aa', then wants '!' at offset 2 — deeper than any caller reaches.
    const deep = sequence(string('aa'), char('!'));
    const furthestOf = <T>(parser: Parser<T>, input: string) => {
        const ctx = context();
        parser(input, 0, ctx);

        return ctx;
    };

    const cases: [string, Parser<unknown>][] = [
        ['optional', optional(deep)],
        ['many', many(deep)],
        ['choice', choice(deep, string('zz'))],
        ['separatedBy', separatedBy(deep, char(','))],
        ['memoize', memoize(deep)],
    ];

    it.each(cases)(
        '%s reports the furthest failure it backtracked over',
        (_name, parser) => {
            const ctx = furthestOf(parser, 'aaX');

            expect(ctx.furthest).toBe(2);
            expect(ctx.expected).toContain("'!'");
        },
    );

    it('memoize replays its trace on a cache hit', () => {
        const memo = memoize(deep);
        memo('aaX', 0, context()); // prime the cache

        const ctx = context();
        memo('aaX', 0, ctx);

        expect(ctx.furthest).toBe(2);
        expect(ctx.expected).toContain("'!'");
    });

    it('label hides the internals it replaces', () => {
        const ctx = furthestOf(label(string('hello'), 'a greeting'), 'x');

        expect(ctx.expected).toEqual(['a greeting']);
    });

    it('not does not report the failure it wanted', () => {
        const ctx = furthestOf(not(string('hello')), 'world');

        expect(ctx.furthest).toBe(-1);
    });
});
