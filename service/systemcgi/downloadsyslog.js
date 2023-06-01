
"use strict";

const syslogname = "/data/user/0/com.aira.airatabletlite/files/syslog.log";
let isDownloading = false;
exports.call = function( req, res ) {
    if( isDownloading ) {
        try{res.status( 400 ).json( {message : "in use."} )}catch(e){};
        return;
    }
    isDownloading = true;
    try {
        require('request')( {
            url: "http://127.0.0.1:8588/system/generatesyslog",
            method: "POST",
            pool : {maxSockets: 10},
            time: true,
            timeout: 600000,
            headers: {
                'Content-Type': 'application/json'
            },
            json: {}
        }, function (error, response, body) {
            const now = new Date();
            const file_after_download = "airafacelite-syslog" + now.getFullYear() + "-" + (now.getMonth() + 1 ) + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + ".log";
            try {
                res.download( syslogname, file_after_download ,function (err) {
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
        });
    }
    catch(e) {
        isDownloading = false;
        try{res.status( 400 ).json( {message : e.toString()} )}catch(e){};
    }
}
