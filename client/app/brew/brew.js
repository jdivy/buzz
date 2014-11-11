'use strict';

angular.module('buzzApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('brews', {
                url: '/brews',
                templateUrl: 'app/brew/brew.html',
                controller: 'BrewCtrl'
            });
    });
