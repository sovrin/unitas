import fs from 'node:fs';
import path, { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const directoryName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(directoryName, '..');
const srcDir = path.join(rootDir, 'src');
const testFilePath = path.join(rootDir, 'test', 'examples.test.ts');

const COMMENT_REGEX = /\/\*\*([\s\S]*?)\*\//g;

function extractExamples(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const examples = [];

    const commentMatches = content.matchAll(COMMENT_REGEX);
    for (const match of commentMatches) {
        const comment = match[1];
        if (comment.includes('@example')) {
            const lines = comment.split('\n');
            const exampleLines = [];
            let description = '';
            let capturing = false;

            for (const line of lines) {
                if (line.includes('@example')) {
                    capturing = true;
                    continue;
                }
                if (capturing) {
                    const trimmed = line.replace(/^\s*\*\s?/, '');
                    if (trimmed === '*' || trimmed.startsWith('* @')) {
                        break;
                    }
                    exampleLines.push(trimmed);
                } else {
                    const trimmed = line.replace(/^\s*\*\s?/, '').trim();
                    if (trimmed && !trimmed.startsWith('@')) {
                        description = trimmed;
                    }
                }
            }

            if (exampleLines.length > 0) {
                examples.push({
                    description,
                    content: exampleLines.join('\n'),
                    file: filePath,
                });
            }
        }
    }

    return examples;
}

function findSourceFiles(dir, ext = '.ts') {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findSourceFiles(fullPath, ext));
        } else if (
            entry.name.endsWith(ext) &&
            !entry.name.endsWith('.test.ts')
        ) {
            files.push(fullPath);
        }
    }

    return files;
}

function parseExample(example) {
    const lines = example.trim().split('\n');
    const codeWithComments = [];
    let prelude = [];
    let seenFirstComment = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.includes('//')) {
            const [codePart, ...commentParts] = trimmed.split('//');
            const expected = commentParts.join('//').trim();
            const code = codePart.trim();
            const thisPrelude = seenFirstComment ? '' : prelude.join('\n');
            seenFirstComment = true;
            codeWithComments.push({
                code,
                expected,
                prelude: thisPrelude,
            });
        } else if (!seenFirstComment) {
            prelude.push(trimmed);
        }
    }

    return { codeWithComments };
}

function generateTestFile(examples) {
    const groups = {};

    for (const { content, file, description } of examples) {
        const { codeWithComments } = parseExample(content);

        if (codeWithComments.length === 0) continue;

        const assertionLines = codeWithComments
            .map(({ code, expected, prelude }, j) => {
                const varName = `result${j}`;
                const preludeLines = prelude
                    ? prelude
                          .split('\n')
                          .map((l) => `            ${l}`)
                          .join('\n') + '\n'
                    : '';
                return `${preludeLines}            const ${varName} = ${code};
            expect(${varName}).toEqual(${expected});`;
            })
            .join('\n');

        const name = basename(file, '.ts');
        const namespace = path.basename(path.dirname(file));

        if (!groups[namespace]) {
            groups[namespace] = [];
        }

        groups[namespace].push({ name, description, assertionLines });
    }

    let output = `// @ts-nocheck
import { describe, it, expect } from 'vitest';
import * as utils from '../src/utils';
import * as combinators from '../src/combinators';
import * as terminals from '../src/terminals';
import * as core from '../src/core';
import * as primitives from '../src/primitives';
import * as helpers from './helpers';

Object.assign(globalThis, utils, combinators, terminals, core, primitives, helpers);

describe('examples from source', () => {
`;

    for (const [namespace, testCases] of Object.entries(groups)) {
        output += `    describe('${namespace}', () => {
`;
        for (const tc of testCases) {
            output += `        it('${tc.name}: ${tc.description}', () => {
${tc.assertionLines}
        });

`;
        }
        output += `    });

`;
    }

    output += `});
`;

    return output;
}

const files = findSourceFiles(srcDir);
const allExamples = [];

for (const file of files) {
    const examples = extractExamples(file);
    if (examples.length > 0) {
        const relPath = path.relative(rootDir, file);
        console.log(`Found ${examples.length} example(s) in ${relPath}`);
        allExamples.push(...examples);
    }
}

const testContent = generateTestFile(allExamples);
fs.writeFileSync(testFilePath, testContent);

console.log(`\nGenerated ${testFilePath} with ${allExamples.length} examples`);
