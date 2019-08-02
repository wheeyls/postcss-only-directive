function parseParam(str) {
  let matched = str.match(/\(([ *a-z0-9-,:]+)\)/);
  return matched[1].split(',').map(i => i.trim());
}

function inWhitelist(params, whitelist) {
  let ruleName = parseParam(params);
  return whitelist.indexOf(ruleName[0]) > -1;
}

module.exports = function (config, { whitelist } = {}) {
  const fragmentNames = parseParam(config)
  const names = fragmentNames.map(i => `[,(]+${i}[,)]+`);
  const reg = new RegExp(`(${names.join('|')})`);
  const all = reg.test('(:all)');
  const root = reg.test('(:root)');
  whitelist = whitelist || [];

  return function (params) {
    if (all) {
      return true;
    } else if(root && whitelist.length > 0 && !inWhitelist(params, whitelist)) {
      return true;
    } else {
      return reg.test(params);
    }
  };
};
