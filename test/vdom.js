var test = require('tape')
var browserify = require('browserify')
var vm = require('vm')
var fs = require('fs')

test('vdom', function (t) {
  var expected = fs.readFileSync(__dirname + '/vdom/expected.html', 'utf8')

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

test('vdom strict', function (t) {
  var expected = fs.readFileSync(__dirname + '/vdom/expected.html', 'utf8')

  t.plan(2)

  var b = browserify(__dirname + '/vdom/source-strict.js', {
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
