import { defineConfig } from 'tsdown';

export default defineConfig([
    {
        entry: { index: './src/index.ts' },
        format: ['esm', 'cjs'],
        minify: true,
        dts: true,
    },
    {
        entry: { combinators: './src/combinators/index.ts' },
        format: ['esm', 'cjs'],
        minify: true,
        dts: true,
    },
    {
        entry: { terminals: './src/terminals/index.ts' },
        format: ['esm', 'cjs'],
        minify: true,
        dts: true,
    },
]);
