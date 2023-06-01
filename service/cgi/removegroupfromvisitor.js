
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.uuid == null ||
        data.group_list == null
    ) {
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
            global.airaFaceLiteVisitorDb.removeGroupList( reqData.uuid, reqData.group_list, true, function( ok ) {
                //res.status( 200 ).json( { message : ( ok ? "ok" : "visitor not found." ) } );
                res.status( (ok ? 200 : 400) ).json( { message : ( ok ? "ok" : "visitor not found." ) } );
            } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
