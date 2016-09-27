(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("bookingoversiktCtrl", bookingoversiktCtrl);

  bookingoversiktCtrl.$inject = ["$scope", "FirebaseService"];
  function bookingoversiktCtrl($scope, FirebaseService) {

    FirebaseService.getBookings(function(response) {
      $scope.$apply(function() {
        var bookings = response.val();
        var sorterteBookings = new Object();
          for (var bookingID in bookings) {
            if (bookings.hasOwnProperty(bookingID)) {
              if(!(bookings[bookingID].dato in sorterteBookings)) {
                sorterteBookings[bookings[bookingID].dato] = new Object();
                sorterteBookings[bookings[bookingID].dato][bookingID] = bookings[bookingID];
              } else {
                sorterteBookings[bookings[bookingID].dato][bookingID] = bookings[bookingID];
              }
            }
        }
        console.log(sorterteBookings);
        $scope.sorterteBookings = sorterteBookings;
        $scope.valgtStatus = "velg";
        $scope.valgtScene = "velg";
      });
    });

    $scope.filterFunction = function(bookings) {
      var filtrertList = new Object();
      for (var dato in bookings) {
        var filtrertDato = new Object;
        angular.forEach(bookings[dato], function(value,key) {
          if((value.status == $scope.valgtStatus || $scope.valgtStatus == "velg") && (value.scene == $scope.valgtScene || $scope.valgtScene == "velg")) {
            filtrertDato[key] = value;
          }
        });
        if(!($.isEmptyObject(filtrertDato))) {
          filtrertList[dato] = filtrertDato;
        }
      }
      return filtrertList;
    }

  }

})();
