const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function addVariationIdForEventNamespaces(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args } = path.node;

            const isInsiderOnceCall =
                n.MemberExpression.check(callee) &&
                n.Identifier.check(callee.property) &&
                callee.property.name === 'once' &&
                n.MemberExpression.check(callee.object) &&
                n.Identifier.check(callee.object.object) &&
                callee.object.object.name === 'Insider' &&
                n.Identifier.check(callee.object.property) &&
                callee.object.property.name === 'eventManager';

            if (isInsiderOnceCall && args.length > 0) {
                const eventArg = args[0];

                if (
                    n.StringLiteral.check(eventArg) &&
                    !eventArg.value.includes('variationId')
                ) {
                    const prefix = eventArg.value;

                    args[0] = b.templateLiteral(
                        [
                            b.templateElement({ raw: prefix + ':', cooked: prefix + ':' }, false),
                            b.templateElement({ raw: '', cooked: '' }, true)
                        ],
                        [b.identifier('variationId')]
                    );
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { addVariationIdForEventNamespaces };
