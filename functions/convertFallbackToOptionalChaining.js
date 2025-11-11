const recast = require('recast');
const { namedTypes: n, visit } = recast.types;

function convertFallbackToOptionalChaining(ast) {
    visit(ast, {
        visitMemberExpression(path) {
            const { node } = path;
            const obj = node.object;

            let currentPath = path.parent;
            let isInsideIfCondition = false;
            
            while (currentPath) {
                if (n.IfStatement.check(currentPath.node)) {
                    if (currentPath.get('test').value === path.node || 
                        isAncestor(currentPath.get('test'), path)) {
                        isInsideIfCondition = true;
                        break;
                    }
                }
                currentPath = currentPath.parent;
            }

            if (!isInsideIfCondition &&
                n.LogicalExpression.check(obj) &&
                obj.operator === '||' &&
                n.ObjectExpression.check(obj.right) &&
                obj.right.properties.length === 0
            ) {
                node.object = obj.left;
                node.optional = true;
            }

            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

function isAncestor(ancestorPath, descendantPath) {
    let current = descendantPath;
    while (current) {
        if (current === ancestorPath || current.value === ancestorPath.value) {
            return true;
        }
        current = current.parent;
    }
    return false;
}

module.exports = { convertFallbackToOptionalChaining };
