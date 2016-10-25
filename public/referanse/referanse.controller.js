(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("referanseCtrl", referanseCtrl);

  referanseCtrl.$inject = ["$scope", "FirebaseService", "SpotifyService"];
  function referanseCtrl($scope, FirebaseService, SpotifyService) {

    $scope.findBooking = function() {
      if($scope.searchText in $scope.mainBookingerUsortert && $scope.mainBookingerUsortert[$scope.searchText].status == 'aktiv') {
        $scope.booking = JSON.parse(JSON.stringify($scope.mainBookingerUsortert[$scope.searchText]));
		$scope.booking.key = $scope.searchText
        SpotifyService.getArtist($scope.booking.spotify_id).then(function(data) {
                $scope.booking.imgUrl = data.images[0].url;
              });
        console.log($scope.booking);
        $scope.showBooking = true;
      } else {
        $scope.objectNotFound = true;
      }
    }

    $scope.resetBooking = function() {
      $scope.showBooking = false;
      $scope.booking = {};
      $scope.searchText = "";
    }
	
	$scope.oppdaterDatabase = function() {
		console.log("Oppdaterer: " + $scope.booking.key);
		firebase.database().ref().child('bookinger').child($scope.booking.key).update({
			tekniske_behov : $scope.booking.tekniske_behov
		  });
	}
	
	$scope.addTekniskBehov = function(krav) {
		$scope.booking.tekniske_behov.push(krav);
		$scope.oppdaterDatabase();
	}
	
	$scope.removeTekniskBehov = function(key){
		$scope.booking.tekniske_behov.pop(key);
		console.log(key)
		$scope.oppdaterDatabase();
	}

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato;
    }

    $scope.logFunction = function() {
      console.log($scope.booking.tekniske_behov);
    }

  }
})();
