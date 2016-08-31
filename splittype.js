/** SplitType 
  * A javascript utility that splits text into indivual lines words and characters
  * that can be animated and styled independently. 
  * Date: May 2015
  * @author: Luke Peavey 
  * @version: 0.8
  * @license MIT
  */

var SplitType = (function (window, document, undefined) {
'use strict';

/********************
- DEFAULT SETTINGS - 
*********************/ 
// Internal defaults object 
// Stores the global default settings used for all splitType calls. 
var _defaults = {
  lineClass : 'line',
  wordClass : 'word',
  charClass : 'char',
  splitClass : 'split-item',
  split : 'lines, words, chars',
  position : 'rel',
  nodeName : 'div',
  text : false,
  // === Read Only === 
  // (boolean) checks settings to see if text is being split into lines 
  get splitLines() { return this.split.indexOf('lines') !== -1 },
  // (boolean) checks settings to see if text is being split  into words 
  get splitWords() { return this.split.indexOf('words') !== -1 },
  // (boolean) checks settings to see if text is being split into being characters 
  get splitChars() { return this.split.indexOf('chars') !== -1 },
  // (boolean) checks settings to see if position is set to absolute
  get isAbsolute() { return typeof this.position === "string" && this.position.toLowerCase() === 'absolute' || this.absolute === true }
}

/** 
 * SplitType.defaults is public property on the global SplitType object. 
 * It allows people to access or modify global default settings from outside.
 * Individual settings can be changed like this: SplitType.settings.settingName = 'new value'
 * Multiple settings can be changed like this: SplitType.settings = {setting1: 'value1', setting2: 'value2'}
 */
Object.defineProperty(SplitType, 'settings', {
  get: function() { return _defaults },
  set: function(obj) { 
    _defaults = extend(_defaults, obj); 
  }
})

/***************************************
 - Utility Methods - 
 ***************************************/  
/* jquery type */ 
 function type( obj ) {
  if ( obj == null ) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ? 
    class2type[ toString.call(obj) ] || "object" : 
      typeof obj;
};
/* jquery isArraylike */
function isArraylike(obj) {
  if(typeof obj !== 'object' || obj === null) return false; 
  var length = obj.length; 
  return length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
};
/* Shorthands for native DOM methods */ 
var text = function(str) { return document.createTextNode(str) }
var space = function() { return text(' ') }
var fragment = function() { return document.createDocumentFragment() } 

/* for jquery type */ 
var class2type = {}, 
toString = class2type.toString; 
'Boolean Number String Function Array Object Null'.split(' ').
forEach(function(name) { class2type["[object " + name + "]"] = name.toLowerCase() });

/** 
 * Merges two or more objects into a new object. 
 * Chris Ferdinandi https://gist.github.com/cferdinandi/ 
 * Objects on the right override matching properties of those on the left. 
 * Modified to use getOwnPropertyDescriptor and defineProperty to allow copying of getter/setters
 * IE9 and up
 */
function extend( objects ) {
    var extended = {};
    var merge = function (obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
              var propDefinition = Object.getOwnPropertyDescriptor(obj, prop)
              Object.defineProperty(extended, prop, propDefinition)
            }
        }
    };
    merge(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i]; 
        if( typeof obj === 'object' && obj !== null ) 
          merge(obj); 
    }
    return extended;
};

/**
 * Tests if an object is an element-like node. For our purposes, this includes: 
 * a) element node, b) text node, c) document fragment.  
 * @param: obj: the object to test 
 * returns: boolean 
 */
function isElement(obj) {
  if (typeof obj !== 'object' || obj === null) return false; 
  return obj.nodeType === 1 || obj.nodeType === 3 || obj.nodeType === 11; 
}
/** 
 * Inserts a new stylesheet in the page's <head>.  
 * css rules can be added to the stylesheet using the addCSSRule() method
 * // var mySheet = styleSheet(); 
 * // addCSSRule(mySheet, "body", "color: #fff");
 * David Walsh (http://davidwalsh.name/add-rules-stylesheets)
 * @returns: a CSSStyleSheet object 
 */ 
function position(elem) {
  if (!elem) return; 
  return {
    top: elem.offsetTop, 
    left: elem.offsetLeft, 
    width: elem.offsetWidth, 
    height: elem.offsetHeight, 
  }
}
function styleSheet() {
  var style = document.createElement("style"); // Create the <style> node
  style.appendChild(document.createTextNode("")); // Webkit hack;   
  document.head.appendChild(style); // add style element to page
  return style.sheet; // Returns the CSSStyleSheet object
}
function addCSSRule(sheet, selector, rules, index) {
  if( "insertRule" in sheet ) {
    sheet.insertRule(selector + "{" + rules + "}", (index || 0));
  }
  else if( "addRule" in sheet ) {
    sheet.addRule(selector, rules, (index || 0));
  }
}

/** Creates an HTML Element with the specified attributes and content. 
  * @param: attributes (object): 
  *   @param: class: (string) one or more class names
  *   @param: style: (string) string of css styles 
  *   @param: tagName: (string) the type of HTML element
  *   @param: content: (string) the inner HTML of the new element (HTML string or text)
  *   @param: data: (object) attach custom data attributes to the element
  *     Define data attrs as key value pairs { dataName : 'value' } 
  * @returns: HTML string 
  */
function createHtmlElement(attributes) {
  var a = attributes || {},
    content = typeof a.content === 'string' ? a.content : '',
    tagName = a.tagName || _defaults.nodeName,
    classNames = ((a.class || '') + ' ' + _defaults.splitClass).trim(),
    styleAttribute = a.style ? 'style="' + a.style + '"' : '',
    dataAttribute = ''; 
    // Add custom data attributes 
    type(a.data) === 'object' && Object.keys(a.data).forEach(function(key) {
      dataAttribute += ' data-' + key + '=' + a.data[key] ; 
    })
  return '<' + tagName + ' class="' + classNames + '" ' + styleAttribute + dataAttribute + '>'+ content + ' </'+ tagName + '>';  
};


/** Create a DOM Element with the specified attributes and content. 
  * Same as createHtmlElement() except it returns a DOM node instead of HTML string. 
  * @param: attributes (object) :
  *   @param: class: (string) one or more class names
  *   @param: style: (string) string of css styles 
  *   @param: nodeName: (string) the type of element
  *   @param: content: (element node | array of elements | string) 
  *   @param: data: (object) attach custom data attributes to the element. 
  *     Define as key value pairs {dataName:'value'}
  * @returns: Element Node 
  */
function createDomElement(attributes) {
  // Let a = attributes;
  var a = attributes || {},
      content = a.content,
      data = a.data,
      node = document.createElement( a.nodeName || _defaults.nodeName ); 
  // 1. Set the class, style, and data.
  node.className = (( a['class'] || '') + ' ' + _defaults.splitClass).trim(); 
  a.style && (node.style.cssText = a.style); 
  type(data) === 'object' && Object.keys(data).forEach(function(prop) {
    node.dataset[prop] = data[prop]; 
  })
  // If content was passed in, determine how to insert it
  switch ( type(content) ) {
    // if its a single node, append it to the element
    case "object" : 
      isElement( content ) && node.appendChild( content ); 
    break; 
    // if its an array of elements, interate over array and append each element
    case "array" : 
      content.forEach(function(element) {
        isElement( element ) &&  node.appendChild( element );
      });  
    break;
    // if its a string, insert it as HTML 
    case "string" : node.innerHTML = content; 
  }
  return node; 
}


/****************************************
 - Internal Functions - 
 ***************************************/ 

/** Creates an array of the target elements for a splitType call. 
  * Elements can be passed into splitType() in several different forms: 
  * a) single DOM element; b) nodelist; c) jquery/zepto object; d) array; e) selector string;
  * this method takes those various formats and converts them into a plain array of DOM elements.
  * @param: elements: any of the formats listed above  
  * @returns: an array of DOM nodes representing each of the target elements
  */
function _sanitizeElements( elements ) {
  var elementsArray = []; 
  // 1. If elements is a selector string...
  // its its an ID, use getElementById to search for a single element (faster) 
  // Otherwise, use querySelectorAll to find a set of matched elements
  if ( typeof elements === "string" ) {
    var selector = elements.trim(); 
    if (selector.split(' ').length === 1 && selector.indexOf(',') > -1 
        && selector.indexOf('>') > -1 && selector.charAt(0) === '#' ) {
      elements = document.getElementById( selector.substring(1) )
    } else {
      elements = document.querySelectorAll(selector); 
    }
  }
  // If elements is an array, nodelist, or jquery object...
  // flatten it and convert it to a plain array of DOM elements
  if( isArraylike( elements ) ) {
    var len = elements.length;
    for (var i = 0; i < len; i++ ) {
      if(isArraylike(elements[i])) {
        for(var j = 0, len2 = elements[i].length; j<len2; j++) {
          isElement( elements[i][j] ) && elementsArray.push(elements[i][j])
        }
      } else {
        isElement(elements[i]) && elementsArray.push(elements[i]);  
      }
    }
  // If elements is single element...
  // just wrap it an array so we can use iteration methods
  } else if ( isElement(elements) ) {
    elementsArray = [elements]; 
  }
  return elementsArray; 
}
/** Splits the text content of a single element according to the settings for that instance. 
  * @param: element (DOM Node):  the target element for the split operation
  * @this: refers to the splitType instance 
  */
function _split (element, index) {
  var data = this._SPLIT,
    s = data.settings,
  // Define Variables 
    splitLines = s.splitLines,
    splitWords = s.splitWords,
    splitChars = s.splitChars,
    isAbsolute = s.isAbsolute,
    lines = [], words = [], chars =[], 
    textContent = element.textContent.replace(/\s+/g,' ').trim(),
    splitText = fragment(),
    wordContent, word, charNode; 

  // 1. Iterate over each word of text 
  textContent.split(' ').forEach(function(currentWord, index) {
      // 2. If splitting text into characters... 
      if( splitChars ) {
        // Let wordContent be a doc fragment to hold the wrapped character elements for this word
        wordContent = fragment(); 
        // Iterate over each character of text in the current word.
        // Wrap the character in a new DOM element. 
        // Append the element to wordContent.
        // Push the element to the chars array.
        currentWord.split('').forEach(function(currentChar, index, array){
          chars.push(
            wordContent.appendChild(
              charNode = createDomElement({
                class: s.charClass, 
                content: currentChar,
                nodeName: 'div',
                data: {
                  // true if its the last character in the word 
                  last : (splitLines && !splitWords) && index === array.length - 1,
                }
              })
            ) 
          )
        });
      }
      // 3. NOT splitting into characters... 
      else {
        //  Let wordContent be a textNode containing the current word text
        wordContent = text( currentWord );
      }
      // 4. If splitting text into words... 
      if( splitWords || splitLines) { 
        // wrap wordContent in a new DOM element 
        // Let word be the DOM element that contains wordContent.
        word = createDomElement({
          class: s.wordClass, 
          content: wordContent,
        });
      // 5. NOT splitting into words 
      } else {
        // proceed without wrapping wordContent in an element. 
        // Let word be equal to wordContent 
        word = wordContent;  
      }
      // append the word to splitText (followed by a space). 
      // Push it to words array if splitting text into words or lines. 
      splitText.appendChild( word ); 
      splitText.appendChild( space() ); 
      if ( splitWords || splitLines ) {
        words.push(word); 
      }
  }, this); // END OF LOOP 

  // Empty the target element. Append splitText document fragement
  element.innerHTML = ''; 
  element.appendChild(splitText); 
  
  // Push the words and characters for this element to allChars and allWords. 
  data.allWords = splitWords ? data.allWords.concat(words) : []; 
  data.allChars = splitChars ? data.allChars.concat(chars) : []; 
  
  // Now move on to splitting text into lines, or return. 
  if (!splitLines && !isAbsolute) {
    return; 
  }
  if(splitLines) {
    lines = _splitLines.call(this, element, words, chars); 
    words = splitWords ? words : []; 
  }

  if( isAbsolute ) {
    _setPosition.call(this, element, lines, words, chars)
  }
  
}
/** 3. Split Lines
  * Detects where natural line breaks (line wraps) occur in text, then wraps each in its own HTML element. 
  * @param: element (DOM Node)
  * @returns: lines (an array of all split line elements); 
  * @this: refers to the SplitType instance 
  */
function _splitLines( element, words, chars ) {
  var data = this._SPLIT,
    s = data.settings, 
    splitLines = s.splitLines, 
    splitWords = s.splitWords, 
    splitChars = s.splitChars,
    // Variables 
    lines = [],
    currentLine = [],
    lineOffsetY = -999,
    offsetY, 
    splitText = fragment(); 
  // Iterate over words and detect where natural line breaks occur in the text. 
  words.forEach(function(wordNode) {
    offsetY = wordNode.offsetTop;
    if( offsetY !== lineOffsetY ) {
      currentLine = []; 
      lines.push(currentLine); 
      lineOffsetY = offsetY;
    }
    currentLine.push( wordNode ); 
  }, this)

  // Iterate over the array of lines, create a wrapper element for each one
  lines.forEach(function(currentLine, index) {
    var lineNode = createDomElement({
      class: s.lineClass
    });
    // loop over the array of word elements in the current line.
    // if splitting text in words, just append each node to the line wrapper
    // If not, append the character nodes or the plain text (if we are only splitting text into lines).
    currentLine.forEach(function (wordNode, i) {
      var word; 
      if( splitWords ) {
        word = wordNode; 
      }
      else if (splitChars) {
        word = fragment(); 
        [].slice.call( wordNode.children ).forEach(function(charNode) {
          word.appendChild( charNode ); 
        })
      }
      else {
        word = text(wordNode.textContent); 
      }
      // Append the word to the line element, followed a space. 
      lineNode.appendChild( word ); 
      lineNode.appendChild( space() ); 
    })
    // Append each line element to splitText (doc fragment)
    splitText.appendChild( lineNode ); 
    data.allLines.push( lineNode ); 
    lines.splice(index, 1, lineNode); 
  }, this); 
  // Empty The target Element, Then append spliText
  while ( element.firstChild ) {
    element.removeChild( element.firstChild );
  }
  element.appendChild( splitText ); 
  return lines; 
}
/** Absolute position 
 * Set all split lines, words and characters to absolute position
 */
function _setPosition(element, lines, words, chars) {
  var data = this._SPLIT,
    s = data.settings, 
    splitLines = s.splitLines, 
    splitWords = s.splitWords, 
    splitChars = s.splitChars,
    lineHeight = 0,
    elHeight = element.offsetHeight, 
    elWidth = element.offsetWidth,
    nodes = [].concat(lines, words, chars),
    len = nodes.length, 
    s = window.getComputedStyle(element),
    i;
  element.style.position = s.position === 'static' ? 'relative' : s.position; 
  element.style.height = elHeight + 'px'; 
  element.style.width = elWidth + 2 + 'px';
  
  for (i = 0; i < len; i++) {
    nodes[i].pos = position(nodes[i]); 
  }

  for (i = 0; i < len; i++) {
    // cache the current element and its style prop
    var node = nodes[i];
    node.style.top = node.pos.top + 'px';
    node.style.left= node.pos.left + 'px';
    node.style.height= node.pos.height + 'px';  
    node.style.width= node.pos.width +  'px'; 
    node.style.position = 'absolute'; 
  }
}
// Add some global styles to the page. These apply to all split nodes
var sheet = styleSheet(); 
addCSSRule(sheet, '.is-splitting', 'visibility: hidden; position: absolute;');
addCSSRule(sheet, '.split-item', 'display: inline-block; position: relative;');

/*********************************************
  SplitType Constructor
 *********************************************/ 
function SplitType (elements, options) {
  // Abort if SplitType was called without new
  if(!this instanceof SplitType) return; 
  var data = this._SPLIT =  {
    settings: {}, 
    splitNodes : [], 
    elements : [],
    allLines : [],
    allWords : [],
    allChars : [],
    originals : []
  };
  data.settings = extend(_defaults, options);
  data.elements = _sanitizeElements( elements ); 
  data.elements.forEach(function(element, i) {
    data.originals[i] = element.innerHTML; 
  });
  
  this.split(); 
}
/*********************************************
  PUBLIC PROPERTIES AND METHODS 
 *********************************************/ 
 SplitType.prototype = {
  /** Split 
    * Initiates the text splitting process. It gets called automatically when new splitType 
    * instance is created. But it can also be called manually to re-split the text in an instance. 
    * New options can be passed into split() each time its called. 
    * @param: newOptions (object): modifies the settings for the splitType instance
    * @this: refers to the splitType instance
    */ 
  split: function( newOptions ) {
    var data = this._SPLIT, 
    s = data.settings, 
    elements = data.elements,
    // cache vertical scroll position before splitting 
    // it will change when elements are removed from doc flow
    scrollPos = [ window.scrollX, window.scrollY ];
    // Empty the arrays of split elements before proceeding 
    data.allLines.length = data.allWords.length = data.allChars.length = 0; 
    
    // If new options were passed in, update the settings for this instance 
    data.settings = newOptions ? extend(data.settings, newOptions) : data.settings; 

    // add "is-splitting" class to each target element before starting the process. 
    // This temporarily hides the parent element and removes it from document flow. 
    elements.forEach(function(element) {
      element.parentElement.classList.add('is-splitting'); 
    })

    // split the text in each of the target elements. n
    elements.forEach(function(element, index) {
      _split.call( this, element ) ; 
    }, this)

    // Remove the 'is-splitting' class from all elements once the process is complete.
    elements.forEach(function(element) {
      element.parentElement.classList.remove('is-splitting');
    })
    // Set scroll position to cached value.
    window.scrollTo(scrollPos[0], scrollPos[1]); 
    return this;  
  },
  /** Revert:
    * Removes the HTML elements created by splitType and reverts 
    * the elements back to thier original content
    * @this: refers to the splitType instance
    */ 
  revert: function() {
    var data = this._SPLIT; 
    // Empty the arrays of split items
    // Remove split text from target elements and restore original content
    data.allLines.length = data.allWords.length = data.allChars.length = 0;   
    data.elements.forEach(function(element, i) {
      element.innerHTML = data.originals[i]; 
    })
  },
  /** lines
    * Returns an array of elements for each lines in the splitType instance. 
    */  
  get lines() { return this._SPLIT.allLines }, 
  /** words
    * Returns an array of elements for each words in the splitType instance. 
    */  
  get words() { return this._SPLIT.allWords },
  /** chars
    * Returns an array of elements for each characters in the splitType instance. 
    */
  get chars() { return this._SPLIT.allChars }
}
// Returns the SplitType Constructor 
return SplitType; 
})(window, document);
