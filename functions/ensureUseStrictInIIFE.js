const recast = require('recast');
const { namedTypes: n, builders: b, visit } = recast.types;

function isUseStrictStatement(stmt) {
    if (stmt.directive === 'use strict') {
        return true;
    }

    return (
        n.ExpressionStatement.check(stmt) &&
        stmt.expression &&
        n.Literal.check(stmt.expression) &&
        stmt.expression.value === 'use strict'
    );
}

function ensureUseStrictInIIFE(ast) {
    visit(ast, {
        visitCallExpression(path) {
            const callee = path.node.callee;

            if ((n.FunctionExpression.check(callee) || n.ArrowFunctionExpression.check(callee)) &&
                n.BlockStatement.check(callee.body)
            ) {
                const bodyNode = callee.body;

                bodyNode.body = bodyNode.body.filter(stmt => !isUseStrictStatement(stmt));

                const useStrictLiteral = b.literal('use strict');
                const useStrictStatement = b.expressionStatement(useStrictLiteral);
                useStrictStatement.directive = 'use strict';

                bodyNode.body.unshift(useStrictStatement);
            }

            this.traverse(path);
        }
    });

    return recast.print(ast, { tabWidth: 4 }).code;
}

module.exports = { ensureUseStrictInIIFE };