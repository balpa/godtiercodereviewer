const recast = require('recast');
const { namedTypes: n } = recast.types; 

function isInsideCatchClause(path) {
    let currentPath = path.parentPath;

    while (currentPath) {
        const node = currentPath.node;

        if (n.CatchClause.check(node)) {
            return true;
        }

        if (n.Function.check(node) || n.Program.check(node)) {
            return false;
        }

        currentPath = currentPath.parentPath;
    }

    return false;
}

function removeConsoleLog(ast) {
    recast.types.visit(ast, {
        visitExpressionStatement(path) {
            const { node } = path;

            if (
                n.CallExpression.check(node.expression) &&
                n.MemberExpression.check(node.expression.callee)
            ) {
                const callee = node.expression.callee;

                const isConsoleLog =
                    n.Identifier.check(callee.object) &&
                    callee.object.name === 'console' &&
                    n.Identifier.check(callee.property) &&
                    callee.property.name === 'log';

                const isInsiderLoggerLog =
                    n.MemberExpression.check(callee.object) &&
                    n.Identifier.check(callee.object.object) &&
                    callee.object.object.name === 'Insider' &&
                    n.Identifier.check(callee.object.property) &&
                    callee.object.property.name === 'logger' &&
                    n.Identifier.check(callee.property) &&
                    callee.property.name === 'log';

                if (isConsoleLog || isInsiderLoggerLog) {
                    if (isInsideCatchClause(path)) {
                        return this.traverse(path);
                    }

                    path.prune();

                    return false;
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { removeConsoleLog };