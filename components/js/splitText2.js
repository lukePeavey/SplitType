var absolute = "absolute"; 
/**
* Module: TextSplit
* version: 0.0.2
* Author: Luke Peavey
*
* info: TextSplit is a utility that can be used with Velocity.js for typography animation. 
* It splits text into indivual words and characters that are each wrapped their own div tag.
* The wrapper elements use relative positioning and inline-block display so that the text still
* flows and breaks naturally. But it enables each character to be styled and animated independently.  
*
* To Use: 
* myText = new TextSplit(text, location) // this craete a new instance of TextSplit.
* first argument: is the text that you want to split. This can be a DOM Element, or an artitrary string of text. 
* second argument: is the location where the split text will be inserted. If you are splitting text from an existing DOM element, 
* by default it will be inserted in place of the original text, so the  second argument is optional. But if you pass a string of 
* text as the first argument, the second argument is required. 
* 
*
**/
	function TextSplit(a, b, c) {
		var text,  _words = [], _chars = [];
		this.words = []; this.splitWords= []; 
		this.chars = []; this.splitChars = []; 
		this.is_string = typeof a === 'string' ? true : false; 
		if (this.is_string) {
		 	this.element = b;
		 	text = a.toString();
		 	if(c === absolute) {
		 			this.is_absolute = true; 
		 	} else {
		 			this.is_absolute = false; 
		 	}
		} 
		else {
	 		this.element = a; 
	 		text = this.element.textContent;
	 		if(b === absolute) {
	 			this.is_absolute = true; 
	 		} else {
	 			this.is_absolute = false; 
	 		}
		}
		// text is split into an array of words
		text = text.split(' ');
		//each word is then split into a subarray of characters
		text.forEach(function(word, i){
			var _chars = word.split('');
			_words.push(_chars); 
		})
		// create the html elements that will hold the words and characters. 
		for (i=0; i<_words.length; i++) { 
			var wrapWord = document.createElement('div'); 
			wrapWord.className="split-word word" + i;
			wrapWord.style.cssText="margin-right:0.25em; display: inline-block"; 
				// wrap each letters in a div tag 
				_words[i].forEach( function( char, n) {
					var wrapChar = document.createElement('div'); 
					wrapChar.className="split-char ltr" + n; 
					wrapChar.textContent=char; wrapChar.style.display="inline-block"; 
					//add wrapped character to an array that holds all the split characters
					this.splitChars.push(wrapChar); 

					if (char === '&') {
						// Add a special class is the character is an ampersand
						wrapChar.classList.add('ampersand')
						this.splitWords.push(wrapChar);
					} 
					else {
						// insert it into the wrapped character into the word
						wrapWord.appendChild(wrapChar); 
					}
			 	}, this)
			this.splitWords.push(wrapWord);
		}
		// Create a copy of original element
		this.original = this.element.cloneNode(false); 

		// craete a new element that will hold all split text
		this.splitText = document.createElement('div'); 
		// Then insert each of the wrapped words into the element 
		this.splitWords.forEach(function(splitWord) {
			this.splitText.appendChild(splitWord);
		}, this)
		// Replace the original element with the new one that contains the split text
		this.element.textContent=""; this.element.appendChild(this.splitText); 
		// Add the 'split-text' class to the element
		this.splitText.classList.add('split-text');	
		
		// TODO: PUBLIC METHODS 
		this.words = this.splitWords; 
		this.chars = this.splitChars; 
		// if position absolute = true, call the method to set absolute position
		if (this.is_absolute) {
			var _this = this; 
			this.setPosition();
			
		}

	}

	// TODO ABSOLUTE POSITIONING
	// split words and characters can be set to either relative or absolute position. Using absolute position provides
	// better animation performance, but text will not automatically reflow when browser is resized. I added a method that
	// will update the absolute positioning of text after the browser has been resized. 
	// SET THE ABSOLUTE POSITION OF WORDS/CHARACTERS
	TextSplit.prototype.setPosition = function() {
		//first get the size and position of each element, store those values in its data-attributes
		// the main element
		this.splitText.dataset.height = this.splitText.offsetHeight + 'px'; this.splitText.dataset.width = this.splitText.offsetWidth + 'px'; 
		// the words and chars 
		this.words.forEach(function(word) {
			var left = word.offsetLeft, top = word.offsetTop, width = word.offsetWidth; height = word.offsetHeight; 				
			word.dataset.left= left + "px"; word.dataset.top= top +'px'; word.dataset.width= width +'px'; word.dataset.height= height +'px';
				for (var i=0; i<word.children.length; i++) {
					left = word.children[i].offsetLeft; top = word.children[i].offsetTop; width = word.children[i].offsetWidth;
					word.children[i].dataset.left= left + "px"; word.children[i].dataset.top= top + 'px'; word.children[i].dataset.width= width + 'px'; 
				}
		}, this)
		// Now set each element to position absolute, using the values stored in its data attributes. 
		this.splitText.style.height=this.splitText.dataset.height; this.splitText.style.width=this.splitText.dataset.width; 
		this.words.forEach(function(word) {
			var top = word.dataset.top, left = word.dataset.left; width = word.dataset.width; height = word.dataset.height;
			word.style.cssText="display:inline-block; position:absolute; width: " + width + "; height: " + height + "; left:" + left + "; top:" + top + ";";
				for (var i = 0; i < word.children.length; i++) {
					top = word.children[i].dataset.top, left = word.children[i].dataset.left; width = word.children[i].dataset.width; 
					word.children[i].style.cssText="display:inline-block; position:absolute; width:" + width + "; left:" + left + "; top:" + top + ";";
				};
		}, this) 
	}
	// RESEST THE POSITION OF TEXT TO ITS NATURAL RELATIVE POSITION
	TextSplit.prototype.resetPosition = function() {
		this.splitText.style.height=''; this.splitText.style.width=''; 
		this.splitWords.forEach(function(word, i) {
			
			word.style.cssText="display: inline-block; position: relative; left: 0; margin-right: 0.2em; height:; width:;";
			if(!word.classList.contains('ampersand')) {word.style.top="0"}; 
			for(n=0; n<word.children.length; n++) {
				word.children[n].style.cssText="display: inline-block; position: relative; left: 0; top: 0; height: auto; width: auto;"
			}
		}, this)
	}
	//UPDATE THE ABSOLUTE POSITION OF TEXT AFTER RESIZE EVENT
	// This method first resets the text to its natural position, and then sets it to absolute position based on the new values
	TextSplit.prototype.updatePosition = function() {
		console.log("updating text for " + this); 
		var _this = this; 
		this.splitText.style.visibility="hidden"; 
		this.resetPosition();
			waitForFinalEvent(function(){
				_this.setPosition(); 
				_this.splitText.style.visibility="visible"; 
			}, 800, "THIS IS A UNIQUE ID"); 
	}


	TextSplit.prototype.revert = function() {
		this.element.parentNode.replaceChild(this.original, this.element); 
	}



