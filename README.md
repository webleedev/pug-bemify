# pug-bemify
A plugin that adds BEM shortcuts to pug

## Installation
run `npm i pug-bemify`

## Setup
```javascript
var pugBEMify = require('pug-bemify');

pug.render(somePugString, {
  plugins : [pugBEMify()]
});
```

## Example Usage
```pug
.block.-some-modifier
    ._the-child-el
        span.the-grandchild.-with-content Inside
```
renders:
```html
<div class="block block--some-modifier">
  <div class="block__the-child-el"><span class="the-grandchild the-grandchild--with-content">Inside</span></div>
</div>
```

## Bonus Points
this plugin plays nicely with stylus and [stylus-bem-evaluator](https://github.com/khalidhoffman/stylus-bem-evaluator).
Example usage following the pug example may look like this:
```stylus
.block
  &/--some-modifier
    color: blue 
    /__the-child-el
      color: @color
  /__the-child-el
    color: red
```
which renders:
```css
.block.block--some-modifier {
  color: #00f;
}
.block.block--some-modifier .block__the-child-el {
  color: #00f;
}
.block .block__the-child-el {
  color: #f00;
}
```
hint: the `/` character in `/__` or `/--` is replaced with the parent block (in this case `.block`)
