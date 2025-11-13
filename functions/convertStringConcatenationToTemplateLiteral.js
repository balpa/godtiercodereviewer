const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertStringConcatenationToTemplateLiteral(ast) {
    recast.visit(ast, {
        visitBinaryExpression(path) {
            const { operator, left, right } = path.node;

            if (operator === '+') {
                const parts = [];
                let current = path.node;
                
                const collectParts = (node) => {
                    if (n.BinaryExpression.check(node) && node.operator === '+') {
                        collectParts(node.left);
                        collectParts(node.right);
                    } else {
                        parts.push(node);
                    }
                };

                collectParts(current);

                const hasStringLiteral = parts.some(part => 
                    (part.type === 'StringLiteral' || part.type === 'Literal') && 
                    typeof part.value === 'string'
                );

                if (hasStringLiteral && parts.length > 1) {
                    const quasis = [];
                    const expressions = [];
                    let currentString = '';

                    parts.forEach((part, index) => {
                        const isString = (part.type === 'StringLiteral' || part.type === 'Literal') && 
                            typeof part.value === 'string';
                        
                        if (isString) {
                            currentString += part.value;
                        } else {
                            quasis.push(b.templateElement(
                                { raw: currentString, cooked: currentString },
                                false
                            ));
                            expressions.push(part);

                            currentString = '';
                        }
                    });

                    quasis.push(b.templateElement(
                        { raw: currentString, cooked: currentString },
                        true
                    ));

                    path.replace(b.templateLiteral(quasis, expressions));
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertStringConcatenationToTemplateLiteral };
