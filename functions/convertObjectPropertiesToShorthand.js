const recast = require('recast');
const { namedTypes: n, visit } = recast.types;

function convertObjectPropertiesToShorthand(ast) {
    visit(ast, {
        visitObjectProperty(path) {
            const prop = path.node;
            
            if (
                !prop.shorthand &&
                !prop.computed &&
                n.Identifier.check(prop.key) &&
                n.Identifier.check(prop.value) &&
                prop.key.name === prop.value.name
            ) {
                prop.shorthand = true;
            }
            
            this.traverse(path);
        }
    });

    return ast;
}

module.exports = { convertObjectPropertiesToShorthand };
