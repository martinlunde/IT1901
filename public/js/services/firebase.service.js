'use strict';

angular.module('angularAuth')
  .service('FirebaseService', function($http, $q) {

    this.getDb = function(callback) {
      firebase.database().ref().once('value')
      .then(callback);
    }

    this.getBookings = function(callback) {
      firebase.database().ref("/bookinger/").once('value')
      .then(callback);
    }

    this.getUserInformation = function(uid, callback) {
      firebase.database().ref("/brukere/" + uid).once('value')
      .then(callback);
    }

  });







// END
