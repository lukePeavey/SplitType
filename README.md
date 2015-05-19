Split Type

About: SplitType is a javascript utility that splits plain text into indivudal lines, words, and characters that can each be styled and animated independently. It does this by wrapping each line/word/character in its own HTML element. The concept for this plugin was inspired by Split Text, which is part of the GSAP animation suite. My goal was to create a similar tool that could be used with other animation libraries such as Velocity. 

TO USE: 
SplitType attaches a function to the global window object. Call this function anytime to create a new instance of SplitType
var mySplit = new SplitType(elements, [options])

Elements: (DOM elements || selector string ) The target element or elements for a splitType call. The text content of each target element will be split according to the settings. 
Elements can be passed into a splitType call in several forms. It accepts: a single DOM element, a nodelist, an array of elements, a jQuery object, or a selector string. 

options: (object) the settings for a splitType call. Set any of the following options:

	lineClass  : (string) the css class for split lines 

	wordClass  : (string) the css class for split words 

	charClass  : (string) the css class for split characters

	split      : (string) a comma separated list of the split type to use ('lines, words, chars')

	position   : (string) choices "absolute" or "relative"

	nodeType : ' (string) the type of HTML element that split text will be wrapped in default: 'div'

	text       : (string) custom text content that will be inserted in target elemetns
	