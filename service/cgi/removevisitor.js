
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.uuid == null ) {
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
            global.airaFaceLiteVisitorDb.remove( reqData.uuid, true, function( ok ) {
                res.status( (ok ? 200 : 400) ).json( { message : ( ok ? "ok" : "visitor not found." ) } );
                //res.status( 200 ).json( { message : ( ok ? "ok" : "visitor not found." ) } );
            } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
