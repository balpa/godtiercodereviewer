const recast = require('recast');
const { namedTypes: n, visit } = recast.types;

function convertFallbackToOptionalChaining(ast) {
    visit(ast, {
        visitMemberExpression(path) {
            const { node } = path;
            const memberObject = node.object;

            if (n.LogicalExpression.check(memberObject) && memberObject.operator === '||') {
                const rightSide = memberObject.right;

                if (n.ObjectExpression.check(rightSide) && rightSide.properties.length === 0) {
                    node.object = memberObject.left;
                    node.optional = true;
                }
            }

            this.traverse(path);
        },

        visitLogicalExpression(path) {
            if (path.node.operator === '||') {
                path.node.operator = '??';
            }
            
            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { convertFallbackToOptionalChaining };