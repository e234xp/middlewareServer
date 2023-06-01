
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
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
            global.airaFaceLiteAccountDb.get( function( data ){
                let dataToReturn = data ? data.account_list : [];
                if( req.headers.token ) {
                    const tokenUser = JSON.parse( global.decryptToeknToAccount( req.headers.token ) );
                    if( tokenUser.x != "Admin" ) {
                        dataToReturn = dataToReturn.filter( d => {
                            return tokenUser.u == d.username;
                        });
                    }
                }
                res.status( 200 ).json({ message : "ok", account_list : dataToReturn } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
