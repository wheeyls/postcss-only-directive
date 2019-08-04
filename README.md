# PostCSS Only Directive [![Build Status][ci-img]][ci]

This plugin is designed to help you write CSS for a component in one file, and then split the rules up into separate files based on your needs.

A simple use case would be for creating separate IE stylesheets. Another good use case would be splitting up rules by
media query.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/wheeyls/postcss-only-directive.svg
[ci]:      https://travis-ci.org/wheeyls/postcss-only-directive

## Directive Syntax - Example

We start with a file that has been marked up with `@only` directives:

```css
/* _component.scss */

.button {
  background: blue;
  @only(ie) { content: 'ie only'; }
}

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
/* ie.scss */
@onlyRender(ie);
@import 'component'; // inlines the css
```
```css
/* ie.css */
.button { content: 'ie only'; }
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
.button {
  background: blue;
  content: 'ie only';
}

@media(min-width: 500px) {
  .button { background: green; }
}

@media(min-width: 900px) {
  .button { background: red; }
}
```

## Config

```js
postcss([ require('postcss-only-directive')({ whitelist: [] }) ])
```

See [PostCSS] docs for examples for your environment.

### Whitelist

The `whitelist` is a list of strings specifying which `@only` directives will be supported. Any rules not in a
whitelist will be rolled into `:root` by default.

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

## Motivation and inspiration

There has been a lot of talk about ways to accomplish this over on the sass project on github. There was a lot of
discussion on https://github.com/sass/sass/issues/241, and then @meefox proposed the `@only` directive in
https://github.com/sass/sass/issues/1187.

There are some other postcss plugins that do similar things:

* https://www.npmjs.com/package/postcss-extract-media-query
* https://www.npmjs.com/package/postcss-critical-split

These generally didn't fit my needs because they emit files outside of the normal build pipeline.  These files have to
be manually minified, gzipped, digested / etc.

Complicating my pipeline like that wasn't an option for me, so I chose this approach. The tradeoff is that you must
specify the files ahead of time. Other media-query splitters can dynamically generate files based on the CSS itself -
this plugin does not give you that option.
