
"use strict";

const dataParser = require( "../../utility/dataParser" );
const fs = require( "fs" );
const admZip = require( "adm-zip" );

function rename_or_copy_and_delete (oldPath, newPath, callback) {

    function copy_and_delete () {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);
        readStream.on('close', 
            function () {
                fs.unlink(oldPath, callback);
            }
        );
        readStream.pipe(writeStream);
    }

    fs.rename(oldPath, newPath, 
        function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy_and_delete();
                } else {
                    if( callback ) callback(err);
                }
                return;// << both cases (err/copy_and_delete)
            }
            if( callback ) callback();
        }
    );
}

exports.call = function( req, res ) {
    if( req.files ) {
        var fileKey = Object.keys(req.files)[0];
        var file = req.files[fileKey];
        if( !fs.existsSync( global.fwPath ) ) {
            fs.mkdirSync( global.fwPath );
        }
        //file.mv( global.fwFullName, err => {
        if( fs.existsSync( global.fwFullName ) ) {
            fs.unlinkSync( global.fwFullName );
        }
        fs.rename( file.tempFilePath, global.fwFullName, function(err) {
            if( err ) {
                res.send({ message : "fail"});
            } 
            else {
                require('request')( {
                    url: "http://127.0.0.1:8588/system/upgradefw",
                    method: "POST",
                    timeout: 300000,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    json: {} 
                }, function (error, response, body) {
                    //console.log( "upgradefw error", error, body );
                    res.send( { message : "ok" } );
                });

                // require('request').post( "http://127.0.0.1:8588/system/upgrade", {json : {} }, function (error, response, body) {
                //     try {
                //         res.send( { message : "ok" } );
                //     }
                //     catch(e){
                //         res.send({ message : "fail"});
                //     }
                // });
                // global.upgradeFw( function( err ){
                //     if( err == null ) res.send( { message : "ok" } );
                //     else res.send( { message : err } );
                // })
            }
        })
    } else {
        //console.log( "upgradefw no file" );
        res.send( { message : "fail" } );
    }
}