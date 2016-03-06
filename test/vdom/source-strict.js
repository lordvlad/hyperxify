'use strict'

const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const hx = hyperx(vdom.h)
const something = require('./something.json')
const unrelated = `unrelated ${something}`

const title = 'world'
const wow = [1,2,3]
const tree = hx`<div>
  <h1 y="ab${1+2}cd">hello ${title}!</h1>
  <input type="text">
  ${hx`<i>cool</i>`}
  wow
  ${wow.map(function (w, i) {
    return hx`<b>${w}</b>\n`
  })}
</div>`
console.log(vdom.create(tree).toString())
