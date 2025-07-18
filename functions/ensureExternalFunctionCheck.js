const recast = require('recast');
const babelParser = require('@babel/parser');

const n = recast.types.namedTypes;
const b = recast.types.builders;
const visit = recast.types.visit;

function isInsideIfStatement(path) {
    while (path) {
        if (n.IfStatement.check(path.node)) {
            return true;
        }
        path = path.parentPath;
    }
    return false;
}

function ensureExternalFunctionCheck(ast) {
    const externalCalls = new Map();

    visit(ast, {
        visitCallExpression(path) {
            const callee = path.node.callee;

            if (
                n.MemberExpression.check(callee) &&
                n.MemberExpression.check(callee.object) &&
                n.Identifier.check(callee.object.object) &&
                callee.object.object.name === 'Insider' &&
                callee.object.property.name === '__external'
            ) {
                const fnName = callee.property.name;

                if (isInsideIfStatement(path)) {
                    return false;
                }

                if (!externalCalls.has(fnName)) {
                    externalCalls.set(fnName, []);
                }
                externalCalls.get(fnName).push(path);
            }

            this.traverse(path);
        }
    });

    const existingChecks = new Set();

    visit(ast, {
        visitIfStatement(path) {
            const test = path.node.test;

            if (
                n.CallExpression.check(test) &&
                n.MemberExpression.check(test.callee) &&
                test.callee.object.name === 'Insider.fns' &&
                test.callee.property.name === 'isFunction' &&
                n.MemberExpression.check(test.arguments[0]) &&
                n.MemberExpression.check(test.arguments[0].object) &&
                test.arguments[0].object.object.name === 'Insider' &&
                test.arguments[0].object.property.name === '__external'
            ) {
                const fnName = test.arguments[0].property.name;
                existingChecks.add(fnName);
            }

            this.traverse(path);
        }
    });

    const missing = [...externalCalls.keys()].filter(fn => !existingChecks.has(fn));

    for (const fnName of missing) {
        const calls = externalCalls.get(fnName);

        const callNodes = calls.map(callPath => {
            if (callPath.parentPath && callPath.parentPath.node.type === 'ExpressionStatement') {
                return callPath.parentPath.node;
            }
            return b.expressionStatement(callPath.node);
        });

        let insertionDone = false;

        for (const callPath of calls) {
            let parent = callPath.parentPath;

            while (parent && !Array.isArray(parent.node.body)) {
                parent = parent.parentPath;
            }

            if (parent && Array.isArray(parent.node.body)) {
                const body = parent.node.body;

                const exprNode = callPath.parentPath ? callPath.parentPath.node : callPath.node;
                const idx = body.findIndex(n => n === exprNode);

                if (idx !== -1) {
                    const ifNode = b.ifStatement(
                        b.callExpression(
                            b.memberExpression(
                                b.memberExpression(b.identifier('Insider'), b.identifier('fns')),
                                b.identifier('isFunction')
                            ),
                            [
                                b.memberExpression(
                                    b.memberExpression(b.identifier('Insider'), b.identifier('__external')),
                                    b.identifier(fnName)
                                )
                            ]
                        ),
                        b.blockStatement(callNodes),
                        b.blockStatement([
                            b.expressionStatement(
                                b.callExpression(
                                    b.memberExpression(
                                        b.memberExpression(b.identifier('Insider'), b.identifier('logger')),
                                        b.identifier('log')
                                    ),
                                    [b.stringLiteral(`Insider.__external.${fnName} is not a function`)]
                                )
                            )
                        ])
                    );

                    body.splice(idx, 0, ifNode);

                    for (const cPath of calls) {
                        if (cPath.parentPath) {
                            cPath.parentPath.prune();
                        } else {
                            cPath.prune();
                        }
                    }

                    insertionDone = true;
                }
            }
        }

        if (!insertionDone) {
            const ifNode = b.ifStatement(
                b.callExpression(
                    b.memberExpression(
                        b.memberExpression(b.identifier('Insider'), b.identifier('fns')),
                        b.identifier('isFunction')
                    ),
                    [
                        b.memberExpression(
                            b.memberExpression(b.identifier('Insider'), b.identifier('__external')),
                            b.identifier(fnName)
                        )
                    ]
                ),
                b.blockStatement(callNodes),
                b.blockStatement([
                    b.expressionStatement(
                        b.callExpression(
                            b.memberExpression(
                                b.memberExpression(b.identifier('Insider'), b.identifier('logger')),
                                b.identifier('log')
                            ),
                            [b.stringLiteral(`Insider.__external.${fnName} is not a function`)]
                        )
                    )
                ])
            );
            ast.program.body.unshift(ifNode);

            for (const cPath of calls) {
                if (cPath.parentPath) {
                    cPath.parentPath.prune();
                } else {
                    cPath.prune();
                }
            }
        }
    }

    return recast.print(ast).code;
}

module.exports = { ensureExternalFunctionCheck };
