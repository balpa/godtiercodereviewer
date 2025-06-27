const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function replaceCampaignStorageAccessor(ast) {
    recast.types.visit(ast, {
        visitCallExpression(path) {
            const { node } = path;

            if (
                n.MemberExpression.check(node.callee) &&
                n.MemberExpression.check(node.callee.object) &&
                n.MemberExpression.check(node.callee.object.object) &&
                n.Identifier.check(node.callee.object.object.object) &&
                node.callee.object.object.object.name === 'Insider' &&
                node.callee.object.object.property.name === 'storage' &&
                node.callee.object.property.name === 'localStorage' &&
                node.callee.property.name === 'get' &&
                node.arguments.length === 1 &&
                n.TemplateLiteral.check(node.arguments[0])
            ) {
                const template = node.arguments[0];

                if (
                    template.quasis.length === 2 &&
                    template.quasis[0].value.raw === 'sp-camp-' &&
                    template.quasis[1].value.raw === ''
                ) {
                    const variationIdNode = template.expressions[0];

                    const newCall = b.callExpression(
                        b.memberExpression(
                            b.memberExpression(
                                b.identifier('Insider'),
                                b.identifier('campaign')
                            ),
                            b.identifier('getCampaignStorage')
                        ),
                        [variationIdNode]
                    );

                    path.replace(newCall);
                    return false;
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { replaceCampaignStorageAccessor };
