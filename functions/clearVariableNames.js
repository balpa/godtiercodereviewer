const recast = require('recast');
const { camelCase } = require('./camelCase');

function clearVariableNames(ast) {
    recast.types.visit(ast, {
        visitVariableDeclarator(path) {
            const { node } = path;
            if (node.id.type === 'Identifier') {
                const newName = camelCase(node.id.name);
                if (newName !== node.id.name) {
                    node.id.name = newName;
                }
            }
            this.traverse(path);
        }
    });
}

module.exports = { clearVariableNames };
