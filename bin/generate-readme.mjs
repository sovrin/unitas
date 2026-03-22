import fs from 'node:fs';
import path, { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const templatePath = path.join(__dirname, 'README.template.md');
const readmePath = path.join(rootDir, 'README.md');

const COMMENT_REGEX = /\/\*\*([\s\S]*?)\*\//g;

function extractDocs(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const docs = [];

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
                docs.push({
                    description,
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

function generateDocsSection(namespace, items) {
    if (items.length === 0) return '';

    const lines = items.map(({ name, description, example }) => {
        const formatted = formatExample(example);
        return `<details id="${name}">
<summary><code>${name}</code> — ${description}</summary>

${formatted}
</details>`;
    });

    return lines.join('\n');
}

function generateTOC(docsByNamespace) {
    const sections = [
        { key: 'core', title: 'Core' },
        { key: 'terminals', title: 'Terminals' },
        { key: 'combinators', title: 'Combinators' },
        { key: 'utils', title: 'Utils' },
    ];

    const lines = [];
    for (const { key, title } of sections) {
        const items = docsByNamespace[key] || [];
        if (items.length === 0) continue;

        lines.push(`- [${title}](#${title.toLowerCase()})`);

        for (const { name } of items) {
            lines.push(`  - [\`${name}\`](#${name})`);
        }
    }

    return lines.join('\n');
}

function generateReadme(docsByNamespace) {
    let template = fs.readFileSync(templatePath, 'utf-8');

    const placeholderMap = {
        '<$core>': 'core',
        '<$terminals>': 'terminals',
        '<$combinators>': 'combinators',
        '<$utils>': 'utils',
    };

    for (const [placeholder, namespace] of Object.entries(placeholderMap)) {
        const items = docsByNamespace[namespace] || [];
        const sectionContent = generateDocsSection(namespace, items);
        template = template.replace(placeholder, sectionContent);
    }

    template = template.replace('<$toc>', generateTOC(docsByNamespace));

    fs.writeFileSync(readmePath, template);
    console.log(`Updated ${readmePath}`);
}

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

generateReadme(docsByNamespace);