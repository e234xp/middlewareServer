'use strict';

const logWriter = require('./logWriter')

class Log {
    constructor( logDbname ) {
        this.logW = new logWriter( logDbname );
    }
    log = function( location, info ) {
        var logdata = info + `, pid : [ ${process.pid} ]`;
        console.log( location, logdata );
    }
    
    info = function( location, info ) {
        var logdata = info + `, pid : [ ${process.pid} ]`;
        this.logW.info( location, logdata, 0 );
        if( global.config.show_written_logs === true ) {
            console.log('\x1b[42m%s\x1b[0m', logdata );
            //console.log( logdata );
        }
    }
    warning = function( location, info ) {
        var logdata = info + `, pid : [ ${process.pid} ]`;
        this.logW.warning( location, logdata, 0 );
        if( global.config.show_written_logs === true ) {
            console.log('\x1b[43m%s\x1b[0m', logdata );
        }
    }
    error = function( location, info ) {
        var logdata = info + `, pid : [ ${process.pid} ]`;
        this.logW.error( location, logdata, 0 );
        if( global.config.show_written_logs === true ) {
            console.log('\x1b[41m%s\x1b[0m', logdata );
        }
    }
}

module.exports = Log; 
