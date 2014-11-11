/**
 * The Brew service/$resource used to interact RESTfully
 * with the backend.
 *
 * see https://docs.angularjs.org/api/ngResource/service/$resource
 */
'use strict';

angular.module('buzzApp')
  .factory('Brew', function ($resource) {
    return $resource('/api/brews/:id', {
        id: '@_id'
      },
      {
        next: {
          method: 'GET',
          params: {
            id: 'next'
          }
        }
      });
  });
