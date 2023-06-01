
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
            global.airaFaceLiteSettings.set( reqData, function( ok, errorMsg ) {
                if( ok ) res.status( 200 ).json( { message : "ok" } );
                else res.status( 400 ).json( { message : errorMsg } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
