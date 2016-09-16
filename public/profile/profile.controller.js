(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("profileCtrl", profileCtrl);

  profileCtrl.$inject = ["$scope"];
  function profileCtrl($scope) {
    console.log();
    $scope.test3 = "This is a scope variable for PROFILE";
  }
})();
