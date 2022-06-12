# SplitType

[![npm version](https://badge.fury.io/js/split-type.svg)](https://www.npmjs.com/package/split-type)

SplitType is a small javascript library that splits HTML text into elements so that lines, words, and characters can be animated independently. It was inspired by GSAP's SplitText plugin, and can be used with any animation library.

Under the hood, SplitType changes the html structure of the target elements, wrapping each line, word, and/or character in a element.

- [Supported Browsers](#supported-browsers)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)

## Supported Browsers

Should work in all modern browsers. Internet Explorer is no longer supported (if IE support is important to you, please post a comment [here](https://github.com/lukePeavey/SplitType/issues/29).

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ❌ Internet Explorer

## Features

- Splits text into lines, words, and/or characters
- Customizable class names for split text elements
- Detects natural lines breaks in the text
- Preserves explicit lines breaks (`<br>` tags)
- Preserves nested HTML elements inside the target elements
- Supports unicode symbols such as emojis

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

Or, include the following `<script>` tag to load SplitType from a CDN. In this case, the `SplitType` class will be attached to `window` object.

```html
<!-- Minified UMD bundle -->
<script src="https://unpkg.com/split-type"></script>
```

## Usage

The SplitType class "splits" the text content of the target elements using the provided options. It returns a `SplitType` instance which provides access to the split text nodes.

```js
const text = new SplitType('#target')
```

You can also use the static method `SplitType.create`, which allows you to create a splitType instance without using the `new` keyword.

```js
// Creates a new SplitType instance
const text = SplitType.create('.target')
```

**Types**

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

You can access the split lines/words/characters via properties on the `SplitType` instance.

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

Or using selectors

```js
const text = new SplitType('#target')
const words = document.querySelectorAll('#target .word')
```

**Nested Elements**

As of `v0.3`, nested elements inside the target elements will be preserved when text is split. This makes it possible to:

- Apply custom styles to specific parts of the test
- Include interactive elements such links are buttons inside split text.

```html
<p id="target">Foo <em>Bar</em></p>
```

```js
SplitType.create('#target')
```

Result

```html
<div class="target">
  <div class="line" style="display: block; text-align: start; width: 100%">
    <div class="word" style="display: inline-block; position: relative">
      <div class="char" style="display: inline-block">F</div>
      <div class="char" style="display: inline-block">o</div>
      <div class="char" style="display: inline-block">o</div>
    </div>
    <em style="display: inline-block; position: relative"
      ><div class="word" style="display: inline-block; position: relative">
        <div class="char" style="display: inline-block">B</div>
        <div class="char" style="display: inline-block">a</div>
        <div class="char" style="display: inline-block">r</div>
      </div>
    </em>
  </div>
</div>
```

Caveat: this feature is not compatible with splitting text into lines. When split lines is enabled, if the text content of a nested element gets broken onto multiple lines, it will result in unexpected line breaks in the split text.

**Absolute vs Relative position**

By default, split text nodes are set to relative position and `display:inline-block`. SplitType also supports absolute position for split text nodes by setting `{ absolute: true }`. When this is enabled, each line/word/character will be set to absolute position, which can improve performance for some animations.

**Responsive Text**

When text is split into words and characters using relative position, the text will automatically reflow when the container is resized. However, when absolute position is enabled, or text is split into lines, text will need to re-split after the container is resized. This can be accomplished using an event listener or `ResizeObserver`, and calling the `split` method once the window or container element has been resized.

For a complete example, see [`__stories__/components/Example.svelte`](https://github.com/lukePeavey/SplitType/blob/master/__stories__/components/Example.svelte)

```js
const text = new SplitType('#target')

// Reposition text after the container is resized (simplified version)
// This example uses lodash#debounce to ensure the split method only
// gets called once after the resize is complete.
const resizeObserver = new ResizeObserver(
  debounce(([entry]) => {
    // Note: you should add additional logic so the `split` method is only
    // called when the **width** of the container element has changed.
    text.split()
  }, 500)
)
resizeObserver.observe(containerElement)
```

## API Reference

### SplitType(target, [options])

**`target`**

The target elements for the SplitType call. This can be a selector, a single element, a collection of elements (ie NodeList, jQuery Object, etc).

**`options`**

| name         | type      | default                 | description                                                                |
| ------------ | --------- | ----------------------- | -------------------------------------------------------------------------- |
| absolute     | `boolean` | `false`                 | If true, absolute position will be used to for split text nodes.           |
| tagName      | `string`  | `"div"`                 | The HTML tag that will be used for split text nodes                        |
| isSplitClass | `string`  | `null`                  | A className that will be applied to the target element when text is split. |
| lineClass    | `string`  | `"line"`                | The className all split line elements                                      |
| lineClass    | `string`  | `"line"`                | The className all split line elements                                      |
| wordClass    | `string`  | `"word"`                | The className for split word elements                                      |
| charClass    | `string`  | `"char"`                | The className for split character elements                                 |
| splitClass   | `string`  | `null`                  | A className for all split text elements                                    |
| types        | `string`  | `"lines, words, chars"` | Comma separated list of types                                              |
| split        | `string`  | ""                      | Alias for `types`                                                          |

### Instance Properties

**`instance.lines: HTMLElement[]`**

An array of the split line elements in the splitType instance

**`instance.words: HTMLElement[]`**

An array of the split word elements in the splitType instance

**`instance.chars: HTMLElement[]`**

An array of the split character elements

### Instance Methods

**`instance.split(options): void`**

This method is automatically called by the SplitType constructor. But it can be called manually to re-split text using different options.

**`instance.revert(): void`**

Restores the target elements associated with this SplitType instance to their original text content. It also clears cached data associated with the split text nodes.

### Static Properties

**`SplitType.defaults`**

Gets the current default settings for all SplitType instances. The default settings can be modified using the `setDefaults` methods.

### Static Methods

**`SplitType.setDefaults(options: any)`**

Sets the default options for all `SplitType` instances. **The provided object will be merged with the existing `SplitType.defaults` object**. Returns the new defaults object.

**`SplitType.create(target, options)`**

Creates a new `SplitType` instance using the provided parameters. This method can be used to call SplitType without using the `new` keyword.

**`SplitType.revert(target)`**

Reverts the target element(s) if they are currently split. This provides a way to revert split text without a reference to the `SplitType` instance.

## Examples

**Text Animation with GSAP**

```js
// Split text into words and characters
const text = new SplitType('#target', { types: 'words, chars' })

// Animate characters into view with a stagger effect
gsap.from(text.chars, {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: { amount: 0.1 },
})
```
