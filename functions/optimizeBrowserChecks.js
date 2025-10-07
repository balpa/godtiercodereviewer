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
                    n.MemberExpression.check(callee) && n.Identifier.check(callee.property) &&
                    callee.property.name === functionName && n.MemberExpression.check(callee.object) &&
                    n.Identifier.check(callee.object.property) && callee.object.property.name === 'browser' &&
                    n.Identifier.check(callee.object.object) && callee.object.object.name === 'Insider';

                if (isTargetCall) {
                    if (n.VariableDeclarator.check(path.parent.node) && path.parent.node.init === path.node) {
                        const varName = path.parent.node.id.name;
                        analysis.declarations.push({
                            varName: varName,
                            declarationPath: path.parentPath.parentPath,
                            scope: path.scope
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
                if (analysis.variableUsage[varName]) {
                    if (!(n.VariableDeclarator.check(path.parent.node) && path.parent.node.id === path.node)) {
                        analysis.variableUsage[varName].push(path);
                    }
                }
                this.traverse(path);
            }
        });

        analysis.declarations.forEach(({ varName, declarationPath, scope }) => {
            const usagesInScope = (analysis.variableUsage[varName] || []).filter(
                usagePath => usagePath.scope.path.node === scope.path.node
            );

            if (usagesInScope.length === 1) {
                const usagePath = usagesInScope[0];
                const callExpressionNode = declarationPath.node.declarations[0].init;

                usagePath.replace(callExpressionNode);
                declarationPath.prune();
            }
        });

        if (analysis.directCalls.length > 1) {
            let insertionScopePath = analysis.directCalls[0];
            while (insertionScopePath.parentPath) {
                if (n.BlockStatement.check(insertionScopePath.node)) break;
                insertionScopePath = insertionScopePath.parentPath;
            }

            const varName = functionName;
            const newDeclaration = b.variableDeclaration('const', [
                b.variableDeclarator(b.identifier(varName), analysis.directCalls[0].node)
            ]);

            analysis.directCalls.forEach(callPath => callPath.replace(b.identifier(varName)));

            if (insertionScopePath && n.BlockStatement.check(insertionScopePath.node)) {
                insertionScopePath.get('body').unshift(newDeclaration);
            } else {
                ast.program.body.unshift(newDeclaration);
            }
        }
    });

    return ast;
}

module.exports = { optimizeBrowserChecks };