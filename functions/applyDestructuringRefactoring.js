const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

const ALLOWED_OBJECTS = new Set(['classes', 'selectors', 'config']);

function applyDestructuringRefactoring(ast) {
    recast.visit(ast, {
        visitFunction(path) {
            const fnNode = path.node;

            if (!n.BlockStatement.check(fnNode.body)) return false;

            const usedProps = new Map();
            const nodesToReplace = [];

            recast.types.visit(fnNode.body, {
                visitFunction() {
                    return false;
                },
                visitMemberExpression(innerPath) {
                    const { object, property, computed } = innerPath.node;

                    if (
                        !computed &&
                        n.Identifier.check(object) &&
                        n.Identifier.check(property) &&
                        ALLOWED_OBJECTS.has(object.name)
                    ) {
                        const objName = object.name;
                        const propName = property.name;

                        if (!usedProps.has(objName)) {
                            usedProps.set(objName, new Set());
                        }
                        usedProps.get(objName).add(propName);
                        nodesToReplace.push(innerPath);
                    }

                    this.traverse(innerPath);
                }
            });

            for (const path of nodesToReplace) {
                const { property } = path.node;
                path.replace(b.identifier(property.name));
            }

            const bodyStatements = fnNode.body.body;
            const declarations = [];
            const removedIdentifiers = new Set();

            for (const [objName, props] of usedProps.entries()) {
                const properties = [...props].map((prop) => {
                    const p = b.property('init', b.identifier(prop), b.identifier(prop));
                    p.shorthand = true;
                    return p;
                });

                const declarator = b.variableDeclarator(
                    b.objectPattern(properties),
                    b.identifier(objName)
                );

                const declaration = b.variableDeclaration('const', [declarator]);
                declarations.push(declaration);

                for (const prop of props) {
                    removedIdentifiers.add(prop);
                }
            }

            const newBody = [];
            for (const stmt of bodyStatements) {
                if (
                    n.VariableDeclaration.check(stmt) &&
                    ['const', 'let', 'var'].includes(stmt.kind) &&
                    stmt.declarations.every((decl) =>
                        n.Identifier.check(decl.id) &&
                        removedIdentifiers.has(decl.id.name)
                    )
                ) {
                    continue;
                }

                newBody.push(stmt);
            }

            fnNode.body.body = [...declarations, ...newBody];
            return false;
        }
    });

    return ast;
}

module.exports = { applyDestructuringRefactoring };
