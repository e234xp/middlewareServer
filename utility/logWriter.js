'use strict';
let httpRequest = require('request');
var logWriter = function logWriter( collectionName = "system", logServerIP = "127.0.0.1", port = 10999, path = "/airafacecloud/log/writelog", timeout = 3000 ) {
    this.debugMode = false;
    this.enablelog = true;
    this.timeout = timeout;
    this.who = collectionName;
    this.hostname = logServerIP;
    this.port = port;
    this.path = path;
    this.url = 'http://' + this.hostname + ':' + this.port + this.path;
    this.call = function( self, level, where, what, code ) {
        if( self.enablelog == true ) {
            var data = JSON.stringify({
                "level": level,
                "who" : self.who,
                "what" : what,
                "when" : Date.now(),
                "where" : where,
                "code" : code
            });
            httpRequest.post( {
                url: self.url,
                headers: { 
                    "content-type": "text/plain",
                    "content-length": data.length
                },
                body : data,
                timeout: self.timeout
            }, function(error, res, body){});
        }
    };
    this.enable = function( enable ) {
        this.enablelog = enable;
    };
    this.enableDebugMessage = function( enable ) {
        this.debugMode = enable;
    };
};

logWriter.prototype.info = function( where, what, code ) { if( this.enablelog == true ) setTimeout( this.call, 0, this, "INFO", where, what, code );};
logWriter.prototype.warning = function( where, what, code ) { if( this.enablelog == true ) setTimeout( this.call, 0, this, "WARNING", where, what, code );};
logWriter.prototype.error = function( where, what, code ) { if( this.enablelog == true ) setTimeout( this.call, 0, this, "ERROR", where, what, code );};
logWriter.prototype.fatal = function( where, what, code ) {if( this.enablelog == true ) setTimeout( this.call, 0, this, "FATAL", where, what, code );};
logWriter.prototype.debug = function( where, what, code ) { if( this.debugMode == true ) {setTimeout( this.call, 0, this, "DEBUG", where, what, code );}};

module.exports = logWriter;