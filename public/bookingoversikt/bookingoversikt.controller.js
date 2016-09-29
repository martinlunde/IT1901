(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("bookingoversiktCtrl", bookingoversiktCtrl);

  bookingoversiktCtrl.$inject = ["$scope", "FirebaseService"];
  function bookingoversiktCtrl($scope, FirebaseService) {

    $scope.valgtStatus = "velg";
    $scope.valgtScene = "velg";

    $scope.filterFunction = function() {
      var bookings = $scope.mainBookinger;
      var filtrertList = new Object();
      for (var dato in bookings) {
        var filtrertDato = new Object;
        angular.forEach(bookings[dato], function(value,key) {
          if(((($scope.searchingString == undefined) || value.artist.toLowerCase().indexOf($scope.searchingString.toLowerCase())) != -1) && (value.status == $scope.valgtStatus || $scope.valgtStatus == "velg") && (value.scene == $scope.valgtScene || $scope.valgtScene == "velg")) {
            filtrertDato[key] = value;
          }
        });
        if(!($.isEmptyObject(filtrertDato))) {
          filtrertList[dato] = filtrertDato;
        }
      }
      $scope.filtrertListe = filtrertList;
    }

    $scope.updateBooking = function (bookingID, nyStatus) {
      firebase.database().ref().child('bookinger').child(bookingID).update({
        status : nyStatus
      });
    };

    $scope.$watch('mainBookinger', function() {
      $scope.filterFunction();
    });

    $scope.updateBookingStatus = function (bookingID, nyStatus) {
          firebase.database().ref().child('bookinger').child(bookingID).update(
            { status : nyStatus }
          );
        };

    $scope.avvisBooking = function (key, kommentar) {
      if($scope.currentUserInformation.stilling == 'bookingsjef') {
        $scope.updateBookingStatus(key, 'avvist_av_bookingsjef');
      } else if($scope.currentUserInformation.stilling == 'bookingansvarlig') {
        $scope.updateBookingStatus(key, 'avvist_av_manager');
      }
      firebase.database().ref("/bookinger/" + key + "/kommentar_for_avvisning").set(kommentar);
    }

  }
})();
