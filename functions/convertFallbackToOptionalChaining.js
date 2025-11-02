const recast = require('recast');
const { namedTypes: n, visit } = recast.types;

function convertFallbackToOptionalChaining(ast) {
    visit(ast, {
        visitMemberExpression(path) {
            const { node } = path;
            const obj = node.object;

            if (
                n.LogicalExpression.check(obj) &&
                obj.operator === '||' &&
                n.ObjectExpression.check(obj.right) &&
                obj.right.properties.length === 0
            ) {
                node.object = obj.left;
                node.optional = true;
            }

            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { convertFallbackToOptionalChaining };
