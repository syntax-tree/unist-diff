# unist-diff

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unist**][unist] utility to diff two trees.

One caveat is that unist does not support keys.
Keys are what allow performant reordering of children.
To deal with that, `unist-diff` uses “synthetic” keys based on the properties
on nodes (excluding their value or their children).
This is not ideal but it’s better than nothing.
Let’s see how it goes!

## Install

[npm][]:

```sh
npm install unist-diff
```

## Use

```js
var h = require('hastscript')
var diff = require('unist-diff')

var left = h('div', [
  h('p', ['Some ', h('b', 'importance'), ' and ', h('i', 'emphasis'), '.']),
  h('pre', h('code', 'foo()'))
])

var right = h('div', [
  h('p', [
    'Some ',
    h('strong', 'importance'),
    ' and ',
    h('em', 'emphasis'),
    '.'
  ]),
  h('pre', h('code', 'bar()'))
])

console.dir(diff(left, right), {depth: null})
```

Yields:

```js
{
  '1': [
    {
      type: 'insert',
      left: null,
      right: {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{type: 'text', value: 'importance'}]
      }
    },
    {
      type: 'insert',
      left: null,
      right: {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [{type: 'text', value: 'emphasis'}]
      }
    }
  ],
  '3': {
    type: 'remove',
    left: {
      type: 'element',
      tagName: 'b',
      properties: {},
      children: [{type: 'text', value: 'importance'}]
    },
    right: null
  },
  '6': {
    type: 'remove',
    left: {
      type: 'element',
      tagName: 'i',
      properties: {},
      children: [{type: 'text', value: 'emphasis'}]
    },
    right: null
  },
  '11': {
    type: 'text',
    left: {type: 'text', value: 'foo()'},
    right: {type: 'text', value: 'bar()'}
  },
  left: Node // Reference to the tree at `left`.
}
```

## API

### `diff(left, right)`

Diff two trees.

###### Parameters

*   `left` ([`Node`][node])
    — Left tree
*   `right` ([`Node`][node])
    — Right tree

###### Returns

`Array.<Patch>` — List of one or [`patch`es][patch].

### `Patch`

Patches represent changes.
They come with three properties:

*   `type` (`string`)
    — Type of change
*   `left` ([`Node`][node], optional)
    — Left node
*   `right` ([`Node`][node], [`PropsDiff`][propsdiff], [`MoveDiff`][movediff],
    optional)
    — New thing

#### `remove`

*   `type` (`'remove'`)
*   `left` ([`Node`][node])
    — Left node
*   `right` (`null`)

#### `insert`

*   `type` (`'insert'`)
*   `left` (`null`)
*   `right` ([`Node`][node])
    — Right node

#### `replace`

*   `type` (`'node'`)
*   `left` ([`Node`][node])
    — Left node
*   `right` ([`Node`][node])
    — Right node

#### `props`

*   `type` (`'props'`)
*   `left` ([`Node`][node])
    — Left node
*   `right` ([`PropsDiff`][propsdiff])

#### `text`

*   `type` (`'text'`)
*   `left` ([`Node`][node])
    — Left node
*   `right` ([`Node`][node])
    — Right node

#### `order`

*   `type` (`'order'`)
*   `left` ([`Node`][node])
    — Parent node
*   `right` ([`MoveDiff`][movediff])
    — Reorder

### `PropsDiff`

`PropsDiff` is an object mapping keys to new values.

In the diff:

*   If a key is removed, the key’s value is set to `undefined`
*   If the new value and the old value are both plain objects, the key’s
    value is set to a `PropsDiff` of both values
*   In all other cases, the key’s value is set to the new value

### `MoveDiff`

`MoveDiff` is an object with two arrays: `removes` and `inserts`.
They always have equal lengths, and are never both empty.
Objects in `inserts` and `removes` have the following properties:

*   `left` ([`Node`][node]) — The moved node
*   `right` (`number`)
    — The index this node moved from (when in `removes`) or to (when in
    `inserts`)

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-diff.svg

[build]: https://travis-ci.org/syntax-tree/unist-diff

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-diff.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-diff

[downloads-badge]: https://img.shields.io/npm/dm/unist-diff.svg

[downloads]: https://www.npmjs.com/package/unist-diff

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-diff.svg

[size]: https://bundlephobia.com/result?p=unist-diff

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[patch]: #patch

[propsdiff]: #propsdiff

[movediff]: #movediff
