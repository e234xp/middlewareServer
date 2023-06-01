
"use strict";

const dataParser = require( "../../utility/dataParser" );
const fs = require( "fs" );
const path = require( "path" );
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
        const fileName = file.name;
        //console.log("file.name", file.name )
        if( !fs.existsSync( global.importPath ) ) {
            fs.mkdirSync( global.importPath );
        }
        const targetZipFile = `${global.importPath}/${fileName}`;
        file.mv( targetZipFile, err => {
            if( err ) {
                res.send({ message : "fail"})
            } else {
                require('request')( {
                    url: "http://127.0.0.1:8588/system/unzipdb",
                    method: "POST",
                    pool : {maxSockets: 10},
                    time: true,
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    json: { filename : targetZipFile } 
                }, function (error, response, body) {
                    if( error ) res.status( 400 ).json( error );
                    else {
                        try{fs.unlinkSync( targetZipFile );}catch(e){}
                        res.send( body );
                    }
                });
            }
        });
    } else {
        fs.unlinkSync( targetZipFile )
        res.send( { message : "fail" } );
    }
}