Backbone.emulateHTTP = true;
// Backbone.emulateJSON = true;

jQuery(function() {
	window.eventRouter = new EventRouter;
	Backbone.history.start();
	window.eventRouter.navigate("/projects/20", {
		trigger : true
	});
	/*window.eventRouter.navigate("/", {
		trigger : true
	});*/
});

var appUrl = '/labex/cake';
var EventRouter = Backbone.Router
		.extend( {
			initialize : function(options) {
				console.log("Route initialize");
				window.eventsCollectionModel = new EventsCollectionModel();
				window.ProjectModel = new ProjectModel();
				
				
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

				window.ProjectModel.url = appUrl + '/projects/popcorn/'
						+ project_id;
				window.ProjectModel.fetch( {
					success : function(model, response) {
						createPopcorn(model);
						
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
			if (project_id != window.ProjectModel.get("id")) {
				this.projects(project_id);
				return;
			}
			console.log("Route -> events");
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

var EventModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/events/popcorn/';
	},
	// cette méthode est appelée automatiquement
	// à chaque fois que j'instancie ce type de modèle
	initialize : function(attrs, options) {
		console.log('New EventModel');

		// this.fetch();
		// J'écoute sur l'évènement 'error' au cas où si la validation a échoué
		this.on('error', function(model, err) {
			console.log('error' + err);
		});
		// J'écoute aussi sur l'évènement change pour savoir si ça c'est bien
		// passé
		this.on('change', function(model) {
			console.log('EventModel Change' + model);
		});
		this.on('success', function(model) {
			console.log("EventModel success");
		});
		this.on('add', function(model) {
			console.log("EventModel add");
		});

	},
	set : function(attributes, options) {
		// map JSON obkect to EventModel
	if (attributes.Event) {
		this.set(attributes.Event, options);
		_.each(attributes.Event, function(constructor, key) {
			attributes[key] = constructor;
		}, this);
		delete attributes["Event"];
	}
	return Backbone.Model.prototype.set.call(this, attributes, options);
},
save : function(attributes, options) {
	attributes || (attributes = {});
	if (this.attributes["end"] == 0)
		this.attributes["end"] = 10000;
	this.attributes["project_id"] = window.ProjectModel.id;
	attributes['Event'] = this.attributes;
	Backbone.Model.prototype.save.call(this, attributes, options);
},
parse : function(response) {
	console.log('parse EVENT response' + response);
	return response.Event;
},
validate : function(attrs) {
	/*
	 * if (!/^[A-z]{2,} [A-z]{2,}$/.test(attrs.type)) return 'Nom prénom
	 * invalide';
	 */
	// if (attrs.type.length !=20) return 'TYPE invalide (10 numéros).';
	/*
	 * if (!/^\d{10}$/.test(attrs.phone)) return 'Numéro de téléphone invalide
	 * (chiffres).';
	 */
}

});


// window.eventsModel = new EventModel();

var EventsCollectionModel = Backbone.Collection.extend( {
	model : EventModel,
	parse : function(response) {
		console.log('parse response' + response);
		return response;
	},
	// cette méthode est appelée automatiquement
	// à chaque fois que j'instancie ce type de modèle
	initialize : function(attrs, options) {
		console.log('New EventsCollectionModel');

		this.bind('all', function(action, model) {
			console.log('ModelCollection->' + action + '()', model);
			if (popcorn) {
				clearAllPopcornEvents();
				this.each(function(event) {
					createPopcornEvent(event);
				});
				displayAllEvents();
			}
		});
	},

	log : function(model) {
		console.log("llllllllll" + model)
	}

});

function testLog(model) {
	console.log("llllllllll" + model)
}

function createPopcornEvent(event) {
	// console.log('createPopcornEvent' + event.get('start'));
	popcorn.yahooboss( {
		start : event.get('start'),
		end : parseFloat(event.get('start')) + 120,// event.get('end'),
		target : 'pierre_giner',
		query : event.get('query'),
		searchtype : 'images,web',
		enginetype : event.get('type') ? event.get('type') : 'yahoboss'
	});

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
	if (media && media.type == "soundcloud") {
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
		/*
		 * window.eventRouter.navigate("projects/" + projectModel.id +
		 * "/events", { trigger : true, replace: true });
		 */

	}
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
