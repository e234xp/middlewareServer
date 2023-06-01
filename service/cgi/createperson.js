
"use strict";
const dataParser = require( "../../utility/dataParser" );
const httpRequest = require('request');

function requireDataOk( data ) {
    if( data == null ||
        data.register_image == null ||
        data.display_image == null ||
        data.id == null ||
        data.name == null ||
        data.card_facility_code == null ||
        data.card_number == null ||
        data.group_list == null || (Array.isArray(data.group_list) == false ) ||
        data.begin_date == null ||
        data.expire_date == null ||
        data.extra_info == null ) {
        return false;
    }
    return true;
}

async function insertData( res, reqData, faceImage = "", faceFeature = "", upperFaceFeature = "" ) {
    const dataToWrite = {
        id : reqData.id,
        name : reqData.name,
        card_facility_code : reqData.card_facility_code,
        card_number : reqData.card_number,
        group_list : reqData.group_list,
        extra_info : reqData.extra_info,
        display_image : reqData.display_image,
        register_image : faceImage,
        face_feature : faceFeature,
        upper_face_feature : upperFaceFeature,
        begin_date : reqData.begin_date,
        expire_date : reqData.expire_date
    };
    dataToWrite["as_admin"] = reqData.as_admin ? reqData.as_admin : false;

    const existPerson = await global.airaFaceLitePersonDb.findByPersonId( reqData.id );
    if( existPerson && existPerson.length > 0 ) {
        res.status( 400 ).json({ message : "Id existed." });
        return;
    }
    // const foundGroupAll = dataToWrite.group_list.filter( group => {
    //     return group == "All";
    // });
    // if( !foundGroupAll ) {
    //     dataToWrite.group_list.push( "All" );
    // }

    const foundGroupAllPerson = dataToWrite.group_list.filter( group => {
        return group == "All Person";
    });
    if( foundGroupAllPerson.length == 0 ) {
        dataToWrite.group_list.push( "All Person" );
    }

    global.airaFaceLitePersonDb.insert( dataToWrite, true, function( successful, uuid ){
        if( successful ) res.status( 200 ).json( { message : "ok", uuid : uuid } );
        else res.status( 500 ).json( { message : "db error." } );
    } );
}

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            const maxAmountsOfPersons = 3000;
            global.airaFaceLitePersonDb.count( function( successful, c ){
                if( successful ) {
                    if( c < maxAmountsOfPersons ) {
                        if( reqData.register_image.length > 0 ) {
                            global.engineGenerateFaceFeature( reqData.register_image, function( error, faceImage, faceFeature, upperFaceFeature ){
                                if( !error ) {
                                    if( faceFeature.length == 0 ) {
                                        res.status( 400 ).json( { message : "face not found." } );
                                    }
                                    else insertData( res, reqData, faceImage, faceFeature, upperFaceFeature );
                                }
                                else res.status( 500 ).json( { message : "engine error." } );
                            });
                        }
                        else insertData( res, reqData )
                    } else res.status( 400 ).json( { message : "the numbers of persons in database has exceeded " + maxAmountsOfPersons + " (max)." } );
                } else res.status( 500 ).json( { message : "db error." } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
