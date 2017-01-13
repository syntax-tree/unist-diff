'use strict';

var test = require('tape');
var diff = require('./');

test('unist-diff', function (t) {
  t.plan(1);
  t.equal(typeof diff, 'function', 'should be a function');
});
