#!/usr/bin/env node

import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, '..', 'src');

const dirs = ['combinators', 'terminals', 'core'];

for (const dir of dirs) {
    const dirPath = join(srcDir, dir);
    const files = readdirSync(dirPath)
        .filter(
            (file) =>
                file.endsWith('.ts') &&
                !file.endsWith('.test.ts') &&
                file !== 'index.ts',
        )
        .map((file) => file.replace('.ts', ''))
        .sort();

    const exports = files
        .map((file) => `export * from './${file}';`)
        .join('\n');

    const indexPath = join(dirPath, 'index.ts');
    writeFileSync(indexPath, exports + '\n');

    console.log(`Written: ${indexPath} (${files.length} exports)`);
}
