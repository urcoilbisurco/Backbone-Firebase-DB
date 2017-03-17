# Backbone Firebase Database

Easily integrate Firebase 3 with Backbone.js.

## Usage

Download and include `backbone.firebase.js` after Backbone. Then import Firebase:

    <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

And initialize firebase like usual:

    config = {
      apiKey: "YOUR-API-KEY",
      authDomain: "YOUR-URL.firebaseapp.com",
      databaseURL: "http://YOUR-URL.firebaseio.com",
    };
    window.firebase.initializeApp(config);

Then, instead of extending `Backbone.Collection`, extend `Backbone.Firebase.Collection`. Use the collection's `url` as the "child" reference for that collection in your Firebase Database.

    var TodoList = Backbone.Firebase.Collection.extend({
      url:"/todos", // This would tell the collection to use http://YOUR-URL.firebaseio.com/todos
      model: Todo,
      ...
    })

Use Backbone's built-in events to detect and respond to changes in the database

    TodoList.bind('reset', this.addAll)
    TodoList.bind('add', this.addOne)
    TodoList.bind('change', this.model_change)
    TodoList.bind('remove', this.model_destroy)

## TODO

Here are some things that are not currently implemented:
 - _fetch_ method for collection. Right now it automatically retrieve the objects after the inizialize.
 - all CRUD methods on models not belonging to a collection
