
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.db_type == null ||
        data.uuid == null ) {
        return false;
    }
    return true;
}

function getDB( dbType ) {
    switch( dbType ){
        case "visitor":
            return global.airaFaceLiteVisitorDb
     }
     return global.airaFaceLitePersonDb
}

function getFeedbackOk( dbType, list ) {
    switch( dbType ){
        case "visitor":
            return { message : "ok", visitor_list : list };
     }
     return { message : "ok", person_list : list };
}

function getFeedbackNotFound( dbType ) {
    switch( dbType ){
        case "visitor":
            return { message : "visitor not found." };
     }
     return { message : "person not found." };
}

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            getDB( reqData.db_type ).find( reqData.uuid, function( dataList ) {
                if( dataList.length > 0 ) {
                    dataList.forEach( data => {
                        if( reqData.download_register_image != true ) delete data["register_image"];
                        if( reqData.download_display_image != true ) delete data["display_image"];
                        if( reqData.download_face_feature != true ) delete data["face_feature"];
                        delete data["___id"];
                        delete data["___s"]; 
                    });
                    res.status( 200 ).json( getFeedbackOk( reqData.db_type, dataList ) );
                }
                else res.status( 400 ).json( getFeedbackNotFound( reqData.db_type ) );
            } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
