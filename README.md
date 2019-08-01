# PostCSS Only Operator [![Build Status][ci-img]][ci]

[PostCSS] plugin Allows you to easily create entrypoint files which contain only certain rules..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/wheeyls/postcss-only-operator.svg
[ci]:      https://travis-ci.org/wheeyls/postcss-only-operator

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-only-operator') ])
```

See [PostCSS] docs for examples for your environment.
