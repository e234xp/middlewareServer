
"use strict";
const dataParser = require( "../../utility/dataParser" );

const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
};

function requireDataOk( data ) {
    if( data == null ||
        data.manager_enable == null ||
        data.manager_host == null ||
        data.manager_port == null
        ) {
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
            global.airaFaceLiteManagerSettings.get( function( lastSettings ) {
                var newSettings = {
                    manager_enable : reqData.manager_enable,
                    manager_host : reqData.manager_host,
                    manager_port : reqData.manager_port,
                    manager_token_key : reqData.manager_token_key ? reqData.manager_token_key : "aira83522758"
                };
                //console.log( "airaFaceLiteManagerSettings.get ", lastSettings, newSettings );
                let needReset = (JSON.stringify(lastSettings) != JSON.stringify(newSettings));
                global.airaFaceLiteManagerSettings.set( newSettings, async function( ok, errorMsg ) {
                    //console.log( "airaFaceLiteManagerSettings.set ", ok, errorMsg, needReset );
                    if( ok ) {
                        res.status( 200 ).json( { message : "ok" } );
                        if( needReset ) {
                            await global.airaFaceLitePersonDb.removeAllNow();
                            await global.airaTabletLitePersonVerifyResultReader.removeAllNow();
                            await global.airaTabletLiteVisitorVerifyResultReader.removeAllNow();
                            await global.airaTabletLiteNonVerifyResultReader.removeAllNow();
                            require('request')( {
                                url: "http://127.0.0.1:8588/system/restartapp",
                                method: "POST",
                                pool : {maxSockets: 10},
                                time: true,
                                timeout: 5000,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                json: reqData 
                            }, function (error, response, body) {
                            });
                        }
                    }
                    else res.status( 400 ).json( { message : errorMsg } );
                });
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
