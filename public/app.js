(function () {
  "use strict";

  var firebaseConfig = {
    apiKey: "AIzaSyCDFUJu0EYkF6QBsuYjOEl_t6piqBXBmYg",
    authDomain: "studentersamfundet-booking.firebaseapp.com",
    databaseURL: "https://studentersamfundet-booking.firebaseio.com",
    storageBucket: "studentersamfundet-booking.appspot.com",
  };
  firebase.initializeApp(firebaseConfig);

    angular.module('angularAuth', ['ngRoute', 'firebase'])
            .config(config)
            .run(run)
            .factory("Auth", Auth)
            .controller("mainCtrl", mainCtrl);

    // Config
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {

      /*-- routeProvider --*/
      $routeProvider.when("/", {
        templateUrl : "/home/home.view.html",
        controller : "homeCtrl",
        controllerAs : "homeController",
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
      });

      $routeProvider.when("/login", {
        templateUrl : "login/login.view.html",
        controller : "loginCtrl",
        controllerAs : "loginController"
      });

      $routeProvider.when('/logout', {
    	   	templateUrl:'login/login.html',
    	   	controller:'loginCtrl',
    	   	controllerAs:'loginController'
        });

      $routeProvider.when("/profile", {
        templateUrl : "profile/profile.view.html",
        controller : "profileCtrl",
        controllerAs : "profileController",
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
      });

      $routeProvider.when("/new-booking", {
        templateUrl : "new-booking/new-booking.view.html",
        controller : "newBookingCtrl",
        controllerAs : "newBookingController",
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
      });

      $routeProvider.when("/bookingoversikt", {
        templateUrl : "bookingoversikt/bookingoversikt.view.html",
        controller : "bookingoversiktCtrl",
        controllerAs : "bookingoversiktController",
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
      });

      $routeProvider.otherwise({ redirectTo: '/login' });

    }

    // Run
    run.$inject = ['$rootScope', '$location', 'Auth'];
    function run($rootScope, $location, Auth) {
      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/login");
        }
      });
    }

    // Auth Factory
    Auth.$inject = ["$firebaseAuth"];
    function Auth($firebaseAuth) {
      return $firebaseAuth();
    }

    // mainCtrl controller
    mainCtrl.$inject = ["$scope", "$location", "firebase", "Auth", "FirebaseService"];
    function mainCtrl($scope, $location, firebase, Auth, FirebaseService) {

      $scope.currentUser = firebase.auth().currentUser;
      $scope.currentUserInformation = null;

        /*-- onAuthStateChanged --*/
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            $scope.currentUser = firebase.auth().currentUser;
            console.log("Singed in!");
            $scope.getCurrentUserInformation();
          } else {
            $scope.currentUser = null;
            console.log("Not singed in!");
          }
        });

      $scope.signIn = function(email, password) {
        $scope.message = null;
        $scope.error = null;

        // Create a new user
        Auth.$signInWithEmailAndPassword(email, password)
          .then(function(firebaseUser) {
            $scope.message = "Logged in with: " + firebaseUser.uid;
            $scope.currentUser = firebase.auth().currentUser;
            $scope.getCurrentUserInformation();
            $location.path("/");
          }).catch(function(error) {
            $scope.error = error;
            $scope.currentUser = null;
            $scope.currentUserInformation = null;
          });
      };

      $scope.signOut = function() {
        Auth.$signOut();
        $scope.currentUser = null;
        $scope.currentUserInformation = null;
        $scope.message = null;
        $scope.error = null;
      }

      $scope.getCurrentUserInformation = function() {
        FirebaseService.getUserInformation($scope.currentUser.uid, function(response) {
          $scope.$apply(function() {
            $scope.currentUserInformation = response.val();
          });
        });
      }


    }

})();











//
