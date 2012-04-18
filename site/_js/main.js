var currentEventId;





function createSearchEvent(str) {
	// alert(popcorn.currentTime());
	if (currentEventId)
		popcorn.getTrackEvent(currentEventId).end = popcorn.currentTime();
	popcorn.yahooboss( {
		start : popcorn.currentTime() + 0000001,
		end : popcorn.currentTime() + 1000000,
		target : 'pierre_giner',
		query : str,
		searchtype : 'images,web,news'
	});
	currentEventId = popcorn.getLastTrackEventId();
	console.log("NEW EVENT " + currentEventId + " "
			+ popcorn.getTrackEvent(currentEventId).query)
	
	//var e = new EventModel(popcorn.getTrackEvent(currentEventId));
	var e = new EventModel({query:popcorn.getTrackEvent(currentEventId).query,start:popcorn.getTrackEvent(currentEventId).start,end:popcorn.getTrackEvent(currentEventId).end,project_id:1,user_id:1,type:'yahooboss'});
	e.save();
	displayAllEvents();
}
function createSearchEventAndDispatch(str) {
	createSearchEvent(str);
	if(socket)
	socket.emit('addEvent', {
		query : popcorn.getTrackEvent(currentEventId).query,
		id : currentEventId
	});
}

// var e
window.addEventListener("DOMContentLoaded", function() {
	$("#inputbutton").click(function() {
		console.log("Click for search: "+ $("#inputsearch").val());
		createSearchEventAndDispatch($("#inputsearch").val());
	});
	refreshBehaviours();
	
	

}, false);

function refreshBehaviours() {
	
	$(".gototime").click(function() {
		console.log("Click for time");
		var time=jQuery(this).attr('data-start');
		console.log("Click for time: "+ time);
		popcorn.play(time);
	});
}

function displayAllEvents() {
	console.log("Display All EVents");
	var id="div-events";
	if(jQuery('#'+id).length==0) {
		jQuery('<div id="'+id+'"></div>').appendTo(jQuery(document.body));
		//jQuery('#'+id).css({'position':'absolute','top':'0','left':'0','width':'200px','height':'500px','overflow':'hidden','z-index':'10'});
		//jQuery('#'+id+ " div").css({'position':'absolute','overflow':'hidden'});
	}
	var events = popcorn.getTrackEvents();
	var html="<ul>";
	for ( var i=0;i<events.length;i++) {
		var event = events[i];
		console.log(event._natives.type,event,event.query,event.start);
		html+='<li>'+event.query+' ('+event.start+'/'+event.end+') <a class="gototime" href="#" data-start="'+event.start+'">go</a></li>';
	}
	jQuery('#'+id).html(html);
	refreshBehaviours();
	
}

/*
 * 
 * fonction appelée par popcorn pour créer/raffraichier la vue fonctionnement :
 * le contenu de la div #webservice-return est vidé et est rempli par le html
 * de retour du service une fois ok, appel de la function de
 * création/raffraichissement de la vue
 * 
 * @params start : timecode debut de recherche @params end : timecode fin de
 * recherche @params query : texte recherché
 * 
 */

function nosign(start, end, query) {

	/*
	 * enregistre l'evenement pour enregistrement en base
	 */
	trackEvent(start, end, query);

	/*
	 * vue images
	 */
	// par defaut :
	// jQuery('#image-container').imagesLayer({referer:'#webservice-return'});
	// ou en passant les options :
	jQuery('#image-container').imagesLayer( {
		// id de la div contenant le retour du service
		referer : '#webservice-return',
		// nombre d'images affichées
		grid : 6,
		// durée minimum de transition pour le random
		durationMin : 6000,
		// durée maximum de transition pour le random
		durationMax : 16000,
		// position x de l'image minimumu pour le random
		posxMin : -400,
		// position x de l'image maximum pour le random
		posxMax : 0
	});

	/*
	 * vue textes
	 */
	// par defaut :
	// jQuery('#text-container').textsLayer({referer:'#webservice-return'});
	// ou en passant les options :
	jQuery('#text-container').textsLayer( {
		// id de la div contenant le retour du service
		referer : '#webservice-return',
		// nombre de textes affichées
		textFields : 10,
		// durée minimum de transition pour le random
		durationMin : 10000,
		// durée maximum de transition pour le random
		durationMax : 32000,
		// position initiale x du texte minimumu pour le random
		initxMin : -400,
		// position initiale x du texte maximum pour le random
		initxMax : 1024,
		// position initiale y du texte minimumu pour le random
		inityMin : -400,
		// position initiale y du texte maximum pour le random
		inityMax : 800,
		// position finale x du texte minimumu pour le random
		posxMin : -1024,
		// position finale x du texte maximum pour le random
		posxMax : 1024,
		// position finale y du texte minimumu pour le random
		posyMin : -1024,
		// position finale y du texte maximum pour le random
		posyMax : 800,
		// scale final du texte minimumu pour le random (divisé par 1000 par
		// code)
		scaleMin : 1000,
		// scale final du texte maximum pour le random (divisé par 1000 par
		// code)
		scaleMax : 20000,
		// delay pour le random
		delay : 2000
	});

	/*
	 * pour debug : retour l'historique des evenements
	 */
	// buildMemory();
}
/*
 * jQuery(document).ready(function() {
 * 
 * //simule l'appel popcorn //nosign(0, 10, 'requete initiale');
 * 
 * //jQuery('#main').bind('click', function() {
 * 
 * //nosign(100, 110, 'requete simulée'); //}); });
 */