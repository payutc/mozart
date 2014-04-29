var mozartApp =  angular.module('mozartApp', ['LocalStorageModule', 'ui.bootstrap'], function($locationProvider) {
      $locationProvider.html5Mode(true);
    });
