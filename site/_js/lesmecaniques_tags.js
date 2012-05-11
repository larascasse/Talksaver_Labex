var TagModel = Backbone.Model.extend( {

	urlRoot : function() {
		return appUrl + '/tags/popcorn/';
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		//console.log('New TagModel');

		// this.fetch();
		// J'Žcoute sur l'Žvnement 'error' au cas o si la validation a ŽchouŽ
		this.on('error', function(model, err) {
			console.log('error' + err);
		});
		// J'Žcoute aussi sur l'Žvnement change pour savoir si a c'est bien
		// passŽ
		this.on('change', function(model) {
			console.log('TagModel Change' + model);
		});
		this.on('success', function(model) {
			console.log("TagModel success");
		});
		this.on('add', function(model) {
			console.log("TagModel add");
		});

	},
	set : function(attributes, options) {
		// map JSON obkect to TagModel
		//console.log("SET TAG !!!" + attributes + options);
	//console.log(attributes);
	if (attributes.Event) {
		//console.log("SET TAG=> EVENT" + attributes + options)
		this.set(attributes.Event, options);
		_.each(attributes.Tag, function(constructor, key) {
			attributes[key] = constructor;
		}, this);
		delete attributes["Tag"];
	}
	return Backbone.Model.prototype.set.call(this, attributes, options);
},
parse : function(response) {
	console.log('parse TAGS response' + response);
	return response.Tag;

}

});

var TagsCollectionModel = Backbone.Collection.extend( {
	model : TagModel,
	parse : function(response) {
		//console.log('parse TagsCollectionModel response' + response);
		return response;
	},
	// cette mŽthode est appelŽe automatiquement
	// ˆ chaque fois que j'instancie ce type de modle
	initialize : function(attrs, options) {
		console.log('New TagsCollectionModel');

		this.bind('all', function(action, model) {
			console.log('TagsCollectionModel->' + action + '()', model);

		});
	},

	parse : function(response) {
		console.log('parse TAGS COLLECTION response' + response);
		
		_.each(response, function(constructor, key) {
			console.log(constructor);
			console.log(key);
			response[key].Tag.events = constructor.Event;
			delete constructor.Event;
		}, this);
		console.log(response);
		return response;

	},
	set : function(attributes, options) {
		// map JSON obkect to EventModel
		console.log('SET TAGS COLLECTION response' + response);
		if (attributes.Event) {
			this.set(attributes.Event, options);
			_.each(attributes.Event, function(constructor, key) {
				attributes[key] = constructor;
			}, this);
			delete attributes["Event"];
		}
		return Backbone.Collection.prototype.set.call(this, attributes, options);
	},
log : function(model) {
	console.log("llllllllll" + model)
}

});

var QuestionsCollectionView = Backbone.View.extend( {
	// el : jQuery('#questions-block'),

	initialize : function() {
		console.log("initialize QuestionsCollectionView " + this.collection);
		this.template = _.template($('#question-collection-template').html());

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
		// console.log("render QuestionsCollectionView"+this.collection.toJSON()
		// );
	// console.log(this.collection.toJSON() );
	var renderedContent = this.template( {
		questions : this.collection.toJSON()
	});
	// console.log(renderedContent);
	// console.log(jQuery('#questions-block').html());
	// console.log(this.el.html());
	// console.log(jQuery(this.el).html());
	// jQuery(this.el).html(renderedContent);
	jQuery('#questions-block').html(renderedContent);
	return this;
}

});

var QuestionRow = Backbone.View.extend( {
	// model: doc,
	tagName : "li",
	el : "#questions",
	className : "question-row",

	events : {
		"click .icon" : "open"
	},
	events : {
		"click input[type=button]" : "doSearch"
	},
	open : function(event) {
		// Button clicked, you can access the element that was clicked with
		// event.currentTarget
	alert("Search for " + $("#search_input").val());
},
initialize : function() {
	this.template = _.template($('#question-template').html());
	/*--- binding ---*/
	_.bindAll(this, 'render');
	this.model.bind('change', this.render);
	this.render();
},
setModel : function(model) {
	this.model = model;
	return this;
},
render : function() {
	var renderedContent = this.template(this.model.toJSON());
	jQuery(this.el).html(renderedContent);
	return this;
}

});