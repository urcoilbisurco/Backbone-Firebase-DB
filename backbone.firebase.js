/*!
 *
 * Backbone.Firebase.DB 0.0.1
 * https://github.com/urcoilbisurco/backbone-firebase-db/
 * License: MIT
 */

(function(_, Backbone) {
  'use strict';
  Backbone.Firebase = {};

  /**
   * Overriding of Backbone.sync.
   * All Backbone crud calls (destroy, add, create, save...) will pipe into
   * this method.
   */
  Backbone.Firebase.sync = function(method, model, options) {
    if (method === 'read') {
      //TODO: read single model here
    } else if (method === 'create') {
      model.id=model.db_collection.push(model.toJSON()).key
    } else if (method === 'update') {
      var data={};
      data[model.id]=model.attributes
      model.db_collection.update(data)
    } else if(method === 'delete') {
      var data={};
      data[model.id]=null
      model.db_collection.update(data)
    }
  };
  Backbone.Firebase._throwError = function(message) {
    throw new Error(message);
  };

  Backbone.Firebase.Collection = Backbone.Collection.extend({
    constructor: function (model, options) {
      Backbone.Collection.apply(this, arguments);
      var self = this;
      var BaseModel = self.model;
      //save reference to old add: normal add will be with {silent:true} as the add event will be send by "child_added"
      this._add=this.add;
      this.db_ref=firebase.database().ref().child(this._url())
      this.db_ref.on('child_added', function(data) {
        model=self.get(data.key)
        if(!model) self._add(new BaseModel(_.extend({id:data.key}, data.val())));
      });
      this.db_ref.on('child_changed', function(data) {
        model=self.get(data.key);
        model.set(data.val());
      });
      this.db_ref.on('child_removed', function(data) {
        model=self.get(data.key);
        self.remove(model);
      });
      this.add=function(models,options){
        return self._add(models, _.extend({silent:true}, options))
      }
      // XXX breaking the model prototype
      // Intercept the given model and give it a firebase ref.
      this.model = function(attrs, opts) {
        var newItem = new BaseModel(attrs, opts);
        newItem.db_collection = self.db_ref;
        newItem.collection=self;
        newItem.sync = Backbone.Firebase.sync;
        return newItem;
      };
    },
    //returns URL, both if the URL is a function or string
    _url:function(){
      switch (typeof(this.url)) {
        case 'string':
          return this.url
        case 'function':
          return this.url();
        default:
          Backbone.Firebase._throwError('Invalid type passed to url property');
      }
    },
    //Remove collection.add(model) from create method, as the model will be already added on Firebase child_added
    //Using prepareModel to setup both Model or {} attributes
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      model.save(null, options);
      return model;
    },
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        attrs=attrs.attributes;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },
    comparator: function(model) {
      return model.id;
    }
  });
})(window._, window.Backbone);
