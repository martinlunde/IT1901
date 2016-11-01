(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("bookingerCtrl", bookingerCtrl);

  bookingerCtrl.$inject = ["$scope", "FirebaseService"];
  function bookingerCtrl($scope, FirebaseService) {

    $scope.valgtStatus = "velg";
    $scope.valgtScene = "velg";

    $scope.filterFunction = function() {
      var bookings = $scope.mainBookinger;
      var filtrertList = new Object();
      for (var dato in bookings) {
        var filtrertDato = new Object;
        angular.forEach(bookings[dato], function(value,key) {
          if($scope.isValidFilter(value)) {
            filtrertDato[key] = value;
          }
        });
        if(!($.isEmptyObject(filtrertDato))) {
          filtrertList[dato] = filtrertDato;
        }
      }
      $scope.filtrertListe = filtrertList;
    }

    $scope.isValidFilter = function(value) {
      if (($scope.searchingString != undefined) && (value.artist.toLowerCase().indexOf($scope.searchingString.toLowerCase()) == -1)){
        return false;
      } else if (value.scene != $scope.valgtScene && $scope.valgtScene != "velg") {
        return false;
      } else if(value.status != $scope.valgtStatus && $scope.valgtStatus != "velg") {
        return false;
      } else if(($scope.currentUserInformation.stilling == 'bookingansvarlig') && (value.bookingansvarlig != $scope.currentUser.uid)) {
        return false;
      } else if(value.status == 'aktiv') {
        return false;
      }
      return true;
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

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato;
    }

    $scope.printableDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      var months = ["JANUAR", "FEBRUAR", "MARS", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
      var days = ["SØNDAG", "MANDAG", "TIRSDAG", "ONSDAG", "TORSDAG", "FREDAG", "LØRDAG"];
      return days[dato.getDay()] + " " + dato.getDate() + ". " + months[dato.getMonth()];
    }

    $scope.avvisBooking = function (key, kommentar) {
      if($scope.currentUserInformation.stilling == 'bookingsjef') {
        $scope.updateBookingStatus(key, 'avvist_av_bookingsjef');
      } else if($scope.currentUserInformation.stilling == 'bookingansvarlig') {
        $scope.updateBookingStatus(key, 'avvist_av_manager');
      }
      firebase.database().ref("/bookinger/" + key + "/kommentar_for_avvisning").set(kommentar);
    }

    $scope.makeStatusPrintable = function(status) {
      if(status == 'godkjent_av_bookingsjef') {
        return "GODKJENT"
      } else if(status == 'avvist_av_manager') {
        return "AVBRUTT"
      } else if(status == 'avvist_av_bookingsjef') {
        return "AVVIST"
      } else {
        return status.toUpperCase();
      }
    }


  }
})();
