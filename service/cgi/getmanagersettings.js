
"use strict";
const dataParser = require( "../../utility/dataParser" );
function requireDataOk( data ) {
    if( data == null ) {
        return false;
    }
    return true;
}

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            global.airaFaceLiteManagerSettings.get( function( lastSettings ) {
                var settings = {
                    manager_enable : lastSettings.manager_enable,
                    manager_host : lastSettings.manager_host,
                    manager_port : lastSettings.manager_port
                };
                res.status( 200 ).json( { message : "ok", settings } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
