const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertToAccessNodes(ast) {
    recast.types.visit(ast, {
        visitCallExpression(path) {
            const { node } = path;
            const callee = node.callee;

            const isTargetPattern =
                n.MemberExpression.check(callee) &&
                n.Identifier.check(callee.property) &&
                callee.property.name === 'forEach' &&
                n.MemberExpression.check(callee.object) &&
                n.Identifier.check(callee.object.property) &&
                callee.object.property.name === 'nodes';

            if (isTargetPattern) {
                const baseObject = callee.object.object;

                const newCall = b.callExpression(
                    b.memberExpression(baseObject, b.identifier('accessNodes')),
                    node.arguments
                );

                path.replace(newCall);

                return false;
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertToAccessNodes };