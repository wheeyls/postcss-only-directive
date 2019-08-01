// @format
var postcss = require('postcss');

module.exports = postcss.plugin('postcss-only-operator', function(opts) {
  opts = opts || {};

  // Work with options here

  return function(root, result) {
    let fragmentName = null;
    root.each(function(line, i) {
      if (line.type === 'comment' && i === 0) {
        let matcher = line.text.match(/only:([a-z0-9-]+)/);
        if (matcher) {
          fragmentName = matcher[1];
        }
      }
    });

    root.walkAtRules(function(rule) {
      if (rule.name == 'only') {
        if (rule.params === `(${fragmentName})`) {
          rule.each(function(child) {
            rule.parent.append(child);
          });

          rule.remove();
        } else {
          rule.walkRules(function(inner) {
            inner.remove();
          });

          rule.remove();
        }
      }
    });
  };
});
