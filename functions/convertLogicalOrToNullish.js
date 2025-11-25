const recast = require('recast');
const { namedTypes: n, visit } = recast.types;


function convertLogicalOrToNullish(ast) {
    visit(ast, {
        visitLogicalExpression(path) {
            if (path.node.operator === '||') {
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

                if (!isInsideIfCondition) {
                    path.node.operator = '??';
                }
            }

            this.traverse(path);
        }
    });

    return ast;
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

module.exports = { convertLogicalOrToNullish };