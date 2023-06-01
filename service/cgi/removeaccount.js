
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null || data.account_uuid_list == null ) {
        return false;
    }
    return true;
}

async function removeAccount( tokenUser, data, cb ) {
    const accountData = await global.airaFaceLiteAccountDb.get();
    const adminAccountList = accountData.account_list.filter( function(item, index, array) {
        return ((item.username == tokenUser.u) && (item.permission == "Admin") );
    });
    if( adminAccountList.length > 0 ) {
        // const adminAccount = adminAccountList[0];
        const leftAccountList = accountData.account_list.filter( function(item, index, array) {
            const listFound = data.account_uuid_list.filter( u => { return u == item.uuid; } );
            return (listFound.length == 0) || (item.fixed == true);
        });
        if( leftAccountList.length != accountData.account_list.length ) {
            const ret = await global.airaFaceLiteAccountDb.set( { account_list : leftAccountList } );
            if( cb ) cb( ret.ok ? null : ret.message );
        }
        else {
            if( cb ) cb( "account not found", null );
        }
    }
    else {
        if( cb ) cb( "no permission", null );
    }
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            const tokenUser = JSON.parse( global.decryptToeknToAccount( req.headers.token ) );
            if( tokenUser.u.length > 0 && reqData.account_uuid_list.length > 0 ) {
                removeAccount( tokenUser, reqData, function( error ) {
                    res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
                });
            }
            else res.status( 400 ).json( { message : "username cannot be empty."} );
        }
        catch(e) {
            res.status( 401 ).json({ message : "Unauthorized" } );
        }
    }
}
