var falafel = require('falafel')
var through = require('through2')
var hyperx = require('hyperx')

module.exports = function (file, opts) {
  var bufs = []
  var h = null, mname = null
  var hx = hyperx(function (tagName, opts, children) {
    if (!h) return null
    return { expr: h + '(' + JSON.stringify(tagName)
      + ',' + JSON.stringify(opts)
      + ',[' + children.map(child).join(',')
      + '])' }
  })
  return through(write, end)

  function child (c) {
    if (c && typeof c === 'object' && c.expr) {
      return c.expr
    } else return JSON.stringify(c)
  }

  function write (buf, enc, next) {
    bufs.push(buf)
    next()
  }
  function end () {
    var src = Buffer.concat(bufs).toString('utf8')
    this.push(falafel(src, { ecmaVersion: 6 }, walk).toString())
    this.push(null)
  }
  function walk (node) {
    if (node.type === 'TemplateLiteral') {
      var args = [ node.quasis.map(cooked) ]
        .concat(node.expressions.map(expr))
      var res = hx.apply(null, args)
      if (!res) return
      node.parent.update(res.expr)
    } else if (node.type === 'CallExpression'
    && node.callee && node.callee.name === 'require'
    && node.arguments.length === 1
    && node.arguments[0].value === 'hyperx') {
      node.update('0')
      mname = node.parent.id.name
    } else if (node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === mname) {
      h = node.arguments[0].source()
      node.update('0')
    }
  }
}

function cooked (node) { return node.value.cooked }
function expr (ex) { return { expr: ex.source() } }
