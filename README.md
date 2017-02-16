# pug-bemify
A plugin that adds BEM shortcuts to pug

## Installation
run `npm i pug-bemify`

## Setup
```
var pugBEMify = require('pug-bemify');

pug.render(somePugString, {
  plugins : [pugBEMify()]
});
```

## Example Usage
```
.block.-a-modifier
    ._some-element
        span.a-grandchild.-with-content Inside
```
renders:
```
<div class="block block--a-modifier">
  <div class="block__some-element"><span class="a-grandchild a-grandchild--with-content">Inside</span></div>
</div>
```

