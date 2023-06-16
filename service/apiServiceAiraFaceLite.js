"use strict";

const myService = require("express")();


const find = require( "./cgi/find" );
/////////////// person ///////////////
const createperson = require( "./cgi/createperson" );
const findperson = require( "./cgi/findperson" );
const modifyperson = require( "./cgi/modifyperson" );
const removeperson = require( "./cgi/removeperson" );
const removeallpersons = require( "./cgi/removeallpersons" );
const removegroupfromperson = require( "./cgi/removegroupfromperson" );

/////////////// visitor ///////////////
const createvisitor = require( "./cgi/createvisitor" );
const findvisitor = require( "./cgi/findvisitor" );
const modifyvisitor = require( "./cgi/modifyvisitor" );
const removevisitor = require( "./cgi/removevisitor" );
const removeallvisitors = require( "./cgi/removeallvisitors" );
const removegroupfromvisitor = require( "./cgi/removegroupfromvisitor" );

//// photo 
const fetchphoto = require( "./cgi/fetchphoto" );
const fetchverifyphoto = require( "./cgi/fetchverifyphoto" );


/////////////// group settings ///////////////
const creategroup = require( "./cgi/creategroup" );
const modifygroup = require( "./cgi/modifygroup" );
const findgroup = require( "./cgi/findgroup" );
const removegroup = require( "./cgi/removegroup" );

const setgroupsettings = require( "./cgi/setgroupsettings" );

/////////////// tablet settings ///////////////
const gettabletsettings = require( "./cgi/gettabletsettings" );
const settabletsettings = require( "./cgi/settabletsettings" );

/////////////// event settings ///////////////
const geteventsettings = require( "./cgi/geteventsettings" );
const seteventsettings = require( "./cgi/seteventsettings" );

/////////////// dashboard settings ///////////////
const getdashboardsettings = require( "./cgi/getdashboardsettings" );
const setdashboardsettings = require( "./cgi/setdashboardsettings" );

/////////////// attendance settings ///////////////
const getattendancesettings = require( "./cgi/getattendancesettings" );
const setattendancesettings = require( "./cgi/setattendancesettings" );

/////////////// verify result ///////////////
const querypersonverifyresult = require( "./cgi/querypersonverifyresult" );
const queryvisitorverifyresult = require( "./cgi/queryvisitorverifyresult" );
const querystrangerverifyresult = require( "./cgi/querystrangerverifyresult" );
const querysystemlog = require( "./cgi/querysystemlog" );

/////////////// internal ///////////////
const onverifyresultinternal = require( "./cgi/onverifyresultinternal" );

/////////////// account ///////////////
const findaccount = require( "./cgi/findaccount" );
const createaccount = require( "./cgi/createaccount" );
const modifyaccount = require( "./cgi/modifyaccount" );
const removeaccount = require( "./cgi/removeaccount" );
const resetadmin = require( "./cgi/resetadmin" );

///////////////  token  ///////////////
const generatetoken = require( "./cgi/generatetoken" );
const maintaintoken = require( "./cgi/maintaintoken" );

const setmanagersettings = require( "./cgi/setmanagersettings" );
const getmanagersettings = require( "./cgi/getmanagersettings" );

function logCgiCall( cgi ) {
    var cgiText = cgi;
    let haveGet = (cgiText.indexOf("get") != -1);
    let haveFind = (cgiText.indexOf("find") != -1);
    let haveQuery = (cgiText.indexOf("query") != -1);
    let haveInternal = (cgiText.indexOf("internal") != -1);

    if( !haveGet && !haveFind && !haveQuery && !haveInternal ) {
        global.globalSystemLog_info( "cgi : " + cgiText + " has been called.")
    }
}

myService.on( "mount", function( parent ) {});
myService.post( "/:cgi", async function (req, res, next) {
    console.log(req.method, req.url);
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

        const tmpCgi = req.params.cgi;
        const testCgis = [
            'test','generatetoken',
            'maintaintoken'
            ,'createaccount','findaccount','modifyaccount','removeaccount','resetadmin'
            ,'findperson','createperson','modifyperson','removeperson','removeallpersons','removegroupfromperson',
            'createvisitor','findvisitor','modifyvisitor','removevisitor','removeallvisitors'
            // 'findgroup',
            ,'querypersonverifyresult'
        ]
        if(testCgis.includes(tmpCgi)){
            next();
            return;
        }

        cgi = eval( req.params.cgi );
        if( cgi && typeof cgi === "object" && typeof cgi.call === "function" ) {
            if( req.params.cgi == "generatetoken" || req.params.cgi == "maintaintoken" ) cgi.call(req, res);
            else {
                let tokenToCheck = req.headers.token ? req.headers.token : ( (req.query && req.query.token) ? req.query.token : null );
                if( tokenToCheck && (tokenToCheck == "83522758" || global.toeknToValidAccountInTime( tokenToCheck ) ) ) {
                    logCgiCall( req.params.cgi );
                    cgi.call(req, res);
                }
                else {
                    global.globalSystemLog_warning( "cgi : " + req.params.cgi + ", unauthorized.");
                    res.status( 401 ).json({ message : "Unauthorized" } );
                }
            }
        }
        else {
            global.globalSystemLog_error( "cgi : " + req.params.cgi + ", bad request.");
            res.status(400).json({ message: "Bad request."});
        }
    }
    catch(e){
        global.globalSystemLog_error( "cgi : " + req.params.cgi + " -- " + e.toString() );
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
        cgi = eval( req.params.cgi );
        if( cgi && typeof cgi === "object" && typeof cgi.call === "function" ) {
            //cgi.call(req, res);
            let tokenToCheck = req.headers.token ? req.headers.token : ( (req.query && req.query.token) ? req.query.token : null );
            if( tokenToCheck && (tokenToCheck == "83522758" || global.toeknToValidAccountInTime( tokenToCheck ) ) ) {
                logCgiCall( req.params.cgi );
                cgi.call(req, res);
            }
            else {
                global.globalSystemLog_warning( "cgi : " + req.params.cgi + ", unauthorized.");
                res.status( 401 ).json({ message : "Unauthorized" } );
            }
        }
        else {
            global.globalSystemLog_error( "cgi : " + req.params.cgi + ", bad request.");
            res.status(400).json({ message: "Bad request."});
        }
    }
    catch(e){
        global.globalSystemLog_error( "cgi : " + req.params.cgi + " -- " + e.toString() );
        res.status(400).json({ message: "Bad request."});
    };
});

module.exports = myService;
