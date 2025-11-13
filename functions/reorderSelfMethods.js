const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function reorderSelfMethods(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args } = path.node;

            if (
                n.FunctionExpression.check(callee) ||
                n.ArrowFunctionExpression.check(callee)
            ) {
                const params = callee.params;
                const body = callee.body;

                if (
                    params.length > 0 &&
                    n.Identifier.check(params[0]) &&
                    params[0].name === 'self' &&
                    n.BlockStatement.check(body)
                ) {
                    const statements = body.body;
                    const methodDefinitions = [];
                    const otherStatements = [];
                    let returnStatement = null;
                    let initMethodIndex = -1;

                    statements.forEach((stmt, index) => {
                        if (
                            n.ExpressionStatement.check(stmt) &&
                            n.AssignmentExpression.check(stmt.expression) &&
                            stmt.expression.operator === '=' &&
                            n.MemberExpression.check(stmt.expression.left) &&
                            n.Identifier.check(stmt.expression.left.object) &&
                            stmt.expression.left.object.name === 'self' &&
                            (n.FunctionExpression.check(stmt.expression.right) ||
                             n.ArrowFunctionExpression.check(stmt.expression.right))
                        ) {
                            const methodName = stmt.expression.left.property.name;
                            methodDefinitions.push({
                                name: methodName,
                                statement: stmt,
                                originalIndex: index,
                                dependencies: []
                            });

                            if (methodName === 'init') {
                                initMethodIndex = methodDefinitions.length - 1;
                            }
                        } else if (n.ReturnStatement.check(stmt)) {
                            returnStatement = stmt;
                        } else {
                            otherStatements.push(stmt);
                        }
                    });

                    if (methodDefinitions.length > 1 && initMethodIndex >= 0) {
                        const initMethod = methodDefinitions[initMethodIndex];
                        const callOrder = [];
                        
                        const methodBody = initMethod.statement.expression.right.body;

                        recast.visit(methodBody, {
                            visitCallExpression(innerPath) {
                                const innerCallee = innerPath.node.callee;
                                
                                if (
                                    n.MemberExpression.check(innerCallee) &&
                                    n.Identifier.check(innerCallee.object) &&
                                    innerCallee.object.name === 'self' &&
                                    n.Identifier.check(innerCallee.property)
                                ) {
                                    const calledMethod = innerCallee.property.name;
                                    if (!callOrder.includes(calledMethod)) {
                                        callOrder.push(calledMethod);
                                    }
                                }
                                
                                this.traverse(innerPath);
                            }
                        });

                        const sorted = orderByCallSequence(methodDefinitions, initMethod, callOrder);
                        
                        if (sorted) {
                            const newBody = [
                                ...otherStatements,
                                ...sorted.map(m => m.statement)
                            ];

                            if (returnStatement) {
                                newBody.push(returnStatement);
                            }

                            body.body = newBody;
                        }
                    }
                }
            }

            this.traverse(path);
        }
    });
}

function orderByCallSequence(methods, initMethod, callOrder) {
    const sorted = [initMethod];
    const methodMap = new Map();
    methods.forEach(m => methodMap.set(m.name, m));
    
    for (const methodName of callOrder) {
        const method = methodMap.get(methodName);
        if (method && method.name !== 'init') {
            sorted.push(method);
        }
    }
    
    for (const method of methods) {
        if (!sorted.includes(method)) {
            sorted.push(method);
        }
    }
    
    return sorted;
}

module.exports = { reorderSelfMethods };
