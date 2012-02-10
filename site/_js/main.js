/*
 * 
 * fonction appelée par popcorn pour créer/raffraichier la vue
 * fonctionnement : le contenu de la div #webservice-return est vidé et est rempli par le html de retour du service
 * une fois ok, appel de la function de création/raffraichissement de la vue
 * 
 * @params start : timecode debut de recherche
 * @params end : timecode fin de recherche
 * @params query : texte recherché
 * 
 */

function nosign(start, end, query){
	
	/*
	 * enregistre l'evenement pour enregistrement en base 
	 */
	trackEvent(start, end, query);
	
	/*
	 * vue images
	 */		
	//par defaut :
	//jQuery('#image-container').imagesLayer({referer:'#webservice-return'});

	//ou en passant les options :	
	jQuery('#image-container').imagesLayer({
		//id de la div contenant le retour du service
		referer : '#webservice-return',		
		//nombre d'images affichées
		grid : 6,
		//durée minimum de transition pour le random
		durationMin : 6000,
		//durée maximum de transition pour le random
		durationMax : 16000,
		//position x de l'image minimumu pour le random
		posxMin : -400,
		//position x de l'image maximum pour le random
		posxMax : 0
	});
	
	/* 
	 * vue textes
	 */	
	//par defaut :
	//jQuery('#text-container').textsLayer({referer:'#webservice-return'});

	//ou en passant les options :	
	jQuery('#text-container').textsLayer({
		//id de la div contenant le retour du service
		referer : '#webservice-return',		
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
	
	/*
	 * pour debug : retour l'historique des evenements
	 */
	//buildMemory();
}  
    /*                 
jQuery(document).ready(function() {
	
	//simule l'appel popcorn
	//nosign(0, 10, 'requete initiale');
	
	//jQuery('#main').bind('click', function() {
		
		//nosign(100, 110, 'requete simulée');
	//});
});*/