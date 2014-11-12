'use strict';

angular.module('buzzApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Brew) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.deleteUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.brews = Brew.query();

    $scope.deleteBrew = function(brew) {
      Brew.remove({id: brew._id});
      angular.forEach($scope.brews, function (b, i) {
        if(b === brew){
          $scope.brews.splice(i, 1);
        }
      });
    };

    $scope.brew = {};

    $scope.addBrew = function() {
      $http.post('/api/brews', $scope.brew);
      $scope.brews.push($scope.brew);
      $scope.brew = {};
    };
  });
