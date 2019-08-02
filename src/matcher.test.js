//@format
const buildMatcher = require('./matcher');

function run(names, params, { whitelist, passes = true } = {}) {
  let subject = buildMatcher(names, { whitelist });
  expect(subject(params)).toEqual(passes);
}

describe('with a list of names', function() {
  it('true when there is a match', function() {
    run('(small)', '(small)');
  });

  it('false when there is not', function() {
    run('(small)', '(smal)', { passes: false });
  });

  it('tolerant of weird spacing', function() {
    run('(medium, small)', '(small)');
  });

  it(':all is always true', function() {
    run('(:all)', '(:root)');
    run('(:all)', '(small)');
    run('(:all)', '(large)');
  });
});

describe('with a whitelist', function() {
  it('is true for root if name is not in list', function() {
    run('(:root)', '(small)', { whitelist: ['medium'] });
  });

  it('is false for root if name is in list', function() {
    run('(:root)', '(medium)', { whitelist: ['medium'], passes: false });
  });

  it('is false if whitelist is empty', function() {
    run('(:root)', '(small)', { whitelist: [], passes: false });
  });
});
