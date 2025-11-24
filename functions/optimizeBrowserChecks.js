const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function optimizeBrowserChecks(ast) {
    const targets = ['isDesktop', 'isMobile'];

    targets.forEach(functionName => {
        const analysis = {
            declarations: [],
            directCalls: [],
            variableUsage: {}
        };

        recast.visit(ast, {
            visitCallExpression(path) {
                const callee = path.node.callee;
                const isTargetCall =
                    n.MemberExpression.check(callee) && 
                    n.Identifier.check(callee.property) &&
                    callee.property.name === functionName && 
                    n.MemberExpression.check(callee.object) &&
                    n.Identifier.check(callee.object.property) && 
                    callee.object.property.name === 'browser' &&
                    n.Identifier.check(callee.object.object) && 
                    callee.object.object.name === 'Insider';

                if (isTargetCall) {
                    if (n.VariableDeclarator.check(path.parent.node) && path.parent.node.init === path.node) {
                        const varName = path.parent.node.id.name;
                        analysis.declarations.push({
                            varName: varName,
                            declarationPath: path.parentPath.parentPath
                        });
                        analysis.variableUsage[varName] = [];
                    } else {
                        analysis.directCalls.push(path);
                    }
                }
                this.traverse(path);
            },
            visitIdentifier(path) {
                const varName = path.node.name;
                if (analysis.variableUsage.hasOwnProperty(varName)) {
                    if (!(n.VariableDeclarator.check(path.parent.node) && path.parent.node.id === path.node)) {
                        analysis.variableUsage[varName].push(path);
                    }
                }
                this.traverse(path);
            }
        });

        analysis.declarations.forEach(({ varName, declarationPath }) => {
            const usages = analysis.variableUsage[varName] || [];

            if (usages.length === 1 && declarationPath && declarationPath.node && declarationPath.node.declarations) {
                const usagePath = usages[0];
                const init = declarationPath.node.declarations[0]?.init;
                
                if (init && n.CallExpression.check(init)) {
                    const newCallExpr = b.callExpression(
                        b.memberExpression(
                            b.memberExpression(
                                b.identifier('Insider'),
                                b.identifier('browser')
                            ),
                            b.identifier(functionName)
                        ),
                        []
                    );
                    
                    usagePath.replace(newCallExpr);
                    declarationPath.prune();
                }
            }
        });

        if (analysis.directCalls.length > 1) {
            let blockPath = analysis.directCalls[0];
            
            while (blockPath && blockPath.parentPath) {
                if (n.BlockStatement.check(blockPath.node) || n.Program.check(blockPath.node)) {
                    break;
                }
                blockPath = blockPath.parentPath;
            }

            const varName = functionName;

            const newDeclaration = b.variableDeclaration('const', [
                b.variableDeclarator(
                    b.identifier(varName), 
                    b.callExpression(
                        b.memberExpression(
                            b.memberExpression(
                                b.identifier('Insider'),
                                b.identifier('browser')
                            ),
                            b.identifier(functionName)
                        ),
                        []
                    )
                )
            ]);

            analysis.directCalls.forEach(callPath => {
                const identifierNode = b.identifier(varName);
                callPath.replace(identifierNode);
            });

            if (blockPath) {
                if (n.Program.check(blockPath.node)) {
                    blockPath.node.body.unshift(newDeclaration);
                } else if (n.BlockStatement.check(blockPath.node)) {
                    blockPath.node.body.unshift(newDeclaration);
                }
            }
        }
    });

    return ast;
}

module.exports = { optimizeBrowserChecks };