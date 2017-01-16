'use strict';

var test = require('tape');
var diff = require('./');

test('unist-diff', function (t) {
  t.plan(7);

  t.test('equal (no patch)', function (st) {
    st.plan(4);

    (function () {
      var node = {type: 'alpha', value: 'bravo'};

      st.deepEqual(
        diff(node, node),
        {left: node},
        'should return no patches for strictly equal nodes'
      );
    })();

    (function () {
      var left = {type: 'alpha', value: 'bravo'};
      var right = {type: 'alpha', value: 'bravo'};

      st.deepEqual(
        diff(left, right),
        {left: left},
        'should return no patches for equal text nodes'
      );
    })();

    (function () {
      var left = {type: 'alpha'};
      var right = {type: 'alpha'};

      st.deepEqual(
        diff(left, right),
        {left: left},
        'should return no patches for equal void nodes'
      );
    })();

    (function () {
      var left = {type: 'alpha', children: [{type: 'bravo', value: 'charlie'}]};
      var right = {type: 'alpha', children: [{type: 'bravo', value: 'charlie'}]};

      st.deepEqual(
        diff(left, right),
        {left: left},
        'should return no patches for equal parents with equal children'
      );
    })();
  });

  t.test('`props`', function (st) {
    st.plan(12);

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: 'delta', echo: true, foxtrot: 1, golf: null, children: [alpha]};
      var right = {type: 'bravo', charlie: 'delta', echo: true, foxtrot: 1, golf: null, children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {left: left},
        'should not return a patch for equal keys with the same primitive values'
      );
    })();

    (function () {
      var left = {type: 'alpha', bravo: true, value: 'charlie'};
      var right = {type: 'alpha', bravo: false, value: 'charlie'};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {bravo: false}
          },
          left: left
        },
        'should not return a patch for changed primitives'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', data: {charlie: 'delta', echo: true, foxtrot: 1, golf: null}, children: [alpha]};
      var right = {type: 'bravo', data: {charlie: 'delta', echo: true, foxtrot: 1, golf: null}, children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {left: left},
        'should not return a patch for deep equal objects'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: 'delta', children: [alpha]};
      var right = {type: 'bravo', children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: undefined}
          },
          left: left
        },
        'should return a `props` patch for a removed key'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', children: [alpha]};
      var right = {type: 'bravo', charlie: 'delta', children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: 'delta'}
          },
          left: left
        },
        'should return a `props` patch for an added key'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: 'delta', children: [alpha]};
      var right = {type: 'bravo', charlie: 'echo', children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: 'echo'}
          },
          left: left
        },
        'should return a `props` patch for a changed key'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]};
      var right = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: [1, 2, 3]}
          },
          left: left
        },
        'should return a patch for deep equal arrays'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]};
      var right = {type: 'bravo', charlie: {delta: true}, children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: {delta: true}}
          },
          left: left
        },
        'should return a `props` patch for an array that changed to an object'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: {delta: true}, children: [alpha]};
      var right = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: [1, 2, 3]}
          },
          left: left
        },
        'should return a `props` patch for an object that changed to an array'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: [1, 2], children: [alpha]};
      var right = {type: 'bravo', charlie: [2, 3], children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: {0: 2, 1: 3}}
          },
          left: left
        },
        'should return a `props` patch for a changed array'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: [1, 2], children: [alpha]};
      var right = {type: 'bravo', charlie: {delta: true}, children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: {delta: true}}
          },
          left: left
        },
        'should return a `props` patch for an array changed to an object'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var left = {type: 'bravo', charlie: {delta: true}, children: [alpha]};
      var right = {type: 'bravo', charlie: {delta: false}, children: [alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'props',
            left: left,
            right: {charlie: {delta: false}}
          },
          left: left
        },
        'should return a `props` patch for a changed object'
      );
    })();
  });

  t.test('`text`', function (st) {
    st.plan(4);

    (function () {
      var left = {type: 'alpha', value: 'bravo'};
      var right = {type: 'alpha', value: 'charlie'};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'text', left: left, right: right},
          left: left
        },
        'should compare two text nodes of the same type that differ in value'
      );
    })();

    (function () {
      var leftChild = {type: 'bravo', value: 'charlie'};
      var rightChild = {type: 'bravo', value: 'delta'};
      var left = {type: 'alpha', children: [leftChild]};
      var right = {type: 'alpha', children: [rightChild]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'text', left: leftChild, right: rightChild},
          left: left
        },
        'should compare two child text nodes of the same type which differ ' +
        'in value'
      );
    })();

    (function () {
      var bravo = {type: 'alpha', value: 'bravo'};
      var charlie = {type: 'alpha', value: 'charlie'};
      var delta = {type: 'alpha', value: 'delta'};
      var left = {type: 'echo', children: [bravo, charlie, delta]};
      var right = {type: 'echo', children: [delta, charlie, bravo]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'text', left: bravo, right: delta},
          3: {type: 'text', left: delta, right: bravo},
          left: left
        },
        'should compare two child text nodes of the same type which differ ' +
        'in value'
      );
    })();

    (function () {
      var charlie = {type: 'bravo', value: 'charlie'};
      var delta = {type: 'bravo', value: 'delta'};
      var alphaOne = {type: 'alpha', children: [charlie]};
      var alphaTwo = {type: 'alpha', children: [delta]};
      var left = {type: 'foxtrott', children: [alphaOne, alphaTwo]};
      var right = {type: 'foxtrott', children: [alphaTwo, alphaOne]};

      st.deepEqual(
        diff(left, right),
        {
          2: {type: 'text', left: charlie, right: delta},
          4: {type: 'text', left: delta, right: charlie},
          left: left
        },
        'should support deeply nested text changes'
      );
    })();
  });

  t.test('`remove`', function (st) {
    st.plan(9);

    (function () {
      var node = {type: 'alpha', value: 'bravo'};

      st.deepEqual(
        diff(node),
        {
          0: {type: 'remove', left: node, right: null},
          left: node
        },
        'should return a `remove` if the top-most node is removed'
      );
    })();

    (function () {
      var child = {type: 'alpha', value: 'bravo'};
      var left = {type: 'charlie', children: [child]};
      var right = {type: 'charlie', children: []};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'remove', left: child, right: null},
          left: left
        },
        'should return a `remove` if an only child is removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two, three]};
      var right = {type: 'delta', children: [two, three]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'remove', left: one, right: null},
          left: left
        },
        'should return a `remove` if a first child is removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two, three]};
      var right = {type: 'delta', children: [three]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'remove', left: one, right: null},
          2: {type: 'remove', left: two, right: null},
          left: left
        },
        'should return multiple `remove`s if initial children are removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two, three]};
      var right = {type: 'delta', children: [one, three]};

      st.deepEqual(
        diff(left, right),
        {
          2: {type: 'remove', left: two, right: null},
          left: left
        },
        'should return a `remove` if a child is removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var four = {type: 'delta'};
      var left = {type: 'echo', children: [one, two, three, four]};
      var right = {type: 'echo', children: [one, four]};

      st.deepEqual(
        diff(left, right),
        {
          2: {type: 'remove', left: two, right: null},
          3: {type: 'remove', left: three, right: null},
          left: left
        },
        'should return multiple `remove`s if children are removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two, three]};
      var right = {type: 'delta', children: [one, two]};

      st.deepEqual(
        diff(left, right),
        {
          3: {type: 'remove', left: three, right: null},
          left: left
        },
        'should return a `remove` if a final child is removed'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two, three]};
      var right = {type: 'delta', children: [one]};

      st.deepEqual(
        diff(left, right),
        {
          2: {type: 'remove', left: two, right: null},
          3: {type: 'remove', left: three, right: null},
          left: left
        },
        'should return multiple `remove`s if final children are removed'
      );
    })();

    (function () {
      var charlie = {type: 'bravo', value: 'charlie'};
      var delta = {type: 'bravo', value: 'delta'};
      var alphaOne = {type: 'alpha', children: [delta, charlie]};
      var alphaTwo = {type: 'alpha', children: [delta]};
      var left = {type: 'foxtrott', children: [alphaOne]};
      var right = {type: 'foxtrott', children: [alphaTwo]};

      st.deepEqual(
        diff(left, right),
        {
          3: {type: 'remove', left: charlie, right: null},
          left: left
        },
        'should support deeply nested `remove`s'
      );
    })();
  });

  t.test('`insert`', function (st) {
    st.plan(10);

    (function () {
      var node = {type: 'alpha', value: 'bravo'};

      st.deepEqual(
        diff(null, node),
        {
          0: {type: 'insert', left: null, right: node},
          left: null
        },
        'should return an `insert` for a root node without predecessor'
      );
    })();

    (function () {
      var child = {type: 'alpha', value: 'bravo'};
      var left = {type: 'charlie', children: []};
      var right = {type: 'charlie', children: [child]};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'insert', left: null, right: child},
          left: left
        },
        'should return an `insert` if an only child is inserted'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var four = {type: 'delta'};
      var left = {type: 'echo', children: []};
      var right = {type: 'echo', children: [one, two, three, four]};

      st.deepEqual(
        diff(left, right),
        {
          0: [
            {type: 'insert', left: null, right: one},
            {type: 'insert', left: null, right: two},
            {type: 'insert', left: null, right: three},
            {type: 'insert', left: null, right: four}
          ],
          left: left
        },
        'should return multiple `insert`s if many multiple children are injected'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [two, three]};
      var right = {type: 'delta', children: [one, two, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'insert', left: null, right: one},
          left: left
        },
        'should return an `insert` if a child is prepended'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [three]};
      var right = {type: 'delta', children: [one, two, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: [
            {type: 'insert', left: null, right: one},
            {type: 'insert', left: null, right: two}
          ],
          left: left
        },
        'should return multiple `insert`s if multiple children are prepended'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, three]};
      var right = {type: 'delta', children: [one, two, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'insert', left: null, right: two},
          left: left
        },
        'should return an `insert` if a child is injected'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var four = {type: 'delta'};
      var left = {type: 'echo', children: [one, four]};
      var right = {type: 'echo', children: [one, two, three, four]};

      st.deepEqual(
        diff(left, right),
        {
          0: [
            {type: 'insert', left: null, right: two},
            {type: 'insert', left: null, right: three}
          ],
          left: left
        },
        'should return multiple `insert`s if multiple children are injected'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one, two]};
      var right = {type: 'delta', children: [one, two, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'insert', left: null, right: three},
          left: left
        },
        'should return an `insert` if a child is appended'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var left = {type: 'delta', children: [one]};
      var right = {type: 'delta', children: [one, two, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: [
            {type: 'insert', left: null, right: two},
            {type: 'insert', left: null, right: three}
          ],
          left: left
        },
        'should return multiple `insert`s if multiple children are appended'
      );
    })();

    (function () {
      var charlie = {type: 'bravo', value: 'charlie'};
      var delta = {type: 'bravo', value: 'delta'};
      var alphaOne = {type: 'alpha', children: [delta]};
      var alphaTwo = {type: 'alpha', children: [delta, charlie]};
      var left = {type: 'foxtrott', children: [alphaOne]};
      var right = {type: 'foxtrott', children: [alphaTwo]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'insert', left: null, right: charlie},
          left: left
        },
        'should support deeply nested `insert`s'
      );
    })();
  });

  t.test('`replace`', function (st) {
    st.plan(4);

    (function () {
      var left = {type: 'alpha', value: 'bravo'};
      var right = {type: 'charlie', value: 'bravo'};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'replace', left: left, right: right},
          left: left
        },
        'should return a `replace` if the top-most left and right (both text) ' +
        'nodes differ in type'
      );
    })();

    (function () {
      var left = {type: 'alpha'};
      var right = {type: 'bravo'};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'replace', left: left, right: right},
          left: left
        },
        'should return a `replace` if the top-most left and right (both void) ' +
        'nodes differ in type'
      );
    })();

    (function () {
      var one = {type: 'alpha'};
      var two = {type: 'bravo'};
      var three = {type: 'charlie'};
      var four = {type: 'delta'};
      var left = {type: 'echo', children: [one, two, three]};
      var right = {type: 'echo', children: [one, four, three]};

      st.deepEqual(
        diff(left, right),
        {
          0: {type: 'insert', left: null, right: four},
          2: {type: 'remove', left: two, right: null},
          left: left
        },
        'should return an `insert` and `replace` if two children are replaced'
      );
    })();

    (function () {
      var bravo = {type: 'bravo'};
      var charlie = {type: 'charlie'};
      var delta = {type: 'delta'};
      var alphaOne = {type: 'alpha', children: [bravo, charlie]};
      var alphaTwo = {type: 'alpha', children: [bravo, delta]};
      var left = {type: 'foxtrott', children: [alphaOne]};
      var right = {type: 'foxtrott', children: [alphaTwo]};

      st.deepEqual(
        diff(left, right),
        {
          1: {type: 'insert', left: null, right: delta},
          3: {type: 'remove', left: charlie, right: null},
          left: left
        },
        'should support deeply nested `replace`s (as `insert` and `replace`)'
      );
    })();
  });

  t.test('`order`', function (st) {
    st.plan(5);

    (function () {
      var alpha = {type: 'alpha'};
      var bravo = {type: 'bravo'};
      var charlie = {type: 'charlie'};
      var left = {type: 'delta', children: [alpha, bravo, charlie]};
      var right = {type: 'delta', children: [charlie, alpha, bravo]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'order',
            left: left,
            right: {
              removes: [{from: 2, left: charlie, right: charlie}],
              inserts: [{left: charlie, right: charlie, to: 0}]
            }
          },
          left: left
        },
        'should return an `order` if the last child in a parent moved to start'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var bravo = {type: 'bravo'};
      var charlie = {type: 'charlie'};
      var left = {type: 'delta', children: [alpha, bravo, charlie]};
      var right = {type: 'delta', children: [bravo, charlie, alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'order',
            left: left,
            right: {
              removes: [{from: 2, left: alpha, right: alpha}],
              inserts: [{left: alpha, right: alpha, to: 0}]
            }
          },
          left: left
        },
        'should return an `order` if the first child in a parent moved to the end'
      );
    })();

    (function () {
      var alpha = {type: 'alpha'};
      var bravo = {type: 'bravo'};
      var charlie = {type: 'charlie'};
      var left = {type: 'delta', children: [alpha, bravo, charlie]};
      var right = {type: 'delta', children: [charlie, bravo, alpha]};

      st.deepEqual(
        diff(left, right),
        {
          0: {
            type: 'order',
            left: left,
            right: {
              removes: [
                {from: 1, left: bravo, right: bravo},
                {from: 2, left: alpha, right: alpha}
              ],
              inserts: [
                {to: 0, left: alpha, right: alpha},
                {to: 1, left: bravo, right: bravo}
              ]
            }
          },
          left: left
        },
        'should return an `order` if the children reversed'
      );
    })();

    (function () {
      var bravo = {type: 'bravo'};
      var charlie = {type: 'charlie'};
      var delta = {type: 'delta'};
      var alphaOne = {type: 'alpha', children: [bravo, charlie, delta]};
      var alphaTwo = {type: 'alpha', children: [delta, charlie, bravo]};
      var left = {type: 'foxtrott', children: [alphaOne]};
      var right = {type: 'foxtrott', children: [alphaTwo]};

      st.deepEqual(
        diff(left, right),
        {
          1: {
            type: 'order',
            left: alphaOne,
            right: {
              inserts: [
                {left: bravo, right: bravo, to: 0},
                {left: charlie, right: charlie, to: 1}
              ],
              removes: [
                {from: 1, left: charlie, right: charlie},
                {from: 2, left: bravo, right: bravo}
              ]
            }
          },
          left: left
        },
        'should support deeply nested `order`s'
      );
    })();

    (function () {
      var bravo = {type: 'a', id: 'bravo'};
      var charlie = {type: 'a', id: 'charlie'};
      var delta = {type: 'a', id: 'delta'};
      var alphaOne = {type: 'alpha', children: [bravo, charlie, delta]};
      var alphaTwo = {type: 'alpha', children: [delta, charlie, bravo]};
      var left = {type: 'foxtrott', children: [alphaOne]};
      var right = {type: 'foxtrott', children: [alphaTwo]};

      st.deepEqual(
        diff(left, right),
        {
          1: {
            type: 'order',
            left: alphaOne,
            right: {
              inserts: [
                {left: bravo, right: bravo, to: 0},
                {left: charlie, right: charlie, to: 1}
              ],
              removes: [
                {from: 1, left: charlie, right: charlie},
                {from: 2, left: bravo, right: bravo}
              ]
            }
          },
          left: left
        },
        'should use other data properties when ordering'
      );
    })();
  });
});
