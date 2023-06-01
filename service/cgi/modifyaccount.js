
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null || data.username == null || 
        // data.password == null || 
        data.new_password == null ) {
        return false;
    }
    return true;
}

async function modifyAccount( tokenUser, data, cb ) {
    let usingAdmin = false;
    const accountData = await global.airaFaceLiteAccountDb.get();

    if( data.username == "Admin" && tokenUser.u != "Admin" ) {
        if( cb ) cb( "no permission", null );
        return;
    }

    const adminAccountList = accountData.account_list.filter( function(item, index, array) {
        return ((item.username == tokenUser.u) && (item.permission == "Admin") );
    });
    if( adminAccountList.length > 0 ) usingAdmin = true;

    const matchedAccountList = accountData.account_list.filter( function(item, index, array) {
        return (item.username == data.username) && (usingAdmin || tokenUser.u == data.username) ;
    });
    if( matchedAccountList.length == 0 ) {
        if( cb ) {
            if( usingAdmin ) cb( "account not found", null );
            else cb( "no permission", null );
        }
        return;
    }
    const account = matchedAccountList[0];
    // if( account.password !=  data.password ) {
    //     if( cb ) cb( "password is wrong", null );
    //     return;
    // }
    account["last_modify_date"] = Date.now();
    account["password"] = data.new_password;
    if( data.new_permission ) account["permission"] = data.new_permission;

    const ret = await global.airaFaceLiteAccountDb.set( accountData );
    if( cb ) cb( ret.ok ? null : ret.message );
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            const tokenUser = JSON.parse( global.decryptToeknToAccount( req.headers.token ) );
            if( tokenUser.u.length > 0 && reqData.username.length > 0 && reqData.new_password.length > 0 && ( tokenUser.x == "Admin" || tokenUser.u == reqData.username ) ) {
                modifyAccount( tokenUser, reqData, function( error ) {
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
