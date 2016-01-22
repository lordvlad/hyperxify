var test = require('tape')
var browserify = require('browserify')
var vm = require('vm')

var fs = require('fs')
var expected = fs.readFileSync(__dirname + '/vdom/expected.html', 'utf8')

test('vdom', function (t) {
  t.plan(2)
  var b = browserify(__dirname + '/vdom/source.js', {
    browserField: false
  })
  b.transform(__dirname + '/..')
  b.bundle(function (err, src) {
    t.ifError(err)
    var c = { console: { log: log } }
    vm.runInNewContext(src.toString(), c)
    function log (msg) { t.equal(msg.trim(), expected.trim()) }
  })
})
