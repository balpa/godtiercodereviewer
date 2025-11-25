const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertEs5ToArrowFunctions(ast) {
    recast.visit(ast, {
        visitFunctionExpression: function (path) {
            const node = path.node;

            if (
                (n.Property.check(path.parentPath.node) && path.parentPath.node.value === node) ||
                n.MethodDefinition.check(path.parentPath.node)
            ) {
                return this.traverse(path);
            }

            if (node.id && !n.VariableDeclarator.check(path.parentPath.node)) {
                return this.traverse(path);
            }

            const newArrowFunction = b.arrowFunctionExpression(
                node.params,
                node.body,
                node.async
            );

            path.replace(newArrowFunction);

            this.traverse(path);
        },

        visitFunctionDeclaration: function (path) {
            const node = path.node;

            if (node.generator || node.async || (n.ExportDeclaration.check(path.parentPath.node) && path.parentPath.node.declaration === node)) {
                return this.traverse(path);
            }

            const arrowFunction = b.arrowFunctionExpression(
                node.params,
                node.body,
                node.async
            );

            const variableDeclarator = b.variableDeclarator(node.id, arrowFunction);

            const variableDeclaration = b.variableDeclaration('const', [variableDeclarator]);

            path.replace(variableDeclaration);

            this.traverse(path);
        }
    });

    return ast;
}

module.exports = { convertEs5ToArrowFunctions };
