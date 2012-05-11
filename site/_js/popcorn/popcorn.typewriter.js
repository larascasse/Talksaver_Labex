(function() {


  Popcorn.player( "typewriter", {
    _canPlayType: function( nodeName, url ) {
	  return true;
      //return (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(typewriter)/).test( url ) && nodeName.toLowerCase() !== "video";
    },
    _setup: function( options ) {
    	console.log("typewriter _setup")
    	console.log(this.src);
    	console.log(options);
      var media = this,
          typewriterObject,
          typewriterContainer = document.createElement( "div" ),
          currentTime = 0,
          seekTime = 0,
          seeking = false,
          volumeChanged = false,
          lastMuted = false,
          lastVolume = 0,
          height,
          width;

      typewriterContainer.id = media.id + Popcorn.guid();
      media.appendChild( typewriterContainer );

      // setting typewriter player's height and width, default to 560 x 315
      width = media.style.width ? "" + media.offsetWidth : "560";
      height = media.style.height ? "" + media.offsetHeight : "315";
      
     
      
  
      var typewriterInit = function() {
    	 
    	  onFire = function(word) {
              //console.log("onFire"+word);
              timeUpdate();
          };
          
          onComplete = function() {
        	  media.paused = true;
              media.dispatchEvent( "pause" );
          };
          
        
          console.log("*****   typewriterInit"+typewriterContainer.id);
    	  console.log(media.src);
    	  
    	  var options2;
    	  if(typeof media.src === 'object') {
    		  options2 = media.src;
    	  }
    	  else {
    		  options2 =  {
    	  				speed: 200,//delay between imaginary keystrokes (in milliseconds)
    	  				typeIn: 'words',//letters,words,phrases,custom
    	  				customChar: [''],//only for typeIn == custom, provide an array of custom characters to break the "typing" or "erasing" at
    	  				outputFormat: 'HTML',//['HTML','plaintext']
    	  				typeInHTML: false,//true: type in the HTML tag (char by char), false: type in the HTML tag all at once
    	  				typeInASCII: false,//true: type in the ASCII (char by char), false: type in the ASCII all at once
    	  				onComplete: onComplete,//a function when the effect completes,//a function when the effect completes
    	  				onFire: onFire,//a function when the effect fire
    	  				text : "Ceci est un text"
    	  			};
    	  }
    	  options2.onComplete = onComplete;
    	  options2.onFire = onFire;
    	  typewriterObject = jQuery('#'+typewriterContainer.id);
    	  typewriterObject.jTypeWriterMecanique(options2);
    	 // typewriterObject = jQuery('#'+typewriterContainer.id).jTypeWriterMecanique("init",options2);
    	  
        //typewriter_player_loaded[ typewriterContainer.id ] = function() {
        	/*typewriterObject.seek[ typewriterContainer.id ] = function( time ) {
            if( time !== currentTime ) {
              currentTime = time;
              media.dispatchEvent( "seeked" );
              media.dispatchEvent( "timeupdate" );
            }
          };*/
          /*typewriterObject.play[ typewriterContainer.id ] = function() {
            if ( media.paused ) {
              media.paused = false;
              media.dispatchEvent( "play" );
              media.dispatchEvent( "playing" );
              timeUpdate();
            }
          };

          typewriterObject.pause[ typewriterContainer.id ] = function() {
            if ( !media.paused ) {
              media.paused = true;
              media.dispatchEvent( "pause" );
            }
          };

          typewriterObject.loadProgress[ typewriterContainer.id ] = function( progress ) {

            if ( !loadStarted ) {
              loadStarted = true;
              media.dispatchEvent( "loadstart" );
            }
            media.dispatchEvent( "canplaythrough" );
          };*/

         // typewriterObject.api_addEventListener( "seek", "typewriterObject.seek." + typewriterContainer.id );
          /**typewriterObject.api_addEventListener( "loadProgress", "typewriterObject.loadProgress." + typewriterContainer.id );
          typewriterObject.api_addEventListener( "play", "typewriterObject.play." + typewriterContainer.id );
          typewriterObject.api_addEventListener( "pause", "typewriterObject.pause." + typewriterContainer.id );
			*/
          var timeUpdate = function() {
            if ( !media.paused ) {
              //console.log("timeUpdate"+typewriterContainer.id)
              currentTime = typewriterObject.jTypeWriterMecanique("getCurrentTime");
              media.dispatchEvent( "timeupdate" );
              //setTimeout( timeUpdate, 10 );
            }
          },

          isMuted = function() {
	            return true;
          };
          
          
          

          media.play = function() {
        	  console.log(" media.play"+typewriterObject)
            media.paused = false;
            media.dispatchEvent( "play" );
            media.dispatchEvent( "playing" );
            timeUpdate();
            typewriterObject.jTypeWriterMecanique("play");
          };

          media.pause = function() {
        	  console.log(" media.pause"+typewriterObject)
            if ( !media.paused ) {

              media.paused = true;
              media.dispatchEvent( "pause" );
              typewriterObject.jTypeWriterMecanique("pause");
            }
          };

          Popcorn.player.defineProperty( media, "currentTime", {

            set: function( val ) {

              if ( !val ) {
                return currentTime;
              }

              currentTime = seekTime = +val;
              seeking = true;

              media.dispatchEvent( "seeked" );
              media.dispatchEvent( "timeupdate" );
              typewriterObject.jTypeWriterMecanique("seekTo",currentTime);

              return currentTime;
            },

            get: function() {

              return currentTime;
            }
          });

          Popcorn.player.defineProperty( media, "muted", {

            set: function( val ) {
        	  	
            },
            get: function() {

              return isMuted();
            }
          });

          Popcorn.player.defineProperty( media, "volume", {

            set: function( val ) {
        	  return 0;
            },
            get: function() {
              return 0;
            }
          });

          media.dispatchEvent( "loadedmetadata" );
          media.dispatchEvent( "loadeddata" );

          media.duration = typewriterObject.jTypeWriterMecanique("getDuration");
          media.dispatchEvent( "durationchange" );
          media.readyState = 4;
          media.dispatchEvent( "canplaythrough" );
        };

       // var clip_id = ( /\d+$/ ).exec( src );
        /*

        swfobject.embedSWF( "//typewriter.com/moogaloop.swf", typewriterContainer.id,
                            width, height, "9.0.0", "expressInstall.swf",
                            flashvars, params, attributes );
                            */

     // };

      //if ( !window.swfobject ) {
    	 // Popcorn.getScript( "lib/external/jQuery.typewriter.js", typewriterInit );
      //} else {

        typewriterInit();
      //}
    }
  });
})();