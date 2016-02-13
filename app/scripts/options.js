(function() {
  'use strict';

  /* global app, chrome, angular, CodeMirror */

  // TODO: define `$scope.keystr` as a computed property, not as a stored property

  var mod = angular.module('pockeedly', ['ui.bootstrap']);

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

      // view
      var textarea = document.getElementById('input-script');
      var editor = CodeMirror.fromTextArea(textarea, {
        mode: 'javascript',
        lineWrapping: true
      });
      editor.on('change', function() {
        if ($scope.config) {
          $scope.config.script = editor.getValue();
        }
      });

      // data
      var req = { func: 'load' };

      chrome.runtime.sendMessage(req, function(res) {
        if (res.error) {
          $scope.error(res.error);
          return;
        }

        var config = new Config(res.data.config);

        editor.setValue(config.script);
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
    $scope.saveConfig = function() {
      var req = {
        func: 'save',
        data: {
          config: $scope.config
        }
      };

      chrome.runtime.sendMessage(req, function(res) {
        if (res.error) {
          $scope.error(res.error);
          return;
        }

        $scope.success();
      });
    };

    /**
     * Close window
     */
    $scope.closeWindow = function() {
      window.close();
    };

    /**
     * Show success dialog
     */
    $scope.success = function() {
      $uibModal.open({
        templateUrl: 'alert/success.html',
        controller: 'ModalController',
        animation: true,
        resolve: {
          error: null
        }
      });
    };

    /**
     * Show error dialog
     *
     * @param error
     */
    $scope.error = function(error) {
      $uibModal.open({
        templateUrl: 'alert/error.html',
        controller: 'ModalController',
        animation: true,
        resolve: {
          error: error
        }
      });
    };
  });

  mod.controller('ModalController', function($scope, $uibModalInstance, error) {

    /**
     * Error data if exists
     */
    $scope.error = error;

    /**
     * Close modal dialog
     */
    $scope.close = function() {
      $uibModalInstance.close();
    };
  });
})();
