(function() {
  'use strict';

  /* global app, chrome, angular */

  // TODO: define `$scope.keystr` as a computed property, not as a stored property

  var mod = angular.module('pockeedly', [
    'ui.bootstrap',
    'ui.codemirror'
  ]);

  mod.controller('OptionController', function($scope, $uibModal) {

    //
    // alias
    //
    var Config = app.Config;
    var Keymap = app.Keymap;

    //
    // values
    //
    var KeyCode = {
      TAB: 9
    };

    /**
     * Initialize scoped data and views
     */
    $scope.init = function() {

      // data
      var req = {
        func: 'load'
      };

      chrome.runtime.sendMessage(req, function(res) {
        if (res.error) {
          $scope.error({
            title: 'Failed to load options',
            message: res.error.message
          });
          return;
        }

        var config = new Config(res.data.config);
        $scope.config = config;
        $scope.keystr = config.keystr();
        $scope.$apply();
      });
    };

    /**
     * Handle keydown event
     *
     * @param {event} ev
     */
    $scope.onKeydown = function(ev) {
      var keymap = new Keymap(ev);

      // do not handle tab key
      if (keymap.keyCode === KeyCode.TAB) {
        return;
      }

      // clear for other controls
      if (!keymap.visible()) {
        $scope.config.keymap = Keymap.empty();
        $scope.keystr = $scope.config.keystr();
        return;
      }

      // update values if keymap is visible
      $scope.config.keymap = keymap;
      $scope.keystr = $scope.config.keystr();
    };

    /**
     * Handle keyup event
     */
    $scope.onKeyup = function() {
      // with valid char: ok
      if ($scope.config.keymap.valid()) {
        return;
      }

      // with no char: reset
      $scope.config.keymap = Keymap.empty();
      $scope.keystr = $scope.config.keystr();
    };

    /**
     * Save config
     */
    $scope.save = function() {
      if (!$scope.config.filled()) {
        $scope.error({
          message: 'Key and script must not be empty.'
        });
        return;
      }

      var req = {
        func: 'save',
        data: {
          config: $scope.config
        }
      };

      chrome.runtime.sendMessage(req, function(res) {
        if (res.error) {
          $scope.error({
            title: 'Failed to save options',
            message: res.error.message
          });
          return;
        }

        $scope.success({
          title: 'Options are saved successfully!!'
        });
      });
    };

    /**
     * Clear config
     */
    $scope.clear = function() {
      var modal = $scope.confirm({
        title: 'Clear configurations. Are your sure?'
      });

      modal.result.then(
        function() {
          // fulfilled
          $scope.config = Config.empty();
          $scope.keystr = $scope.config.keystr();

          var req = {
            func: 'save',
            data: {
              config: $scope.config
            }
          };

          chrome.runtime.sendMessage(req, function(res) {
            if (res.error) {
              $scope.error({
                title: 'Failed to clear options',
                message: res.error.message
              });
              return;
            }

            $scope.success({
              title: 'Options are cleared successfully!!'
            });
          });
        },
        function() {
          // rejected
        }
      );
    };

    /**
     * Show success dialog
     *
     * @param {Object=} resolve
     * @param {string=} resolve.title
     */
    $scope.confirm = function(resolve) {
      return $uibModal.open({
        templateUrl: 'alert/confirm.html',
        controller: 'ConfirmModalController',
        animation: true,
        resolve: {
          title: function() {
            return resolve.title;
          }
        }
      });
    };

    /**
     * Show success dialog
     *
     * @param {Object=} resolve
     * @param {string=} resolve.title
     * @param {string=} resolve.message
     */
    $scope.success = function(resolve) {
      return $uibModal.open({
        templateUrl: 'alert/success.html',
        controller: 'ResultModalController',
        animation: true,
        resolve: {
          title: function() {
            return resolve.title;
          },
          message: function() {
            return resolve.message;
          }
        }
      });
    };

    /**
     * Show error dialog
     *
     * @param {Object=} resolve
     * @param {string=} resolve.title
     * @param {string=} resolve.message
     */
    $scope.error = function(resolve) {
      return $uibModal.open({
        templateUrl: 'alert/error.html',
        controller: 'ResultModalController',
        animation: true,
        resolve: {
          title: function() {
            return resolve.title;
          },
          message: function() {
            return resolve.message;
          }
        }
      });
    };
  });

  mod.controller('ConfirmModalController', function($scope, $uibModalInstance, title) {

    /**
     * Resolve
     */
    $scope.title = title;

    /**
     * Close modal dialog with fulfilled
     */
    $scope.fulfill = function() {
      $uibModalInstance.close(true);
    };

    /**
     * Close modal dialog with rejected
     */
    $scope.reject = function() {
      $uibModalInstance.dismiss();
    };
  });

  mod.controller('ResultModalController', function($scope, $uibModalInstance, title, message) {

    /**
     * Resolve
     */
    $scope.title = title;
    $scope.message = message;

    /**
     * Close modal dialog
     */
    $scope.close = function() {
      $uibModalInstance.close();
    };
  });
})();
