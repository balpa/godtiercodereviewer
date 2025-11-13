const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertStorageExpireTimeToDateHelper(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args} = path.node;

            const isStorageSet =
                callee.type === 'MemberExpression' &&
                callee.property && callee.property.name === 'set' &&
                callee.object && callee.object.type === 'MemberExpression' &&
                callee.object.property && 
                (callee.object.property.name === 'localStorage' || 
                 callee.object.property.name === 'session') &&
                callee.object.object && callee.object.object.type === 'MemberExpression' &&
                callee.object.object.property && callee.object.object.property.name === 'storage' &&
                callee.object.object.object && callee.object.object.object.name === 'Insider';

            if (isStorageSet && args.length > 0) {
                const configArg = args[0];

                if (configArg.type === 'ObjectExpression') {
                    configArg.properties.forEach((prop) => {
                        if (
                            (prop.type === 'Property' || prop.type === 'ObjectProperty') &&
                            prop.key && prop.key.type === 'Identifier' &&
                            prop.key.name === 'expires' &&
                            prop.value && 
                            (prop.value.type === 'Literal' || 
                             prop.value.type === 'NumericLiteral') &&
                            typeof prop.value.value === 'number'
                        ) {
                            const expiresValue = prop.value.value;

                            if (expiresValue >= 0 && expiresValue <= 366) {
                                prop.value = b.callExpression(
                                    b.memberExpression(
                                        b.memberExpression(
                                            b.identifier('Insider'),
                                            b.identifier('dateHelper')
                                        ),
                                        b.identifier('addDay')
                                    ),
                                    [b.numericLiteral(expiresValue)]
                                );
                            }
                        }
                    });
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertStorageExpireTimeToDateHelper };
