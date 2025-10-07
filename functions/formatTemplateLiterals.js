const recast = require('recast');
const { namedTypes: n } = recast.types;

function formatTemplateLiterals(ast) {
    recast.visit(ast, {
        visitTemplateLiteral(path) {
            let needsReplacement = false;

            for (let i = 0; i < path.node.expressions.length; i++) {
                const quasiBefore = path.node.quasis[i];
                const quasiAfter = path.node.quasis[i + 1];

                if (!quasiBefore.value.raw.endsWith(' ') || !quasiAfter.value.raw.startsWith(' ')) {
                    needsReplacement = true;
                    break; 
                }
            }

            if (needsReplacement) {
                const nodeAsString = recast.print(path.node).code;
                const fixedString = nodeAsString.replace(/\$\{(?!\s)(.*?)(?<!\s)\}/g, '${ $1 }');

                const newNode = recast.parse(fixedString).program.body[0].expression;

                path.replace(newNode);
            }

            return false;
        }
    });

    return recast.print(ast).code;
}

module.exports = { formatTemplateLiterals };