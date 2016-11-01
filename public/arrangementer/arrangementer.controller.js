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
      } else if(($scope.valgtSjanger != "velg") && ($scope.isValidSjanger(value.sjanger) == false)){
        return false;
      } else if ((($scope.visTidligereArrangementer != true) && (today > date))) {
        return false;
      } else if (($scope.visMineArrangementer == true) && ((value.teknikere == undefined) || (value.teknikere.indexOf($scope.currentUser.uid) == -1))) {
        return false;
      }
      return true;
    }

    $scope.isValidSjanger = function(sjangere){
      for (var element in sjangere) {
        if (sjangere[element].toLowerCase().split(" ").indexOf($scope.valgtSjanger) != -1) {
          return true;
        }
      }
      return false;
    }

    $scope.$watch('mainBookinger', function() {
      $scope.filterFunction();
    });

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato
    }

    $scope.printableDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      var months = ["JANUAR", "FEBRUAR", "MARS", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
      var days = ["SØNDAG", "MANDAG", "TIRSDAG", "ONSDAG", "TORSDAG", "FREDAG", "LØRDAG"];
      return days[dato.getDay()] + " " + dato.getDate() + ". " + months[dato.getMonth()];
    }

    $scope.updateModal = function(key, konsert) {
      $scope.modalInformation = konsert;
      $scope.modalInformation.key = key;
      if(konsert.har_rapport == true) {
        $scope.modalInformation.rapport = $scope.mainRapporter[key];
      }
      SpotifyService.getArtist(konsert.spotify_id).then(function(data) {
        $scope.modalInformation.spotifyData = data;
      })
    }

    $scope.dateHasPassed = function(booking) {
      if(booking == undefined) {
        return false;
      }
      var today = new Date();
      var date = $scope.intToDateFunction(booking.dato);
      date.setHours(parseInt(booking.tid.substring(0,2)));
      if (date < today) {
        return true;
      } else {
        return false;
      }
    }

    $scope.changePage = function(url) {
      $('.modal .close-modal').click();
      document.location.href = url;
    }

    $scope.getSceneKapasitet = function(scene) {
      if(scene == 'Storsalen') {
        return 1000;
      } else if (scene == 'Edgar') {
        return 210;
      } else if (scene == 'Klubben') {
        return 190;
      } else if (scene == 'Knaus') {
        return 100;
        console.log(190);
      }
    }

  }
})();
