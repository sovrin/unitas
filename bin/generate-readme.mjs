import fs from 'node:fs';
import path, { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const directoryName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(directoryName, '..');
const srcDir = path.join(rootDir, 'src');
const docDir = path.join(rootDir, 'doc');
const apiDir = path.join(docDir, 'api');
const readmeTemplatePath = path.join(docDir, 'README.template.md');
const apiTemplatePath = path.join(docDir, 'api.template.md');
const readmePath = path.join(rootDir, 'README.md');

const COMMENT_REGEX = /\/\*\*([\s\S]*?)\*\//g;

const CHEAT_SHEET_HEADING = '## Which function do I need?';

/** Covered by the "Core concepts" prose instead of the cheat sheet. */
const CHEAT_SHEET_EXEMPT = new Set(['failure', 'parser', 'run', 'success']);

/**
 * Module metadata. Order here drives the order of the API index in the README
 * and the cross-page navigation on every generated reference page.
 */
const MODULES = [
    {
        key: 'core',
        title: 'Core',
        entry: 'unitas',
        tagline: 'Types, constructors and the grammar runner.',
        intro:
            'The core entry point holds everything a parser is built from: the `Parser<T>` and `Result<T>` types, the `success`/`failure` constructors, and the tools for running and wiring parsers together (`run`, `grammar`, `lazy`, `memoize`).',
    },
    {
        key: 'terminals',
        title: 'Terminals',
        entry: 'unitas/terminals',
        tagline: 'Factories that match the input string directly.',
        intro:
            'Terminals are the leaves of a grammar. They do not take other parsers — they inspect the input string themselves. Each one is a factory: call it with what you want to match and it hands back a `Parser`.',
    },
    {
        key: 'primitives',
        title: 'Primitives',
        entry: 'unitas/primitives',
        tagline: 'Ready-made parsers for the usual suspects.',
        intro:
            'Primitives are parser *instances*, not factories. Where a terminal needs an argument (`char("a")`), a primitive is already a parser and can be passed straight to a combinator (`many(digit)`).',
    },
    {
        key: 'combinators',
        title: 'Combinators',
        entry: 'unitas/combinators',
        tagline: 'Take parsers, return a new parser.',
        intro:
            'Combinators are the glue. Every one of them takes one or more parsers and returns a new parser, which is what lets a grammar stay a set of small, independently testable pieces.',
    },
    {
        key: 'utils',
        title: 'Utils',
        entry: 'unitas/utils',
        tagline: 'Plain helpers for `map` callbacks.',
        intro:
            'Utils are not parsers. They are small curried helpers meant to be dropped into a `map` callback so reshaping a result stays a one-liner instead of an arrow function.',
    },
];

function extractDocs(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const docs = [];

    const commentMatches = content.matchAll(COMMENT_REGEX);
    for (const match of commentMatches) {
        const comment = match[1];
        if (comment.includes('@example')) {
            const lines = comment.split('\n');
            const exampleLines = [];
            const descriptionParts = [];
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
                        descriptionParts.push(trimmed);
                    }
                }
            }

            if (exampleLines.length > 0) {
                docs.push({
                    description: descriptionParts.join(' '),
                    example: exampleLines.join('\n'),
                    name: basename(filePath, '.ts'),
                });
            }
        }
    }

    return docs;
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

function formatExample(example) {
    const lines = example.split('\n');
    const codeLines = [];
    const assertionMap = new Map();

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed) continue;

        if (trimmed.includes('//')) {
            const [code, ...commentParts] = trimmed.split('//');
            assertionMap.set(i, {
                code: code.trim(),
                assertion: commentParts.join('//').trim(),
            });
        } else {
            codeLines.push({ line: trimmed, index: i });
        }
    }

    const resultLines = [];
    for (const { line, index } of codeLines) {
        if (assertionMap.has(index)) {
            const { assertion } = assertionMap.get(index);
            resultLines.push(`${line} // ${assertion}`);
        } else {
            resultLines.push(line);
        }
    }

    for (const [idx, { code, assertion }] of assertionMap) {
        if (!codeLines.some((c) => c.index === idx)) {
            resultLines.push(`${code} // ${assertion}`);
        }
    }

    return `\`\`\`typescript\n${resultLines.join('\n')}\n\`\`\``;
}

/**
 * The README index shows one line per export, so it gets the headline sentence
 * only — the full description stays on the reference page.
 */
function summarize(description) {
    const [first] = description.split(/(?<=\.)\s+(?=[A-Z])/);

    return (first || description).replace(/\|/g, '\\|');
}

function generateApiPage(module, items) {
    const template = fs.readFileSync(apiTemplatePath, 'utf-8');

    const toc = items
        .map(({ name }) => `[\`${name}\`](#${name.toLowerCase()})`)
        .join(' · ');

    const body = items
        .map(({ name, description, example }) =>
            [
                `### \`${name}\``,
                '',
                description,
                '',
                formatExample(example),
            ].join('\n'),
        )
        .join('\n\n');

    const nav = MODULES.map(({ key, title }) =>
        key === module.key ? `**${title}**` : `[${title}](./${key}.md)`,
    ).join(' · ');

    return template
        .replaceAll('<$title>', module.title)
        .replaceAll('<$entry>', module.entry)
        .replaceAll('<$intro>', module.intro)
        .replaceAll('<$count>', String(items.length))
        .replaceAll('<$nav>', nav)
        .replaceAll('<$toc>', toc)
        .replaceAll('<$body>', body);
}

/**
 * Absolute links, not relative ones: the `doc/` directory is not published to
 * npm, so a relative link would dead-end on npmjs.com.
 */
function apiUrl(baseUrl, key, anchor) {
    const url = `${baseUrl}/doc/api/${key}.md`;

    return anchor ? `${url}#${anchor.toLowerCase()}` : url;
}

/**
 * Reference-style links, not inline ones: the absolute URLs are long enough
 * that inlining them makes the formatter pad every table cell to ~80 columns.
 */
function generateIndex(baseUrl, docsByNamespace) {
    const sections = [];
    const definitions = [];

    for (const module of MODULES) {
        const items = docsByNamespace[module.key] || [];
        if (items.length === 0) continue;

        const pageRef = `api-${module.key}`;
        definitions.push(`[${pageRef}]: ${apiUrl(baseUrl, module.key)}`);

        const rows = items.map(({ name, description }) => {
            const ref = `${module.key}-${name.toLowerCase()}`;
            definitions.push(`[${ref}]: ${apiUrl(baseUrl, module.key, name)}`);

            return `| [\`${name}\`][${ref}] | ${summarize(description)} |`;
        });

        sections.push(
            [
                `### ${module.title} — \`${module.entry}\``,
                '',
                `${module.tagline} **${items.length}** exports — [full reference →][${pageRef}]`,
                '',
                '| | |',
                '| --- | --- |',
                ...rows,
            ].join('\n'),
        );
    }

    return [...sections, definitions.join('\n')].join('\n\n');
}

function generateReadme(baseUrl, docsByNamespace) {
    const template = fs.readFileSync(readmeTemplatePath, 'utf-8');
    const total = Object.values(docsByNamespace).reduce(
        (sum, items) => sum + items.length,
        0,
    );

    const content = template
        .replaceAll('<$index>', generateIndex(baseUrl, docsByNamespace))
        .replaceAll('<$total>', String(total));

    fs.writeFileSync(readmePath, content);
    console.log(`Updated ${readmePath}`);

    warnAboutCheatSheetGaps(template, docsByNamespace);
}

/**
 * The cheat sheet is hand-written, so it silently rots as exports are added.
 * Every name should be reachable by intent, not just alphabetically.
 */
function warnAboutCheatSheetGaps(template, docsByNamespace) {
    const start = template.indexOf(CHEAT_SHEET_HEADING);
    const end = template.indexOf('\n## ', start + 1);
    if (start === -1) return;

    const section = template.slice(start, end === -1 ? undefined : end);
    const mentioned = new Set(
        [...section.matchAll(/`([A-Za-z][A-Za-z0-9]*)`/g)].map(([, n]) => n),
    );

    const missing = MODULES.flatMap(({ key }) =>
        (docsByNamespace[key] || [])
            .map(({ name }) => name)
            .filter(
                (name) =>
                    !mentioned.has(name) && !CHEAT_SHEET_EXEMPT.has(name),
            ),
    );

    if (missing.length > 0) {
        console.warn(
            `Warning: ${missing.length} export(s) missing from the "${CHEAT_SHEET_HEADING}" table in ${path.relative(rootDir, readmeTemplatePath)}: ${missing.join(', ')}`,
        );
    }
}

const pkg = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'),
);
const baseUrl = `${pkg.repository.url.replace(/\.git$/, '')}/blob/master`;

const files = findSourceFiles(srcDir);
const docsByNamespace = {};

for (const file of files) {
    const docs = extractDocs(file);
    if (docs.length === 0) continue;

    const namespace = basename(path.dirname(file));
    if (!docsByNamespace[namespace]) {
        docsByNamespace[namespace] = [];
    }
    docsByNamespace[namespace].push(...docs);
}

for (const items of Object.values(docsByNamespace)) {
    items.sort((a, b) => a.name.localeCompare(b.name));
}

fs.rmSync(apiDir, { force: true, recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

for (const module of MODULES) {
    const items = docsByNamespace[module.key] || [];
    if (items.length === 0) continue;

    const target = path.join(apiDir, `${module.key}.md`);
    fs.writeFileSync(target, generateApiPage(module, items));
    console.log(`Updated ${target} (${items.length} exports)`);
}

generateReadme(baseUrl, docsByNamespace);
