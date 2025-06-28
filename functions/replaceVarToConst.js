const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function replaceVarToConst(ast) {
    recast.visit(ast, {
        visitVariableDeclaration: function (path) {
            const node = path.node;

            if (node.kind === 'var') {
                node.kind = 'const';
            }
            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { replaceVarToConst };
