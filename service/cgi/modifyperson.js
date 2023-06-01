
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.uuid == null ||
        data.data == null  ) {
        return false;
    }
    return true;
}

function modifyData( res, uuid, data, faceImage = "", faceFeature = "", upperFaceFeature = "" ) {
    const dataToWrite = {
        last_modify_date : Date.now()
    };
    if( data.id != null ) dataToWrite["id"] = data.id ;
    if( data.name != null ) dataToWrite["name"] = data.name ;
    if( data.card_facility_code != null ) dataToWrite["card_facility_code"] = data.card_facility_code ;
    if( data.card_number != null ) dataToWrite["card_number"] = data.card_number ;
    if( data.group_list != null ) dataToWrite["group_list"] = data.group_list ;
    if( data.display_image != null ) dataToWrite["display_image"] = data.display_image ;
    if( data.begin_date != null ) dataToWrite["begin_date"] = data.begin_date ;
    if( data.expire_date != null ) dataToWrite["expire_date"] = data.expire_date ;
    if( data.extra_info != null ) dataToWrite["extra_info"] = data.extra_info ;
    dataToWrite["as_admin"] = data.as_admin ? data.as_admin : false;
    
    if( faceImage != null ) dataToWrite["register_image"] = faceImage ;
    if( faceFeature != null ) dataToWrite["face_feature"] = faceFeature;
    if( upperFaceFeature != null ) dataToWrite["upper_face_feature"] = upperFaceFeature;

    try {
        global.airaFaceLitePersonDb.update( uuid, dataToWrite, true, function( ok ) {
            //res.status( 200 ).json( { message : ( ok ? "ok" : "person not found." ) } );
            res.status( (ok ? 200 : 400) ).json( { message : ( ok ? "ok" : "person not found." ) } );
        } );
    }
    catch(e) {
        res.status( 500 ).json({ message : `${e}` } );
    }
}

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            if( reqData.data.register_image && reqData.data.register_image.length > 0 ) {
                global.engineGenerateFaceFeature( reqData.data.register_image, function( error, faceImage, faceFeature, upperFaceFeature ){
                    if( !error ) {
                        if( faceFeature.length == 0 ) {
                            res.status( 400 ).json( { message : "face not found." } );
                        }
                        else modifyData( res, reqData.uuid, reqData.data, faceImage, faceFeature, upperFaceFeature )
                    }
                    else res.status( 500 ).json( { message : "engine error." } );
                });
            }
            else {
                if( reqData.data.register_image === "" ) {
                    modifyData( res, reqData.uuid, reqData.data, "", "", "" )
                }
                else {
                    modifyData( res, reqData.uuid, reqData.data, null, null, null )
                }
            }

            // global.airaFaceLitePersonDb.update( reqData.uuid, reqData.data, true, function( ok ) {
            //     res.status( (ok ? 200 : 400) ).json( { message : ( ok ? "ok" : "person not found." ) } );
            // } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
