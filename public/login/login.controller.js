(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("loginCtrl", loginCtrl);

  loginCtrl.$inject = ["$scope", "firebase", "Auth"];
  function loginCtrl($scope, firebase, Auth) {

  }
})();
