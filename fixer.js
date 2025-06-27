const recast = require('recast');
const parser = require('@babel/parser');

const { removeConsoleLog } = require('./functions/removeConsoleLog');
const { clearVariableNames } = require('./functions/clearVariableNames');
const { clearFunctionName } = require('./functions/clearFunctionName');

const parseOptions = {
    parser: {
        parse(source) {
            return parser.parse(source, {
                sourceType: 'module',
                plugins: ['jsx', 'classProperties']
            });
        }
    }
};

const fixCode = (code) => {
    const AST = recast.parse(code, parseOptions);

    removeConsoleLog(AST);
    clearVariableNames(AST);
    clearFunctionName(AST);

    return recast.print(AST).code;
};

module.exports = { fixCode };
