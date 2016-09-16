(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("homeCtrl", homeCtrl);

  homeCtrl.$inject = ["$scope", "FirebaseService"];
  function homeCtrl($scope, FirebaseService) {
    $scope.test = "This is a scope variable for HOMEPAGE";
    $scope.firebaseDb = {};

    FirebaseService.getDb(function(response) {
      $scope.$apply(function() {
        $scope.firebaseDb = response.val();
      });
    });

  }
})();
