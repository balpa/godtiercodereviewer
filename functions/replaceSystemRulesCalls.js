const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

const targetFunctions = new Set([
  'getCurrentProduct',
  'getPaidProducts',
  'getTotalCartAmount',
  'isOnCartPage',
  'isOnAfterPaymentPage',
  'isOnProductPage',
  'getProductCategories',
  'spAddToCart',
  'getLang',
  'isOnMainPage',
  'isUserLoggedIn',
  'isOnCategoryPage',
  'getCategories',
  'getCurrency',
  'getCartCount',
  'getLocale',
  'getProductList'
]);

function replaceSystemRulesCalls(ast) {
  recast.types.visit(ast, {
    visitCallExpression(path) {
      const { node } = path;

      if (
        n.MemberExpression.check(node.callee) &&
        n.Identifier.check(node.callee.object) &&
        node.callee.object.name === 'Insider' &&
        n.Identifier.check(node.callee.property) &&
        node.callee.property.name === 'systemRules' &&
        n.CallExpression.check(node.arguments?.[0])
      ) {
        this.traverse(path);

        return;
      }

      if (
        n.MemberExpression.check(node.callee) &&
        n.MemberExpression.check(node.callee.object) &&
        n.Identifier.check(node.callee.object.object) &&
        node.callee.object.object.name === 'Insider' &&
        node.callee.object.property.name === 'systemRules' &&
        n.Identifier.check(node.callee.property) &&
        targetFunctions.has(node.callee.property.name)
      ) {
        const originalMethodName = node.callee.property.name;

        const newCall = b.callExpression(
          b.memberExpression(
            b.memberExpression(
              b.identifier('Insider'),
              b.identifier('systemRules')
            ),
            b.identifier('call')
          ),
          [b.literal(originalMethodName)]
        );

        path.replace(newCall);

        return false;
      }

      this.traverse(path);
    }
  });
}

module.exports = { replaceSystemRulesCalls };
