'use strict'

var test = require('tape')
var diff = require('.')

test('unist-diff', function (t) {
  t.test('equal (no patch)', function (t) {
    var node = {type: 'alpha', value: 'bravo'}

    t.deepEqual(
      diff(node, node),
      {left: node},
      'should return no patches for strictly equal nodes'
    )

    var left = {type: 'alpha', value: 'bravo'}
    var right = {type: 'alpha', value: 'bravo'}

    t.deepEqual(
      diff(left, right),
      {left: left},
      'should return no patches for equal text nodes'
    )

    left = {type: 'alpha'}
    right = {type: 'alpha'}

    t.deepEqual(
      diff(left, right),
      {left: left},
      'should return no patches for equal void nodes'
    )

    left = {type: 'alpha', children: [{type: 'bravo', value: 'charlie'}]}
    right = {type: 'alpha', children: [{type: 'bravo', value: 'charlie'}]}

    t.deepEqual(
      diff(left, right),
      {left: left},
      'should return no patches for equal parents with equal children'
    )

    t.end()
  })

  t.test('`props`', function (t) {
    var alpha = {type: 'alpha'}
    var left = {
      type: 'bravo',
      charlie: 'delta',
      echo: true,
      foxtrot: 1,
      golf: null,
      children: [alpha]
    }
    var right = {
      type: 'bravo',
      charlie: 'delta',
      echo: true,
      foxtrot: 1,
      golf: null,
      children: [alpha]
    }

    t.deepEqual(
      diff(left, right),
      {left: left},
      'should not return a patch for equal keys with the same primitive values'
    )

    left = {type: 'alpha', bravo: true, value: 'charlie'}
    right = {type: 'alpha', bravo: false, value: 'charlie'}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {
      type: 'bravo',
      data: {charlie: 'delta', echo: true, foxtrot: 1, golf: null},
      children: [alpha]
    }
    right = {
      type: 'bravo',
      data: {charlie: 'delta', echo: true, foxtrot: 1, golf: null},
      children: [alpha]
    }

    t.deepEqual(
      diff(left, right),
      {left: left},
      'should not return a patch for deep equal objects'
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: 'delta', children: [alpha]}
    right = {type: 'bravo', children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', children: [alpha]}
    right = {type: 'bravo', charlie: 'delta', children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: 'delta', children: [alpha]}
    right = {type: 'bravo', charlie: 'echo', children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]}
    right = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]}
    right = {type: 'bravo', charlie: {delta: true}, children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: {delta: true}, children: [alpha]}
    right = {type: 'bravo', charlie: [1, 2, 3], children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: [1, 2], children: [alpha]}
    right = {type: 'bravo', charlie: [2, 3], children: [alpha]}

    t.deepEqual(
      diff(left, right),
      {
        0: {
          type: 'props',
          left: left,
          right: {charlie: [2, 3]}
        },
        left: left
      },
      'should return a `props` patch for a changed array'
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: [1, 2], children: [alpha]}
    right = {type: 'bravo', charlie: {delta: true}, children: [alpha]}

    t.deepEqual(
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
    )

    alpha = {type: 'alpha'}
    left = {type: 'bravo', charlie: {delta: true}, children: [alpha]}
    right = {type: 'bravo', charlie: {delta: false}, children: [alpha]}

    t.deepEqual(
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
    )

    t.end()
  })

  t.test('`text`', function (t) {
    var left = {type: 'alpha', value: 'bravo'}
    var right = {type: 'alpha', value: 'charlie'}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'text', left: left, right: right},
        left: left
      },
      'should compare two text nodes of the same type that differ in value'
    )

    var leftChild = {type: 'bravo', value: 'charlie'}
    var rightChild = {type: 'bravo', value: 'delta'}
    left = {type: 'alpha', children: [leftChild]}
    right = {type: 'alpha', children: [rightChild]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'text', left: leftChild, right: rightChild},
        left: left
      },
      'should compare two child text nodes of the same type which differ ' +
        'in value'
    )

    var bravo = {type: 'alpha', value: 'bravo'}
    var charlie = {type: 'alpha', value: 'charlie'}
    var delta = {type: 'alpha', value: 'delta'}
    left = {type: 'echo', children: [bravo, charlie, delta]}
    right = {type: 'echo', children: [delta, charlie, bravo]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'text', left: bravo, right: delta},
        3: {type: 'text', left: delta, right: bravo},
        left: left
      },
      'should compare two child text nodes of the same type which differ ' +
        'in value'
    )

    charlie = {type: 'bravo', value: 'charlie'}
    delta = {type: 'bravo', value: 'delta'}
    var alphaOne = {type: 'alpha', children: [charlie]}
    var alphaTwo = {type: 'alpha', children: [delta]}
    left = {type: 'foxtrott', children: [alphaOne, alphaTwo]}
    right = {type: 'foxtrott', children: [alphaTwo, alphaOne]}

    t.deepEqual(
      diff(left, right),
      {
        2: {type: 'text', left: charlie, right: delta},
        4: {type: 'text', left: delta, right: charlie},
        left: left
      },
      'should support deeply nested text changes'
    )

    t.end()
  })

  t.test('`remove`', function (t) {
    var node = {type: 'alpha', value: 'bravo'}

    t.deepEqual(
      diff(node),
      {
        0: {type: 'remove', left: node, right: null},
        left: node
      },
      'should return a `remove` if the top-most node is removed'
    )

    var child = {type: 'alpha', value: 'bravo'}
    var left = {type: 'charlie', children: [child]}
    var right = {type: 'charlie', children: []}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'remove', left: child, right: null},
        left: left
      },
      'should return a `remove` if an only child is removed'
    )

    var one = {type: 'alpha'}
    var two = {type: 'bravo'}
    var three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two, three]}
    right = {type: 'delta', children: [two, three]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'remove', left: one, right: null},
        left: left
      },
      'should return a `remove` if a first child is removed'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two, three]}
    right = {type: 'delta', children: [three]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'remove', left: one, right: null},
        2: {type: 'remove', left: two, right: null},
        left: left
      },
      'should return multiple `remove`s if initial children are removed'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two, three]}
    right = {type: 'delta', children: [one, three]}

    t.deepEqual(
      diff(left, right),
      {
        2: {type: 'remove', left: two, right: null},
        left: left
      },
      'should return a `remove` if a child is removed'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    var four = {type: 'delta'}
    left = {type: 'echo', children: [one, two, three, four]}
    right = {type: 'echo', children: [one, four]}

    t.deepEqual(
      diff(left, right),
      {
        2: {type: 'remove', left: two, right: null},
        3: {type: 'remove', left: three, right: null},
        left: left
      },
      'should return multiple `remove`s if children are removed'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two, three]}
    right = {type: 'delta', children: [one, two]}

    t.deepEqual(
      diff(left, right),
      {
        3: {type: 'remove', left: three, right: null},
        left: left
      },
      'should return a `remove` if a final child is removed'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two, three]}
    right = {type: 'delta', children: [one]}

    t.deepEqual(
      diff(left, right),
      {
        2: {type: 'remove', left: two, right: null},
        3: {type: 'remove', left: three, right: null},
        left: left
      },
      'should return multiple `remove`s if final children are removed'
    )

    var charlie = {type: 'bravo', value: 'charlie'}
    var delta = {type: 'bravo', value: 'delta'}
    var alphaOne = {type: 'alpha', children: [delta, charlie]}
    var alphaTwo = {type: 'alpha', children: [delta]}
    left = {type: 'foxtrott', children: [alphaOne]}
    right = {type: 'foxtrott', children: [alphaTwo]}

    t.deepEqual(
      diff(left, right),
      {
        3: {type: 'remove', left: charlie, right: null},
        left: left
      },
      'should support deeply nested `remove`s'
    )

    t.end()
  })

  t.test('`insert`', function (t) {
    var node = {type: 'alpha', value: 'bravo'}

    t.deepEqual(
      diff(null, node),
      {
        0: {type: 'insert', left: null, right: node},
        left: null
      },
      'should return an `insert` for a root node without predecessor'
    )

    var child = {type: 'alpha', value: 'bravo'}
    var left = {type: 'charlie', children: []}
    var right = {type: 'charlie', children: [child]}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'insert', left: null, right: child},
        left: left
      },
      'should return an `insert` if an only child is inserted'
    )

    var one = {type: 'alpha'}
    var two = {type: 'bravo'}
    var three = {type: 'charlie'}
    var four = {type: 'delta'}
    left = {type: 'echo', children: []}
    right = {type: 'echo', children: [one, two, three, four]}

    t.deepEqual(
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
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [two, three]}
    right = {type: 'delta', children: [one, two, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: [
          {type: 'insert', left: null, right: one},
          {
            type: 'order',
            left: left,
            right: {
              removes: [{left: one, right: 2}],
              inserts: [{left: one, right: 0}]
            }
          }
        ],
        left: left
      },
      'should return an `insert` if a child is prepended'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [three]}
    right = {type: 'delta', children: [one, two, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: [
          {type: 'insert', left: null, right: one},
          {type: 'insert', left: null, right: two},
          {
            type: 'order',
            left: left,
            right: {
              removes: [{left: three, right: 0}],
              inserts: [{left: three, right: 2}]
            }
          }
        ],
        left: left
      },
      'should return multiple `insert`s if multiple children are prepended'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, three]}
    right = {type: 'delta', children: [one, two, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: [
          {type: 'insert', left: null, right: {type: 'bravo'}},
          {
            type: 'order',
            left: left,
            right: {
              removes: [{left: two, right: 2}],
              inserts: [{left: two, right: 1}]
            }
          }
        ],
        left: left
      },
      'should return an `insert` if a child is injected'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    four = {type: 'delta'}
    left = {type: 'echo', children: [one, four]}
    right = {type: 'echo', children: [one, two, three, four]}

    t.deepEqual(
      diff(left, right),
      {
        0: [
          {type: 'insert', left: null, right: two},
          {type: 'insert', left: null, right: three},
          {
            type: 'order',
            left: left,
            right: {
              removes: [{left: four, right: 1}],
              inserts: [{left: four, right: 3}]
            }
          }
        ],
        left: left
      },
      'should return multiple `insert`s if multiple children are injected'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one, two]}
    right = {type: 'delta', children: [one, two, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'insert', left: null, right: three},
        left: left
      },
      'should return an `insert` if a child is appended'
    )

    one = {type: 'alpha'}
    two = {type: 'bravo'}
    three = {type: 'charlie'}
    left = {type: 'delta', children: [one]}
    right = {type: 'delta', children: [one, two, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: [
          {type: 'insert', left: null, right: two},
          {type: 'insert', left: null, right: three}
        ],
        left: left
      },
      'should return multiple `insert`s if multiple children are appended'
    )

    var charlie = {type: 'bravo', value: 'charlie'}
    var delta = {type: 'bravo', value: 'delta'}
    var alphaOne = {type: 'alpha', children: [delta]}
    var alphaTwo = {type: 'alpha', children: [delta, charlie]}
    left = {type: 'foxtrott', children: [alphaOne]}
    right = {type: 'foxtrott', children: [alphaTwo]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'insert', left: null, right: charlie},
        left: left
      },
      'should support deeply nested `insert`s'
    )

    t.end()
  })

  t.test('`replace`', function (t) {
    var left = {type: 'alpha', value: 'bravo'}
    var right = {type: 'charlie', value: 'bravo'}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'replace', left: left, right: right},
        left: left
      },
      'should return a `replace` if the top-most left and right (both text) ' +
        'nodes differ in type'
    )

    left = {type: 'alpha'}
    right = {type: 'bravo'}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'replace', left: left, right: right},
        left: left
      },
      'should return a `replace` if the top-most left and right (both void) ' +
        'nodes differ in type'
    )

    var one = {type: 'alpha'}
    var two = {type: 'bravo'}
    var three = {type: 'charlie'}
    var four = {type: 'delta'}
    left = {type: 'echo', children: [one, two, three]}
    right = {type: 'echo', children: [one, four, three]}

    t.deepEqual(
      diff(left, right),
      {
        0: {type: 'insert', left: null, right: four},
        2: {type: 'remove', left: two, right: null},
        left: left
      },
      'should return an `insert` and `replace` if two children are replaced'
    )

    var bravo = {type: 'bravo'}
    var charlie = {type: 'charlie'}
    var delta = {type: 'delta'}
    var alphaOne = {type: 'alpha', children: [bravo, charlie]}
    var alphaTwo = {type: 'alpha', children: [bravo, delta]}
    left = {type: 'foxtrott', children: [alphaOne]}
    right = {type: 'foxtrott', children: [alphaTwo]}

    t.deepEqual(
      diff(left, right),
      {
        1: {type: 'insert', left: null, right: delta},
        3: {type: 'remove', left: charlie, right: null},
        left: left
      },
      'should support deeply nested `replace`s (as `insert` and `replace`)'
    )

    t.end()
  })

  t.test('`order`', function (t) {
    var alpha = {type: 'alpha'}
    var bravo = {type: 'bravo'}
    var charlie = {type: 'charlie'}
    var left = {type: 'delta', children: [alpha, bravo, charlie]}
    var right = {type: 'delta', children: [charlie, alpha, bravo]}

    t.deepEqual(
      diff(left, right),
      {
        0: {
          type: 'order',
          left: left,
          right: {
            removes: [{left: charlie, right: 2}],
            inserts: [{left: charlie, right: 0}]
          }
        },
        left: left
      },
      'should return an `order` if the last child in a parent moved to start'
    )

    alpha = {type: 'alpha'}
    bravo = {type: 'bravo'}
    charlie = {type: 'charlie'}
    left = {type: 'delta', children: [alpha, bravo, charlie]}
    right = {type: 'delta', children: [bravo, charlie, alpha]}

    t.deepEqual(
      diff(left, right),
      {
        0: {
          type: 'order',
          left: left,
          right: {
            removes: [{left: alpha, right: 0}],
            inserts: [{left: alpha, right: 2}]
          }
        },
        left: left
      },
      'should return an `order` if the first child in a parent moved to the end'
    )

    alpha = {type: 'alpha'}
    bravo = {type: 'bravo'}
    charlie = {type: 'charlie'}
    left = {type: 'delta', children: [alpha, bravo, charlie]}
    right = {type: 'delta', children: [charlie, bravo, alpha]}

    t.deepEqual(
      diff(left, right),
      {
        0: {
          type: 'order',
          left: left,
          right: {
            removes: [
              {left: bravo, right: 1},
              {left: charlie, right: 2}
            ],
            inserts: [
              {left: charlie, right: 0},
              {left: bravo, right: 1}
            ]
          }
        },
        left: left
      },
      'should return an `order` if the children reversed'
    )

    bravo = {type: 'bravo'}
    charlie = {type: 'charlie'}
    var delta = {type: 'delta'}
    var alphaOne = {type: 'alpha', children: [bravo, charlie, delta]}
    var alphaTwo = {type: 'alpha', children: [delta, charlie, bravo]}
    left = {type: 'foxtrott', children: [alphaOne]}
    right = {type: 'foxtrott', children: [alphaTwo]}

    t.deepEqual(
      diff(left, right),
      {
        1: {
          type: 'order',
          left: alphaOne,
          right: {
            removes: [
              {left: charlie, right: 1},
              {left: delta, right: 2}
            ],
            inserts: [
              {left: delta, right: 0},
              {left: charlie, right: 1}
            ]
          }
        },
        left: left
      },
      'should support deeply nested `order`s'
    )

    bravo = {type: 'a', id: 'bravo'}
    charlie = {type: 'a', id: 'charlie'}
    delta = {type: 'a', id: 'delta'}
    alphaOne = {type: 'alpha', children: [bravo, charlie, delta]}
    alphaTwo = {type: 'alpha', children: [delta, charlie, bravo]}
    left = {type: 'foxtrott', children: [alphaOne]}
    right = {type: 'foxtrott', children: [alphaTwo]}

    t.deepEqual(
      diff(left, right),
      {
        1: {
          type: 'order',
          left: alphaOne,
          right: {
            removes: [
              {left: charlie, right: 1},
              {left: delta, right: 2}
            ],
            inserts: [
              {left: delta, right: 0},
              {left: charlie, right: 1}
            ]
          }
        },
        left: left
      },
      'should use other data properties when ordering'
    )

    t.end()
  })

  t.end()
})
