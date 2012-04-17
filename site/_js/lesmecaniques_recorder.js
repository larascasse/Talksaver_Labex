Backbone.emulateHTTP = true;
// Backbone.emulateJSON = true;
var appUrl = 'http://localhost/labex/cake';
var EventRouter = Backbone.Router.extend( {
	initialize : function(options) {
		console.log("Route initialize")
		// Matches #page/10, passing "10"
		// this.route("page/:number", "page", function(number){ ... });

		// Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
		// this.route(/^(.*?)\/open$/, "open");

	},

	routes : {
		"projects" : "projects", // #help
		// "/^(.*?)\/open$/": "open", //Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		":route/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"#/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"/^(.*?)\/start/:time" : "start", // Matches /117-a/b/c/open, passing
		// "117-a/b/c" to this.open
		"events/project/:project" : "events" // #search/kiwis
	},

	projects : function() {
		// ...
},

	events : function(project_id) {
		console.log("Rootes events");
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
	new EventRouter;
	Backbone.history.start();
});

var EventModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/events/popcorn/';
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		console.log('New EventModel');

		// this.fetch();
		// J'Žcoute sur l'Žvnement 'error' au cas o si la validation a ŽchouŽ
		this.on('error', function(model, err) {
			console.log('error' + err);
		});
		// J'Žcoute aussi sur l'Žvnement change pour savoir si a c'est bien
		// passŽ
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
	attributes['Event'] = this.attributes;
	Backbone.Model.prototype.save.call(this, attributes, options);
},
parse : function(response) {
	console.log('parse EVENT response' + response);
	return response.Event;
},
validate : function(attrs) {
	/*
	 * if (!/^[A-z]{2,} [A-z]{2,}$/.test(attrs.type)) return 'Nom prŽnom
	 * invalide';
	 */
	// if (attrs.type.length !=20) return 'TYPE invalide (10 numŽros).';
	/*
	 * if (!/^\d{10}$/.test(attrs.phone)) return 'NumŽro de tŽlŽphone invalide
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
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
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
window.eventsCollectionModel = new EventsCollectionModel();
window.eventsCollectionModel.bind("add", testLog);

function testLog(model) {
	console.log("llllllllll" + model)
}

function createPopcornEvent(event) {
	console.log('createPopcornEvent' + event.get('start'));
	popcorn.yahooboss( {
		start : event.get('start'),
		end : event.get('end'),
		target : 'pierre_giner',
		query : event.get('query'),
		searchtype : 'images,web,news'
	});

}

function clearAllPopcornEvents() {
	var events = popcorn.getTrackEvents();
	for ( var i = 0; i < events.length; i++) {
		var event = events[i];
		popcorn.removeTrackEvent(event.id);
	}

}

/*
 * Backbone.sync = function(method, model) { alert(method + ": " + model.url); };
 */

// Je crŽŽ une instance de ce modle
// window.eventsModel = new EventModel();
// eventsModel.save({author: "Teddy"});
// Backbone.Model.prototype.set.call(this, attributes, options);
