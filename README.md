## SplitType

### About: 

SplitType 'splits' the text content of HTML elements so that each line, word, and character of text can be animated independently. The concept for this plugin was inspired by Split Text, which is part of the GSAP animation platform. My goal was to create a similar tool that could be used with other animation libraries such as Velocity. 

### How To Use:  

Once its loaded on the page, the SplitType() function can be called anytime to split text in one or more elements. SplitType is constructor, so it should always be called using the `new` operator. 

``` js 
// Creates a new instance of splitType and assigns it variable 
var instance = new SplitType(elements, [options])
```
This will 'split' the text content in each of the `elements` using the specified `options`. Multiple instances of SplitType can be created on the same page.

#### Parameters
##### elements 

The elements that will be targeted by a SplitType call.  WARNING Any nested HTML tags inside the elements will be stripped when text is split. The elements can be passed in in any of the following ways: 
+ Single DOM element
+ Nodelist 
+ jQuery/Zepto object
+ Array (of multiple elements, nodelists, jquery objects)
+ Selector String 

##### options: (object) 

the settings for a splitType call. Set any of the following options:

	lineClass : (string) | default: 'split-line'
	the css class for split lines 

	wordClass : (string) | default: 'split-word'
	the css class for split words 

	charClass : (string) | default: 'split-char'
	the css class for split characters

	split : (string) | default: 'lines, words, chars' 
	defines how the text will be split. Takes a comma separated list of the split types to use
	choices: lines | words | chars 

	position : (string) default: 'relative'
	the css positioning used for split text elements 
	choices: 'relative' | 'absolute'

	nodeType : (string) default: 'div'
	the type of HTML element that split text will be wrapped in

	text : (string | boolean) default: false
	insert a custom string of text into the target element before splitting.

#### Properties And Methods:

Each SplitType call returns a new instance of SplitType. There are several properties and methods which can be accessed on the splitType instance. 
``` js
// PROPERTIES
instance.lines 
// returns an array of DOM elements for all split lines in the splitType instance.
instance.words 
// returns an array of DOM elements for each split word in the instance
instance.chars 
// returns an array of DOM elements for each split character in the instance 

// METHODS
instance.split(options) 
// This method initiates the text splitting process. 
// It gets called automatically when a splitType instance is created. 
// It also be called manually to re-split text using different options. 

instance.revert() 
// Reverts the target elements back to their original content. 
```

#### Using splitType with Velocity
``` js
// This splits the text in '.banner h1' into both words and characters using absolute positioning. 
var myText = new SplitType('.banner h1', {
	split:'words, chars', 
	position: 'absolute'
	});

// myText.chars returns an array of all the split characters in the text. 
// this can be passed directly into a velocity call to animate the characters 
Velocity.animate( myText.chars, 'transition.slideDownBigIn', {duration: 1000, stagger: 100})

````
