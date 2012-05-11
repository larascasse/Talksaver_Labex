Backbone.emulateHTTP = true;
// Backbone.emulateJSON = true;

jQuery(function() {
	window.eventRouter = new EventRouter;
	Backbone.history.start();
	/*window.eventRouter.navigate("/projects/20", {
		trigger : true
	});*/
	window.eventRouter.navigate("/", {
		trigger : true
	});
});

var appUrl = '/labex/cake';
var EventRouter = Backbone.Router
		.extend( {
			initialize : function(options) {
				console.log("Route initialize");
				//Event Collection
				window.eventsCollectionModel = new EventsCollectionModel();
				
				//Current Project Model
				window.ProjectModel = new ProjectModel();
				
				//Projects Collections
				window.projectsCollectionModel = new ProjectsCollectionModel();
				window.projectsCollectionModel.url = appUrl + '/projects/popcorn';
				window.projectsCollectionView = new ProjectsCollectionView({ collection : window.projectsCollectionModel,el : jQuery('#projects-block') });
				window.projectsCollectionModel.fetch( {
					success : function(model, response) {
						// createPopcorn(model);
						console.log("FETCHED projectsCollectionView "+response+" "+model);
						model.trigger("change");
					}
				});
				
				//Tags Collections
				window.tagsCollectionModel = new TagsCollectionModel();
				window.questionsCollectionView = new QuestionsCollectionView({ collection : window.tagsCollectionModel,el : jQuery('#questions-block') });
				
				window.tagsCollectionModel.url = appUrl + '/tags/project';
				window.tagsCollectionModel.fetch( {
					success : function(model, response) {
						// createPopcorn(model);
						console.log("FETCHED tagsCollectionModel "+response+" "+model);
						model.trigger("change");
					}
				});
				
				// Matches #page/10, passing "10"
				// this.route("page/:number", "page", function(number){ ... });

				// Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
				// this.route(/^(.*?)\/open$/, "open");

			},

			routes : {
				"projects/:project" : "projects", // #help
				// "/^(.*?)\/open$/": "open", //Matches /117-a/b/c/open, passing
				// "117-a/b/c" to this.open
				":route/start/:time" : "start", // Matches /117-a/b/c/open,
												// passing
				// "117-a/b/c" to this.open
				"#/start/:time" : "start", // Matches /117-a/b/c/open, passing
				// "117-a/b/c" to this.open
				"/^(.*?)\/start/:time" : "start", // Matches /117-a/b/c/open,
													// passing
				// "117-a/b/c" to this.open
				"events/project/:project" : "events", // #search/kiwis
				"projects/:project/events" : "events" // #search/kiwis
			},

			projects : function(project_id) {
				if($tabs)
					$tabs.tabs('select', 1); // switch to third tab
				window.ProjectModel.url = appUrl + '/projects/popcorn/'
						+ project_id;
				window.ProjectModel.fetch( {
					success : function(model, response) {
						//Create Popcorn on success
						createPopcorn(model);
						
						//Refresh tags colection for the new loaded project
						window.tagsCollectionModel.url = appUrl + '/tags/project/'+project_id;
						window.tagsCollectionModel.fetch( {
							success : function(model, response) {
								// createPopcorn(model);
								console.log("FETCHED tagsCollectionModel "+response+" "+model);
								model.trigger("change");
							}
						});
					}
				});
			},

			events : function(project_id) {
				// prevent for loading event from another projetc
				console.log("fetch eventsCollectionModel")
			if (project_id != window.ProjectModel.get("id")) {
				this.projects(project_id);
				return;
			}
			window.eventsCollectionModel.reset();
			window.eventsCollectionModel.url = appUrl + '/events/project/'
					+ project_id;
			window.eventsCollectionModel.fetch();
		},
		start : function(route, time) {
			console.log("what start: " + route + ": " + time);
			popcorn.play(time);
		}

		});

function testLog(model) {
	console.log("llllllllll" + model)
}


function clearAllPopcornEvents() {
	console
			.log('clearAllPopcornEvents total: ' + popcorn.getTrackEvents().length);
	var events = popcorn.getTrackEvents();
	for ( var i = 0; i < events.length; i++) {
		var event = events[i];
		popcorn.removeTrackEvent(event._id);
	}

}

function removeThumbs() {
	jQuery("#div-events-thumb").html('');
}

function createPopcorn(projectModel) {
	console.log('-------  createPopcorn projectModel: ' + popcorn);
	removeThumbs();
	try {
		jQuery('#div-events-thumb').isotope('destroy');
	} catch (err) {

	}
	if (popcorn) {
		console.log('try detroy popcorn');
		popcorn.pause();
		Popcorn.destroy(popcorn);
		jQuery("#main").html('');
	}
	var media = projectModel.get('Media');
	
	if (media && media.type == "text") {
		console.log('create Text');
		
		var html = '<div id="textDiv"></div>';
		jQuery("#main").html(html)
		popcorn = Popcorn.typewriter( "textDiv", {
			speed: 200,//delay between imaginary keystrokes (in milliseconds)
				typeIn: 'words',//letters,words,phrases,custom
				customChar: [''],//only for typeIn == custom, provide an array of custom characters to break the "typing" or "erasing" at
				outputFormat: 'HTML',//['HTML','plaintext']
				typeInHTML: false,//true: type in the HTML tag (char by char), false: type in the HTML tag all at once
				typeInASCII: false,//true: type in the ASCII (char by char), false: type in the ASCII all at once
				text : media.text
			});
		popcorn.play();
	} 
	else if (media && media.type == "soundcloud") {
		console.log('create soundcloud');

		var html = '<div id="soundcloudDiv"></div>';
		jQuery("#main").html(html)

		popcorn = Popcorn(Popcorn.soundcloud("soundcloudDiv", media.url, {
			api : {
				key : "PRaNFlda6Bhf5utPjUsptg"
			}
		// width : "100%"
				}));
		popcorn.video.registerPopcornWithPlayer(popcorn);
		/*
		 * window.eventRouter.navigate("projects/" + projectModel.id +
		 * "/events", { trigger : true, replace: true });
		 */
	} else if (media) {
		console.log('create video' + media.type+" "+media.url);
		var sourceUrl = '';
		var html = '';
		if (media.type == "audio" && media.url.indexOf("http://")==-1) {
			sourceUrl += '<source src="videos/' + media.url + '" />';
			html = '<audio controls="controls" id="butter-media-element-Media0" autobuffer="" preload="">' + sourceUrl + '</audio>';
			//html = '<audio controls id="butter-media-element-Media0"  autoplay preload="none" src="'+media.url + '"></audio>';
		}
		else if (media.type == "audio") {
			sourceUrl += '<source src="' + media.url + '" />';
			html = '<audio controls="controls" id="butter-media-element-Media0" autobuffer="" preload="" autoplay>' + sourceUrl + '</audio>';
			html+='<div id="baseplayer"></div>';
			//html = '<audio controls id="butter-media-element-Media0"  autoplay preload="none" src="'+media.url + '"></audio>';
		}
		else if (media.type == "m3u8") {
			sourceUrl += media.url;
			//html = '<audio controls="controls" id="butter-media-element-Media0" autobuffer="" preload="">' + sourceUrl + '</audio>';
			html = '<video controls id="butter-media-element-Media0" autoplay preload="none" src="'+sourceUrl + '"></video>';
		}
		else {
			sourceUrl += '<source src="videos/' + media.url + '.webm" />';
			html = '<video controls="controls" id="butter-media-element-Media0" autobuffer="true" preload="auto">' + sourceUrl + '</video>';
		}
		jQuery("#main").html(html);
		
		//Stream !!
		if(media.url.indexOf("http://")>=0) {
			 Popcorn.player( "baseplayer" );

			 
			 popcorn = Popcorn.baseplayer('#baseplayer');
			//
			popcorn.currentTime(new Date()/1000);
			popcorn.listen( "timeupdate", function() {
				jQuery('.timeupdate').html(parseInt(popcorn.currentTime()));
			}
			);
			popcorn.listen( "trackstart", function() {
				console.log("TRACK START");
		    }
			);
			
			//var swf='<object width="300" height="200" type="application/x-shockwave-flash" id="PM44W4h547" name="PM44W4h547" data="http://static.playtv.fr/swf/tvplayer.swf?r=15"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="quality" value="high"><param name="flashvars" value="controls=1&amp;background=1579032&amp;esms=playtv.fr&amp;report=%2Faide%2Fsupport%2F&amp;bwt=%2Faide%2Fbandwidth%2F&amp;volume_cookie=true&amp;caching=true&amp;events=tvplayer.events&amp;a=c138ea9a991bd57733fcbdbfbf2f11ac96fe5d16917c5ccc3f271bfd79c5f9ab84e071c790b4c17b0c9a1fc50a2843a063c78d71d2b07869d488547f257acd711fe4545c290f7b34cd6e8688b5f64d14569f2914655dcb8ae72a6fc4e17b5919c3df7891&amp;b=61d717ff5a3c6fe1bc616a04301ebc191a274145f23f2ff379c96c5fb5f30608810f06155deaa0a34811defbfad714ef"></object>';
			//jQuery('#main').html(swf);
		}
		else {
			popcorn = Popcorn('#butter-media-element-Media0');
		}
		
	    
		popcorn.play();
		$tabs.tabs('select', 1); // switch to third tab
		/*
		 * window.eventRouter.navigate("projects/" + projectModel.id +
		 * "/events", { trigger : true, replace: true });
		 */

	}
	console.log("EN CREATING POPCORN popcor ?"+popcorn+" "+$tabs)
	window.eventRouter.events(projectModel.id);
}

function share() {

}
/*
 * Backbone.sync = function(method, model) { alert(method + ": " + model.url); };
 */

// Je créé une instance de ce modèle
// window.eventsModel = new EventModel();
// eventsModel.save({author: "Teddy"});
// Backbone.Model.prototype.set.call(this, attributes, options);
