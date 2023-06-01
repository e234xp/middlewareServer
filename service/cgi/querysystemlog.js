
"use strict";
const dataParser = require( "../../utility/dataParser" );

function requireDataOk( data ) {
    if( data == null ||
        data.start_time == null ||
        data.end_time == null ||
        data.slice_shift == null ||
        data.slice_length == null ||
        data.level_list == null ) {
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
            const levelList = reqData.level_list.length > 0 ? reqData.level_list : null
            const shift = ( reqData.slice_shift != null ? reqData.slice_shift : 0 );
            const sliceLength = ( reqData.slice_length != null ? reqData.slice_length : 100 );
            global.airaTabletLiteSystemLogReader.readDb( reqData.start_time, reqData.end_time, levelList, function( resultList ) {
                let rl = [];
                if( resultList.length > 10000 ) rl = resultList.slice( 0, 10000 );
                else rl = resultList;
                res.status( 200 ).json({ message : "ok", result : {
                    total_length : rl.length,
                    slice_shift : shift,
                    slice_length : sliceLength,
                    data : rl.slice( shift, shift + sliceLength )
                }});
            });
            // else res.status( 500 ).json({ message : "no plugin" } );
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
