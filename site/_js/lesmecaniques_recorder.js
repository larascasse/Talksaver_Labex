Backbone.emulateHTTP = true;
// Backbone.emulateJSON = true;
var appUrl = '/labex/cake';
var EventRouter = Backbone.Router.extend( {
	initialize : function(options) {
		console.log("Route initialize");
		window.eventsCollectionModel = new EventsCollectionModel();
		window.ProjectModel = new ProjectModel();
		// Matches #page/10, passing "10"
		// this.route("page/:number", "page", function(number){ ... });

		// Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
		// this.route(/^(.*?)\/open$/, "open");

	},

	routes : {
		"projects/:project" : "projects", // #help
		// "/^(.*?)\/open$/": "open", //Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		":route/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"#/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"/^(.*?)\/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"events/project/:project" : "events", // #search/kiwis
		"projects/:project/events" : "events" // #search/kiwis
	},

	projects : function(project_id) {
		
		window.ProjectModel.url = appUrl + '/projects/popcorn/'+ project_id;
		window.ProjectModel.fetch({success: function(model,response) { createPopcorn(model); }});
	},

	events : function(project_id) {
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

jQuery(function() {
	window.eventRouter = new EventRouter;
	Backbone.history.start();
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
	if(this.attributes["end"]==0) 
		this.attributes["end"]=10000;
	this.attributes["project_id"]=window.ProjectModel.id;
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


var ProjectModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/projects/popcorn/';
	},
	// cette méthode est appelée automatiquement
	// à chaque fois que j'instancie ce type de modèle
	initialize : function(attrs, options) {
		console.log('New ProjectModel');
		
		// this.fetch();
		// J'écoute sur l'évènement 'error' au cas où si la validation a échoué
		this.on('error', function(model, err) {
			console.log('error' + err);
		});

	},
	set : function(attributes, options) {
		// map JSON obkect to ProjectModel
		console.log(attributes);
	if (attributes.Project) {
		this.set(attributes.Project, options);
		_.each(attributes.Project, function(constructor, key) {
			attributes[key] = constructor;
		}, this);
		delete attributes["Project"];
	}
	return Backbone.Model.prototype.set.call(this, attributes, options);
},
save : function(attributes, options) {
	attributes || (attributes = {});
	attributes['Project'] = this.attributes;
	Backbone.Model.prototype.save.call(this, attributes, options);
},
parse : function(response) {
	console.log('parse PROJECT response' + response);
	return response;
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
	//console.log('createPopcornEvent' + event.get('start'));
	popcorn.yahooboss( {
		start : event.get('start'),
		end : event.get('end'),
		target : 'pierre_giner',
		query : event.get('query'),
		searchtype : 'images,web,news'
	});

}

function clearAllPopcornEvents() {
	console.log('clearAllPopcornEvents total: '+popcorn.getTrackEvents().length);
	var events = popcorn.getTrackEvents();
	for ( var i = 0; i < events.length; i++) {
		var event = events[i];
		popcorn.removeTrackEvent(event._id);
	}
}

function createPopcorn(projectModel) {
	console.log('createPopcorn projectModel: '+popcorn);
	console.log(projectModel);
	if(popcorn) {
		console.log('try detroy popcorn');
		popcorn.pause();
		Popcorn.destroy(popcorn);
		jQuery("#main").html('');
	}
	var media =projectModel.get('Media'); 
	if(media && media.type=="soundcloud") {
		console.log('create soundcloud');
		popcorn = Popcorn( Popcorn.soundcloud( "main", "http://soundcloud.com/forss/flickermood", {width: "100%"}) );
		popcorn.video.registerPopcornWithPlayer( popcorn );
		window.eventRouter.navigate("projects/"+projectModel.id+"/events", {trigger: true});
	}
	else if(media){
		console.log('create video');
		var html='<video controls="" id="butter-media-element-Media0" autobuffer="true" preload="auto"><source src="videos/'+media.url+'.webm" /></video>';
		jQuery("#main").html(html);
		popcorn = Popcorn('#butter-media-element-Media0');
		popcorn.play();
		window.eventRouter.navigate("projects/"+projectModel.id+"/events", {trigger: true});
	}
}

/*
 * Backbone.sync = function(method, model) { alert(method + ": " + model.url); };
 */

// Je créé une instance de ce modèle
// window.eventsModel = new EventModel();
// eventsModel.save({author: "Teddy"});
// Backbone.Model.prototype.set.call(this, attributes, options);
