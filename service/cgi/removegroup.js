
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null ||
        data.uuid == null ) {
        return false;
    }
    return true;
}

async function removeGroupAndPerson( groupUuid, cb ) {
    const groupSettings = await global.airaFaceLiteGroupSettings.get();
    const groupListInDb = groupSettings.group_list ? groupSettings.group_list : [];

    const groupToDelete =  groupListInDb.filter(function(item, index, array){
        return (groupUuid.indexOf( item.uuid ) != -1);
    });
    const groupLeft = {
        group_list : groupListInDb.filter(function(item, index, array){
            return (groupUuid.indexOf( item.uuid ) == -1);
        })
    }

    try {
        const nameToDelList = [];
        groupToDelete.forEach( group => {
            nameToDelList.push( group.name );
        });
        await global.airaFaceLitePersonDb.removeGroupList( null, nameToDelList, true );
        await global.airaFaceLiteVisitorDb.removeGroupList( null, nameToDelList, true );
        await global.airaFaceLiteGroupSettings.set( groupLeft );
        if( cb ) cb( null );
    }
    catch(e) {
        console.log( e );
        if( cb ) cb( e.toString() );
    }
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            removeGroupAndPerson( reqData.uuid, function( error ) {
                res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
