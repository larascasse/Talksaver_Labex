(function($){
	$.fn.jTypewriter = function(method,options) {
			//method = ['type','erase']
		this.queue(function (next) {
			$this = jQuery(this);//get DOM element

			//build element specific options (jQuery MetaData Plugin)
			var metaData = $.meta ? $this.data() : {};
			
			// Extend our default options with those provided.
			// Note that the first arg to extend is an empty object -
			// this is to keep from overriding our "defaults" object.
			$this.data('jTypewriter',$.extend({text: $this.html()},$.fn.jTypewriter.defaults,options,metaData,{target: $this}));
			/**
			 * How the Options Cascade (highest to lowest):
			 ** target: $this
			 ** metaData from the actual HTML of the element
			 ** options specified via argument input
			 ** global defaults
			 ** text: $this.html()
			 **/
			
			var data = $this.data('jTypewriter');
			
			data.text = data.text.replace(/\&amp;/g,'&');//this simplifies the coding to remove all ampersands
			var textLength = data.text.length;//total length of text
			var currChar = '';

			var skip2Char = [];
			method = (method == 'type')?'type':'erase';//verifying method			
			var textPosition = (method=='type')?-1:textLength-1;//position of imaginary cursor

			var insideTag = false;
			var insideSpecialChar = false;
			var insideText = false;
			
			//let's run our function
			typewriter();
			
			/**
			 * Private Typing Function
			 ** - Type In Letters, Words, Phrases
			 */
 			function typewriter() {
				//we need to see if we're going to add HTML tags...
				//normally, it'll work regardless, but there's a
				//"shortening" effect when the tag is completed
				//because the HTML is inserted/hidden.... note that
				//we use the jQuery.html() instead of jQuery.text().
				if(method=='type'){
					textPosition++;
					var currChar = data.text.substr(textPosition, 1);
				} else if(method=='erase'){
					textPosition--;
					var currChar = data.text.substr(textPosition, 1);
				}

			//We're going to see if there's anything special as we read through
				switch(data.typeIn){
					case 'phrases':
						skip2Char = ['.','!','?'];
					break;
					case 'words':
						skip2Char = [' '];
					break;
					case 'custom':
						skip2Char = data.customChar;
					break;
				}
				if(data.typeIn != 'letters'){
					if(jQuery.inArray(currChar,skip2Char)==-1 && textPosition != textLength+1){insideText = true;}else{insideText = false;}
				}
				if(!data.typeInHTML){//false = all at once
					if(currChar == '<'){insideTag = (method=='type');}//true for typing, false for erasing
					if(currChar == '>'){insideTag = (method=='erase');}//false for typing, true for erasing
				}
				//we need to see if there are any special characters to add
				//such as &hearts; for example. We'll neglect special characters
				//inside html tags, but not in normal text. If we happen to have
				// a sentence like "this & that", we can correct for that.
				if(!data.typeInASCII){//false = all at once
					if(!insideTag && currChar == '&'){insideSpecialChar = (method=='type');}//true for typing, false for erasing
					if(!insideTag && currChar == ';'){insideSpecialChar = (method=='erase');}//false for typing, true for erasing
				}//Note: when erasing, it doesn't matter.
			//End the reading process, begin the analysis of our read

				tempText = data.text.substr(0,textPosition+1);
				if(method=='type'){
					addTempText = data.text.substr(textPosition);
				} else if(method=='erase'){
					addTempText = tempText;
				}

				if(insideTag || insideSpecialChar || insideText){
					//currently found a tag or special character
					//let's grab it and output it, then
					//increment or decrement the textPosition accordingly
					//and continue with our timeout()
					if(method=='type'){
						if(insideTag){
							addTempText = addTempText.slice(0,addTempText.indexOf('>')+1);
							insideTag = false;
						} else if(insideSpecialChar){
							addTempText = addTempText.slice(0,addTempText.indexOf(';')+1);
							insideSpecialChar = false;
						} else if(insideText){
							//thanks to ajpiano for the apply/map suggestion
							//thanks to BinaryKitten for helping to fix scope
							myFunction = function(s){return ((index=addTempText.indexOf(s))!=-1)?index:addTempText.length;}
							var newIndex = ((minVal=Math.min.apply(Math,$.map(skip2Char,myFunction)))==-1)?textLength-1:minVal+1;
							addTempText = addTempText.slice(0,newIndex);
							insideText = false;
						}

						tempText = data.text.substr(0,textPosition+addTempText.length);
						textPosition = tempText.length-1;//index of position @ 0
						
					} else if(method=='erase'){
						if(insideTag){
							addTempText = addTempText.substr(0,addTempText.lastIndexOf('<')+1);
							insideTag = false;
						} else if(insideSpecialChar){
							addTempText = addTempText.substr(0,addTempText.lastIndexOf('&')+1);
							insideSpecialChar = false;
						} else if(insideText){
							//thanks to ajpiano for the apply/map suggestion
							//thanks to BinaryKitten for helping to fix scope
							myFunction = function(s){return ((index=addTempText.lastIndexOf(s))!=-1)?index:-1;}
							var newIndex = ((minVal=Math.max.apply(Math,$.map(skip2Char,myFunction)))==-1)?-1:minVal+1;
							addTempText = addTempText.substr(0,newIndex);
							insideText = false;
						}
						tempText = addTempText;
						textPosition = tempText.length-1;
					}
				}
//				debug('currChar: '+currChar+'        textPos:'+textPosition+'        textLength:'+textLength+'            tempText: '+tempText);
				if(data.outputFormat=='HTML'){
					data.target.html(tempText);
				} else if(data.outputFormat == 'plaintext') {
					data.target.text(tempText);
				}

				if((textPosition+1 < textLength && method=='type') || (textPosition+1 > 0 && method=='erase')){
					//note that setTimeout("typewriter()",options.speed) would fail
					//due to an issue of function scope. typewriter() is defined within
					//a function of a function and so on... so it's not seen from
					//the scope of the window. You need to pass in the actual function
					setTimeout(typewriter, data.speed);
				} else {
					//here, the function is completely done
					//this would be the point at which we
					//trigger a 'complete' event						
					if(data.onComplete){
						data.onComplete.call(data.target);
					}
					console.log('done');
					//finished running
					next();
				}

			}//end function typewriter();

			
			
		});

		return this;
		
	};
	
	/**
	 * Private function for debugging
	 *
	 * $obj is what you want to log in the
	 * error console.
	 */
	
	function debug($obj){
		if (window.console && window.console.log){
			console.log($obj);
		}
	};

	//provide global defaults for all methods
	//in this namespace - a user will be able to
	//use $.fn.jTypewriter.defaults.speed = 100;
	//anywhere in their front-end to change the default
	//for the rest of the calls (for example here: speed)
	$.fn.jTypewriter.defaults = {
		speed: 50,//delay between imaginary keystrokes (in milliseconds)
		typeIn: 'letters',//letters,words,phrases,custom
		customChar: [''],//only for typeIn == custom, provide an array of custom characters to break the "typing" or "erasing" at
		outputFormat: 'HTML',//['HTML','plaintext']
		typeInHTML: false,//true: type in the HTML tag (char by char), false: type in the HTML tag all at once
		typeInASCII: false,//true: type in the ASCII (char by char), false: type in the ASCII all at once
		onComplete: function(){}//a function when the effect completes
	};
})(jQuery);