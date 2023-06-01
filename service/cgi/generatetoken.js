
"use strict";
const dataParser = require( "../../utility/dataParser" );
function requireDataOk( data ) {
    if( data == null || data.username == null || data.password == null ) {
        return false;
    }
    return true;
}

// const crypt = (salt, text) => {
//     const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
//     const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
//     const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
//     return text
//         .split("")
//         .map(textToChars)
//         .map(applySaltToChar)
//         .map(byteHex)
//         .join("");
// };

// const decrypt = (salt, encoded) => {
//     const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
//     const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
//     return encoded
//         .match(/.{1,2}/g)
//         .map((hex) => parseInt(hex, 16))
//         .map(applySaltToChar)
//         .map((charCode) => String.fromCharCode(charCode))
//         .join("");
// };

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    if( !requireDataOk(reqData) ) {
        res.status( 400 ).json({ message : "invalid parameter." });
    }
    else {
        try {
            global.airaFaceLiteAccountDb.get( function( data ) {
                const account = data.account_list.filter( function(item, index, array) {
                    return (item.username == reqData.username && item.password == reqData.password );
                });
                if( account.length > 0 ) {
                    let now = Date.now();
                    res.status( 200 ).json({
                        message : "ok",
                        username : account[0].username,
                        permission : account[0].permission,
                        expire : now,
                        token : global.encryptAccountToToken( JSON.stringify({
                            u : account[0].username,
                            p : account[0].password,
                            t : Date.now(),
                            x : account[0].permission
                        }))
                    });
                }
                else {
                    res.status( 401 ).json({ message : "unauthorized" } );
                }
            });
        }
        catch(e) {
            res.status( 500 ).json({ message : `${e}` } );
        }
    }
}
