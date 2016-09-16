(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("bookingoversiktCtrl", bookingoversiktCtrl);

  bookingoversiktCtrl.$inject = ["$scope", "FirebaseService"];
  function bookingoversiktCtrl($scope, FirebaseService) {

    FirebaseService.getBookings(function(response) {
      $scope.$apply(function() {
        $scope.bookings = response.val();
      });
    });

  }
})();
