const recast = require('recast');
const { namedTypes: n, builders: b, visit } = recast.types;

function ensureUseStrictInIIFE(ast) {
    visit(ast, {
        visitCallExpression(path) {
            const callee = path.node.callee;

            const isFunction = n.FunctionExpression.check(callee) || n.ArrowFunctionExpression.check(callee);

            if (isFunction && n.BlockStatement.check(callee.body)) {
                const bodyStatements = callee.body.body;
                const hasUseStrict = bodyStatements.length > 0 &&
                    bodyStatements[0].directive === 'use strict';

                if (!hasUseStrict) {
                    const useStrictDirective = b.expressionStatement(b.literal('use strict'));

                    bodyStatements.unshift(useStrictDirective);
                }
            }

            this.traverse(path);
        }
    });

    return recast.print(ast, { tabWidth: 4 }).code;
}

module.exports = { ensureUseStrictInIIFE };