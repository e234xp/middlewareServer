'use strict';
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
exports.go = async function( method, host, port, https, user, pass, url, dataType, data ) {
    //console.log("go", method, host, port, https, user, pass, url, dataType, data );
    try{
        let urlChecked = url;
        if( urlChecked.length > 0 ) {
            if( urlChecked.charAt(0) != '/' ) {
                urlChecked = "/" + urlChecked;
            }
        }
        else urlChecked = "/";
        
        let urlTogo = (https ? "https://" : "http://");
        if( user && user.length > 0 ) {
            urlTogo += (user + ":" + pass + "@");
        }
        urlTogo += (host + ":" + port + urlChecked );
        
        // urlTogo.replace( ",",  encodeURIComponent(",") );
        // urlTogo.replace( ";",  encodeURIComponent(";") );
        // urlTogo.replace( "|",  encodeURIComponent("|") );
        // urlTogo.replace( "#",  encodeURIComponent("#") );
        // urlTogo.replace( "$",  encodeURIComponent("$") );
        // urlTogo.replace( " ",  encodeURIComponent(" ") );
        //console.log("urlTogo : ", urlTogo );

        const options = {
            //host : host,
            //port : port,
            //path : urlChecked,
            url : urlTogo,
            //json : true,
            method : method,
            agent : false,
            pool : { maxSockets : 10 },
            time : true,
            timeout : 3000
        };

        //console.log( options );

        if( method == "POST" ) {
            if( dataType == "XML" ) {
                try {
                    //console.log("data",  data)
                    options["body"] = data;
                    options["headers"] = {
                        "Content-Type" : "application/xml",
                        "Content-Length" : Buffer.byteLength(data)
                    };
                    // options["Content-Length"] = Buffer.byteLength(data);
                }
                catch(e) {
                    options["body"] = "<xml></xml>";
                    options["headers"] = {
                        "Content-Type" : "application/xml",
                        "Content-Length" : 11
                    };
                    //options["Content-Length"] = 0;
                }
            }
            else {
                try {
                    let regex = /\,(?!\s*?[\{\[\"\'\w])/g;
                    let correct = data.replace(regex, ''); // remove all trailing commas
                    options["body"] = correct;
                    options["headers"] = {
                        "Content-Type" : "application/json",
                        "Content-Length" : Buffer.byteLength(data)
                    };
                    //options["json"] = JSON.parse(correct);
                }
                catch(e) {
                    options["body"] = "{}";
                    options["headers"] = {
                        "Content-Type" : "application/json",
                        "Content-Length" : 2
                    };
                    //options["json"] = {};
                }
            }
        }
        

        //console.log( 'options', options );
        //global.globalSystemLog_info( "http(s) action : " + options.url );
        require( "request" ).defaults({ rejectUnauthorized: false })( options, function ( error, response, body ) {
            //console.log( 'error', error.toString() );

            global.globalSystemLog_info( "http(s) action : " + options.url + "[" + ( error ? error.toString() : "ok") + "]" );
        });
    }
    catch(e){
    };
}
