'use strict';

angular.module('buzzApp')
  .controller('MainCtrl', function ($scope, $http/*, socket*/) {
    $scope.awesomeBrews = [];

    $http.get('/api/brews').success(function(awesomeBrews) {
      $scope.awesomeBrews = awesomeBrews;
      //socket.syncUpdates('brew', $scope.awesomeBrews);
    });

    $scope.addBrew = function() {
      /*if ( $scope.newBrew === '' ) {
        return;
      }
      $http.post('/api/brews', { name: $scope.newBrew });
      $scope.newBrew = '';*/
    };

    $scope.deleteBrew = function( brew ) {
      $http.delete('/api/brews/' + brew._id);
    };

    $scope.$on('$destroy', function() {
      //socket.unsyncUpdates('brew');
    });

    /*$scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });*/
  });
