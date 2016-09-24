(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("arrangementerCtrl", arrangementerCtrl);

  arrangementerCtrl.$inject = ["$scope", "FirebaseService"];
  function arrangementerCtrl($scope, FirebaseService) {
    $scope.test = "This is a scope variable for arrangementerPAGE";
    $scope.firebaseDb = {};

    FirebaseService.getDb(function(response) {
      $scope.$apply(function() {
        $scope.firebaseDb = response.val();
      });
    });

  }
})();
