(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("referanseCtrl", referanseCtrl);

  referanseCtrl.$inject = ["$scope","$location", "FirebaseService", "SpotifyService"];
  function referanseCtrl($scope,$location, FirebaseService, SpotifyService) {

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
    };
	$scope.oppdaterDatabase = function(flag) {
        switch(flag){
            case "tekniske_behov":
                firebase.database().ref().child('bookinger').child($scope.booking.key).update({
			                   tekniske_behov : $scope.booking.tekniske_behov
                    });
                break;
            case "sang":
                firebase.database().ref().child('bookinger').child($scope.booking.key).update({
                         sanger : $scope.booking.sanger
                    });
                break;
        };
    };
	$scope.addTekniskBehov = function(krav) {
        if(!$scope.booking.tekniske_behov){
                $scope.booking.tekniske_behov = [];
        };
        $scope.booking.tekniske_behov.push(krav);
        $scope.oppdaterDatabase("tekniske_behov");
        $scope.tekniske_behov_form.nyttKrav = "";
	};
    $scope.removeTekniskBehov = function(key){
		    $scope.booking.tekniske_behov.splice(key,1);
		    $scope.oppdaterDatabase("tekniske_behov");
        console.log($scope.booking.tekniske_behov);
	};
    $scope.addSong = function(krav) {
        if(!$scope.booking.sanger){
            $scope.booking.sanger = [];
        };
        if($scope.sanger_form.ovingCheckbox == true){
            krav = "Skal øves på: " + krav;
            $scope.sanger_form.ovingCheckbox = false;
        }
        $scope.booking.sanger.push(krav);
        $scope.oppdaterDatabase("sang");
        $scope.sanger_form.nyttKrav = "";
	};
    $scope.removeSong = function(key){
		$scope.booking.sanger.splice(key,1);
		$scope.oppdaterDatabase("sang");
	};
    $scope.checkUrl = function(){
        var hash = $location.hash();
        $scope.searchText = hash;
    };

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato;
    }
  }
})();
