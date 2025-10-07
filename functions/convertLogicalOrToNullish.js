const recast = require('recast');
const { visit } = recast.types;


function convertLogicalOrToNullish(ast) {
    visit(ast, {
        visitLogicalExpression(path) {
            if (path.node.operator === '||') {
                path.node.operator = '??';
            }

            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { convertLogicalOrToNullish };