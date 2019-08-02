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

describe('with root directive', function() {
  it('removes @only rules', function() {
    return run('@onlyRender(:root); @only(small) { a { } }', '', {});
  });

  it('keeps other rules', function() {
    return run(
      '@onlyRender(:root); @only(small) { a { } } b { color: blue; }',
      'b { color: blue; }',
      {}
    );
  });

  it('keeps other @ rules', function() {
    return run(
      '@onlyRender(:root); @only(small) { a { } } @media(print) { b { color: blue; } }',
      '@media(print) { b { color: blue; } }',
      {}
    );
  });

  it('removes nested @ rules', function() {
    return run(
      '@onlyRender(:root); @only(small) { @media(print) { a { } } } @media(print) { b { color: blue; } }',
      '@media(print) { b { color: blue; } }',
      {}
    );
  });
});

describe('with a named directive', function() {
  it('keeps @only rules', function() {
    return run('@onlyRender(small); @only(small) { a { } }', ' a { }', {});
  });

  it('keeps nested @ rules', function() {
    return run(
      '@onlyRender(small); @only(small) { @media(print) { a { } } }',
      ' @media(print) { a { } }',
      {}
    );
  });

  it('removes other rules', function() {
    return run(
      '@onlyRender(small); @only(small) { @media(print) { a { } } } b { }',
      ' @media(print) { a { } }',
      {}
    );
  });

  it('removes other @only rules', function() {
    return run(
      '@onlyRender(small); @only(small) { a { } } @only(medium) { b { } }',
      ' a { }',
      {}
    );
  });

  it('keeps parents', function() {
    return run(
      '@onlyRender(small); @media(print) { @only(small) { a { } } }',
      '@media(print) { a { } }',
      {}
    );
  });

  it('keeps parents but not siblings', function() {
    return run(
      '@onlyRender(small); @media(print) { @only(small) { a { } } b { } }',
      '@media(print) { a { } }',
      {}
    );
  });

  it('keeps parents and scoped siblings', function() {
    return run(
      '@onlyRender(small); @media(print) { @only(small) { a { } } @only(small) { b { } } }',
      '@media(print) { a { } b { } }',
      {}
    );
  });

  it('cleans out comments', function() {
    return run(
      '@onlyRender(small); /* test */ @only(small) { a { color: red; } }',
      ' a { color: red; }',
      {}
    );
  });
});

describe('with two named directives', function() {
  it('keeps relevant @only rules', function() {
    return run(
      '@onlyRender(small,medium); @only(small) { a { } } @only(medium) { b { } }',
      ' a { } b { }',
      {}
    );
  });

  it('allows for white space around params', function() {
    return run(
      '@onlyRender( small, medium,other ); @only(small) { a { } } @only(medium) { b { } }',
      ' a { } b { }',
      {}
    );
  });
});

describe('with named directive + :root', function() {
  it('keeps root rules as well as applied rules', function() {
    return run(
      '@onlyRender(small,:root); @only(small) { a { } } @only(medium) { b { } } c { }',
      ' a { } c { }',
      {}
    );
  });
});

describe('with whitelisted names', function() {
  it('shows unlisted sections in root section', function() {
    return run(
      '@onlyRender(:root); @only(small) { a { } } @only(medium) { b { } } c { }',
      ' a { } c { }',
      { whitelist: ['medium'] }
    );
  });
});

describe('with a wildcard directive', function() {
  it('keeps all rules', function() {
    return run(
      '@onlyRender(:all); @only(small) { @media(print) { a { } } } b { }',
      ' @media(print) { a { } } b { }',
      {}
    );
  });
});

describe('with no directive', function() {
  it('keeps all rules', function() {
    return run(
      '@only(small) { @media(print) { a { } } } b { }',
      ' @media(print) { a { } } b { }',
      {}
    );
  });
});
