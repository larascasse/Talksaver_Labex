// PLUGIN: LABEX

(function ( Popcorn ) {

	var _queries = {},
	
	yahooBossCallback = function( o ) {
		var databack = {};

	    if(typeof o.bossresponse.web !== 'undefined' && o.bossresponse.web.count>0){
	      databack.web = [];
	      databack.webHTML = '<ul>';
	      for(var i=0,j=o.bossresponse.web.count;i<j;i++){
	        var item = o.bossresponse.web.results[i];
	        //alert(item);
	        databack.web.push(
	          {
	            abstract:item.abstract,
	            title:item.title,
	            url:item.clickurl,
	            displayurl:item.dispurl
	          }
	        );
	        var html = config.webItemHTML.replace('{clickurl}',item.clickurl);
	        html = html.replace('{title}',item.title);
	        html = html.replace('{abstract}',item.abstract);
	        databack.webHTML += html;
	      }
	      databack.webHTML += '</ul>';
	      //alert(databack.webHTML);
	    }
	    if(typeof o.bossresponse.images !== 'undefined' && o.bossresponse.images.count>0 ){
	    	//alert("num images"+o.bossresponse.images.count)
	      databack.images = [];
	      databack.imagesHTML = '<ul>';
	      for(var i=0,j=o.bossresponse.images.count;i<j;i++){
	        var item = o.bossresponse.images.results[i];
	        var referer = item.refererurl;
	        var shorter = referer.replace('http://www.','').substring(0,39);
	        databack.images.push(
	          {
	            abstract:item.abstract,
	            title:item.title,
	            url:item.clickurl,
	            page:item.refererclickurl,
	            pagedisplay:item.refererurl,
	            shorturl:shorter+'&hellip;',
	            filename:item.filename,
	            imageurl:item.url,
	            thumbnail:item.thumnail_url,
	            thumbnaildimensions:[item.thumbnail_width,item.thumbnail_height],
	            dimensions:[item.width,item.height],
	            format:item.format
	          }
	        );
	        var html = config.imageItemHTML.replace('{url}',item.url);
	        html = html.replace('{clickurl}',item.refererclickurl);
	        html = html.replace('{shortened}',shorter);
	        html = html.replace('{thumbnail}',item.thumbnailurl);
	        html = html.replace('{thumbnailwidth}',item.thumbnailwidth);
	        html = html.replace('{thumbnailheight}',item.thumbnailheight);
	        html = html.replace('{title}',item.title);
	        /*
	         * html = html.replace('{thumbnail}',item.url);
	        html = html.replace('{thumbnailwidth}',item.width);
	        html = html.replace('{thumbnailheight}',item.height);
	         */
	        databack.imagesHTML += html;
	      }
	      databack.imagesHTML += '</ul>';
	    }
	    if(typeof o.bossresponse.news !== 'undefined' && o.bossresponse.news.count>0){
	      databack.news = [];
	      databack.newsHTML = '<ul>';
	      for(var i=0,j=o.bossresponse.news.count;i<j;i++){
	        var item = o.bossresponse.news.results[i];
	        databack.news.push(
	          {
	            abstract:item.abstract,
	            title:item.title,
	            url:item.clickurl,
	            language:item.language,
	            source:item.source,
	            sourceurl:item.sourceurl
	          }
	        );
	        var html = config.newsItemHTML.replace('{language}',item.language);
	        html = html.replace('{clickurl}',item.clickurl);
	        html = html.replace('{abstract}',item.abstract);
	        html = html.replace('{title}',item.title);
	        html = html.replace('{source}',item.source);
	        html = html.replace('{sourceurl}',item.sourceurl);
	        databack.newsHTML += html;
	      }
	      databack.newsHTML += '</ul>';
	      
	    }

	     var htmlString = "";
        if ( databack.imagesHTML ) {
        	htmlString+=databack.imagesHTML; 
        }
        if ( databack.webHTML ) {
        	htmlString+=databack.webHTML; 
        }
        if ( databack.newsHTML ) {
        	htmlString+=databack.newsHTML; 
        }
       _queries[ o.query.name.toLowerCase() ].htmlString = htmlString;
      // console.log(_queries[ o.query.name.toLowerCase() ].started+" "+htmlString)
        if(_queries[ o.query.name.toLowerCase() ].started) {
        	startContainer(_queries[ o.query.name.toLowerCase() ].container,o.query.name.toLowerCase())
        }
      },
      config = {
    		    webItemHTML:'<li><a href="{clickurl}">{title}</a><p>{abstract}</p></li>',
    		    newsItemHTML:'<li lang="{language}"><a href="{clickurl}">{title}</a><p>{abstract} ({source})</p></li>',
    		    imageItemHTML:'<li><a href="{url}"><img src="{thumbnail}" width="{thumbnailwidth}" height="{thumbnailheight}"></a></li>'
    		    	//imageItemHTML:'<li><a href="{url}"><img src="{thumbnail}" width="{thumbnailwidth}" height="{thumbnailheight}"></a></li>'
    		  },
   clean =  function(s) {
  	    return encodeURIComponent(s);
    },
    
    createContainer = function (id) {
    	/****
		 * CREATE CONTAINER */
    	if(jQuery('#'+id).length==0) {
    		jQuery('<div id="'+id+'"></div>').appendTo(jQuery(document.body));
    		jQuery('#'+id).css({'position':'absolute','top':'0','left':'0','width':'100%','height':'100%','overflow':'hidden','z-index':'-2'});
    		jQuery('#'+id+ " div").css({'position':'absolute','overflow':'hidden'});
    	}
    },
    
    startContainer = function (container,query) {
    	createContainer('image-container');
    	//console.log('startContainer'+container+jQuery('#image-container'));
    	container.innerHTML = _queries[query].htmlString;
    	container.style.display = "none";
    	//nosign(_queries[query].start,_queries[query].end,query);
    	//ou en passant les options :	
    	//console.log(jQuery('#webservice-return'+query));
    	jQuery('#image-container').imagesLayer({
    		//id de la div contenant le retour du service
    		referer : container,		
    		//nombre d'images affichées
    		grid : 6,
    		//durée minimum de transition pour le random
    		durationMin : 1000,
    		//durée maximum de transition pour le random
    		durationMax : 500,
    		//position x de l'image minimumu pour le random
    		posxMin : -400,
    		//position x de l'image maximum pour le random
    		posxMax : 0
    	});
    	
    	createContainer('text-container');
    	//ou en passant les options :	
    	jQuery('#text-container').textsLayer({
    		//id de la div contenant le retour du service
    		referer : container,		
    		//nombre de textes affichées
    		textFields : 10,
    		//durée minimum de transition pour le random
    		durationMin : 10000,
    		//durée maximum de transition pour le random
    		durationMax : 32000,
    		//position initiale x du texte minimumu pour le random
    		initxMin : -400,
    		//position initiale x du texte maximum pour le random
    		initxMax : 1024,
    		//position initiale y du texte minimumu pour le random
    		inityMin : -400,
    		//position initiale y du texte maximum pour le random
    		inityMax : 800,		
    		//position finale x du texte minimumu pour le random
    		posxMin : -1024,
    		//position finale x du texte maximum pour le random
    		posxMax : 1024,
    		//position finale y du texte minimumu pour le random
    		posyMin : -1024,
    		//position finale y du texte maximum pour le random
    		posyMax : 800,
    		//scale final du texte minimumu pour le random (divisé par 1000 par code)
    		scaleMin : 1000,
    		//scale final du texte maximum pour le random (divisé par 1000 par code)
    		scaleMax : 20000,
    		//delay pour le random
    		delay : 2000
    	});
    	
    }
    ;
     // logger.log("TOTO");
  /**
   * Labex popcorn plug-in
   * Appends information about a Labex artist to an element on the page.
   * Options parameter will need a start, end, target, artist and apikey.
   * Start is the time that you want this plug-in to execute
   * End is the time that you want this plug-in to stop executing
   * Artist is the name of who's Labex information you wish to show
   * Target is the id of the document element that the images are
   *  appended to, this target element must exist on the DOM
   * ApiKey is the API key registered with Labex for use with their API
   *
   * @param {Object} options
   *
   * Example:
     var p = Popcorn('#video')
        .yahooboss({
          start:          5,                                    // seconds, mandatory
          end:            15,                                   // seconds, mandatory
          query:         'yacht',                              // mandatory
          target:         'Labexdiv',                          // mandatory
          apikey:         '1234567890abcdef1234567890abcdef'    // mandatory
        } )
   *
   */
      Popcorn.plugin( "yahooboss", {
    	
    	  manifest: {
    	  about:{
          name: "Popcorn YahooBoss Plugin",
          version: "0.1",
          author: "Florent Berenger",
          website: "http://www.lesmecaniques.net"
        },
        options: {
          start: {
            elem: "input",
            type: "text",
            label: "In"
          },
          end: {
            elem: "input",
            type: "text",
            label: "Out"
          },
          target: "yahooboss-container",
          query: {
            elem: "input",
            type: "text",
            label: "Query"
          } ,
          searchtype: {
            elem: "input",
            type: "text",
            label: "Type : web,news,images"
          }
        }
        },
    	

      _setup: function( options ) {
    	options._container = document.createElement( "div" );
    	options._container.setAttribute("id",'#webservice-return'+options.query);
        options._container.style.display = "none";
        options._container.innerHTML = "";
        options.query = options.query && options.query.toLowerCase() || "";
        
        options.searchtype = (options.searchtype && options.searchtype.length>0)?options.searchtype : "images,web,news";

        var target = document.getElementById( options.target );

        if ( !target && Popcorn.plugin.debug ) {
          throw new Error( "target container doesn't exist" );
        }
        target && target.appendChild( options._container );
        if ( !_queries[ options.query ] && options.query.length>0 ) {

          _queries[ options.query ] = {
            count: 0,
            htmlString: "loading ...",
            searchtype : options.searchtype,
            started: false,
            //container: options._container
            container: target
          };
          target.innerHTML = "loading.."+options.query;
          var APIurl = 'http://www.lesmecaniques.net/labex/yahooboss.php?q=' + clean(options.query)+"&type="+clean(options.searchtype)+"&callback=jsonp";
          Popcorn.getJSONP( APIurl, function( data ) {
        	    data.query={};
        	    data.query.name = options.query;
                yahooBossCallback(data);
            });

        }
        _queries[ options.query ].count++;

      },
      
     
      /**
       * @member Labex
       * The start function will be executed when the currentTime
       * of the video  reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
    	_queries[ options.query ].started = true;
    	startContainer(options._container,options.query);
        //options._container.innerHTML = _queries[ options.query ].htmlString;
        //options._container.style.display = "inline";
      },
      /**
       * @member Labex
       * The end function will be executed when the currentTime
       * of the video  reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
    	  _queries[ options.query ].started = false;
        options._container.style.display = "none";
        options._container.innerHTML = "";
      },
      _teardown: function( options ) {
        // cleaning possible reference to _artist array;
        --_queries[ options.query ].count || delete _queries[ options.query ];
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
      }
     });
})( Popcorn );
