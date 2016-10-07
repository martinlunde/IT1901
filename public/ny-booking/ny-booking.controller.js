(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("nyBookingCtrl", nyBookingCtrl);

  nyBookingCtrl.$inject = ["$scope", "SpotifyService"];
  function nyBookingCtrl($scope, SpotifyService) {

    var chosenArtist = null;


    $scope.searchForArtist = function (searchText) {
      SpotifyService.searchArtist(searchText, 'artist').then(function (data) {
        console.log(data);
        $scope.searchResult = data.artists.items;
      });
    };

    $scope.getArtistById = function (artistID) {
      SpotifyService.getArtist(artistID).then(function (data) {
        console.log(data);
      });
    };

    $scope.sendBooking = function (booking) {
      console.log(booking);
      var newPostKey = firebase.database().ref().child('bookinger').push().key;
      firebase.database().ref().child('bookinger').child(newPostKey).set({
          artist : booking.artist,
          billettpris : booking.billettpris,
          dato : booking.dato.getYear() + "-" + booking.dato.getMonth() + "-" + booking.dato.getDate(),
          kostnad : booking.kostnad,
          scene : booking.scene,
          bookingansvarlig : firebase.auth().currentUser.uid
      });
    };

    $scope.updaterBooking = function (bookingId, nyStatus) {
      firebase.database().ref().child('bookinger').child(bookingId).update({
        status : nyStatus
      });
    };

/*
    $scope.searchForArtist = function(searchText) {
      FirebaseService.searchForArtist(searchText).then(function (data) {
        $scope.searchResult = JSON.stringify(data, null, " ");
      });
    }
*/
  }
})();
