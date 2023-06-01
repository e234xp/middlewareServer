
"use strict";
const dataParser = require( "../../utility/dataParser" );
const { uuid } = require('uuidv4');

function requireDataOk( data ) {
    if( data == null ||
        data.group_list == null ) {
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
            const list = [];
            reqData.group_list.forEach( group => {
                list.push({
                    uuid : ( group["uuid"] != null ? group["uuid"] : uuid() ),
                    name : group.name,
                    remarks : group.remarks,
                    fixed : group.fixed != null ? group.fixed : false,
                    create_date : group.create_date != null ? group.create_date : Date.now(),
                });
            });
            global.airaFaceLiteGroupSettings.set( { group_list : list }, function( ok, errorMsg ) {
                if( ok ) res.status( 200 ).json( { message : "ok" } );
                else res.status( 400 ).json( { message : errorMsg } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
