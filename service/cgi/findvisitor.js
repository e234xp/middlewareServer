
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.uuid == null ) {
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
            const shift = ( reqData.slice_shift != null ? reqData.slice_shift : 0 );
            const sliceLength = ( reqData.slice_length != null ? reqData.slice_length : 100 );
            global.airaFaceLiteVisitorDb.find( reqData.uuid, function(visitorList) {
                //if( visitorList.length > 0 ) {
                    res.status( 200 ).json( { 
                        message : "ok", 
                        total_length : visitorList.length,
                        slice_shift : shift,
                        slice_length : sliceLength,
                        visitor_list : visitorList.slice( shift, shift + sliceLength ).filter( item => {
                            delete item["___id"];
                            delete item["___s"]; 
                            if( reqData.download_register_image === true || reqData.download_display_image === true ) {
                                let data = global.airaFaceLitePersonDb.fetchPhoto( item.uuid );
                                if( reqData.download_register_image === true ) item["register_image"] = data.register_image;
                                if( reqData.download_display_image === true ) item["display_image"] = data.display_image;
                            }
                            if( reqData.download_face_feature != true ) {
                                delete item["face_feature"];
                            }
                            return true;
                        })
                    });
                //}
                //else res.status( 200 ).json( { message : "ok", total_length : 0, slice_shift : shift, slice_length : sliceLength, visitor_list : [] } );
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
