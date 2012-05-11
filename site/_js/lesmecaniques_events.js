var EventModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/events/popcorn/';
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		//console.log('New EventModel');

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
			if (this.attributes["end"] == 0)
				this.attributes["end"] = 10000;
			this.attributes["project_id"] = window.ProjectModel.id;
			attributes['Event'] = this.attributes;
			Backbone.Model.prototype.save.call(this, attributes, options);
		},
		parse : function(response) {
			//console.log('parse EVENT response' + response);
			return response.Event;
		},
		createPopcornEvent:function() {
			console.log('createPopcornEvent' + this.get('start'));
			popcorn.yahooboss( {
				start : this.get('start'),
				end : parseFloat(this.get('start')) + 120,// event.get('end'),
				target : 'pierre_giner',
				query : this.get('query'),
				searchtype : 'images,web',
				enginetype : this.get('type') ? this.get('type') : 'yahoboss',
				eventModel : this
			});

		}

});

// window.eventsModel = new EventModel();

var EventsCollectionModel = Backbone.Collection.extend( {
	model : EventModel,
	parse : function(response) {
		//console.log('parse response' + response);
		return response;
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		console.log('New EventsCollectionModel');

		this.bind('all', function(action, model) {
			console.log('EventsCollectionModel->' + action + '()', model+ 'popcorn ?'+popcorn);
			if (popcorn) {
				clearAllPopcornEvents();
				this.each(function(event) {
					event.createPopcornEvent();
				});
				displayAllEvents();
			}
		});
	},

	log : function(model) {
		console.log("llllllllll" + model)
	}

});
