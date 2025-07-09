const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function changeLengthControlForIfCondition(ast) {
    recast.visit(ast, {
        visitIfStatement(path) {
            const test = path.node.test;

            if (
                n.MemberExpression.check(test) &&
                n.Identifier.check(test.property) &&
                test.property.name === 'length'
            ) {
                const newTest = b.binaryExpression(
                    '>',
                    test,
                    b.literal(0)
                );
                path.node.test = newTest;
            }

            this.traverse(path);
        },
    });
}

module.exports = { changeLengthControlForIfCondition };
