
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

async function modifyGroupAndPerson( groupUuid, remarks, personUuidList, visitorUuidList, cb ) {
    const groupSettings = await global.airaFaceLiteGroupSettings.get();
    const groupListInDb = groupSettings.group_list ? groupSettings.group_list : [];
    const groupExisted = groupListInDb.filter(function(item, index, array){
        return (groupUuid === item.uuid );
    });
    if( groupExisted.length > 0 ) {
        try {
            const groupName = groupExisted[0].name;
            if( remarks != null ) {
                groupExisted[0].remarks = remarks;
                await global.airaFaceLiteGroupSettings.set( groupSettings );
            }
            if( personUuidList != null ) {
                await global.airaFaceLitePersonDb.removeGroupList( null, [groupExisted[0].name] );
                const personListInDb = await global.airaFaceLitePersonDb.find();
                const personUuidListToAddGroup = [];
                personUuidList.forEach( uuid => {
                    const personToAdd = personListInDb.filter(function(item, index, array) {
                        // 找出設定本 group 的 person list
                        return (uuid === item.uuid );
                    });
                    personToAdd.forEach( person => {
                        personUuidListToAddGroup.push( person.uuid );
                    });
                });
                // 更新 person group
                if( personUuidListToAddGroup.length > 0 ) await global.airaFaceLitePersonDb.addGroupList( personUuidListToAddGroup, [groupName] , true );
                else await global.airaFaceLitePersonDb.flush();
            }
            if( visitorUuidList != null ) {
                await global.airaFaceLiteVisitorDb.removeGroupList( null, [groupExisted[0].name] );
                const visitorListInDb = await global.airaFaceLiteVisitorDb.find();
                const visitorUuidListToAddGroup = [];
                visitorUuidList.forEach( uuid => {
                    const visitorToAdd = visitorListInDb.filter(function(item, index, array) {
                        // 找出設定本 group 的 visitor list
                        return (uuid === item.uuid);
                    });
                    visitorToAdd.forEach( visitor => {
                        visitorUuidListToAddGroup.push( visitor.uuid );
                    });
                });
                if( visitorUuidListToAddGroup.length > 0 ) await global.airaFaceLiteVisitorDb.addGroupList( visitorUuidListToAddGroup, [groupName] , true );
                else await global.airaFaceLiteVisitorDb.flush();
            }
            if( cb ) cb( null );
        }
        catch(e) {
            if( cb ) cb( e.toString() );
        }
    }
    else {
        if( cb ) cb( "group has existed." );
    }
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            modifyGroupAndPerson( reqData.uuid, 
                reqData.remarks ? reqData.remarks : null, 
                reqData.person_uuid_list ? reqData.person_uuid_list : null, 
                reqData.visitor_uuid_list ? reqData.visitor_uuid_list : null,
            function( error ) {
                res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
