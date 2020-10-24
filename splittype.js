/**
 * SplitType
 * A javascript utility that splits text into individual lines, words, and characters
 * so they can be animated and styled independently.
 * @updated: 6/6/2016
 * @author: Luke Peavey
 * @version: 1.0
 * @license MIT
 */


// Support module loaders
(function ( global, factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( factory );
  } else if ( typeof exports !== 'undefined' ) {
    module.exports = factory();
  } else {
    factory();
  }
})( this, function factory() {
  window.SplitType = (function ( window, document, undefined ) {
    // Fail silently on ancient browsers ( IE <= 8 )
    if ( ! document.addEventListener || ! Function.prototype.bind ) return;

    'use strict';
    // global vars
    var DEBUG                 = false;
    var expando               = 'splitType' + (new Date() * 1);
    var cache                 = {};
    var uid                   = 0;
    var push                  = Array.prototype.push;
    var slice                 = Array.prototype.slice;
    var keys                  = Object.keys;
    var hasOwn                = Object.prototype.hasOwnProperty;
    var defineProperty        = Object.defineProperty;
    var defineProperties      = Object.defineProperties;
    var getPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var createFragment        = document.createDocumentFragment.bind( document );
    var createTextNode        = document.createTextNode.bind( document );

    /**
     * The global default settings used for all SplitType calls. Default
     * settings can be modified via the static 'defaults' property on the
     * SplitType constructor.
     * @private
     */
    var _defaults = {
      splitClass : '',
      lineClass  : 'line',
      wordClass  : 'word',
      charClass  : 'char',
      split      : 'lines, words, chars',
      position   : 'relative',
      absolute   : false, // alternate syntax for setting position.
      tagName    : 'div',
      DEBUG      : false,
    };


    /***********************
     - Utility Functions -
     ***********************/
    function isObject( obj ) {
      return obj !== null && typeof obj === 'object';
    }

    function isArraylike( obj ) {
      return isObject( obj ) && typeof obj.length === 'number' && obj.length > 0; // returns false for empty arrays,
                                                                                  // which is fine for our purposes
    }

    function isPlainObject( obj ) {
      return isObject( obj ) && Object.prototype.toString.call( obj ) === '[object Object]';
    }

    function isNode( obj ) {
      return isObject( obj ) && /^(1|3|11)$/.test( obj.nodeType );
    }

    function isString( obj ) {
      return typeof obj === 'string';
    }

    /**
     * Iterates array, arraylike, and plain objects
     * NOTE: non-iterable objects gets passed through
     * @param object object|array - the array or object to iterate
     * @param callback function - a function to be executed once for each item in the array.
     * @param thisArg object - the context for the callback function
     */
    function forEach( object, callback, thisArg ) {
      var obj    = Object( object ); // the target object
      var values = isArraylike( obj ) ? obj : ( isPlainObject( obj ) ? keys( obj ) : [ obj ] ); // the values to
                                                                                                // traverse (see doc
                                                                                                // comment)
      var length = parseInt( values.length ) || 0; // the length of values
      var index  = 0; // index
      // Iterate through the values, execute the callback with three arguments:
      // 1) the current item 2) the current index 3) the object being traversed.
      for ( ; index < length; index ++ ) {
        callback.call( thisArg, values[ index ], index, obj );
      }
    }

    /**
     * Merges user options with default settings (shallow).
     * Returns a new object without modifying source objects.
     * Only keys that exist on target obj will be copied to the new object.
     * @note: non-writable properties on the target object will not be over-ridden
     * @returns object
     */
    function extend( target, object ) {
      target = Object( target );
      object = Object( object );
      return Object.getOwnPropertyNames( target ).reduce( function ( extended, key ) {
        return defineProperty( extended, key, getPropertyDescriptor( object, key ) || getPropertyDescriptor( target, key ) );
      }, {} )
    }

    /**
     * Associates arbitrary data with DOM nodes or other objects.
     * (shortened version of jquery's data method)
     * @param element object - the element for which data is being set or retrieved.
     * @param key string (optional) - the name of the data property to set or retrieve.
     * @param value mixed (optional) - Sets the value of the specified key. any type of data.
     */
    function Data( element, key, value ) {
      var data = {}, id;

      if ( isObject( element ) ) {
        id   = element[ expando ] || ( element[ expando ] = ++ uid );
        data = cache[ id ] || ( cache[ id ] = {} );
      }
      // Get data
      if ( value === undefined ) {
        if ( key === undefined ) {
          return data; // if no key or value is given, return the data store object
        }
        return data[ key ];
      }
      // Set data
      else if ( key !== undefined ) {
        data[ key ] = value;
        return value;
      }
    }

    // Remove all associated with the given element
    function RemoveData( element ) {
      var id = element && element[ expando ];
      if ( id ) {
        delete element[ id ]; // remove the id property from the element
        delete cache[ id ]; // delete the data store for the element from the cache
      }
    }

    /**
     * Create element with attributes
     * @param name {string} The name of the element to create
     * @param attributes {object} (optional) any html attribute, plus several DOM properties:
     * innerHTML, textContent, children (chilren takes an array and child nodes)
     * @returns elem
     */
    function createElement( name, attributes ) {
      var elem = document.createElement( name );

      if ( attributes === undefined ) {
        return elem;
      }
      // Handle attributes
      forEach( attributes, function ( name ) {
        var value = attributes[ name ];
        if ( value === null ) return;
        switch ( name ) {
          // 'text' sets the text content
          case 'textContent':
            elem.textContent = value;
            break;
          // 'html' sets the innerHTML
          case 'innerHTML':
            elem.innerHTML = value;
            break;
          // 'children' one or more child nodes to insert into the element - can be single node, nodelist, array
          case 'children':
            forEach( value, function ( child ) {
              isNode( child ) && elem.appendChild( child )
            } );
            break;
          // handle standard attributes
          default:
            elem.setAttribute( name, value );
        }
      } )
      return elem;
    }

    /**
     * Handles the target elements parameter.
     * Target elements can be passed into splitType in several different forms:
     * Selector string, element, array/nodelist/jquery object, deep array
     * This method converts those different formats into a plain array of elements.
     * @returns:  {array}  the target elements
     */
    function _processElements( elements ) {
      var elementsArray = [],
          selector, isId, ID, len, len2, i, k;
      // A. If elements is a selector string...
      // ==> If its a single ID selector, use getElementById (super fast)
      // ==> otherwise use querySelectorAll to find the set of matched elements.
      if ( isString( elements ) ) {
        selector = elements.trim();
        isId     = selector[ 0 ] === '#' && ! /[^\w]/.test( ID = selector.slice( 1 ) );
        elements = isId ? document.getElementById( ID ) : document.querySelectorAll( selector );
      }
      // B. if we're certain that elements is a single node or nodelist,
      // convert it to an array and return here.
      if ( selector || isNode( elements ) ) {
        return isNode( elements ) ? [ elements ] : slice.call( elements );
      }

      // if elements is an array or jquery/object...
      // flatten it if necessary, remove any non-element values, and return the result.
      if ( isArraylike( elements ) ) {
        for ( i = 0, len = elements.length; i < len; i ++ ) {
          if ( isArraylike( elements[ i ] ) ) {
            for ( k = 0, len2 = elements[ i ].length; k < len2; k ++ ) {
              if ( isNode( elements[ i ][ k ] ) ) {
                elementsArray.push( elements[ i ][ k ] );
              }
            }
          } else if ( isNode( elements[ i ] ) ) {
            elementsArray.push( elements[ i ] );
          }
        }
      }
      return elementsArray;
    }

    /**
     * Splits the text content of a single element using to the settings for the SplitType instance.
     * By "split", we mean the process of breaking down plain text into separate components
     * (lines, words, and characters) and wrapping each one in its own element.
     * There are three possible split types: lines, words, and characters. Each one is optional,
     * so text can be split into any combination of the three types.
     *
     * 'this' refers to the splitType instance from which this function was called.
     * @param element node - the target element for the split operation.
     */
    function _split( element ) {
      // Let o equal the settings for this SplitTypes instance.
      var settings   = this.settings,
          // the tag name for split text nodes
          TAG_NAME   = settings.tagName,
          // A unique string to tempNodeorarily replace <br> tags
          BR_SYMBOL  = 'B' + (new Date() * 1) + 'R',
          // The plain text content of the target element
          TEXT_CONTENT,
          // the split types to use (ie lines, words, characters)
          types      = settings.split,
          // (boolean) true if text is being split into lines
          splitLines = types.indexOf( 'lines' ) !== - 1,
          // (boolean) true if text is being split into words
          splitWords = types.indexOf( 'words' ) !== - 1,
          // (boolean) true if text is being split into characters
          splitChars = types.indexOf( 'chars' ) !== - 1,
          // (boolean) true if position is set to absolute
          isAbsolute = settings.position === 'absolute' || settings.absolute === true,
          // An empty element node
          tempNode   = createElement( 'div' ),
          // An array of the split lines in the current element
          lineNodes  = [],
          // An array of the split words in the current element
          wordNodes  = [],
          // An array of the split characters in the current element
          charNodes  = [],
          lineNode,
          wordNode,
          charNode,
          splitText;


      /*---------------------------------------
       SPLIT TEXT INTO WORDS AND CHARACTERS
       -----------------------------------------*/

      // 1. splitText is a wrapper to hold the HTML structure while its being built.
      splitText = splitLines ? createElement( 'div' ) : createFragment();

      // 2. Get the element's text content.
      //    temporarily replace <br> tags with a unique string before extracting text.
      tempNode.innerHTML = element.innerHTML.replace( /<br\s*\/?>/g, (' ' + BR_SYMBOL + ' ') );
      TEXT_CONTENT       = tempNode.textContent.replace( /\s+/g, ' ' ).trim(); // remove extra white space

      // 3. Iterate over each word in the text.
      //    Create an array of wrapped the word elements (wordNodes).
      //    WORD (string) refers to the current word in the loop.
      wordNodes = TEXT_CONTENT.split( ' ' ).map( function ( WORD ) {

        // a. If the current word is a symbol representing a br tag,
        //    append a <br> tag to splitText and continue to the next word
        if ( WORD === BR_SYMBOL ) {
          splitText.appendChild( createElement( 'br' ) );
          return null; // br tag is not added to the array of wordNodes
        }

        // b. If Splitting Text Into Characters...
        if ( splitChars ) {

          // i. Iterate through the characters in the current word
          //    CHAR (string) refers to the current character in the loop
          //    currentWordCharNodes is array of the wrapped character elements in this word
          var currentWordCharNodes = WORD.split( '' ).map( function ( CHAR ) {
            // Create an element to wrap the current character.
            charNode = createElement( TAG_NAME, {
              class       : settings.charClass + ' ' + settings.splitClass,
              style       : "display: inline-block;",
              textContent : CHAR
            } );
            return charNode;
          } );

          // ii. push the character nodes for this word to charNodes
          push.apply( charNodes, currentWordCharNodes );

        } // END IF;

        // c. If Splitting Text Into Words...
        if ( splitWords || splitLines ) {

          // i. Let wordNode be an element to wrap the current word.
          wordNode = createElement( TAG_NAME, {
            class       : ( settings.wordClass + ' ' + settings.splitClass ),
            style       : 'display: inline-block; position:' + ( splitWords ? 'relative' : 'static;' ),
            // It contains the character nodes, or the word (plain text).
            children    : splitChars ? currentWordCharNodes : null,
            textContent : ! splitChars ? WORD : null
          } );

          // ii. Append wordNode to splitText.
          splitText.appendChild( wordNode );

        } // END IF;

        // d. If NOT Splitting Words...
        else {
          // i. Append the character nodes directly to splitText.
          forEach( currentWordCharNodes, function ( charNode ) {
            splitText.appendChild( charNode );
          } )
        }

        // e. Add a space after the word.
        splitText.appendChild( createTextNode( ' ' ) );

        return wordNode;

      }, this ).filter( function ( el ) {
        return el
      } ); // remove any undefined/null entries from the array
      // end forEach

      // 4. Now remove the original contents of the target element and insert the split text.
      element.innerHTML = '';
      element.appendChild( splitText );

      // 5. Add the split words/chars in this element to the array of all split words/chars.
      push.apply( this.words, wordNodes );
      push.apply( this.chars, charNodes );

      // STOP HERE If not splitting text into lines or using absolute positioning
      if ( ! isAbsolute && ! splitLines ) {
        return;
      }

      /*---------------------------------
       GET STYLES AND POSITIONS
       ----------------------------------*/

      // There is no built-in way to detect natural line breaks in text (when a block of text
      // wraps to fit its container). So in order to split text into lines, we have to detect
      // line breaks by checking the top offset of words. This is why text was split into words
      // first. To apply absolute positioning, its also necessary to record the size and position
      // of every split node (lines, words, characters).

      // To consolidate DOM getting/settings, this is all done at the same time, before actually
      // splitting text into lines, which involves restructuring the DOM again.

      var lines = [],
          currentLine,
          lineOffsetY,
          lineHeight,
          contentBox,
          elementHeight,
          elementWidth,
          nodes,
          parent,
          nextsib,
          cs,
          align;

      // nodes is a live HTML collection of the nodes in this element
      nodes = Data( element ).nodes = element.getElementsByTagName( TAG_NAME );

      // Cache the element's parent and next sibling (for DOM removal).
      parent  = element.parentElement;
      nextsib = element.nextElementSibling;

      // get the computed style object for the element
      cs    = window.getComputedStyle( element );
      align = cs.textAlign;

      // If using absolute position...
      if ( isAbsolute ) {

        // Let contentBox be an object containing the width and offset position of the element's
        // content box (the area inside padding box). This is needed (for absolute positioning)
        // to set the width and position of line elements, which have not been created yet.
        contentBox = {
          left  : splitText.offsetLeft,
          top   : splitText.offsetTop,
          width : splitText.offsetWidth
        };

        // Let elementWidth and elementHeight equal the actual width/height of the element.
        // Also check if the element has inline height or width styles already set.
        // If it does, cache those values for later.
        elementWidth  = element.offsetWidth;
        elementHeight = element.offsetHeight;

        Data( element ).cssWidth  = element.style.width;
        Data( element ).cssHeight = element.style.height;
      }

      // 6. Iterate over every split text node
      forEach( nodes, function ( node ) {
        if ( node === splitText ) return;

        var isWord = node.parentElement === splitText;
        var wordOffsetY;
        // a. Detect line breaks by checking the top offset of word nodes.
        //    For each line, create an array (line) containing the words in that line.
        if ( splitLines && isWord ) {
          // wordOffsetY is the top offset of the current word.
          wordOffsetY = Data( node ).top = node.offsetTop;

          // If wordOffsetY is different than the value of lineOffsetY...
          // Then this word is the beginning of a new line.
          // Set lineOffsetY to value of wordOffsetY.
          // Create a new array (line) to hold the words in this line.
          if ( wordOffsetY !== lineOffsetY ) {
            lineOffsetY = wordOffsetY;
            lines.push( currentLine = [] );
          }

          // Add the current word node to the line array
          currentLine.push( node );
        }

        // b. Get the size and position of all split text nodes.
        if ( isAbsolute ) {
          // The values are stored using the data method
          // All split nodes have the same height (lineHeight). So its only retrieved once.
          // If offset top has already been cached (step 11 a) use the stored value.
          Data( node ).top    = wordOffsetY || node.offsetTop;
          Data( node ).left   = node.offsetLeft;
          Data( node ).width  = node.offsetWidth;
          Data( node ).height = lineHeight || ( lineHeight = node.offsetHeight );
        }

      } ) // END LOOP

      // 7. Remove the element from the DOM
      parent.removeChild( element );


      /*--------------------------------
       SPLIT LINES
       ----------------------------------*/

      if ( splitLines ) {

        // 8. Let splitText be a new document createFragment to hold the HTML structure.
        splitText = createFragment();

        // 9. Iterate over the arrays in lines (see 11 b)
        //     Let line be the array of words in the current line.
        //     Return an array of the wrapped line elements (lineNodes)
        lineNodes = lines.map( function ( line ) {

          // a. Create a new element (lineNode) to wrap the current line.
          //    Append lineNode to splitText.
          splitText.appendChild(
            lineNode = createElement( TAG_NAME, {
              class : settings.lineClass + ' ' + settings.splitClass,
              style : 'display: block; text-align:' + align + '; width: 100%;'
            } )
          );

          // b. store size/position values for the line element.
          if ( isAbsolute ) {
            Data( lineNode ).type   = 'line';
            Data( lineNode ).top    = Data( line[ 0 ] ).top; // the offset top of the first word in the line
            Data( lineNode ).height = lineHeight;
          }

          // c. Iterate over the word elements in the current line.
          //    wordNode refers to the current word in the loop.
          forEach( line, function ( wordNode ) {

            // i. If splitting text into words,
            // just append wordNode to the line element.
            if ( splitWords ) {
              lineNode.appendChild( wordNode );

              // ii. If NOT splitting into words...
              //     if splitting characters append the char nodes to the line element
            } else if ( splitChars ) {
              slice.call( wordNode.children ).forEach( function ( charNode ) {
                lineNode.appendChild( charNode );
              } )
            }
            // iii. If NOT splitting into words OR characters...
            //      append the plain text content of the word to the line element
            else {
              lineNode.appendChild( createTextNode( wordNode.textContent ) )
            }
            // iV. add a space after the word
            lineNode.appendChild( createTextNode( ' ' ) );
          } ) // END LOOP

          return lineNode;
        } ) // END LOOP

        // 10. Insert the new splitText
        element.replaceChild( splitText, element.firstChild );

        // 11. Add the split line elements to the array of all split lines
        push.apply( this.lines, lineNodes );
      }

      /*---------------------------------
       SET ABSOLUTE POSITION
       ----------------------------------*/

      // Apply absolute positioning to all split text elements (lines, words, and characters).
      // The size and relative position of split nodes has already been recorded. Now we use those
      // values to set each element to absolute position. However, positions were logged before
      // text was split into lines (step 13 - 15). So some values need to be recalcated to account
      // for the modified DOM structure.

      if ( isAbsolute ) {

        // 12. Set the width/height of the parent element, so it does not collapse when its
        //     child nodes are set to absolute position.
        element.style.width  = element.style.width || elementWidth + 'px';
        element.style.height = elementHeight + 'px';

        // 13. Iterate over all split nodes.
        //     Let node be current node in the loop
        forEach( nodes, function ( node ) {

          // a. Let isLine be true if the current node is a line element
          //    Let isLineChild be true if the current node is a direct child of a line element.
          var isLine      = Data( node ).type === 'line';
          var isLineChild = ! isLine && Data( node.parentElement ).type === 'line';

          // b. Set the top position of the current node.
          //    If its a line node, we use the top offset of its first child (see step 14 b)
          //    If its the child of line node, then its top offset is zero
          node.style.top = isLineChild ? 0 : Data( node ).top + 'px';

          // c. Set the left position of the current node.
          //    If its a line node, this this is equal to the left offset of contentBox (step 9).
          //    If its the child of a line node, the cached valued must be recalculated so its
          //    relative to the line node (which didn't exist when value was initially checked).
          // NOTE: the value is recalculated without querying the DOM again
          node.style.left = isLine ? (contentBox.left + 'px') :
          ( isLineChild ? ( Data( node ).left - contentBox.left ) :
            Data( node ).left ) + 'px';

          // d. Set the height of the current node to the cached value.
          node.style.height = Data( node ).height + 'px';

          // e. Set the width of the current node.
          //    If its a line element, width is equal to the width of the contentBox (see step 9).
          node.style.width = isLine ? (contentBox.width + 'px') : Data( node ).width + 'px';

          // f. Finally, set the node's position to absolute.
          node.style.position = 'absolute';
        } )
      } // end if;

      // 14. Re-attach the element to the DOM
      if ( nextsib ) parent.insertBefore( element, nextsib );
      else parent.appendChild( element );

    } // End Function

    /***************************
     SplitType Constructor
     ***************************/

    function SplitType( elements, options ) {
      // Allow the SplitType constructor to be called without 'new'
      if ( ! ( this instanceof SplitType ) ) {
        return new SplitType( elements, options );
      }
      this.isSplit  = false;
      // Merge options with defaults
      this.settings = extend( _defaults, options );
      // Prepare target elements
      this.elements = _processElements( elements );

      if ( this.elements.length ) {
        // Store the original HTML content of each target element
        this.originals = this.elements.map( function ( element ) {
          return ( Data( element ).html = Data( element ).html || element.innerHTML );
        } );

        // Initiate the split operation.
        this.split();
      }
    }


    /*********************************
     PUBLIC PROPERTIES AND METHODS
     *********************************/

    /**
     * SplitType.defaults
     * A public property on the global SplitType object that allows users to access or modify the
     * default settings. Multiple settings can be changed at once by assigning an object to
     * SplitType.defaults containing the settings you wish to change. This will merge the new settings
     * with the internal _defaults object, not overwrite it.
     * To access the current settings: SplitType.defaults
     * To modify settings: SplitType.defaults = {setting1: 'new value', setting2: 'new value'}
     * @public
     * @static
     */
    defineProperty( SplitType, 'defaults', {
      get : function () {
        return _defaults;
      },
      set : function ( object ) {
        _defaults = extend( _defaults, object );
      }
    } );

    /**
     * instance.split()
     * Splits text in the target elements. This method gets called automatically when a new SplitType
     * instance is created. The method can also be called manually to re-split text with new options.
     * @param newOptions: (object) modifies the settings for the splitType instance.
     * @public
     */
    SplitType.prototype.split = function split( newOptions ) {
      // If any of the target elements have already been split,
      // revert them back to their original content before splitting them.
      this.revert();

      // Create arrays to hold the split lines, words, and characters for this instance.
      // These are public properties which can be accessed on the SplitType instance.
      this.lines = [];
      this.words = [];
      this.chars = [];

      // cache vertical scroll position before splitting
      var scrollPos = [ window.pageXOffset, window.pageYOffset ];

      // If new options were passed into the split() method, update settings for the instance.
      if ( newOptions !== undefined ) {
        this.settings = extend( this.settings, newOptions );
      }

      // Call the _split function to split the text in each target element
      forEach( this.elements, function ( element ) {
        _split.call( this, element );
        Data( element ).isSplit = true; // Set isSplit to true for this element.
      }, this );

      // Set isSplit to true for the SplitType instance
      this.isSplit = true;

      // Set scroll position to cached value.
      window.scrollTo.apply( window, scrollPos );

      // Clear data Cache
      forEach( this.elements, function ( element ) {
        var nodes = Data( element ).nodes || [];
        for ( var i = 0, len = nodes.length; i < len; i ++ ) {
          RemoveData( nodes[ i ] );
        }
      } )
    }

    /**
     * revert
     * Reverts the target elements back to their original html content.
     * @public
     */
    SplitType.prototype.revert = function revert() {
      // Delete the arrays of split text elements from the SplitType instance.
      // @NOTE: these properties are non-writable, that is why they have to be
      // deleted instead of just setting their value to null.
      if ( this.isSplit ) {
        this.lines = this.words = this.chars = null;
      }

      // Remove split text from target elements and restore original content
      forEach( this.elements, function ( elem ) {
        if ( Data( elem ).isSplit && Data( elem ).html ) {
          elem.innerHTML    = Data( elem ).html;
          elem.style.height = Data( elem ).cssHeight || '';
          elem.style.width  = Data( elem ).cssWidth || '';
          this.isSplit      = false;
        }
      }, this );
    }
    return SplitType;
  })( window, document )
} )
