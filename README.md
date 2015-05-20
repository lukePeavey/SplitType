# splitType

## About: 

SplitType is a javascript utility that splits plain text into individual lines, words, and characters that can each be styled and animated independently. It does this modifying the DOM behind the scenes, wrapping each line/word/character in its own element. The concept for this plugin was inspired by Split Text, which is part of the GSAP animation suite. My goal was to create a similar tool that could be used with other animation libraries such as Velocity. 

## HOW TO USE: 

SplitType attaches a function to the global window object. Call this function anytime to create a new instance of SplitType

	``` js 
	var mySplit = new SplitType(elements, [options])
	```

#### Elements (DOM elements | selector string )

Sets the target element(s) for a splitType call. The text content of each target element will be split according settings (see below).
Elements can be passed into a splitType call in several forms. It accepts: a single DOM element, a nodelist, an array of elements, a jQuery object, or a selector string. 

#### Options: (object) 

the settings for a splitType call. Set any of the following options:

`	lineClass : (string) | default: 'split-line'
	the css class for split lines 

	wordClass : (string) | default: 'split-word'
	the css class for split words 

	charClass : (string) | default: 'split-char'
	the css class for split characters

	split : (string) | default: 'lines, words, chars' 
	defines how the text will be split up. It takes a comma separated list of the split types to use
	choices: lines | words | chars 

	position : (string) default: 'relative'
	the css positioning used for split text elements 
	choices: 'relative' | 'absolute'

	nodeType : (string) default: 'div'
	the type of HTML element that split text will be wrapped in

	text : (string | boolean) default: false
	the text to be split. If set, this will replace the existing text content in target element `

#### PROPERTIES AND METHODS:

Each SplitType call returns a new instance of SplitType. There are several properties and methods which can be accessed on the splitType instance. 
	``` js
	Example: var mySplit = new SplitType('h1'); 
	
	mySplit.lines 
	// returns an array of DOM elements for all split lines in the splitType instance.
	mySplit.words 
	// returns an array of DOM elements for each split word in the instance
	mySplit.chars 
	// returns an array of DOM elements for each split character in the instance 

	mySplit.split(options) 
	// This method initiates the text splitting process. 
	// It gets called automatically when a splitType instance is created.
	// It can also be called again to re-split text using new options. 

	mySplit.revert() 
	// Reverts the target elements back to their original content. 
	```




