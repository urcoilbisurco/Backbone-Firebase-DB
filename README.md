# Backbone Firebase Database

Easily integrate Firebase 3 with Backbone.js.

## Usage

Download and include backbone.firebase_db.js after Backbone. Import Firebase

  <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

And initialize the firebase object.

    config = {
      apiKey: "YOUR-API-KEY",
      authDomain: "YOUR-URL.firebaseapp.com",
      databaseURL: "http://YOUR-URL.firebaseio.com",
    };
    window.firebase.initializeApp(config);

Then, instead of extending Backbone.Collection, extends Backbone.Firebase.Collection, and use as url the "child" reference for that collection in your Firebase Database.

    var TodoList = Backbone.Firebase.Collection.extend({
      url:"/todos",
      model: Todo,
      ...
    })

This integration is heavily based on the Backbone events for models:

    TodoList.bind('reset', this.addAll)
    TodoList.bind('add', this.addOne)
    TodoList.bind('change', this.model_change)
    TodoList.bind('remove', this.model_destroy)

Be sure to implement these methods to be able to get all the new models and changes from Firebase.

## TODO
Here are some things that are not currently implemented:
 - _fetch_ method for collection. Right now it automatically retrieve the objects after the inizialize.
 - all CRUD methods on models not belonging to a collection
