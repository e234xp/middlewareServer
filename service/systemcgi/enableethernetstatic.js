
"use strict";

const dataParser = require( "../../utility/dataParser" );
exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !reqData ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else require('request')( {
        url: "http://127.0.0.1:8588/system/enableethernetstatic",
        method: "POST",
        timeout: 5000,
        pool : {maxSockets: 10},
        time: true,
        headers: {
            'Content-Type': 'application/json'
        },
        json: reqData 
    }, function (error, response, body) {
        if( error ) res.status( 400 ).json( error );
        else res.send( body );
    });
    // else require('request').post( "http://127.0.0.1:8588/system/enableethernetstatic", { json : reqData }, function (error, response, body) {
    //     if( error ) res.status( 400 ).json( error );
    //     else res.send( body );
    // });
}