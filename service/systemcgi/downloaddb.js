
"use strict";

const dataParser = require( "../../utility/dataParser" );
const fs = require( "fs" );
// const admZip = require( "adm-zip" );

// exports.call = function( req, res ) {
//     let now = new Date();
//     var to_zip = fs.readdirSync( global.dbPath )
//     var zp = new admZip();
  
//     for( let k = 0 ; k < to_zip.length ; k++ ) {
//         zp.addLocalFile( global.dbPath + "/" + to_zip[k] );
//     }
//     zp.addZipComment("airadbfile");
//     const file_after_download = "airafacelitedb-" + now.getFullYear() + "-" + (now.getMonth() + 1 ) + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + ".dbf";
//     const data = zp.toBuffer();
//     res.set( "Content-Type", "application/octet-stream" );
//     res.set( "Content-Disposition", `attachment; filename=${file_after_download}` );
//     res.set( "Content-Length", data.length );
//     res.send( data );
// }

const path = require( "path" );

let isDownloading = false;
function removeDbFile() {
    try {fs.unlink( dbname );}
    catch(e){}
}
exports.call = function( req, res ) {
    if( isDownloading ) {
        try{res.status( 400 ).json( {message : "in use."} )}catch(e){};
        return;
    }
    isDownloading = true;
    const now = new Date();
    const file_after_download = "airafacelitedb-" + now.getFullYear() + "-" + (now.getMonth() + 1 ) + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + ".dbf";
    try {
        res.download( global.dbBackupFileName, file_after_download ,function (err) {
            //removeDbFile();
            if( err ) {
                res.sendStatus(404);
            }
            isDownloading = false;
        });
    }
    catch(e) {
        //removeDbFile();
        isDownloading = false;
    }
}

/*
var Http = require('http');
var Archiver = require('archiver');

Http.createServer(function (request, response) {
    // Tell the browser that this is a zip file.
    response.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=myFile.zip'
    });

    var zip = Archiver('zip');

    // Send the file to the page output.
    zip.pipe(response);

    // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
    zip.append('Some text to go in file 1.', { name: '1.txt' })
        .append('Some text to go in file 2. I go in a folder!', { name: 'somefolder/2.txt' })
        .file('staticFiles/3.txt', { name: '3.txt' })
        .finalize();

}).listen(process.env.PORT);
*/