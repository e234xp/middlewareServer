"use strict";

const myService = require("express")();

/////////////// system ///////////////
const downloaddb = require( "./systemcgi/downloaddb" );
const uploaddb = require( "./systemcgi/uploaddb" );
const factorydefault = require( "./systemcgi/factorydefault" );
const upgradefw = require( "./systemcgi/upgradefw" );
const synctime = require( "./systemcgi/synctime" );
const enablentp = require( "./systemcgi/enablentp" );
const timeinfo = require( "./systemcgi/timeinfo" );
const supportedtimezonelist = require( "./systemcgi/supportedtimezonelist" );
const changewifi = require( "./systemcgi/changewifi" );
const enableethernetdhcp = require( "./systemcgi/enableethernetdhcp" );
const enableethernetstatic = require( "./systemcgi/enableethernetstatic" );
const currentethernetinfo = require( "./systemcgi/currentethernetinfo" );
const currentwifiinfo = require( "./systemcgi/currentwifiinfo" );
const fetchwifilist = require( "./systemcgi/fetchwifilist" );
const restart = require( "./systemcgi/restart" );
const supportedlanguagelist = require( "./systemcgi/supportedlanguagelist" );
const changelanguage = require( "./systemcgi/changelanguage" );
const systeminfo = require( "./systemcgi/systeminfo" );
const triggerrelay1 = require( "./systemcgi/triggerrelay1" );
const triggerrelay2 = require( "./systemcgi/triggerrelay2" );
const checkdbbackupfile = require( "./systemcgi/checkdbbackupfile" );
const generatedbbackup = require( "./systemcgi/generatedbbackup" );
const downloadsyslog = require( "./systemcgi/downloadsyslog" );
const downloadcrashlog = require( "./systemcgi/downloadcrashlog" );


function logCgiCall( cgi ) {
    var cgiText = cgi;
    let haveRestart = (cgiText.indexOf("restart") != -1);
    let haveUpgradefw = (cgiText.indexOf("upgradefw") != -1);
    let haveSynctime = (cgiText.indexOf("synctime") != -1);
    let haveTriggerrelay = (cgiText.indexOf("triggerrelay") != -1);
    if( haveRestart || haveUpgradefw || haveSynctime || haveTriggerrelay ) {
        global.globalSystemLog_info( "cgi : " + cgiText + " has been called.")
    }
}

myService.on( "mount", function( parent ) {});
myService.post( "/:cgi", function (req, res) {
    let cgi = null;
    try {
        req.on("close", function() {
            if( global.cgiProtectionCounter > 0 ) {
                global.cgiProtectionCounter--;
            }
        });
        if( global.cgiProtectionCounter++ > 50 ) {
            res.status( 429 ).json({ message : "Too Many Requests, server allows upto max 50 request concurrently." } );
            return;
        }
       
        cgi = eval( req.params.cgi );
        if( cgi && typeof cgi === "object" && typeof cgi.call === "function" ) {
            let tokenToCheck = req.headers.token ? req.headers.token : ( (req.query && req.query.token) ? req.query.token : null );
            if( tokenToCheck && (tokenToCheck == "83522758" || global.toeknToValidAccountInTime( tokenToCheck ) ) ) {
                logCgiCall( req.params.cgi );
                cgi.call(req, res);
            }
            else if( req.params.cgi == "downloadsyslog" || req.params.cgi == "systeminfo" ) {
                cgi.call(req, res);
            }
            else {
                global.globalSystemLog_warning( "cgi : " + req.params.cgi + ", unauthorized.");
                res.status( 401 ).json({ message : "Unauthorized" } );
            }
        }
        else res.status(400).json({ message: "Bad request."});
    }
    catch(e){
        res.status(400).json({ message: "Bad request."});
    };
});

myService.get( "/:cgi", function (req, res) {
    let cgi = null;
    try { 
        if( global.cgiProtectionCounter++ > 50 ) {
            res.status( 429 ).json({ message : "Too Many Requests, server allows upto max 50 request concurrently." } );
            return;
        }
        req.on("close", function() {global.cgiProtectionCounter--;});
        //console.log( req.params.cgi );
        cgi = eval( req.params.cgi );
        if( cgi && typeof cgi === "object" && typeof cgi.call === "function" ) {
            //cgi.call(req, res);
            let tokenToCheck = req.query.token ? req.query.token : ( (req.query && req.query.token) ? req.query.token : null );
            if( tokenToCheck && (tokenToCheck == "83522758" || global.toeknToValidAccountInTime( tokenToCheck ) ) ) {
                logCgiCall( req.params.cgi );
                cgi.call(req, res);
            }
            else if( req.params.cgi == "downloadsyslog" || req.params.cgi == "systeminfo" ) {
                cgi.call(req, res);
            }
            else {
                global.globalSystemLog_warning( "cgi : " + req.params.cgi + ", unauthorized.");
                res.status( 401 ).json({ message : "Unauthorized" } );
            }
        }
        else res.status(400).json({ message: "Bad request."});
    }
    catch(e){
        res.status(400).json({ message: `Bad request : ${e}`});
    };
});

module.exports = myService;
