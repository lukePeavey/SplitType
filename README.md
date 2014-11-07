
Module: TextSplit
version: 0.0.2
Author: Luke Peavey
info: TextSplit is a utility that can be used with Velocity to create typographic animations. It splits text into indivudal words and characters, wrapping each one its own div element. The original text
is replaced with the wrapped elements, making it possible to animate words/characters independently. 

TO USE: 
create a new instance of textSplit
var myText = new TextSplit(textContent,[element],[position]) 

Properties

myText.words gives you an array of all the wrapped words
myText.chars array of all the wrapped characters

You can pass either of these arrays into a velocity call as its first arguement to animate all word/chars. 
Using velocity features like 'stagger' and 'drag' you can increment the animation speed and delay 
for each element without making multiple velocity calls. 

$.Velocity.animate(
	elements: myText.chars, 
	properties: {rotateX: [0, '-90deg'], translateZ: [0, '-100px'], opacity: [1, 0]}, 
	options: {stagger: 100, drag: true, duration: 500, visibility: 'visible'}
)
Split text elements also have classes that can be used to target them. 
.split-text : wrapper that holds all the text
.split-word : wrapper for words 
.split-char : wrapper for characters 


textContent : DOM Element | string 
This specifies the text that will be split. You can target a DOM Element that contains text content (ie 'h1'),
or pass an arbitrary string of text that you want to split. If the first argument is a string of text, the second 
argument has to be a DOM element where the text will be inserted. 

Element : DOM element
The element where text will be inserted. 

Position : string | 
If set to absolute, the position of words/charaters will be set to absolute. The position of elements is set based on their natural position, so the initial appearance of text will be the same. However, with absolure position, text will no longer re-flow naturally when the browser is resized. 
