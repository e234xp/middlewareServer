
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.f == null ||
        data.uuid == null ) {
        return false;
    }
    return true;
}

exports.call = async function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    try {
        let faceImage = "";
        switch( reqData.f.charAt(0) ) {
            case "p" : {
                faceImage = await global.airaTabletLitePersonVerifyResultReader.readVerifyPhoto( reqData.f, reqData.uuid );
            } break;
            case "v" : {
                faceImage = await global.airaTabletLiteVisitorVerifyResultReader.readVerifyPhoto( reqData.f, reqData.uuid );
            } break;
            case "n" : {
                faceImage = await global.airaTabletLiteNonVerifyResultReader.readVerifyPhoto( reqData.f, reqData.uuid );
            } break;
        }
        if( faceImage.length > 0 ) res.status( 200 ).json( { face_image : faceImage } );
        else res.status( 404 ).json( {} );
    }
    catch(e) {
        res.status( 500 ).json({ message : `${e}` } );
    }
}
