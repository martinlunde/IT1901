(function () {
    "use strict";
    angular.module("angularAuth").controller("nyBookingCtrl", nyBookingCtrl);
    nyBookingCtrl.$inject = ["$scope", "SpotifyService"];

    function nyBookingCtrl($scope, SpotifyService) {
        var chosenArtist = null;
        $scope.searchForArtist = function (searchText) {
            SpotifyService.searchArtist(searchText, 'artist').then(function (data) {
                $scope.searchResult = data.artists.items;
            });
        };
        $scope.getArtistById = function (artistID) {
            SpotifyService.getArtist(artistID).then(function (data) {
                console.log(data);
            });
        };
        $scope.updateFormData = function (band) {
            $scope.formData = band;
            //$scope.suggestedPrice();
        };
        $scope.emptyFormData = function () {
            $scope.formData = {};
            console.log("Empty");
        };
        $scope.convertToTwoNumbers = function (number) {
            if (number < 10) {
                number = "0" + number
            }
            return number
        };
        $scope.suggestedPrice = function () {
            var followers = $scope.formData.followers.total;
            var bandRatingPercent = $scope.formData.popularity/100;
            var extraCostNonMember = 50;
            var sceneCapacity = [1000,210,190,100]; //[SS, Edgar, Klubben, Knaus]

            var integerFollowers = followers.toString().length;
            var bandCost = Math.round(followers/Math.pow(10,integerFollowers-2))*Math.pow(10,integerFollowers-2); // Setter forslag til bookingpris til avrundet antall folgere
            if (bandCost<15000){bandCost = 15000;} // Setter minste bookingpris til 15k

            var scene = $scope.bookingForm.scene.$modelValue;
            switch (scene){
                case "Storsalen":
                    var sceneNr = 0;
                    break;
                case "Edgar":
                    var sceneNr = 1;
                    break;
                case "Klubben":
                    var sceneNr = 2;
                    break;
                case "Knaus":
                    var sceneNr = 3;
                    break;}
            var estimatedAudience = sceneCapacity[sceneNr]*bandRatingPercent;
            var estimatedMemberPrice = Math.ceil((bandCost/estimatedAudience)/10)*10;

            if(estimatedMemberPrice<100){estimatedMemberPrice += 100;}// Setter billettprisen til minst hundre hvis estimert er under hundre

            var estimatedNonMember = 0.2; // Random antall ikke-medlemmer for a regne ut profitt
            $scope.booking.billettpris_medlem = estimatedMemberPrice;
            $scope.booking.billettpris_ikke_medlem = $scope.booking.billettpris_medlem+extraCostNonMember;
            $scope.booking.kostnad = bandCost;

            $scope.booking.profitt = Math.round((estimatedAudience*(1-estimatedNonMember)*$scope.booking.billettpris_medlem)+(estimatedAudience*estimatedNonMember*$scope.booking.billettpris_ikke_medlem)-bandCost);

            // Sjekker om det er for dyrt
            var maxPrice = 600; // Maksimal pris man vil betale for en kosert
            if($scope.booking.billettpris_medlem>maxPrice){
                $scope.booking.tooExpensive = true;
               }else{$scope.booking.tooExpensive = false;}
        };
        $scope.checkDate = function () {
            var today = new Date();
            if ($scope.booking.dato < today){
                $scope.booking.pastDate = true;
               }else{$scope.booking.pastDate = false;}
        };
        $scope.sendBooking = function (booking) {
            // Fikser dato-objektet
            var year = booking.dato.getFullYear();
            var month = $scope.convertToTwoNumbers(booking.dato.getMonth() + 1);
            var day = $scope.convertToTwoNumbers(booking.dato.getDate());
            var tid = String(year) + String(month) + String(day);
            tid = parseInt(tid);
            // Oppretter en key for bookingen
            var newPostKey = firebase.database().ref().child('bookinger').push().key;
            // Lager objektet og sender det inn til Firebase
            firebase.database().ref().child('bookinger').child(newPostKey).set({
                aldersgrense: booking.aldersgrense
                , artist: $scope.formData.name
                , bookingansvarlig: firebase.auth().currentUser.uid
                , dato: tid
                , har_rapport: false
                , kostnad: booking.kostnad
                , pris_ikke_medlem: booking.billettpris_ikke_medlem
                , pris_medlem: booking.billettpris_medlem
                , scene: booking.scene
                , sjanger: $scope.formData.genres
                , spotify_id: $scope.formData.id
                , status: "ubesvart"
                , tid: booking.tid
            });
            // Endrer variabelen til å vise tilbakemelding
            $scope.skjema_sendt = true;
            // Tilbakestiller skjemainnhold
            $scope.resetBookingForm();
        };
        $scope.resetBookingForm = function () {
            $scope.booking = {};
        };
        $scope.updaterBooking = function (bookingId, nyStatus) {
            firebase.database().ref().child('bookinger').child(bookingId).update({
                status: nyStatus
            });
        };
        /*
            $scope.searchForArtist = function(searchText) {
              FirebaseService.searchForArtist(searchText).then(function (data) {
                $scope.searchResult = JSON.stringify(data, null, " ");
              });
            }
        */
    }
})();
