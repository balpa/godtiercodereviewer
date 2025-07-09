const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

const highFrequencyEvents = ['scroll', 'mousemove', 'touchmove', 'resize'];

function shouldWrap(eventName) {
    return highFrequencyEvents.some((evt) => eventName.startsWith(evt));
}

function wrapWith(fnName, innerFn, delay = 300) {
    return b.callExpression(
        b.memberExpression(
            b.memberExpression(b.identifier('Insider'), b.identifier('fns')),
            b.identifier(fnName)
        ),
        [innerFn, b.literal(delay)]
    );
}

function enhanceEventHandlers(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args } = path.node;

            if (
                n.MemberExpression.check(callee) &&
                n.Identifier.check(callee.property) &&
                callee.property.name === 'once' &&
                n.MemberExpression.check(callee.object) &&
                n.Identifier.check(callee.object.object) &&
                callee.object.object.name === 'Insider' &&
                callee.object.property.name === 'eventManager'
            ) {
                const [eventArg, , handlerArg] = args;

                let eventName = '';
                if (n.StringLiteral.check(eventArg)) {
                    eventName = eventArg.value;
                } else if (n.TemplateLiteral.check(eventArg)) {
                    eventName = eventArg.quasis.map((q) => q.value.cooked).join('');
                }

                if (!shouldWrap(eventName)) {
                    this.traverse(path);
                    return;
                }

                if (
                    n.CallExpression.check(handlerArg) &&
                    n.MemberExpression.check(handlerArg.callee) &&
                    n.MemberExpression.check(handlerArg.callee.object) &&
                    n.Identifier.check(handlerArg.callee.object.object) &&
                    handlerArg.callee.object.object.name === 'Insider' &&
                    handlerArg.callee.object.property.name === 'fns' &&
                    ['throttle', 'debounce'].includes(handlerArg.callee.property.name)
                ) {
                    this.traverse(path);
                    return;
                }

                let newFn = handlerArg;

                if (n.FunctionExpression.check(handlerArg)) {
                    newFn = b.arrowFunctionExpression(handlerArg.params, handlerArg.body, false);
                }

                args[2] = wrapWith('throttle', newFn, 300);
            }

            this.traverse(path);
        }
    });
}

module.exports = { enhanceEventHandlers };
