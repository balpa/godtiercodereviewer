const recast = require('recast');
const { camelCase } = require('./camelCase');

function clearFunctionName(ast) {
    recast.types.visit(ast, {
        visitFunctionDeclaration(path) {
            const { node } = path;
            if (node.id && node.id.name) {
                const newName = camelCase(node.id.name);
                if (newName !== node.id.name) {
                    node.id.name = newName;
                }
            }
            this.traverse(path);
        }
    });
}

module.exports = { clearFunctionName };
