/**
* LPV Website
* Utility Functions
*
**/
// QUERY SELECTOR METHOD THAT RETURNS AN ARRAY OF DOM ELEMENTS
Document.prototype.querySelectorArray = function(selector) {
	var selector = selector.toString();
	return [].slice.call(this.querySelectorAll(selector));
}
Element.prototype.querySelectorArray = function(selector) {
	var selector = selector.toString();
	return [].slice.call(this.querySelectorAll(selector));
}

// Throttle Resize Events
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) 
  {if (!uniqueId) {uniqueId = "This is a uniqueId";}
    if (timers[uniqueId])clearTimeout (timers[uniqueId]);
    timers[uniqueId] = setTimeout(callback, ms)
  }}
)();

//function to create divs, pass a list of one or more classes as the first argument 
function create(el, className, text) {
  var e, c, t; 
  e = el.toString();
	var element = document.createElement(e);
	if (className !== undefined) {
		c = className.toString(),
	 	element.className=c;
	}
	if(text !== undefined) {
		t = text.toString();
		t =  document.createTextNode(t);
		element.appendChild(t);
	} 
	return element;
}
/* this is a utility for completing basic math operations
 */
 var doMath = { 
 	'+': function (a, b) { return a + b },  
 	'-': function (a, b) { return a-b }, 
 	'*': function(a,b) {return a * b }, 
 	'/': function(a,b) {return a / b } 
 }

// merge two objects into a new object. properties in the first object will by overridden by those in the second, 
// the same basic functionality as jQuery .extend()  method. 
 function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

// RANDOM NUMBER WITHIN A SET RANGE
// by default it rounds to the closest integer. It will return an integer even if both min and max values are less than |1|
// pass false as the third argument to get an unrounded number. Returns floating point number. 
function rand(min, max, rounded) {
  var roundResult = typeof rounded ==='undefined' ? true : rounded; 
  if (roundResult) {
    return Math.round(Math.round(Math.random() * (max - min)) + min);
  } 
  else {
  return Math.random() * (max - min) + min;
  }
}
$.Velocity.RegisterEffect('transition.rightSpringIn', {
    defaultDuration: 800,
    calls: [ 
        [ { translateX:['20%', '100%'] }, 1,  { easing:[135, 10] } ]
    ],
});

$.Velocity.RegisterEffect('transition.rightSpringOut', {
    defaultDuration: 800,
    calls: [ 
        [ { translateX:['100%', '20%'] }, 1,  { easing:[150, 30]} ]
    ],
     reset: { translateX: 0 }
});
$.Velocity.RegisterEffect('callout.spinZ', {
    defaultDuration: 800,
    calls: [ 
        [ {translateX:"-150px", translateY:"-150px", translateZ:"-150px"  }, 0.25 ],
        [{translateX:"0", translateY:"0", translateZ:"-300px" } , 0.25  ],
        [ {translateX:"150px", translateY:"150px", translateZ:"150px"  }, 0.25 ],
        [{translateX:"0", translateY:"0", translateZ:"0" } , 0.25  ]
    ],
});
