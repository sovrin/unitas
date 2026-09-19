import { defineConfig } from 'tsdown';

/**
 * One build with five entries rather than five separate builds.
 *
 * Every entry point shares the core types and constructors. Built separately,
 * each bundle inlines its own copy, so importing from more than one entry —
 * which is the normal way to use this library — ships that code several times
 * over. A single build emits it once as a shared chunk instead.
 */
export default defineConfig({
    entry: {
        index: './src/index.ts',
        combinators: './src/combinators/index.ts',
        terminals: './src/terminals/index.ts',
        primitives: './src/primitives/index.ts',
        utils: './src/utils/index.ts',
    },
    format: ['esm'],
    minify: true,
    dts: true,
});
