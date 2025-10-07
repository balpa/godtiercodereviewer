const recast = require('recast');
const { namedTypes: n, builders: b, visit } = recast.types;

function simplifyTemplateLiterals(ast) {
    visit(ast, {
        visitTemplateLiteral(path) {
            const { node } = path;

            const isSinglePureExpression =
                node.expressions.length === 1 &&
                node.quasis.length === 2 &&
                node.quasis[0].value.raw === '' &&
                node.quasis[1].value.raw === '';

            if (isSinglePureExpression) {
                path.replace(node.expressions[0]);
                return false;
            }

            const isPureString =
                node.expressions.length === 0 &&
                node.quasis.length === 1;
            
            if (isPureString) {
                path.replace(b.literal(node.quasis[0].value.cooked));
                return false;
            }

            this.traverse(path);
        }
    });
}

module.exports = { simplifyTemplateLiterals };