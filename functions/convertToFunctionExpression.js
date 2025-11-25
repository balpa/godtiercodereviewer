const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertToFunctionExpression(ast) {
    recast.visit(ast, {
        visitFunctionDeclaration: function (path) {
            const node = path.node;

            if (node.generator || node.async || (n.ExportDeclaration.check(path.parentPath.node) && path.parentPath.node.declaration === node)) {
                return this.traverse(path);
            }

            let newBody = node.body;
            let expression = false;

            if (n.BlockStatement.check(node.body) && node.body.body.length === 1 && n.ReturnStatement.check(node.body.body[0])) {
                newBody = node.body.body[0].argument;
                expression = true;
            }

            const arrowFunction = b.arrowFunctionExpression(
                node.params,
                newBody,
                node.async
            );
            arrowFunction.expression = expression;

            const variableDeclarator = b.variableDeclarator(node.id, arrowFunction);
            const variableDeclaration = b.variableDeclaration('const', [variableDeclarator]);

            path.replace(variableDeclaration);
            this.traverse(path);
        },

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

            let newBody = node.body;
            let expression = false;

            if (n.BlockStatement.check(node.body) && node.body.body.length === 1 && n.ReturnStatement.check(node.body.body[0])) {
                newBody = node.body.body[0].argument;
                expression = true;
            }

            const newArrowFunction = b.arrowFunctionExpression(
                node.params,
                newBody,
                node.async
            );
            newArrowFunction.expression = expression;

            path.replace(newArrowFunction);
            this.traverse(path);
        }
    });

    return ast;
}

module.exports = { convertToFunctionExpression };
