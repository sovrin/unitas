# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # run all tests once
npm run test:watch        # watch mode
npm run coverage          # coverage report

npm run build             # compile to dist/
npm run watch             # build in watch mode

npm run lint              # oxlint
npm run lint:fix          # auto-fix lint issues
npm run format            # oxfmt (format all files)

npm run generate:index    # regenerate all index.ts barrel files from source
npm run generate:readme   # regenerate README.md and doc/api/*.md from JSDoc examples
npm run test:extract      # extract JSDoc @examples from .js files into test/examples.test.ts
```

Run a single test file:

```bash
npx vitest run src/combinators/map.test.ts
```

## Architecture

ESM-only TypeScript parser combinator library. Five separate entry points, each compiled to its own `.mjs` bundle:

| Entry                | Path                         | Purpose                                                                                         |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `unitas`             | `src/index.ts` → `src/core/` | Core types: `Parser<T>`, `Result<T>`, `success`, `failure`, `run`, `grammar`, `lazy`, `memoize` |
| `unitas/terminals`   | `src/terminals/`             | Factory functions that match input directly (`char`, `regex`, `string`, `satisfy`, …)           |
| `unitas/primitives`  | `src/primitives/`            | Pre-built parser instances (`digit`, `letters`, `whitespace`, …)                                |
| `unitas/combinators` | `src/combinators/`           | Higher-order parsers that compose other parsers (`map`, `choice`, `sequence`, `many`, …)        |
| `unitas/utils`       | `src/utils/`                 | Array/function helpers used in map callbacks (`pick`, `join`, `pipe`, …)                        |

### Core types (`src/core/`)

```typescript
type Parser<T> = (input: string) => Result<T>;
type Result<T> = Success<T> | Failure;
type Success<T> = { ok: true; value: T; remaining: string };
type Failure = { ok: false; error?: string };
```

`grammar` enables mutual recursion — rules receive a proxy object `p` so they can reference sibling rules by name without forward declarations. `lazy` defers evaluation for self-referential parsers.

### File conventions

- Every combinator/terminal/primitive lives in its own file: `src/combinators/map.ts`
- Co-located test: `src/combinators/map.test.ts`
- `index.ts` in each module is generated — run `npm run generate:index` after adding or removing files; do not edit manually
- JSDoc `@example` blocks in source files are the source of truth for the docs and `test/examples.test.ts`
- `README.md` is generated from `doc/README.template.md` — a landing page (pitch, quick start, intent-based cheat sheet, one-line API index)
- `doc/api/{core,terminals,primitives,combinators,utils}.md` are generated from `doc/api.template.md` — the full per-export reference; the whole directory is wiped and rewritten on every run
- Neither `README.md` nor `doc/api/` is edited by hand; hand-written prose belongs in the two templates in `doc/`

### Adding a new combinator

1. Create `src/combinators/myThing.ts` + `src/combinators/myThing.test.ts`
2. Run `npm run generate:index` to update `src/combinators/index.ts`
3. Add JSDoc `@example` block — run `npm run generate:readme` and `npm run test:extract` to keep the docs and examples test in sync
4. Add the new name to the "Which function do I need?" cheat sheet in `doc/README.template.md` — that table is hand-written, and `generate:readme` warns about any export missing from it

### Test structure

- `src/**/*.test.ts` — unit tests co-located with source (vitest, typecheck enabled)
- `test/examples.test.ts` — generated from README examples, do not edit by hand
- `src/combinators/node.test.ts` — newly added, covers `node` (alias for `ast`)
