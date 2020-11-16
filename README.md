# SplitType
[![npm version](https://badge.fury.io/js/split-type.svg)](https://www.npmjs.com/package/split-type)

SplitType is a small javascript library that splits HTML text into elements so that lines, words, and characters can be animated independently. It was inspired by GSAP's SplitText plugin, and can be used with any animation library. 

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)
  
## Installation

**Yarn/NPM**

You can install SplitType as a dependency using yarn or npm.

```SHELL
yarn add 'split-type'
```
```js
import SplitType from 'split-type'
```

**CDN**

Or, include the following `<script>` tag to load SplitType from a CDN. In this case, the `SplitType` constructor will be attached to `window` object. 

```html
<!-- Minified UMD bundle -->
<script src="https://unpkg.com/split-type"></script>
```


## Usage 

`SplitType` splits the text content of the target element(s) using the provided [options](#options). It returns a new `SplitType` instance which provides access to the split text nodes.  Under the hood, it simply wraps each line, word, and/or character in an element without changing the visual appearance of the text. 

**Split Types**

The `types` option lets you specify which units the text will be broken up into. There are three types: lines, words, and characters. You can specify any combination of these types.

```js
// Splits text into lines, words, characters (default)
const text = new SplitType('#target')
// Splits text into words and characters
const text = new SplitType('#target', { types: 'words, chars' })
// Splits text into lines
const text = new SplitType('#target', { types: 'words' }
```

**Accessing split text nodes**

```js
// Splits text in element with ID="target"
const text = new SplitType('#target')

// An array of the all line elements
console.log(text.lines)
// An array of all word elements
console.log(text.words)
// An array of all character elements
console.log(text.chars)
```

**Absolute vs Relative position**

By default, split text nodes are set to relative position and `display:inline-block`. This allows split text to reflow naturally if the container is resized. SplitType also supports absolute position for split text nodes by settings `{absolute: true}`. This can improve performance for animations. But split text will not automatically reflow if the container size changes. To reposition text after browser is resized, you can use the `split` method to re-split text. 

```js
// Splits text using absolute position for split text elements
const text = new SplitType('#target', { absolute: true })
```

## API Reference 

### SplitType(target, [options])

### Arguments

#### `target` 

The target elements for the SplitType call. This can be a selector, a single element, or an ArrayLike object (ie NodeList, jQuery Object, etc). SplitType does not currently support nested HTML inside target elements. So the elements passed to `SplitType` should directly contain the text that you wish to split. 

#### `options`

| name       | type      | default                 | description                                                      |
| ---------- | --------- | ----------------------- | ---------------------------------------------------------------- |
| absolute   | `boolean` | `false`                 | If true, absolute position will be used to for split text nodes. |
| tagName    | `string`  | `"div"`                 | The HTML tag that will be used for split text nodes              |
| lineClass  | `string`  | `"line"`                | The className all split line elements                            |
| wordClass  | `string`  | `"word"`                | The className for split word elements                            |
| charClass  | `string`  | `"char"`                | The className for split character elements                       |
| splitClass | `string`  | `null`                  | A className for all split text elements                          |
| types      | `string`  | `"lines, words, chars"` | Comma separated list of types                                    |
| split      | `string`  | ""                      | Alias for `types`                                                |


###  Instance Properties


#### `instance.lines: HTMLElement[]`

An array of the split line elements in the splitType instance

#### `instance.words: HTMLElement[]`

An array of the split word elements in the splitType instance

#### `instance.chars: HTMLElement[]`

An array of the split character elements


### Instance Methods

#### `instance.split(options): void`

This method is automatically called by the SplitType constructor. But it can be called manually to re-split text using new options. 

#### `revert(): void`

Restores target elements to their original text content. It also clears cached data associated with the split text nodes. 

### Static Properties

#### `get SplitType.defaults`

Gets the default settings for all SplitType calls

#### `set SplitType.defaults`

Set the defaults settings. The value should be object containing specific settings to override. The value will be merged with the existing defaults object.

```js
// To have splitType use absolute position by default.
SplitType.defaults = { absolute: true }
```
  
## Examples

**Text Animation with GSAP**
``` js 
// Split text into characters using absolute positioning.
const text = new SplitType('#target', {
	types: 'chars',
	absolute: true
});

// Animate characters into view with a stagger effect
gsap.from(text.chars, {
	opacity: 0,
	y: 20
  duration: 1,
	stagger: { amount: 0.1 },
})
```
