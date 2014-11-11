'use strict';

angular.module('buzzApp')
    .controller('BrewCtrl', function ($scope, $http, Brew) {
        $scope.brews = Brew.query();
    });