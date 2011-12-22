(function() {
  var AbstractDispatcher, Messanger, Response,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  AbstractDispatcher = require("../abstract/dispatcher");

  Messanger = require("./messanger");

  Response = require("./response");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    _Class.prototype._newMessanger = function(message, middleware) {
      var msgr;
      msgr = new Messanger(message, middleware, this);
      msgr.response.reader.dump(message.callback, message.headers);
      return msgr;
    };

    return _Class;

  })(AbstractDispatcher);

}).call(this);
