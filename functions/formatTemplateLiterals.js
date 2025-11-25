const recast = require('recast');
const { namedTypes: n } = recast.types;

function formatTemplateLiterals(ast) {
    recast.visit(ast, {
        visitTemplateLiteral(path) {
            for (let i = 0; i < path.node.quasis.length; i++) {
                const quasi = path.node.quasis[i];
                
                if (i > 0 && !quasi.value.raw.startsWith(' ')) {
                    quasi.value.raw = ' ' + quasi.value.raw;
                    quasi.value.cooked = quasi.value.cooked ? ' ' + quasi.value.cooked : quasi.value.raw;
                }
                
                if (i < path.node.quasis.length - 1 && !quasi.value.raw.endsWith(' ')) {
                    quasi.value.raw = quasi.value.raw + ' ';
                    quasi.value.cooked = quasi.value.cooked ? quasi.value.cooked + ' ' : quasi.value.raw;
                }
            }

            return false;
        }
    });

    return ast;
}

module.exports = { formatTemplateLiterals };