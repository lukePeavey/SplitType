## SplitType

A javascript plugin that "splits" plain text into indivudual lines, words and characters, which can each be animated and styled independly. This makes it easy to create complex typographic animations without the use of canvas.<br>
Compatible with GSAP and Velocity 

#### How To Use:  

SplitType attaches a global function to the window object, which can be called at any time to split the text in one or more elements. `SplitType` is a constructor; it returns a new SplitType instance that contains several properties and methods for interacting with the split text. 

It takes two arguments: <br />
+ elements: the target element(s). This can be a selector string, DOM node, nodelist, jQuery object or array
+ options: (optional) An object containing custom settings for the splitType call (see below for a list of available options)

``` js 
// The basic syntax is:
var instance = new SplitType( elements, [ options ] ); 
```

SpliType works taking plain text and wrapping each line, word, and character in an element, without modifying the visual appearance or formatting of the text. By default it uses inline-block elements and relative positioning. This allows the split text to still reflow naturally when the viwport is resized. However, its also possible to apply absolute positioning to all split text elements. 

##### options:

<b>split</b>: {string} (default: 'lines, words, chars')<br />
defines how the text will be split up. takes a comma separated list.

<b>position</b>:  {string} (default: 'relative')<br />
the css positioning used for split text elements 
choices: 'relative' | 'absolute'

<b>tagName</b>:        {string} (default: 'div')<br />
the type of HTML element that split text will be wrapped in

<b>lineClass</b>:   {string} (default: 'line')<br />
the css class that is added to all split lines

<b>wordClass</b>: {string} (default: 'word')<br />
the css class added to all split words

<b>charClass</b>: {string} (default: 'char')<br />
the css class added to all split characters

<b>splitClass</b>:
  {string} (default: '')<br />
a css class for all split text elements


##### Properties And Methods:
``` js 
var instance = new SplitType('#some-element');
// an array of the split lines in the splitType instance (DOM nodes)
instance.lines 
// an array of the split words in the splitType instance
instance.words 
// an array of the split chars in the splitType instance 
instance.chars 

// METHODS
instance.split(options) 

instance.revert() 
```

#### Using splitType with Velocity
``` js 
// This splits the text in '.banner h1' into both words and characters,
// using absolute positioning. 
var instance = new SplitType('.banner h1', {
	split: 'words, chars', 
	position: 'absolute'
});

// Pass the split characters directly into a Velocity
// TIP: using Velocity's features like stagger, drag, and backwards is 
Velocity( instance.chars, 'transition.slideDownBigIn', { duration: 1000, stagger: 100 })

````
