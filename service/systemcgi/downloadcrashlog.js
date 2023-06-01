
"use strict";

const lastsyslogname = "/data/user/0/com.aira.airatabletlite/files/lastcrashlog.log";

let isDownloading = false;
exports.call = function( req, res ) {
    if( isDownloading ) {
        try{res.status( 400 ).json( {message : "in use."} )}catch(e){};
        return;
    }
    isDownloading = true;

    const now = new Date();
    const file_after_download = "airafacelite-crashlog" + now.getFullYear() + "-" + (now.getMonth() + 1 ) + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + ".log";
    try {
        res.download( lastsyslogname, file_after_download ,function (err) {
            if( err ) {
                res.sendStatus(404);
            }
            isDownloading = false;
        });
    }
    catch(e) {
        isDownloading = false;
        try{res.status( 400 ).json( {message : e.toString()} )}catch(e){};
    }
}
