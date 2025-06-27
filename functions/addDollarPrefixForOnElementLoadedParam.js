const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function addDollarPrefixForOnElementLoadedParam(ast) {
  recast.visit(ast, {
    visitCallExpression: function (path) {
      const node = path.node;

      if (
        n.MemberExpression.check(node.callee) &&
        n.Identifier.check(node.callee.property) &&
        node.callee.property.name === 'onElementLoaded' &&
        n.MemberExpression.check(node.callee.object) &&
        n.Identifier.check(node.callee.object.object) &&
        node.callee.object.object.name === 'Insider' &&
        n.Identifier.check(node.callee.object.property) &&
        node.callee.object.property.name === 'fns'
      ) {
        const onElementLoadedArgs = node.arguments;

        if (onElementLoadedArgs.length > 1) {
          const callbackArg = onElementLoadedArgs[1];

          if (
            n.ArrowFunctionExpression.check(callbackArg) ||
            n.FunctionExpression.check(callbackArg)
          ) {
            if (callbackArg.params.length > 0) {
              const param = callbackArg.params[0];

              if (n.Identifier.check(param) && !param.name.startsWith('$')) {
                param.name = `$${param.name}`;
              }
            }
          }
        }
      }
      this.traverse(path);
    }
  });

  return recast.print(ast).code;
}

module.exports = { addDollarPrefixForOnElementLoadedParam };
