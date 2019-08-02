// @format
const postcss = require('postcss');
const buildMatcher = require('./src/matcher');

function handleOnlyRule(rule, { matcher }) {
  let parent = rule.parent;

  if (matcher(rule.params)) {
    rule.before(rule.nodes);
  }

  rule.remove();
}

function getMatcher(root, whitelist) {
  let fragmentNames = [':root'];
  let matcher = buildMatcher('(:root)', { whitelist });

  root.walkAtRules(function(rule) {
    if (rule.type === 'atrule' && rule.name === 'onlyRender') {
      matcher = buildMatcher(rule.params, { whitelist });
      rule.remove();
      return false;
    }
  });

  return matcher;
}

function keepOnly(root, { matcher, keepRoot = matcher('(:root)') }) {
  let found = false;

  root.each(function(line) {
    if (line.type === 'atrule' && line.name === 'only') {
      handleOnlyRule(line, { matcher });
      found = true;
    } else if (line.nodes) {
      let childFound = keepOnly(line, { matcher, keepRoot });
      if (!childFound && !keepRoot) {
        line.remove();
      }

      found = found || childFound;
    }
  });

  return found;
}

function fragmentMatcher(fragmentNames) {
  let names = fragmentNames.map(i => `[,(]+${i}[,)]+`);
  return new RegExp(`(${names.join('|')})`);
}

module.exports = postcss.plugin('postcss-only-operator', function(opts = {}) {
  opts = opts || {};

  return function(root, result) {
    let matcher = getMatcher(root, opts.whitelist);

    keepOnly(root, { matcher });
  };
});
