(function() {
  var Reader, Response, ResponseReader, Writer, _,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Writer = require("../io/writer");

  Reader = require("../io/reader");

  _ = require("underscore");

  ResponseReader = (function(_super) {

    __extends(ResponseReader, _super);

    function ResponseReader() {
      ResponseReader.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ResponseReader.prototype._listenTo = function() {
      return ResponseReader.__super__._listenTo.call(this).concat("headers");
    };

    /*
    */

    ResponseReader.prototype._listen = function() {
      var _this = this;
      ResponseReader.__super__._listen.call(this);
      return this.on("headers", function(headers) {
        return _this.headers = headers;
      });
    };

    ResponseReader.prototype._dumpCached = function(pipedReader) {
      if (this.headers) pipedReader.emit("headers", this.headers);
      return ResponseReader.__super__._dumpCached.call(this, pipedReader);
    };

    return ResponseReader;

  })(Reader);

  module.exports = Response = (function(_super) {

    __extends(Response, _super);

    /*
    */

    function Response() {
      Response.__super__.constructor.call(this);
      this._headers = {};
    }

    /*
    */

    Response.prototype.headers = function(typeOrObj, value) {
      if (typeof typeOrObj === "object") {
        return _.extend(this._headers(typeOrObj));
      } else {
        return this._headers[typeOfObj] = value;
      }
    };

    /*
    */

    Response.prototype.write = function(chunk, encoding) {
      if (encoding == null) encoding = "utf8";
      this.sendHeaders();
      return Response.__super__.write.call(this, chunk, encoding);
    };

    /*
    */

    Response.prototype.end = function(chunk, encoding) {
      if (encoding == null) encoding = "utf8";
      this.sendHeaders();
      return Response.__super__.end.call(this, chunk, encoding);
    };

    /*
    */

    Response.prototype.sendHeaders = function() {
      if (this.sentHeaders) return this;
      this.sentHeaders = true;
      this.emit("headers", this._headers);
      return this;
    };

    /*
    */

    Response.prototype.reader = function() {
      return new ResponseReader(this);
    };

    return Response;

  })(Writer);

  Writer.prototype.writable = true;

}).call(this);