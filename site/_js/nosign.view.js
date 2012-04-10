/*
 * 
 * log
 * 
 */

window.log = function(){
  log.history = log.history || [];
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


/*
 * 
 * random
 * 
 */

jQuery.extend({
	random: function(X) {
	    return Math.floor(X * (Math.random() % 1));
	},
	randomBetween: function(MinV, MaxV) {
	  return MinV + jQuery.random(MaxV - MinV + 1);
	}
});


/*
 * 
 * nosignMemory (enregistre les evenements pour stockage json en db)
 * 
 */

function NosignMemoryItem(start, end, query) {
	this.start = start;
	this.end = end;
	this.query = query;
}

var _nosignEvents = new Array();

function trackEvent(start, end, query) {
	
	_nosignEvents.push(new NosignMemoryItem(start, end, query));   
}

function buildMemory(){
	
	for (var i = 0; i < _nosignEvents.length; i++){
		log(_nosignEvents[i]);
	}
}

/*
 * 
 * imagesLayer
 * 
 */

(function( $ ){
	
	$.fn.getImageResize = function( src) {
			
		var $img = new Image();						
		$img.src = src;
				
		var c_w		= jQuery(window).width(),
			c_h		= jQuery(window).height(),
			r_w		= c_h / c_w,			
			i_w		= $img.width,
			i_h		= $img.height,
			r_i		= i_h / i_w,
			new_w, new_h, new_left, new_top;
				
		if( r_w > r_i ) {			
			new_h	= c_h;
			new_w	= c_h / r_i;		
		}else{		
			new_h	= c_w * r_i;
			new_w	= c_w;		
		}				
		return {
			width	: new_w,
			height	: new_h,
			left	: ( c_w - new_w ) / 2,
			top		: ( c_h - new_h ) / 2
		};		
	};
	
	var methods = {
		
		init : function( options ) {
			
			return this.each(function(){		
				
				
					
				var winW = jQuery(window).width();
				var winH = jQuery(window).height();
				
				var settings = jQuery.extend( {
					'posxMin' 		: -winW,
					'posxMax' 		: winW,
					'grid' 			: 4,
					'durationMin' 	: 6000,
					'durationMax' 	: 12000
			    }, options);
         
				var _self = jQuery(this),data = _self.data('imagesLayer');
				
				//reset
				_self.find('div').each(function(indes){
					
					jQuery(this).transition({ opacity : 0 }, jQuery.randomBetween(2000, 4000), function() {
					   jQuery(this).remove();
					});
				});
				
				var imgs = jQuery(settings.referer).find('img');
				console.log(imgs)
				var columnWidth = winW/settings.grid;				
				
				for(var i=0; i<settings.grid; i++){						
											
					var el = jQuery('<div/>', {
					    //id: 'imagesLayer_'+i,
					    html: imgs[i]
					});
					el.css({
						width	: columnWidth,
						height	: '100%',
						left	: columnWidth*i
					});	
					
					var imgDim = _self.getImageResize(jQuery(imgs[i]).attr('src'));
					var im = el.find('img');
					im.removeAttr('width');
					im.removeAttr('height');
					im.css({
						left		: imgDim.width/2,
						width		: imgDim.width,
						height		: imgDim.height,
						marginLeft	: imgDim.left,
						marginTop	: imgDim.top,
						opacity		: 0
					});						
					el.appendTo(_self);
					
					var posx = jQuery.randomBetween(settings.posxMin, settings.posxMax);
					var speed = jQuery.randomBetween(settings.durationMin, settings.durationMax);
		
					//im.transition({ x: posx}, speed,'in-out');
					im.transition({ opacity: 1}, jQuery.randomBetween(600, 2000)).transition({ x: posx}, speed);
				}
			});
		},		
		destroy : function( ) {
			return this.each(function(){
				var _self = jQuery(this),
				data = _self.data('imagesLayer');
	
				jQuery(window).unbind('.imagesLayer');
					data.imagesLayer.remove();
	         		_self.removeData('imagesLayer');
				})
		},
		update : function(content){}
	};

	$.fn.imagesLayer = function(method) {
    
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.imagesLayer' );
		}  
	};
})(jQuery);


/*
 * 
 * textsLayer
 * 
 */

(function( $ ){
	
	var methods = {
		init : function( options ) {

			return this.each(function(){
				
				var winW = jQuery(window).width();
				var winH = jQuery(window).height();
				
				var settings = jQuery.extend( {
					'initxMin' 		: -winW,
					'initxMax' 		: winW,
					'inityMin' 		: -winH,
					'inityMax' 		: winH,
					'posxMin' 		: -winW,
					'posxMax' 		: winW,
					'posyMin'		: -winH,
					'posyMax' 		: winH,
					'textFields' 	: 4,
					'durationMin' 	: 6000,
					'durationMax'	: 12000,
					'scaleMin'		: 0,
					'scaleMax'		: 4000,
					'delay'			: 4000
			    }, options);
         
				var _self = jQuery(this),data = _self.data('textsLayer');
				
				//reset
				_self.find('div').each(function(indes){
					
					jQuery(this).transition({ opacity : 0 }, jQuery.randomBetween(1000, 1000), function() {
					   jQuery(this).remove();
					});
				});

				var txts = jQuery(settings.referer).find('p');
				
				for(var i=0; i<settings.textFields; i++){						
											
					var el = jQuery('<div/>', {
					    //id: 'textsLayer_'+i,
					    html: txts[i]
					});						
					
					el.css({
						top	    : jQuery.randomBetween(settings.initxMin, settings.initxMax),
						left	: jQuery.randomBetween(settings.inityMin, settings.inityMax),
						opacity	: 0
					});						
					el.appendTo(_self);
					
					var _posx = jQuery.randomBetween(settings.posxMin, settings.posxMax);
					var _posy = jQuery.randomBetween(settings.posyMin, settings.posyMax)
					var _speed = jQuery.randomBetween(settings.durationMin, settings.durationMax);
					var _scale = jQuery.randomBetween(settings.scaleMin, settings.scaleMax)/1000;
					var _delay = jQuery.randomBetween(0, settings.delay);
									
					el.transition({opacity : 1, scale: _scale, x: _posx,  y: _posy, delay:_delay}, _speed);		
				}
			});
		},		
		destroy : function( ) {
			return this.each(function(){
				var _self = jQuery(this),
				data = _self.data('textsLayer');
	
				jQuery(window).unbind('.textsLayer');
					data.imagesLayer.remove();
	         		_self.removeData('textsLayer');
				})
		},
		update : function(content){}
	};

	$.fn.textsLayer = function(method) {
    
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.textsLayer' );
		}  
	};
})(jQuery);