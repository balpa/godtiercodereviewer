const recast = require('recast');
const { namedTypes: n, builders: b, visit } = recast.types;

function makeObjectPropertiesShorthand(ast) {
    visit(ast, {
        visitObjectExpression(path) {
            path.node.properties.forEach((prop, index) => {
                if (
                    n.Property.check(prop) &&
                    !prop.shorthand &&
                    n.Identifier.check(prop.key) &&
                    n.Identifier.check(prop.value) &&
                    prop.key.name === prop.value.name
                ) {
                    path.node.properties[index] = b.property(
                        'init',
                        b.identifier(prop.key.name),
                        b.identifier(prop.value.name)
                    );
                    path.node.properties[index].shorthand = true;
                }
            });

            this.traverse(path);
        }
    });

    return recast.print(ast).code;
}

module.exports = { makeObjectPropertiesShorthand };
