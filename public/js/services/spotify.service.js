'use strict';

angular.module('angularAuth')
  .service('SpotifyService', function($http, $q) {

    this.apiBase = 'https://api.spotify.com/v1';

    this.searchArtist = function(search, type) {

      var deferred = $q.defer();
      var params = {};
      params.q = search;
      params.type = type;

      $http({
        url: this.apiBase + "/search",
        method: 'GET',
        params: params,
        withCredentials: false
      })
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;

    }

  });
