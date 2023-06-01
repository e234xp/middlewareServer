
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');
function requireDataOk( data ) {
    if( data == null ) {
        return false;
    }
    return true;
}
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

async function findGroupAndPerson( groupSettings, specifiedUuid, cb ) {
    const personList = await global.airaFaceLitePersonDb.find();
    const visitorList = await global.airaFaceLiteVisitorDb.find();
    let assignedGroupList = [];

    if( groupSettings.group_list ) {
        let groupListToReturn = groupSettings.group_list;

        if( specifiedUuid && specifiedUuid.length > 0 ) {
            groupListToReturn = groupListToReturn.filter(function(item, index, array){
                return (item.uuid === specifiedUuid );
            });
        }
        personList.forEach( person => {
            if( person.assigned_group_list != null ) {
                assignedGroupList = assignedGroupList.concat( person.assigned_group_list ).unique(); 
            }
        });
        visitorList.forEach( visitor => {
            if( visitor.assigned_group_list != null ) {
                assignedGroupList = assignedGroupList.concat( visitor.assigned_group_list ).unique();
            }
        });

        const assignedGroupObjList = [];
        assignedGroupList.forEach( groupName => {
            var group = {
                uuid: uuid(),
                name: groupName,
                remarks: '',
                fixed: true,
                no_edit: true,
                assgined_by_manager : true,
                person_list : [],
                visitor_list : [],
                create_date: Date.now()
            }
            const pl =  personList.filter(function(item, index, array){
                return ( item.assigned_group_list && item.assigned_group_list.indexOf( group.name ) != -1 );
            });
            pl.forEach( person => {
                group.person_list.push( {
                    uuid : person.uuid,
                    id : person.id,
                    name : person.name
                });
            });

            const vl =  visitorList.filter(function(item, index, array){
                return ( item.assigned_group_list && item.assigned_group_list.indexOf( group.name ) != -1 );
            });
            vl.forEach( visitor => {
                group.visitor_list.push( {
                    uuid : visitor.uuid,
                    id : visitor.id,
                    name : visitor.name
                });
            });
            assignedGroupObjList.push(group)
        });

        groupListToReturn.forEach( group => {
            group["person_list"] = [];            
            group["visitor_list"] = [];
            // 找出本群人員
            const personListInGroup =  personList.filter(function(item, index, array){
                // indexof : person 的 group_list 裡包含 要找的 group
                return (item.group_list.indexOf( group.name ) != -1);
            });
            personListInGroup.forEach( person => {
                group.person_list.push( {
                    uuid : person.uuid,
                    id : person.id,
                    name : person.name
                });
            });
            // 找出本群訪客
            const visitorListInGroup =  visitorList.filter(function(item, index, array){
                // indexof : visitor 的 group_list 裡包含 要找的 group
                return (item.group_list.indexOf( group.name ) != -1);
            });
            visitorListInGroup.forEach( visitor => {
                group.visitor_list.push( {
                    uuid : visitor.uuid,
                    id : visitor.id,
                    name : visitor.name
                });
            });
        });

        groupListToReturn = groupListToReturn.concat( assignedGroupObjList );
        if( cb ) cb( groupListToReturn );
    }
    else if( cb ) cb( [], [] );
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            global.airaFaceLiteGroupSettings.get( function( groupSettings ) {
                findGroupAndPerson( groupSettings, reqData.uuid, function( groupList ) {
                    res.status( 200 ).json( { message : "ok", group_list : groupList } );
                });
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
