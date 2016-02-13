(function() {
  'use strict';

  /* global app, chrome */

  var Config = app.Config;

  var self = {

    /**
     * @callback loadCallback
     *
     * @param {object} error
     * @param {Config} config
     */

    /**
     * Load option from storage.
     * @param {loadCallback} callback
     */
    load: function (callback) {
      chrome.storage.local.get(Config.fields, function(attrs) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError, null);
          return;
        }

        var config = new Config(attrs);

        if (config.valid()) {
          callback(null, config);
        } else {
          callback(null, Config.empty());
        }
      });
    },

    /**
     * @callback saveCallback
     *
     * @param {object} error
     */

    /**
     * Save option to storage.
     *
     * @param {Config} config
     * @param {saveCallback} callback
     */
    save: function (config, callback) {
      if (!config.valid()) {
        callback({ message: 'invalid data' });
        return;
      }

      chrome.storage.local.set(config, function() {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }

        callback(null);
      });
    }
  };

  //
  // Event Listener
  //
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    switch (req.func) {
      case 'load':
        self.load(function(error, config) {
          sendResponse({
            error: error,
            data: {
              config: config
            }
          });
        });
        return true;

      case 'save':
        self.save(new Config(req.data.config), function(error) {
          sendResponse({
            error: error
          });
        });
        return true;

      default:
        return false;
    }
  });
})();
