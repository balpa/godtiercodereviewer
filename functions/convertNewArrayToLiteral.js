const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertNewArrayToLiteral(ast) {
    recast.visit(ast, {
        visitNewExpression: function (path) {
            const node = path.node;

            if (n.Identifier.check(node.callee) && node.callee.name === 'Array') {
                const newArrayLiteral = b.arrayExpression(node.arguments);
                path.replace(newArrayLiteral);
            }
            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { convertNewArrayToLiteral };
