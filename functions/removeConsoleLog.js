const recast = require('recast');
const { namedTypes } = recast.types;

function removeConsoleLog(ast) {
    recast.types.visit(ast, {
        visitExpressionStatement(path) {
            const { node } = path;
            if (
                namedTypes.CallExpression.check(node.expression) &&
                namedTypes.MemberExpression.check(node.expression.callee) &&
                node.expression.callee.object.name === 'console' &&
                node.expression.callee.property.name === 'log'
            ) {
                path.prune();

                return false;
            }

            this.traverse(path);
        }
    });
}

module.exports = { removeConsoleLog };
