# unist-diff [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Diff two [**Unist**][unist] trees.

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
  left: left
}
```

## API

### `diff(left, right)`

###### Parameters

*   `left` ([`Node`][node]) — Left tree.
*   `right` ([`Node`][node]) — Right tree.

###### Returns

`Array.<Patch>` — List of one or [`patch`es][patch].

### `Patch`

Patches represent changes.  They come with three properties:

*   `type` (`string`) — Type of change
*   `left` ([`Node`][node], optional) — Left node
*   `right` ([`Node`][node], [`PropsDiff`][propsdiff], [`MoveDiff`][movediff],
    optional) — New thing

#### `remove`

*   `type`: `'remove'`
*   `left` ([`Node`][node]) — Left node
*   `right`: `null`

#### `insert`

*   `type`: `'insert'`
*   `left`: `null`
*   `right` ([`Node`][node]) — Right node

#### `replace`

*   `type`: `'node'`
*   `left` ([`Node`][node]) — Left node
*   `right` ([`Node`][node]) — Right node

#### `props`

*   `type`: `'props'`
*   `left` ([`Node`][node]) — Left node
*   `right`: [`PropsDiff`][propsdiff]

#### `text`

*   `type`: `'text'`
*   `left` ([`Node`][node]) — Left node
*   `right` ([`Node`][node]) — Right node

#### `order`

*   `type`: `'order'`
*   `left` ([`Node`][node]) — Parent node
*   `right` ([`MoveDiff`][movediff]) — Reorder

## `PropsDiff`

`PropsDiff` is an object mapping keys to new values.

In the diff:

*   If a key is removed, the key’s value is set to `undefined`.
*   If the new value is of the same non-primitive type as the new value
    (their prototype’s are equal, thus both array or both object), the key’s
    value is set to a `PropsDiff` of both values.
*   In all other cases, the key’s value is set to the new value.

## `MoveDiff`

`MoveDiff` is an object with two arrays: `removes` and `inserts`.
They are never both empty.  Objects in `inserts` and `removes` have the
following properties:

*   `from` (`number`), if in `removes` — Current index of the child in `parent`
*   `left` ([`Node`][node]) — Left node
*   `right` ([`Node`][node]) — Right node
*   `to` (`number`), if in `inserts` — Next index of the child in `parent`

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
