const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function replaceObjectKeys(ast) {
    recast.types.visit(ast, {
        visitCallExpression(path) {
            const { node } = path;

            if (
                n.MemberExpression.check(node.callee) &&
                n.Identifier.check(node.callee.object) &&
                node.callee.object.name === 'Object' &&
                n.Identifier.check(node.callee.property) &&
                node.callee.property.name === 'keys'
            ) {
                const newCallee = b.memberExpression(
                    b.memberExpression(
                        b.identifier('Insider'),
                        b.identifier('fns')
                    ),
                    b.identifier('keys')
                );

                node.callee = newCallee;
            }

            this.traverse(path);
        }
    });
}

module.exports = { replaceObjectKeys };
