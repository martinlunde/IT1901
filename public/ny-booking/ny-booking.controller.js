(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("nyBookingCtrl", nyBookingCtrl);

  nyBookingCtrl.$inject = ["$scope", "SpotifyService"];
  function nyBookingCtrl($scope, SpotifyService) {

    var chosenArtist = null;


    $scope.searchForArtist = function (searchText) {
      SpotifyService.searchArtist(searchText, 'artist').then(function (data) {
        $scope.searchResult = data.artists.items;
      });
    };

    $scope.getArtistById = function (artistID) {
      SpotifyService.getArtist(artistID).then(function (data) {
        console.log(data);
      });
    };

    $scope.updateFormData = function(band) {
      $scope.formData = band;
    }

    $scope.emptyFormData = function() {
      $scope.formData = {};
      console.log("Empty");
    }

    $scope.convertToTwoNumbers = function(number) {
      if (number < 10) {
        number = "0" + number
      }
      return number
    }

    $scope.sendBooking = function (booking) {
      // Fikser dato-objektet
      var year = booking.dato.getFullYear();
      var month = $scope.convertToTwoNumbers(booking.dato.getMonth() + 1);
      var day = $scope.convertToTwoNumbers(booking.dato.getDate());
      var tid = String(year) + String(month) + String(day);
      tid = parseInt(tid);

      // Oppretter en key for bookingen
      var newPostKey = firebase.database().ref().child('bookinger').push().key;

      // Lager objektet og sender det inn til Firebase
      firebase.database().ref().child('bookinger').child(newPostKey).set({
        aldersgrense : booking.aldersgrense,
        artist : $scope.formData.name,
        bookingansvarlig : firebase.auth().currentUser.uid,
        dato : tid,
        har_rapport : false,
        kostnad : booking.kostnad,
        pris_ikke_medlem : booking.billettprip_ikke_medlem,
        pris_medlem : booking.billettpris_medlem,
        scene : booking.scene,
        sjanger : $scope.formData.genres,
        spotify_id : $scope.formData.id,
        status : "ubesvart",
        tid : booking.tid
      });

      // Endrer variabelen til å vise tilbakemelding
      $scope.skjema_sendt = true;

      // Tilbakestiller skjemainnhold
      $scope.booking = {};
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
