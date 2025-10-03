const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

//TODO: update this list
const domReturningMethods = new Set([
  'append', 'appendTo', 'prepend', 'prependTo', 'remove', 'hide', 'show',
  'toggle', 'removeAttr', 'first', 'last', 'even', 'odd', 'checked',
  'html', 'replaceWith', 'addClass', 'removeClass', 'toggleClass', 'after',
  'insertAfter', 'before', 'insertBefore', 'exists', 'closest', 'accessNodes',
  'each', 'filter', 'find', 'offsetParent', 'parent', 'siblings', 'children',
  'clone', 'scrollTop', 'prev', 'next', 'unique',
]);

const nonDomReturningMethods = new Set([
  'val', 'prop', 'css', 'text', 'offset', 'position', 'outerHeight', 'outerWidth',
  'width', 'height', 'index', 'getNode', 'hasClass', 'is', 'data', 'attr'
]);

function getInsiderDomChainInfo(expression) {
  let isInsiderDomBaseFound = false;
  let current = expression;
  const methods = [];

  while (n.CallExpression.check(current)) {
    if (n.MemberExpression.check(current.callee)) {
      if (n.Identifier.check(current.callee.property) &&
        current.callee.property.name === 'dom' &&
        n.Identifier.check(current.callee.object) &&
        current.callee.object.name === 'Insider') {
        isInsiderDomBaseFound = true;

        break;
      } else if (n.Identifier.check(current.callee.property)) {
        methods.unshift(current.callee.property.name);
      }

      current = current.callee.object;
    } else {
      break;
    }
  }

  return {
    isInsiderDomBaseFound,
    chainedMethods: methods
  };
}

function addDollarPrefixForNodeElements(ast) {
  recast.types.visit(ast, {
    visitVariableDeclarator(path) {
      const { node } = path;

      if (!node.init || !n.CallExpression.check(node.init)) {
        return this.traverse(path);
      }

      const { isInsiderDomBaseFound, chainedMethods } = getInsiderDomChainInfo(node.init);

      if (isInsiderDomBaseFound) {
        let shouldAddPrefix = false;
        if (chainedMethods.length === 0) {
          shouldAddPrefix = true;
        } else {
          const finalMethodInChain = chainedMethods[chainedMethods.length - 1];
          if (domReturningMethods.has(finalMethodInChain)) {
            shouldAddPrefix = true;
          } else if (nonDomReturningMethods.has(finalMethodInChain)) {
            shouldAddPrefix = false;
          } else {
            shouldAddPrefix = true;
          }
        }

        const originalName = node.id.name;
        const alreadyHasPrefix = originalName.startsWith('$');
        let newName = originalName;

        if (shouldAddPrefix) {
          if (alreadyHasPrefix) {
            if (originalName.length > 1 && originalName.charAt(1) !== originalName.charAt(1).toLowerCase()) {
              newName = `$${originalName.charAt(1).toLowerCase()}${originalName.slice(2)}`;
            }
          }
          else {
            newName = `$${originalName.charAt(0).toLowerCase()}${originalName.slice(1)}`;
          }
        } else {
          if (alreadyHasPrefix) {
            newName = originalName.slice(1);
          }
        }
        if (newName !== originalName) {
          node.id = b.identifier(newName);

          return false;
        }
      }

      return this.traverse(path);
    }
  });
}

module.exports = { addDollarPrefixForNodeElements };
