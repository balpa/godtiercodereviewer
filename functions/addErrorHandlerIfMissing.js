const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function addErrorHandlerToRequests(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { node } = path;

            const callee = node.callee;

            const isTargetCall =
                n.MemberExpression.check(callee) &&
                n.MemberExpression.check(callee.object) &&
                n.Identifier.check(callee.object.object) &&
                callee.object.object.name === 'Insider' &&
                callee.object.property.name === 'request' &&
                ['get', 'post'].includes(callee.property.name);

            if (!isTargetCall) return false;

            const [arg] = node.arguments;

            if (!n.ObjectExpression.check(arg)) return false;

            const alreadyHasErrorProp = arg.properties.some(
                (prop) => n.Identifier.check(prop.key) && prop.key.name === 'error'
            );

            if (!alreadyHasErrorProp) {
                const errorFnAST = recast.parse(
                `(error) => {
    Insider.logger.log(\`error during request: \${ error }\`);
}`);
                const errorFn = errorFnAST.program.body[0].expression;

                const errorHandlerProp = b.property(
                    'init',
                    b.identifier('error'),
                    errorFn
                );

                arg.properties.push(errorHandlerProp);
            }

            return false;
        }
    });
}

module.exports = { addErrorHandlerToRequests };
