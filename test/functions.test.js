const recast = require('recast');

const { ensureExternalFunctionCheck } = require('../functions/ensureExternalFunctionCheck');
const { convertFallbackToOptionalChaining } = require('../functions/convertFallbackToOptionalChaining');
const { convertLogicalOrToNullish } = require('../functions/convertLogicalOrToNullish');
const { replaceVarToConst } = require('../functions/replaceVarToConst');
const { addDollarPrefixForAccessNodesParam } = require('../functions/addDollarPrefixForAccessNodesParam');
const { convertEs5ToArrowFunctions } = require('../functions/convertEs5ToArrowFunctions');
const { convertToFunctionExpression } = require('../functions/convertToFunctionExpression');
const { addDollarPrefixForOnElementLoadedParam } = require('../functions/addDollarPrefixForOnElementLoadedParam');
const { ensureUseStrictInIIFE } = require('../functions/ensureUseStrictInIIFE');
const { convertRGBtoHEX } = require('../functions/convertRGBtoHEX');
const { convertNewArrayToLiteral } = require('../functions/convertNewArrayToLiteral');
const { applyDestructuringRefactoring } = require('../functions/applyDestructuringRefactoring');
const { convertObjectPropertiesToShorthand } = require('../functions/convertObjectPropertiesToShorthand');
const { convertStringConcatenationToTemplateLiteral } = require('../functions/convertStringConcatenationToTemplateLiteral');
const { convertIncludesFunction } = require('../functions/convertIncludesFunction');
const { replaceCampaignStorageAccessor } = require('../functions/replaceCampaignStorageAccessor');
const { replaceSystemRulesCalls } = require('../functions/replaceSystemRulesCalls');
const { addDollarPrefixForNodeElements } = require('../functions/addDollarPrefixForNodeElements');
const { convertLengthControlForIfCondition } = require('../functions/convertLengthControlForIfCondition');
const { convertStringCasting } = require('../functions/convertStringCasting');
const { addVariationIdForEventNamespaces } = require('../functions/addVariationIdForEventNamespaces');
const { convertTimeToDateHelper } = require('../functions/convertTimeToDateHelper');
const { convertStorageExpireTimeToDateHelper } = require('../functions/convertStorageExpireTimeToDateHelper');

const parseOptions = {
    parser: require('@babel/parser'),
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
};

const printOptions = {
    parser: require('@babel/parser'),
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
};

function testFunction(name, inputCode, expectedOutput, transformFunction) {
    console.log(`\nTesting: ${name}`);
    try {
        const ast = recast.parse(inputCode, parseOptions);
        const transformedAst = transformFunction(ast);
        const result = recast.print(transformedAst, printOptions).code;
        
        if (result.trim() === expectedOutput.trim()) {
            console.log(`✓ ${name} passed`);
            return true;
        } else {
            console.log(`✗ ${name} failed`);
            console.log('Expected:', expectedOutput);
            console.log('Got:', result);
            return false;
        }
    } catch (error) {
        console.error(`✗ ${name} failed:`, error.message);
        return false;
    }
}

console.log('=== Running Function Transformation Tests ===');

let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

if (testFunction(
    'convertFallbackToOptionalChaining',
    `const value = (obj || {}).prop;`,
    `const value = obj?.prop;`,
    convertFallbackToOptionalChaining
)) passedTests++; else failedTests++;

if (testFunction(
    'convertLogicalOrToNullish',
    `const value = something || 'default';`,
    `const value = something ?? 'default';`,
    convertLogicalOrToNullish
)) passedTests++; else failedTests++;

if (testFunction(
    'replaceVarToConst',
    `var x = 5;`,
    `const x = 5;`,
    replaceVarToConst
)) passedTests++; else failedTests++;

if (testFunction(
    'convertEs5ToArrowFunctions',
    `const fn = function(x) { return x * 2; };`,
    `const fn = x => { return x * 2; };`,
    convertEs5ToArrowFunctions
)) passedTests++; else failedTests++;

if (testFunction(
    'convertNewArrayToLiteral',
    `const arr = new Array();`,
    `const arr = [];`,
    convertNewArrayToLiteral
)) passedTests++; else failedTests++;

if (testFunction(
    'convertObjectPropertiesToShorthand',
    `const obj = { value: value };`,
    `const obj = { value };`,
    convertObjectPropertiesToShorthand
)) passedTests++; else failedTests++;

console.log('\n⚠ Skipping tests that require more complex code patterns:');
console.log('- convertStringConcatenationToTemplateLiteral');
console.log('- convertIncludesFunction');
console.log('- replaceCampaignStorageAccessor');
console.log('- replaceSystemRulesCalls');
console.log('- convertLengthControlForIfCondition');
console.log('- convertStringCasting');
console.log('- addDollarPrefixForAccessNodesParam');
console.log('- addDollarPrefixForOnElementLoadedParam');
console.log('- addVariationIdForEventNamespaces');
console.log('- convertTimeToDateHelper');
console.log('- addDollarPrefixForNodeElements');
skippedTests = 11;

if (testFunction(
    'convertRGBtoHEX',
    `const color = 'rgb(255, 0, 0)';`,
    `const color = "#ff0000";`,
    convertRGBtoHEX
)) passedTests++; else failedTests++;

if (testFunction(
    'ensureUseStrictInIIFE',
    `(function() { console.log('test'); })();`,
    `(function() {\n  "use strict";\n  console.log('test');\n})();`,
    ensureUseStrictInIIFE
)) passedTests++; else failedTests++;

if (testFunction(
    'convertToFunctionExpression',
    `function myFunction() { return 42; }`,
    `const myFunction = () => 42;`,
    convertToFunctionExpression
)) passedTests++; else failedTests++;

console.log('\n=== Test Summary ===');
console.log(`Total: ${passedTests + failedTests + skippedTests}`);
console.log(`✓ Passed: ${passedTests}`);
console.log(`✗ Failed: ${failedTests}`);
console.log(`⚠ Skipped: ${skippedTests} (require real-world code patterns)`);
