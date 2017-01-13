# unist-diff [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Diff two [**Unist**][unist] trees.

## Installation

[npm][]:

```bash
npm install unist-diff
```

## Usage

```js
```

## API

### `diff(left, right)`

###### Parameters

*   `left` ([`Node`][node]) — Left tree.
*   `right` ([`Node`][node]) — Right tree.

###### Returns

`Array.<Patch>` — List of one or [`patch`es][patch].

### Patch

A patch.

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
