
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null || data.username == null || data.password == null || data.permission == null ) {
        return false;
    }
    return true;
}

async function createAccount( tokenUser, data, cb ) {
    const accountData = await global.airaFaceLiteAccountDb.get();
    const adminAccountList = accountData.account_list.filter( function(item, index, array) {
        return ((item.username == tokenUser.u) && (item.permission == "Admin") );
    });
    if( adminAccountList.length > 0 ) {
        // const adminAccount = adminAccountList[0];
        const matchedAccountList = accountData.account_list.filter( function(item, index, array) {
            return (item.username == data.username );
        });
        if( matchedAccountList.length > 0 ) {
            if( cb ) cb( "account has already existed", null );
            return;
        }

        accountData.account_list.push({
            uuid : uuid(),
            username : data.username,
            password : data.password,
            permission : data.permission,
            remarks : data.remarks ? data.remarks : "",
            fixed : false,
            create_date : Date.now(),
            last_modify_date : Date.now()
        });
        const ret = await global.airaFaceLiteAccountDb.set( accountData );
        if( cb ) cb( ret.ok ? null : ret.message );
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
            if( tokenUser.u.length > 0 && reqData.username.length > 0 && reqData.password.length > 0 && reqData.permission.length > 0 ) {
                createAccount( tokenUser, reqData, function( error ) {
                    res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
                });
            }
            else res.status( 400 ).json( { message : "username or password cannot be empty."} );
        }
        catch(e) {
            res.status( 401 ).json({ message : "Unauthorized" } );
        }
    }
}
