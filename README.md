# PostCSS Only Directive [![Build Status][ci-img]][ci]

This is a plugin I wrote to help split up CSS files by media query.

It can be used to break up a file for other reasons as well - for instance creating separate IE stylesheets.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/wheeyls/postcss-only-operator.svg
[ci]:      https://travis-ci.org/wheeyls/postcss-only-operator

## Directive Syntax - Example

We start with a file that has been marked up with `@only` directives:

```css
/* _component.scss */

.button { background: blue; }

@only(medium) {
  @media(min-width: 500px) {
    .button { background: green; }
  }
}

@only(large) {
  @media(min-width: 900px) {
    .button { background: red; }
  }
}
```

Then we call the `@onlyRender` directive at the top of each file to specify what should be included.


#### By name
```css
/* medium.scss */
@onlyRender(medium);
@import 'component'; // inlines the css
```
```css
/* medium.css */
@media(min-width: 500px) {
  .button { background: green; }
}
```

#### Multiple names
```css
/* medium-and-up.scss */
@onlyRender(medium, large);
@import 'component'; // inlines the css
```
```css
/* medium-and-up.css */
@media(min-width: 500px) {
  .button { background: green; }
}
@media(min-width: 900px) {
  .button { background: red; }
}
```

#### :root
```css
/* small.scss */
@onlyRender(:root);
@import 'component'; // inlines the css
```
```css
/* small.css */
.button { background: blue; }
```

#### :all
```css
/* app.scss */
@onlyRender(:all);
@import 'component'; // inlines the css
```
```css
/* app.css */
.button { background: blue; }
@media(min-width: 500px) {
  .button { background: green; }
}
@media(min-width: 900px) {
  .button { background: red; }
}
```

## Config

```js
postcss([ require('postcss-only-operator')({ whitelist: [] }) ])
```

### Whitelist

The `whitelist` is a list of strings specifies a list of `@only` directives that will be supported. If you pass a
whitelist, any rules you create that are not in that list will be rolled into `:root`.


#### Example

Suppose I'm splitting a file out for IE:

```css
/* button.css */
.button { background: blue; }
@only(ie11) { .button { background: green; } }

/* main.css */
@onlyRender(:root);
@import 'button';
```

```
/* ie11.css */
@onlyRender(ie11);
@import 'button';
```

Now pretend that someone comes along later and adds an `@only(ie10)` rule - not realizing that no one has created a
matching call to `@onlyRender(ie10)`. Their rules will be removed from our stylesheets silently!

The whitelist is here to save us from that. Any rules that aren't in the whitelist will be automatically rolled up into
the special `:root` keyword, avoiding lossy changes.

See [PostCSS] docs for examples for your environment.
