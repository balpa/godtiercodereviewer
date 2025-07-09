const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertStringCasting(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee } = path.node;

            if (
                n.MemberExpression.check(callee) &&
                !callee.computed &&
                n.Identifier.check(callee.property) &&
                callee.property.name === 'toString'
            ) {
                const newCall = b.callExpression(
                    b.identifier('String'),
                    [callee.object]
                );

                path.replace(newCall);
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertStringCasting };
