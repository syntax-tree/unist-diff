# unist-diff [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Diff two [**Unist**][unist] trees.

Based on the [`vtree`][vtree] diffing algorithm in [`virtual-dom`][vdom],
but for Unist.

One caveat is that “Unist” does not support keys.  Keys are what allow
performant reordering of children.  To deal with that, `unist-diff` uses
“synthetic” keys based on the properties on nodes (excluding their value
or their children).  This is not ideal but it’s better than nothing.
Let’s see how it goes!

## Installation

[npm][]:

```bash
npm install unist-diff
```

## Usage

```js
var h = require('hastscript');
var diff = require('unist-diff');

var left = h('div', [
  h('p', [
    'Some ',
    h('b', 'importance'),
    ' and ',
    h('i', 'emphasis'),
    '.'
  ]),
  h('pre', h('code', 'foo()'))
]);

var right = h('div', [
  h('p', [
    'Some ',
    h('strong', 'importance'),
    ' and ',
    h('em', 'emphasis'),
    '.'
  ]),
  h('pre', h('code', 'bar()'))
]);

console.dir(diff(left, right), {depth: null});
```

Yields:

```js
{ '1':
   [ { type: 'insert',
       left: null,
       right:
        { type: 'element',
          tagName: 'strong',
          properties: {},
          children: [ { type: 'text', value: 'importance' } ] } },
     { type: 'insert',
       left: null,
       right:
        { type: 'element',
          tagName: 'em',
          properties: {},
          children: [ { type: 'text', value: 'emphasis' } ] } } ],
  '3':
   { type: 'remove',
     left:
      { type: 'element',
        tagName: 'b',
        properties: {},
        children: [ { type: 'text', value: 'importance' } ] },
     right: null },
  '6':
   { type: 'remove',
     left:
      { type: 'element',
        tagName: 'i',
        properties: {},
        children: [ { type: 'text', value: 'emphasis' } ] },
     right: null },
  '11':
   { type: 'text',
     left: { type: 'text', value: 'foo()' },
     right: { type: 'text', value: 'bar()' } },
  left:
   { type: 'element',
     tagName: 'div',
     properties: {},
     children:
      [ { type: 'element',
          tagName: 'p',
          properties: {},
          children:
           [ { type: 'text', value: 'Some ' },
             { type: 'element',
               tagName: 'b',
               properties: {},
               children: [ { type: 'text', value: 'importance' } ] },
             { type: 'text', value: ' and ' },
             { type: 'element',
               tagName: 'i',
               properties: {},
               children: [ { type: 'text', value: 'emphasis' } ] },
             { type: 'text', value: '.' } ] },
        { type: 'element',
          tagName: 'pre',
          properties: {},
          children:
           [ { type: 'element',
               tagName: 'code',
               properties: {},
               children: [ { type: 'text', value: 'foo()' } ] } ] } ] } }
```

## API

### `diff(left, right)`

###### Parameters

*   `left` ([`Node`][node]) — Left tree
*   `right` ([`Node`][node]) — Right tree

###### Returns

`Array.<Patch>` — List of one or [`patch`es][patch].

### `Patch`

Patches represent changes.  They come with three properties:

*   `type` (`string`) — Type of change
*   `left` ([`Node`][node], optional) — Left node
*   `right` ([`Node`][node], [`PropsDiff`][propsdiff], [`MoveDiff`][movediff],
    optional) — New thing

#### `remove`

*   `type` (`'remove'`)
*   `left` ([`Node`][node]) — Left node
*   `right` (`null`)

#### `insert`

*   `type` (`'insert'`)
*   `left` (`null`)
*   `right` ([`Node`][node]) — Right node

#### `replace`

*   `type` (`'node'`)
*   `left` ([`Node`][node]) — Left node
*   `right` ([`Node`][node]) — Right node

#### `props`

*   `type` (`'props'`)
*   `left` ([`Node`][node]) — Left node
*   `right` ([`PropsDiff`][propsdiff])

#### `text`

*   `type` (`'text'`)
*   `left` ([`Node`][node]) — Left node
*   `right` ([`Node`][node]) — Right node

#### `order`

*   `type` (`'order'`)
*   `left` ([`Node`][node]) — Parent node
*   `right` ([`MoveDiff`][movediff]) — Reorder

### `PropsDiff`

`PropsDiff` is an object mapping keys to new values.

In the diff:

*   If a key is removed, the key’s value is set to `undefined`
*   If the new value and the old value are both plain objects, the key’s
    value is set to a `PropsDiff` of both values
*   In all other cases, the key’s value is set to the new value

### `MoveDiff`

`MoveDiff` is an object with two arrays: `removes` and `inserts`.
They always have equal lengths, and are never both empty.  Objects in
`inserts` and `removes` have the following properties:

*   `left` ([`Node`][node]) — The moved node
*   `right` (`number`) — The index this node moved from (when in `removes`) or
    to (when in `inserts`)

## Contribute

See [`contribute.md` in `syntax-tree/unist`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/unist-diff.svg

[travis]: https://travis-ci.org/syntax-tree/unist-diff

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-diff.svg

[codecov]: https://codecov.io/github/syntax-tree/unist-diff

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[patch]: #patch

[propsdiff]: #propsdiff

[movediff]: #movediff

[vtree]: https://github.com/Matt-Esch/virtual-dom/tree/master/vtree

[vdom]: https://github.com/Matt-Esch/virtual-dom

[contribute]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
