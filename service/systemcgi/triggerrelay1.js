
"use strict";

const dataParser = require( "../../utility/dataParser" );

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !reqData ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else require('request')( {
        url: "http://127.0.0.1:8588/system/tr1",
        method: "POST",
        pool : {maxSockets: 10},
        time: true,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        },
        json: {} 
    }, function (error, response, body) {
        if( error ) res.status( 400 ).json( error );
        else {
            res.send( body );
        }
    });
}
