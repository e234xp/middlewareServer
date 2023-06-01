
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null || data.name == null ) {
        return false;
    }
    return true;
}

async function createGroupAndAddPerson( groupName, remarks, personUuidList, visitorUuidList, cb ) {
    const personListInDb = await global.airaFaceLitePersonDb.find();
    const visitorListInDb = await global.airaFaceLiteVisitorDb.find();
    const groupSettings = await global.airaFaceLiteGroupSettings.get();
    const groupListInDb = groupSettings.group_list ? groupSettings.group_list : [];
    const groupExisted = groupListInDb.filter(function(item, index, array){
        return (groupName === item.name );
    });
    if( groupExisted.length == 0 ) {
        try {
            const personUuidListToAddGroup = [];
            if( personUuidList != null ) personUuidList.forEach( uuid => {
                const personToAdd = personListInDb.filter(function(item, index, array) {
                    // 找出還沒有設定本 group 的 person list
                    return ((uuid === item.uuid ) && ( item.group_list.indexOf( groupName ) == -1));
                });
                personToAdd.forEach( person => {
                    personUuidListToAddGroup.push( person.uuid );
                });
            });
            const visitorUuidListToAddGroup = [];
            if( visitorUuidList != null ) visitorUuidList.forEach( uuid => {
                const visitorToAdd = visitorListInDb.filter(function(item, index, array) {
                    // 找出還沒有設定本 group 的 visitor list
                    return ((uuid === item.uuid) && (item.group_list.indexOf( groupName ) == -1));
                });
                visitorToAdd.forEach( visitor => {
                    visitorUuidListToAddGroup.push( visitor.uuid );
                });
            });

            let groupExisted = false;
            groupSettings.group_list.forEach( group => {
                if( group.name == groupName ) {
                    groupExisted = true;
                }
            });

            if( groupExisted == false ) {
                // 更新 group settings
                groupSettings.group_list.push( {
                    uuid : uuid(),
                    name : groupName,
                    remarks : remarks != null ? remarks : "",
                    create_date : Date.now(),
                    fixed : false,
                    no_edit : false
                });
                await global.airaFaceLiteGroupSettings.set( groupSettings );

                // 更新 person group
                if( personUuidListToAddGroup.length > 0 ) await global.airaFaceLitePersonDb.addGroupList( personUuidListToAddGroup, [groupName] , true );
                if( visitorUuidListToAddGroup.length > 0 ) await global.airaFaceLiteVisitorDb.addGroupList( visitorUuidListToAddGroup, [groupName] , true );
                if( cb ) cb( null );
            }
            else if( cb ) cb( "the group have already existed." );
        }
        catch(e) {
            if( cb ) cb( e.toString() );
        }
    }
    else {
        if( cb ) cb( "the group have already existed." );
    }
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            if( reqData.name.length > 0 ) {
                createGroupAndAddPerson( reqData.name, 
                    reqData.remarks ? reqData.remarks : "", 
                    reqData.person_uuid_list ? reqData.person_uuid_list : null, 
                    reqData.visitor_uuid_list ? reqData.visitor_uuid_list : null, 
                    function( error ) {
                        res.status( error == null ? 200 : 400 ).json( { message : error != null ? error : "ok"} );
                    }
                );
            }
            else res.status( 400 ).json( { message : "name cannot be empty."} );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
