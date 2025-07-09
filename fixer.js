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
const { replaceVarToConst } = require('./functions/replaceVarToConst')
const { convertToFunctionExpression } = require('./functions/convertToFunctionExpression')
const { convertNewArrayToLiteral } = require('./functions/convertNewArrayToLiteral')
//FIX: convertObjectPropertiesToShorthand not working
const { convertObjectPropertiesToShorthand } = require('./functions/convertObjectPropertiesToShorthand')
const { applyDestructuringRefactoring } = require('./functions/applyDestructuringRefactoring')
const { convertLengthControlForIfCondition } = require('./functions/convertLengthControlForIfCondition')
const { convertStringCasting } = require('./functions/convertStringCasting')
//const { addErrorHandlerIfMissing } = require('./functions/addErrorHandlerIfMissing')
const { addVariationIdForEventNamespaces } = require('./functions/addVariationIdForEventNamespaces')

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

const functionCaller = (fn, ast) => {
    if (typeof fn === 'function') {
        fn(ast);
    }
};

const fixCode = (code) => {
    const ast = recast.parse(code, parseOptions);

    const declaredFunctions = [
        removeConsoleLog, clearVariableNames, clearFunctionName, ensureExternalFunctionCheck, replaceObjectKeys,
        convertIncludesFunction, replaceCampaignStorageAccessor, replaceSystemRulesCalls, addDollarPrefixForNodeElements,
        addDollarPrefixForAccessNodesParam, addDollarPrefixForOnElementLoadedParam, convertEs5ToArrowFunctions,
        replaceVarToConst, convertToFunctionExpression, convertNewArrayToLiteral, convertObjectPropertiesToShorthand,
        applyDestructuringRefactoring, convertLengthControlForIfCondition, convertStringCasting,
        addVariationIdForEventNamespaces
    ]

    declaredFunctions.forEach((fn) => {
        functionCaller(fn, ast)
    })

    return recast.print(ast, {
        retainLines: true,
        quote: 'single'
      }).code;
};

module.exports = { fixCode };
