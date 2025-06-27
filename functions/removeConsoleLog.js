const recast = require('recast');
const { namedTypes } = recast.types;

function removeConsoleLog(ast) {
    recast.types.visit(ast, {
        visitExpressionStatement(path) {
            const { node } = path;

            if (
                namedTypes.CallExpression.check(node.expression) &&
                namedTypes.MemberExpression.check(node.expression.callee)
            ) {
                const callee = node.expression.callee;

                const isConsoleLog = 
                    callee.object.name === 'console' &&
                    callee.property.name === 'log';

                const isInsiderLoggerLog =
                    callee.object.type === 'MemberExpression' &&
                    callee.object.object.name === 'Insider' &&
                    callee.object.property.name === 'logger' &&
                    callee.property.name === 'log';

                if (isConsoleLog || isInsiderLoggerLog) {
                    path.prune();

                    return false;
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { removeConsoleLog };
