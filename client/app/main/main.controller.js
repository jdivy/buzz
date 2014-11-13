'use strict';

angular.module('buzzApp')
  .controller('MainCtrl', function ($scope, $interval, $http/*, socket*/) {
    $scope.nextBrew = {};

    $http.get('/api/brews/next').success(function(brew) {
      $scope.nextBrew = brew;
    });

    //$scope.$on('$destroy', function() {
    //  socket.unsyncUpdates('brew');
    //});

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
