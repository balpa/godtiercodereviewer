const recast = require('recast');
const parser = require('@babel/parser');
//const generator = require('@babel/generator').default;

const { removeConsoleLog } = require('./functions/removeConsoleLog');
const { clearVariableNames } = require('./functions/clearVariableNames');
const { clearFunctionName } = require('./functions/clearFunctionName');
const { ensureExternalFunctionCheck } = require('./functions/ensureExternalFunctionCheck');
const { replaceObjectKeys } = require('./functions/replaceObjectKeys')
const { convertIncludesFunction } = require('./functions/convertIncludesFunction')

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
    const ast = recast.parse(code, parseOptions);

    removeConsoleLog(ast);
    clearVariableNames(ast);
    clearFunctionName(ast);
    ensureExternalFunctionCheck(ast);
    replaceObjectKeys(ast);
    convertIncludesFunction(ast);


    return recast.print(ast).code;
};

module.exports = { fixCode };
