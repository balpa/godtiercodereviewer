const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

function addDollarPrefixForAccessNodesParam(ast) {
  recast.visit(ast, {
    visitCallExpression: function (path) {
      const node = path.node;

      if (
        n.MemberExpression.check(node.callee) &&
        n.Identifier.check(node.callee.property) &&
        node.callee.property.name === 'accessNodes' &&
        n.CallExpression.check(node.callee.object) &&
        n.MemberExpression.check(node.callee.object.callee) &&
        n.Identifier.check(node.callee.object.callee.object) &&
        node.callee.object.callee.object.name === 'Insider' &&
        n.Identifier.check(node.callee.object.callee.property) &&
        node.callee.object.callee.property.name === 'dom'
      ) {
        const accessNodesArgs = node.arguments;

        if (accessNodesArgs.length > 0) {
          const firstArg = accessNodesArgs[0];

          if (
            n.ArrowFunctionExpression.check(firstArg) ||
            n.FunctionExpression.check(firstArg)
          ) {
            if (firstArg.params.length > 0) {
              const param = firstArg.params[0];

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

  return ast;
}

module.exports = { addDollarPrefixForAccessNodesParam };
