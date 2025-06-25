const camelCase = (str) => {
    return str
        .replace(/[_-]+/g, ' ')
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
};

const fixCode = (code) => {
    let fixedCode = code;

    fixedCode = fixedCode.replace(/^\s*console\.log\(.*\);\s*$/gm, '');

    fixedCode = fixedCode.replace(
        /function\s+([a-zA-Z0-9_$]+)/g,
        (match, p1) => `function ${camelCase(p1)}`
    );

    fixedCode = fixedCode.replace(
        /const\s+([a-zA-Z0-9_$]+)\s*=\s*\(/g,
        (match, p1) => `const ${camelCase(p1)} = (`
    );

    return fixedCode;
}

module.exports = { fixCode };
