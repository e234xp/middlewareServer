
"use strict";
const dataParser = require( "../../utility/dataParser" );
function requireDataOk( data ) {
    if( data == null || data.token == null ) {
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
            const validAccountData = global.toeknToValidAccountInTime( reqData.token );
            if( validAccountData ) {
                global.airaFaceLiteAccountDb.get( function( data ) {
                    const account = data.account_list.filter( function(item, index, array) {
                        return (item.username == validAccountData.u && item.password == validAccountData.p);
                    });
                    if( account.length > 0 ) {
                        let now = Date.now();
                        const tokenData = {
                            u : account[0].username,
                            p : account[0].password,
                            t : now,
                            x : account[0].permission
                        };
                        //console.log( tokenData, global.encryptAccountToToken( JSON.stringify(tokenData) ) );
                        res.status( 200 ).json({
                            message : "ok",
                            username : account[0].username,
                            permission : account[0].permission,
                            expire : now,
                            token : global.encryptAccountToToken( JSON.stringify(tokenData) )
                        });
                    }
                    else {
                        res.status( 401 ).json({ message : "unauthorized" } );
                    }
                });
            }
            else res.status( 408 ).json({ message : "token has expired" } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
