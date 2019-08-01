// @format
var postcss = require('postcss');

var plugin = require('./');

function run(input, output, opts) {
  return postcss([plugin(opts)])
    .process(input)
    .then(function(result) {
      expect(result.css).toEqual(output);
      expect(result.warnings()).toHaveLength(0);
    });
}

describe('with * directive', function() {
  it('removes @only rules', function() {
    return run('@only(small) { a { } }', '', {});
  });

  it('keeps other rules', function() {
    return run(
      '@only(small) { a { } } b { color: blue; }',
      'b { color: blue; }',
      {}
    );
  });

  it('keeps other @ rules', function() {
    return run(
      '@only(small) { a { } } @media(print) { b { color: blue; } }',
      '@media(print) { b { color: blue; } }',
      {}
    );
  });

  it('removes nested @ rules', function() {
    return run(
      '@only(small) { @media(print) { a { } } } @media(print) { b { color: blue; } }',
      '@media(print) { b { color: blue; } }',
      {}
    );
  });
});

describe('with a named directive', function() {
  it('keeps @only rules', function() {
    return run(
      '/* only:small */ @only(small) { a { } }',
      '/* only:small */ a { }',
      {}
    );
  });

  it('keeps nested @ rules', function() {
    return run(
      '/* only:small */ @only(small) { @media(print) { a { } } }',
      '/* only:small */ @media(print) { a { } }',
      {}
    );
  });

  it('removes other rules', function() {
    return run(
      '/* only:small */ @only(small) { @media(print) { a { } } } b { }',
      '/* only:small */ @media(print) { a { } }',
      {}
    );
  });
});
