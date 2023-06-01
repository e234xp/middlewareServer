
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.start_time == null ||
        data.end_time == null ||
        data.slice_shift == null ||
        data.slice_length == null ||
        data.with_image == null ||
        data.uuid_list == null ) {
        return false;
    }
    return true;
}

exports.call = async function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            const uuidList = reqData.uuid_list.length > 0 ? reqData.uuid_list : null
            const shift = ( reqData.slice_shift != null ? reqData.slice_shift : 0 );
            const sliceLength = ( reqData.slice_length != null ? reqData.slice_length : 100 );
            const withImage = ( reqData.with_image != null ? reqData.with_image : true );

            let resultList = [];
            if( withImage == true ) {
                resultList = await global.airaTabletLiteVisitorVerifyResultReader.readDb( reqData.start_time, reqData.end_time, uuidList );
            }
            else {
                resultList = await global.airaTabletLiteVisitorVerifyResultReader.readDbNoImage( reqData.start_time, reqData.end_time, uuidList );
            }
            res.status( 200 ).json({ message : "ok", result : {
                total_length : resultList ? resultList.length : 0,
                slice_shift : shift,
                slice_length : sliceLength,
                data : resultList ? resultList.slice( shift, shift + sliceLength ) : []
            }});

            // global.airaTabletLiteVisitorVerifyResultReader.readDb( reqData.start_time, reqData.end_time, uuidList, function( resultList ) {
            //     res.status( 200 ).json({ message : "ok", result : {
            //         total_length : resultList.length,
            //         slice_shift : shift,
            //         slice_length : sliceLength,
            //         data : resultList.slice( shift, shift + sliceLength ).filter( item => {
            //             if( withImage != true && item["face_image"] ) delete item["face_image"];
            //             return true;
            //         })
            //     }});
            // });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
