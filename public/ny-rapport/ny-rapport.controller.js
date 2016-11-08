(function () {
  "use strict";

  angular.module("angularAuth")
  .controller("nyRapportCtrl", nyRapportCtrl);

  nyRapportCtrl.$inject = ["$scope", "SpotifyService"];
  function nyRapportCtrl($scope, SpotifyService) {

    $scope.filterFunction = function() {
      var bookings = $scope.mainBookingerUsortert;
      var filtrertList = new Object();
      angular.forEach(bookings, function(value,key) {
        if($scope.isValidFilter(value)) {
            filtrertList[key] = value;
            SpotifyService.getArtist(value.spotify_id).then(function(data) {
                    filtrertList[key].imgUrl = data.images[0].url;
                  });
            }
      });
      $scope.filtrertListe = filtrertList;
    }

    $scope.isValidFilter = function(value) {
      var today = new Date();
      var date = $scope.intToDateFunction(value.dato);
      date.setHours(parseInt(value.tid.substring(0,2)));
      if(value.status != 'aktiv') {
        return false;
      } else if (value.har_rapport == true) {
        return false;
      } else if (($scope.searchingString != undefined) && (value.artist.toLowerCase().indexOf($scope.searchingString.toLowerCase()) == -1)){
        return false;
      } else if (today < date) {
        return false;
      }
      return true;
    }

    $scope.sendBooking = function () {
      if ($scope.formData.hasOwnProperty("kommentar") == false) {
        $scope.formData.kommentar = "";
      }
      firebase.database().ref().child('konsertrapporter').child($scope.formData.key).set({
        profitt : $scope.formData.profitt,
        solgte_billetter_medlem : $scope.formData.solgte_billetter_medlem,
        solgte_billetter_ikke_medlem : $scope.formData.solgte_billetter_ikke_medlem,
        status : "ubesvart",
        tilleggskostnader : $scope.formData.tilleggskostnader,
        kommentar : $scope.formData.kommentar
      });
      firebase.database().ref().child('bookinger').child($scope.formData.key).update({
        har_rapport : true
      });
      $scope.skjema_sendt = true;
      $scope.emptyFormData();
    }

    $scope.emptyFormData = function() {
      $scope.formData = {}
    }

    $scope.$watch('mainBookingerUsortert', function() {
      $scope.filterFunction();
    });

    $scope.updateFormData = function(key, booking) {
      $scope.formData = JSON.parse(JSON.stringify(booking));
      $scope.formData.key = key;
    }

    $scope.intToDateFunction = function(tall) {
      tall = String(tall);
      var dato = new Date(tall.substring(0,4) + "/" + tall.substring(4,6) + '/' + tall.substring(6,8));
      return dato;
    }


  }
})();
