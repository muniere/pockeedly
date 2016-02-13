var app = {};

//
// MARK: Keymap
//
(function() {
  'use strict';

  /**
   * Create a new keymap
   *
   * @param {Object}  attrs
   * @param {boolean} attrs.altKey
   * @param {boolean} attrs.ctrlKey
   * @param {boolean} attrs.metaKey
   * @param {boolean} attrs.shiftKey
   * @param {number}  attrs.keyCode
   * @constructor
   */
  var Keymap = function (attrs) {
    this.altKey = attrs.altKey;
    this.ctrlKey = attrs.ctrlKey;
    this.metaKey = attrs.metaKey;
    this.shiftKey = attrs.shiftKey;
    this.keyCode = attrs.keyCode;
  };

  /** Fields of keymap */
  Keymap.fields = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'keyCode'];

  /**
   * Create a new empty keymap
   *
   * @returns {Keymap}
   */
  Keymap.empty = function () {
    return new Keymap({
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      keyCode: 0
    });
  };

  /**
   * Judge if keymap is valid or not
   *
   * @returns {boolean}
   */
  Keymap.prototype.valid = function () {
    return /^[a-zA-Z]$/.test(String.fromCharCode(this.keyCode));
  };

  /**
   * Judge if keymap is visible or not
   *
   * @returns {boolean}
   */
  Keymap.prototype.visible = function () {
    return this.altKey || this.ctrlKey || this.metaKey || this.shiftKey || this.valid();
  };

  /**
   * Judge if this object is match with other
   *
   * @param {Keymap} other
   * @returns {boolean}
     */
  Keymap.prototype.match = function(other) {
    return this.altKey === other.altKey &&
        this.ctrlKey === other.ctrlKey &&
        this.shiftKey === other.shiftKey &&
        this.keyCode === other.keyCode;
  };

  /**
   * Convert into string.
   *
   * @returns {string}
   */
  Keymap.prototype.stringify = function() {

    var words = [];

    if (this.altKey) {
      words.push('alt');
    }
    if (this.ctrlKey) {
      words.push('ctrl');
    }
    if (this.metaKey) {
      words.push('meta');
    }
    if (this.shiftKey) {
      words.push('shift');
    }

    var char = String.fromCharCode(this.keyCode);

    if (/^[a-zA-Z]$/.test(char)) {
      words.push(char.toLowerCase());
    } else {
      words.push('');
    }

    return words.join('-');
  };

  app.Keymap = Keymap;

})();

//
// MARK: Config
//
(function() {
  'use strict';

  var Keymap = app.Keymap;

  /**
   * Create a new config instance.
   *
   * @param {Object} attrs
   * @param {Object} attrs.keymap
   * @param {string} attrs.script
   * @constructor
   */
  var Config = function(attrs) {
    this.keymap = new Keymap(attrs.keymap || {});
    this.script = attrs.script;
  };

  /** Fields of option */
  Config.fields = ['keymap', 'script'];

  /**
   * Create an empty option.
   *
   * @returns {Config}
   */
  Config.empty = function() {
    return new Config({
      keymap: Keymap.empty(),
      script: null
    });
  };

  /**
   * Get keymap string
   *
   * @returns {string}
   */
  Config.prototype.keystr = function() {
    return this.keymap.stringify();
  };

  /**
   * Judge if this option is valid or not.
   *
   * @returns {boolean}
   */
  Config.prototype.valid = function() {
    return this.keymap.valid() && !!this.script;
  };

  //
  // export
  //
  app.Config = Config;

})();

