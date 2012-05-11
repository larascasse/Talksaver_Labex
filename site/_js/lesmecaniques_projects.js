
var ProjectModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/projects/popcorn/';
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		//console.log('New ProjectModel');

		// this.fetch();
		// J'Žcoute sur l'Žvnement 'error' au cas o si la validation a ŽchouŽ
		this.on('error', function(model, err) {
			console.log('error' + err);
		});

	},
	set : function(attributes, options) {
	
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
	//console.log('parse PROJECT response' + response);
	return response;
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

var ProjectsCollectionModel = Backbone.Collection.extend( {
	model : ProjectModel,
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		console.log('New ProjectsCollectionModel');

		this.bind('all', function(action, model) {
			//console.log('ProjectsCollectionModel->' + action + '()', model);

		});
	},

	parse : function(response) {
		//console.log('parse PROJECTS COLLECTION response' + response);
		
		/*_.each(response, function(constructor, key) {
			response[key].Tag.events = constructor.Event;
			delete constructor.Event;
		}, this);*/
		//console.log(response);
		return response;

	},
	set : function(attributes, options) {
		// map JSON obkect to EventModel
		//console.log('SET PROJECTS COLLECTION response' + response);
		if (attributes.Event) {
			this.set(attributes.Event, options);
			_.each(attributes.Event, function(constructor, key) {
				attributes[key] = constructor;
			}, this);
			delete attributes["Event"];
		}
		return Backbone.Collection.prototype.set.call(this, attributes, options);
	}

});

var ProjectsCollectionView = Backbone.View.extend( {
	// el : jQuery('#questions-block'),

	initialize : function() {
		//console.log("initialize ProjectsCollectionView " + this.collection);
		this.template = _.template($('#project-collection-template').html());

		/*--- binding ---*/
		_.bindAll(this, 'render');
		this.collection.bind('change', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
		/*---------------*/

	},

	render : function() {
		/*
		 * render: function () { this.el.innerHTML =
		 * this.template(this.model.toJSON()); return this; }
		 * 
		 */
		// console.log("render ProjectsCollectionView"+this.collection.toJSON()
		// );
	// console.log(this.collection.toJSON() );
	var renderedContent = this.template( {
		projects : this.collection.toJSON()
	});
	// console.log(renderedContent);
	// console.log(jQuery('#questions-block').html());
	// console.log(this.el.html());
	// console.log(jQuery(this.el).html());
	// jQuery(this.el).html(renderedContent);
	jQuery('#projects-block').html(renderedContent);
	return this;
}

});