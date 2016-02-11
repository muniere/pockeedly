(function() {
  'use strict';

  /* global angular */

  angular.module('scm', [])
    .controller('RootController', function($scope) {
      $scope.shortcuts = [
        {
          key: 'ctrl+c',
          name: 'ccopycopycopycopycopycopycopyopy',
          script: 'console.log("copy");',
          patterns: ''
        },
        {
          key: 'ctrl+v',
          name: 'paste',
          script: 'console.log("paste");',
          patterns: ''
        }
      ];

      $scope.shortcut = $scope.shortcuts[0];

      $scope.activate = function(index) {
        $scope.shortcut = $scope.shortcuts[index];
      };

      $scope.save = function(index) {
        console.log('Save pref at index ' + index);
      };

      $scope.remove = function(index) {
        console.log('Remove pref at index ' + index);
      };
    });
})();
