const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertIncludesFunction(ast) {
    recast.types.visit(ast, {
        visitCallExpression(path) {
            const { node } = path;

            if (
                n.MemberExpression.check(node.callee) &&
                n.Identifier.check(node.callee.property) &&
                node.callee.property.name === 'includes'
            ) {
                const arrayExpr = node.callee.object;
                const argExpr = node.arguments[0];

                const newCall = b.callExpression(
                    b.memberExpression(
                        b.memberExpression(
                            b.identifier('Insider'),
                            b.identifier('fns')
                        ),
                        b.identifier('has')
                    ),
                    [arrayExpr, argExpr]
                );

                path.replace(newCall);

                return false;
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertIncludesFunction };
