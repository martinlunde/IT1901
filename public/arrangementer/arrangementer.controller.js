(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("arrangementerCtrl", arrangementerCtrl);

  arrangementerCtrl.$inject = ["$scope", "FirebaseService", "SpotifyService"];
  function arrangementerCtrl($scope, FirebaseService, SpotifyService) {

    $scope.valgtSjanger = "velg";
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
      var today = new Date();
      var date = $scope.intToDateFunction(value.dato);
      date.setHours(parseInt(value.tid.substring(0,2)));
      if(value.status != 'aktiv') {
        return false;
      } else if (($scope.searchingString != undefined) && (value.artist.toLowerCase().indexOf($scope.searchingString.toLowerCase()) == -1)){
        return false;
      } else if ((value.scene != $scope.valgtScene && $scope.valgtScene != "velg")) {
        return false;
      } else if((value.sjanger.indexOf($scope.valgtSjanger) == -1) && ($scope.valgtSjanger != "velg")) {
        return false;
      } else if ((($scope.visTidligereArrangementer != true) && (today > date))) {
        return false;
      }
      return true;
    }

    $scope.$watch('mainBookinger', function() {
      $scope.filterFunction();
    });

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato;
    }

    $scope.updateModal = function(key, konsert) {
      $scope.modalInformation = konsert;
      if($scope.hasRapport == true) {
        $scope.modalInformation.rapport = $scope.mainRapporter[key];
      }
      SpotifyService.getArtist(konsert.spotify_id).then(function(data) {
        $scope.modalInformation.spotifyData = data;
      })
      console.log($scope.modalInformation);
    }

    $scope.hasRapportFunction = function(key) {
      if(key in $scope.mainRapporter) {
        $scope.hasRapport = true;
      } else {
        $scope.hasRapport = false;
      }
    }


  }
})();
