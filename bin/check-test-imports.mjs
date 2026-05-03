#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const directoryName = dirname(filename);
const srcDir = join(directoryName, '..', 'src');

const ALLOWED_PATTERNS = [
    /^\.\.\/\.\.\/test\//, // ../../test/utils
    /^\.\.\/core\//, // ../core/*
];

const violations = [];

const CHECKED_DIRS = new Set(['combinators', 'terminals', 'primitives']);

for (const dir of readdirSync(srcDir)) {
    if (!CHECKED_DIRS.has(dir)) {
        continue;
    }
    const dirPath = join(srcDir, dir);

    let files;
    try {
        files = readdirSync(dirPath);
    } catch {
        continue;
    }

    for (const file of files) {
        if (!file.endsWith('.test.ts')) {
            continue;
        }

        const moduleName = basename(file, '.test.ts');
        const filePath = join(dirPath, file);
        const content = readFileSync(filePath, 'utf8');

        const imports = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(
            (m) => m[1],
        );

        for (const imp of imports) {
            if (!imp.startsWith('.')) {
                continue;
            }

            const isAllowed =
                ALLOWED_PATTERNS.some((p) => p.test(imp)) ||
                imp === `./${moduleName}`;

            if (!isAllowed) {
                violations.push(
                    `${dir}/${file}: disallowed import '${imp}' — only './${moduleName}', '../../test/*', '../core/*' allowed`,
                );
            }
        }
    }
}

if (violations.length > 0) {
    console.error('Test import violations:\n');
    violations.forEach((v) => console.error(`  ${v}`));
    process.exit(1);
}

console.log(`Checked test imports — no violations.`);
