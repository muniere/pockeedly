(function() {
  'use strict';

  /* global app, chrome */

  var Config = app.Config;
  var Keymap = app.Keymap;

  var self = {

    /** Cached properties */
    keymap: Keymap.empty(),

    /** Cached user script */
    script: '',

    /**
     * Initialize data
     */
    init: function() {

      // config
      var req = { func: 'load' };

      chrome.runtime.sendMessage(req, function(res) {
        if (res.error) {
          console.error(res.error);
          return;
        }

        var config = new Config(res.data.config);
        self.keymap = config.keymap;
        self.script = self.convert(config.script);
      });

      // handler
      window.addEventListener('keydown', function(ev) {
        if (!self.keymap.match(new Keymap(ev))) {
          return;
        }

        ev.preventDefault();
        ev.stopPropagation();

        var el = document.createElement('script');
        el.textContent = self.script;
        document.body.appendChild(el);
        document.body.removeChild(el);
      });
    },

    /**
     * Convert bookmarklet script into runnable javascript
     *
     * @param {string} script
     */
    convert: function(script) {

      //
      // validate
      //
      if (!/^javascript:/.test(script)) {
        console.error('Bookmarklet script must starts with string "javascript:"');
        return '';
      }

      //
      // convert
      //
      var prev = [
        'var entry = document.querySelector(".selectedEntry");',
        'if (!entry) { return; } ',
        'var entryObject = entry.querySelector("a.title");',
        'if (!entryObject) { return; } ',
        'var entryTitle  = entryObject.textContent;',
        'var entryLocation = entryObject.href;',
        'if (!entryTitle || !entryLocation) { return ; } '
      ].join('');

      var body = script.trim()
        .replace(/javascript:\(function\(\)\{(.*)\}\)\(\)/, '$1')
        .replace(/=\w+\.title/, '=entryTitle')
        .replace(/=\w+\.location.href/, '=entryLocation');

      var post = '';

      return ['(function(){', prev, body, post, '})()'].join('').trim();
    }
  };

  // run
  self.init();
})();

