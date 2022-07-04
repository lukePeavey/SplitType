# SplitType

[![npm version](https://badge.fury.io/js/split-type.svg)](https://www.npmjs.com/package/split-type)

SplitType is a small javascript library that splits HTML text into elements so that lines, words, and characters can be animated independently. It was inspired by GSAP's SplitText plugin, and can be used with any animation library.

Under the hood, SplitType changes the html structure of the target elements, wrapping each line, word, and/or character in a element.

- [Features](#features)
- [Supported Browsers](#supported-browsers)
- [Installation](#installation)
- [Usage](#usage)
  - [Splitting Text](#splitting-text)
  - [The types option](#the-types-option)
  - [Accessing split text nodes](#accessing-split-text-nodes)
  - [Reverting Split Text](#reverting-split-text)
  - [Nested Elements](#nested-elements)
  - [Absolute vs Relative position](#absolute-vs-relative-position)
  - [Responsive Text](#responsive-text)
- [API Reference](#api-reference)
  - [SplitType(target, [options])](#splittypetarget-options)
  - [Instance Properties](#instance-properties)
  - [Static Properties](#static-properties)
- [Examples](#examples)

## Features

- Splits text into lines, words, and/or characters
- Customizable class names for split text elements
- Detects natural lines breaks in the text
- Preserves explicit lines breaks (`<br>` tags)
- Preserves nested HTML elements inside the target elements
- Supports unicode symbols such as emojis

## Supported Browsers

SplitType works in all modern browsers. Internet Explorer is [no longer supported](https://github.com/lukePeavey/SplitType/issues/29).

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ❌ Internet Explorer

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

Or, include the following `<script>` tag to load SplitType from a CDN.

```html
<!-- Minified UMD bundle -->
<script src="https://unpkg.com/split-type"></script>
```

## Usage

### Splitting Text

The SplitType class "splits" the text content of the target elements using the provided options. It returns a `SplitType` instance which provides access to the split text nodes. By default, text will be split into lines, words, and characters, using relative position.

Because SplitType is a class, it cannot be called without the `new` keyword. As an alternative, you can use the static method `SplitType.create().`

```js
const text = new SplitType('#target')
// or
const text = SplitType.create('#target')

// Array of line elements
text.lines
// Array of word elements
text.words
// Array of character elements
text.chars
```

**Important: The following style should be applied to all target elements.** This prevents the characters from shifting slightly when text is split/reverted.

```css
.target {
  font-kerning: none;
}
```

Also, if the target elements are inside a flex container, they need to have a defined `width` to prevent the text from moving when it gets split.

### The types option

The `types` option lets you specify which units the text will be broken up into. There are three types: lines, words, and characters. You can specify any combination of these types. However, splitting text into only characters is not recommended. To maintain normal line breaks, you need to include words and/or lines.

```js
// Splits text into lines, words, characters (default)
const text = new SplitType('#target')
// Splits text into words and characters
const text = new SplitType('#target', { types: 'words, chars' })
// Splits text into lines
const text = new SplitType('#target', { types: 'words' }
```

### Accessing split text nodes

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

You can also use selectors to access split text elements

```js
const text = new SplitType('#target')
const words = document.querySelectorAll('#target .word')
```

### Reverting Split Text

The revert method will restore the target element(s) to their original html content. It also removes all data associated with the target elements from SplitType's internal data store. It is recommended to revert split text once it is no longer needed (for example at the end of an animation, or before the component is unmounted).

Text can be reverted using the instance method:

```js
instance.revert()
```

Or using the static method, and specify the target elements to revert.

```js
SplitType.revert('#target')
```

### Nested Elements

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

### Absolute vs Relative position

By default, split text nodes are set to relative position and `display:inline-block`. SplitType also supports absolute position for split text nodes by setting `{ absolute: true }`. When this is enabled, each line/word/character will be set to absolute position, which can improve performance for some animations.

### Responsive Text

When text is split into words and characters using relative position, the text will automatically reflow when the container is resized. However, when absolute position is enabled, or text is split into lines (default), the text will not reflow naturally if the viewport is resized. In this case, you will need to re-split text after the container is resized. This can be accomplished using an event listener or ResizeObserver and calling `instance.split()` after the container has been resized.

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

The target element(s) for the SplitType call. This can be a selector string, a single element, or a collection of elements (ie NodeList, jQuery object, or array).

**`options`**

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

### Instance Properties

`get` **`instance.lines`** &nbsp;:&nbsp; `HTMLElement[]`

An array of the split line elements in the splitType instance

`get` **`instance.words`** &nbsp;:&nbsp; `HTMLElement[]`

An array of the split word elements in the splitType instance

`get` **`instance.chars`** &nbsp;:&nbsp; `HTMLElement[]`

An array of the split character elements

`get` **`instance.settings`** &nbsp;:&nbsp; `SplitTypeOptions`

The settings for this splitType instance.

`get` **`instance.isSplit`** &nbsp;:&nbsp; `boolean`

Indicates if the target elements are currently split

`method` **`instance.split(options)`** &nbsp; `=> void`

The split method is called automatically when a new SplitType instance is created. It can be called manually to re-split the target elements. By default it will use the same options that were passed to the constructor when the instance was created. You can also provide new options. This method is useful when you need to re-split text after the browser or container element has been re-sized.

`method` **`instance.revert()`** &nbsp; `=> void`

Restores the target elements to their original html content. It also removes data associated with the target elements from SplitTypes internal data store.

### Static Properties

`get` **`SplitType.defaults`**&nbsp;:&nbsp;`{SplitTypeOptions}`

Gets the current default settings for all SplitType instances. The default settings can be modified using the `setDefaults` methods.

`method` **`SplitType.setDefaults(options: any)`** &nbsp;`=> SplitTypeOptions`

Sets the default options for all `SplitType` instances. **The provided object will be merged with the existing `SplitType.defaults` object**. Returns the new defaults object.

`method` **`SplitType.create(target, options)`** &nbsp;`=> SplitType`

Creates a new `SplitType` instance using the provided parameters. This method can be used to call SplitType without using the `new` keyword.

`method` **`SplitType.revert(target)`** &nbsp;`=> void`

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
