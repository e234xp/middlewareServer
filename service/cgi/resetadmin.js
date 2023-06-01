
"use strict";

async function resetAdmin( cb ) {
    const accountData = await global.airaFaceLiteAccountDb.get();
    const adminAccountList = accountData.account_list.filter( function(item, index, array) {
        return (item.username == "Admin");
    });

    if( adminAccountList.length == 0 ) {
        if( cb ) {
            cb( "account not found", null );
        }
        return;
    }
    const account = adminAccountList[0];
    account["last_modify_date"] = Date.now();
    account["password"] = "123456";
    const ret = await global.airaFaceLiteAccountDb.set( accountData );
    if( cb ) cb( ret.ok ? null : ret.message );
};

exports.call = function( req, res ) {
    try {
        resetAdmin( function( error ) {
            res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
        });
    }
    catch(e) {
        res.status( 401 ).json({ message : "Unauthorized" } );
    }
}
