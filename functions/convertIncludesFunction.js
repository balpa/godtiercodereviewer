const recast = require('recast');
const { namedTypes: n, builders: b, visit } = recast.types;

function convertIncludesFunction(ast) {
    const isNegativeOne = (node) => {
        return (n.Literal.check(node) && node.value === -1) ||
               (n.UnaryExpression.check(node) && node.operator === '-' &&
                n.Literal.check(node.argument) && node.argument.value === 1);
    };

    visit(ast, {
        visitBinaryExpression(path) {
            const { node } = path;
            const { left, right, operator } = node;
            let indexOfCall;

            if (n.CallExpression.check(left) && n.MemberExpression.check(left.callee) && left.callee.property.name === 'indexOf' && isNegativeOne(right)) {
                indexOfCall = left;
            } else if (n.CallExpression.check(right) && n.MemberExpression.check(right.callee) && right.callee.property.name === 'indexOf' && isNegativeOne(left)) {
                indexOfCall = right;
            }

            if (indexOfCall) {
                const arrayExpr = indexOfCall.callee.object;
                const argExpr = indexOfCall.arguments[0];

                const insiderHasCall = b.callExpression(
                    b.memberExpression(
                        b.memberExpression(b.identifier('Insider'), b.identifier('fns')),
                        b.identifier('has')
                    ),
                    [arrayExpr, argExpr]
                );

                let finalExpression;

                if (operator === '===' || operator === '==') {
                    finalExpression = b.unaryExpression('!', insiderHasCall);
                } else if (operator === '!==' || operator === '!=' || operator === '>') {
                    finalExpression = insiderHasCall;
                }

                if (finalExpression) {
                    path.replace(finalExpression);
                    return false;
                }
            }

            this.traverse(path);
        },

        visitCallExpression(path) {
            const { node } = path;
            const callee = node.callee;

            if (n.MemberExpression.check(callee) && n.Identifier.check(callee.property) && callee.property.name === 'includes') {
                const arrayExpr = callee.object;
                const argExpr = node.arguments[0];

                const newCall = b.callExpression(
                    b.memberExpression(
                        b.memberExpression(b.identifier('Insider'), b.identifier('fns')),
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