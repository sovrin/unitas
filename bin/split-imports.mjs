const BARRELS = ['core', 'combinators', 'terminals', 'primitives'];
const BARREL_RE = new RegExp(`^(.*/)?(${BARRELS.join('|')})$`);

function getBarrelBase(source) {
    if (typeof source !== 'string') return null;
    const match = source.match(BARREL_RE);
    return match ? `${match[1] ?? ''}${match[2]}` : null;
}

function isNamedOnlyImport({ specifiers = [] }) {
    return (
        specifiers.length > 0 &&
        specifiers.every((s) => s.type === 'ImportSpecifier')
    );
}

module.exports = function transform(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    root.find(j.ImportDeclaration).forEach((path) => {
        const { source, specifiers = [] } = path.node;
        const base = getBarrelBase(source.value);
        if (!base || !isNamedOnlyImport(path.node)) return;

        // Build one import per specifier: import { create } from '../core/create'
        const newImports = specifiers.map((spec) => {
            const imported = spec.imported.name;
            const local = spec.local?.name ?? imported;
            const specifier =
                imported === local
                    ? j.importSpecifier(j.identifier(imported))
                    : j.importSpecifier(
                          j.identifier(imported),
                          j.identifier(local),
                      );
            return j.importDeclaration(
                [specifier],
                j.literal(`${base}/${imported}`),
            );
        });

        j(path).replaceWith(newImports);
    });

    return root.toSource({ quote: 'single' });
};
