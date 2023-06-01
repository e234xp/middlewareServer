"use strict";
const fs = require("fs");
const TAFFY = require( 'taffy' );

const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
};

class airaTabletLiteSystemLogReader {
    constructor( workingFolder ) {
        const self = this;
        self.workingDBFolder = workingFolder;
    };

    readDb = async function( startTime, endTime, logLevel, cb ) {
        const self = this;
        return new Promise((resolve) => {
            try {
                fs.readdir( self.workingDBFolder, (err, files) => {
                    if( !err ) {
                        let dataArray = [];
                        files.forEach( file => {
                            const mainOfStr = file.split( "." );
                            if( mainOfStr.length == 2 ) {
                                const partsOfStr = mainOfStr[0].split( "_" );
                                if( partsOfStr.length == 3 ) {
                                    if( (startTime >= partsOfStr[1] && startTime <= partsOfStr[2]) || 
                                        (endTime >= partsOfStr[1] && endTime <= partsOfStr[2]) ||
                                        (startTime <= partsOfStr[1] && endTime >= partsOfStr[2]) ||
                                        (startTime >= partsOfStr[1] && endTime <= partsOfStr[2]) ) {
                                        try {
                                            let fileToOpen =  self.workingDBFolder + "/" + file;
                                            let dataStringFromFile = fs.readFileSync( fileToOpen ).toString( "utf8");
                                            while( "," == dataStringFromFile.charAt(0) ) dataStringFromFile = dataStringFromFile.substring(1);
                                            let dbDataObj = new TAFFY( JSON.parse( "[" + dataStringFromFile + "]" ) );
                                            let query = {
                                                timestamp: { 
                                                    lt : endTime + 1,
                                                    gt : startTime - 1 
                                                }
                                            };
                                            if( logLevel != null && logLevel.length >  0 ) {
                                                query["log_level"] = logLevel;
                                            }
                                            let dataRecordset = dbDataObj( query );
                                            dataRecordset.each( function (data) {
                                                //let data = JSON.parse(JSON.stringify(r));
                                                if( data["___id"] ) delete data["___id"];
                                                if( data["___s"] ) delete data["___s"];
                                                dataArray.push( data);
                                            });
                                            dataRecordset = null
                                        } 
                                        catch(err) {}
                                    }
                                }
                            }
                        });
                        if( cb ) cb(dataArray);
                        resolve(dataArray);
                    }
                    else {
                        if( cb ) cb([]);
                        resolve([]);
                    }
                });
            }
            catch(e){
                if( cb ) cb([]);
                resolve([]);
            }
        });
    }
}

module.exports = airaTabletLiteSystemLogReader;
