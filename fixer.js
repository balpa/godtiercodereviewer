const recast = require('recast');
const parser = require('@babel/parser');
const prettier = require('prettier');

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
const { addErrorHandlerToRequests } = require('./functions/addErrorHandlerIfMissing')
const { addVariationIdForEventNamespaces } = require('./functions/addVariationIdForEventNamespaces')
const { enhanceEventHandlers } = require('./functions/enhanceEventHandlers')
const { convertToAccessNodes } = require('./functions/convertToAccessNodes');
const { optimizeBrowserChecks } = require('./functions/optimizeBrowserChecks');
const { formatTemplateLiterals } = require('./functions/formatTemplateLiterals');
const { convertRGBtoHEX } = require('./functions/convertRGBtoHEX');
const { convertLogicalOrToNullish } = require('./functions/convertLogicalOrToNullish');
const { convertFallbackToOptionalChaining } = require('./functions/convertFallbackToOptionalChaining');
const { ensureUseStrictInIIFE } = require('./functions/ensureUseStrictInIIFE');
const { simplifyTemplateLiterals } = require('./functions/simplifyTemplateLiterals');
const { convertTimeToDateHelper } = require('./functions/convertTimeToDateHelper');
const { convertStorageExpireTimeToDateHelper } = require('./functions/convertStorageExpireTimeToDateHelper');
const { convertStringConcatenationToTemplateLiteral } = require('./functions/convertStringConcatenationToTemplateLiteral');
//const { reorderSelfMethods } = require('./functions/reorderSelfMethods');
const parseOptions = {
    parser: {
        parse(source) {
            return parser.parse(source, {
                sourceType: 'module',
                plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
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
        addVariationIdForEventNamespaces, enhanceEventHandlers, addErrorHandlerToRequests, convertToAccessNodes,
        optimizeBrowserChecks, convertRGBtoHEX, convertFallbackToOptionalChaining, convertLogicalOrToNullish,
        simplifyTemplateLiterals, formatTemplateLiterals, convertTimeToDateHelper, convertStorageExpireTimeToDateHelper,
        convertStringConcatenationToTemplateLiteral
    ]

    declaredFunctions.forEach((fn) => {
        functionCaller(fn, ast)
    })

    let recastCode = recast.print(ast, {
        retainLines: true,
        quote: 'single'
    }).code;

    recastCode = recastCode.replace(/\$\{([^}]+)\}/g, (match, content) => {
        const trimmed = content.trim();
        return `\${ ${trimmed} }`;
    });

    return recastCode;
};

module.exports = { fixCode };
