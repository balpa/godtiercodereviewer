const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function convertCssColorsToHex(str) {
    const componentToHex = (c) => {
        const num = parseInt(c, 10);
        const hex = num.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    };

    const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g;

    return str.replace(rgbRegex, (match, r, g, b, a) => {
        const hexR = componentToHex(r);
        const hexG = componentToHex(g);
        const hexB = componentToHex(b);
        let hexA = '';

        if (a !== undefined) {
            const alphaValue = Math.round(parseFloat(a) * 255);
            hexA = componentToHex(alphaValue);
        }

        return `#${hexR}${hexG}${hexB}${hexA}`;
    });
}

function convertRGBtoHEX(ast) {
    recast.visit(ast, {
        visitLiteral(path) {
            const { node } = path;

            if (typeof node.value === 'string') {
                const originalValue = node.value;
                const newValue = convertCssColorsToHex(originalValue);

                if (originalValue !== newValue) {
                    path.replace(b.literal(newValue));
                }
            }
            this.traverse(path);
        },

        visitTemplateLiteral(path) {
            const { node } = path;
            
            if (!node.quasis || !node.expressions) {
                this.traverse(path);
                return;
            }
            
            let hasChanged = false;

            const newQuasis = node.quasis.map(quasi => {
                const originalRaw = quasi.value.raw;
                const newRaw = convertCssColorsToHex(originalRaw);

                if (originalRaw !== newRaw) {
                    hasChanged = true;
                }

                return b.templateElement({ raw: newRaw, cooked: newRaw }, quasi.tail);
            });

            if (hasChanged) {
                const newNode = b.templateLiteral(newQuasis, node.expressions);
                path.replace(newNode);
            }

            this.traverse(path);
        }
    });

    return ast;
}

module.exports = { convertRGBtoHEX };