const recast = require('recast');
const parser = require('@babel/parser');

//TODO: return etmeden önce ESlint ekle
//TODO: babel generator ile kod return edilebilir noktalı virgül için. 
//const generator = require('@babel/generator').default;

const { removeConsoleLog } = require('./functions/removeConsoleLog');
const { clearVariableNames } = require('./functions/clearVariableNames');
const { clearFunctionName } = require('./functions/clearFunctionName');
const { ensureExternalFunctionCheck } = require('./functions/ensureExternalFunctionCheck');
const { replaceObjectKeys } = require('./functions/replaceObjectKeys')
const { convertIncludesFunction } = require('./functions/convertIncludesFunction')
const { replaceCampaignStorageAccessor } = require('./functions/replaceCampaignStorageAccessor')
const { replaceSystemRulesCalls } = require('./functions/replaceSystemRulesCalls')
const { addDollarPrefixForNodeElements } = require('./functions/addDollarPrefixForNodeElements')
const { addDollarPrefixForAccessNodesParam } = require('./functions/addDollarPrefixForAccessNodesParam')
const { addDollarPrefixForOnElementLoadedParam } = require('./functions/addDollarPrefixForOnElementLoadedParam')
const { convertEs5ToArrowFunctions } = require('./functions/convertEs5ToArrowFunctions')

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
    replaceCampaignStorageAccessor(ast);
    replaceSystemRulesCalls(ast);
    addDollarPrefixForNodeElements(ast);
    addDollarPrefixForAccessNodesParam(ast);
    addDollarPrefixForOnElementLoadedParam(ast);
    convertEs5ToArrowFunctions(ast);


    return recast.print(ast, {
        retainLines: true,
        quote: 'single'
      }).code;
};

module.exports = { fixCode };
