# hyperxify

browserify transform for [hyperx][1]

This module will compile your hyperx template strings down to javascript
expressions so that you don't need to send the hyperx library over the wire.

[1]: https://github.com/substack/hyperx

# example

Given some hyperx code:

``` js
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)

var main = require('main-loop')
var loop = main({ times: 0 }, render, vdom)
document.querySelector('#content').appendChild(loop.target)

function render (state) {
  return hx`<div>
    <h1>clicked ${state.times} times</h1>
    <button onclick=${onclick}>click me!</button>
  </div>`

  function onclick () {
    loop.update({ times: state.times + 1 })
  }
}
```

Compile with browserify using `-t hyperxify`:

```
$ browserify -t hyperxify main.js > bundle.js
```

If you look in the `bundle.js` file, you can see that the hyperx template
strings have been replaced with calls to `vdom.h`, which is how `hyperx` was
invoked:

```
$ <bundle.js head -n16 | tail -n+2
var vdom = require('virtual-dom')
var hyperx = 0
var hx = 0

var main = require('main-loop')
var loop = main({ times: 0 }, render, vdom)
document.querySelector('#content').appendChild(loop.target)

function render (state) {
  return vdom.h("div",{},["\n    ",vdom.h("h1",{},["clicked ",state.times," times"]),"\n    ",vdom.h("button",{"onclick":onclick},["click me!"]),"\n  "])

  function onclick () {
    loop.update({ times: state.times + 1 })
  }
}
```

# license

BSD
