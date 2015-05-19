Split Type

About: SplitType is a javascript utility that splits plain text into indivudal lines, words, and characters that can each be styled and animated independently. It does this by wrapping each line/word/character in its own HTML element. The concept for this plugin was inspired by Split Text, which is part of the GSAP animation suite. My goal was to create a similar tool that could be used with other animation libraries such as Velocity. 

TO USE: 
SplitType attaches a function to the global window object. Call this function anytime to create a new instance of SplitType

	var myText = new SplitType(elements, options)

Elements: (DOM elements || selector string ) The target element or elements for a splitType call. The text content of each target element will be split according to the settings. 
Elements can be passed into a splitType call in several forms. It accepts: a single DOM element, a nodelist, an array of elements, a jQuery object, or a selector string. 

options: (object) the settings for a splitType call. Set any of the following options:

	lineClass  : (string) the css class for split lines 

	wordClass  : (string) the css class for split words 

	charClass  : (string) the css class for split characters

	split      : (string) default: 'lines, words, chars' | a comma separated list of the split type to use 

	position   : (string) "absolute" or "relative"

	nodeType   : (string) default: 'div' | the type of HTML element that split text will be wrapped in 

	text       : (string) custom text content that will be inserted in target elemetns

PROPERTIES AND METHODS:

Each splitType call returns a new instance of SplitType. There are several properties and methods which can be accessed on the splitTYpe instance. 

	instance.lines // returns an array of DOM elements for all the split lines in this splitType instance.
	instance.words // an array of DOM elements for each split word in the instance
	instance.chars // an array of DOM elements for each split character in the instance 

	instance.split(options) // the split method initiates the text splitting process. 
	This get called automatically when a new splitType instance is created. But it 
	can also be called again to re-split text using new options. 

	instance.revert() // Reverts the target elements back to their original content. 




