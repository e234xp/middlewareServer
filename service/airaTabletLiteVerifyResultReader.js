"use strict";
const fs = require("fs");
const TAFFY = require( 'taffy' );

const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
};

class airaTabletLiteVerifyResultReader {
    constructor( workingFolder ) {
        const self = this;
        console.log( "workingFolder : ", workingFolder );
        self.workingDBFolder = workingFolder;
        self.fileCacheDataSizeLimit = 200000000;
        self.fileCacheDataSize = 0;
        self.fileCacheData = [];

        self._readFileData = function( fileToOpen ) {
            //const self = this;
            let stats = fs.statSync( fileToOpen );
            let dataStringFromFile = "";
            if( stats.isFile() ) {
                var dataFound = self.fileCacheData.filter( d => { return d.filename == fileToOpen; } );
                if( dataFound.length > 0 && stats.mtime.getTime() == dataFound[0].mtime ) {
                    dataStringFromFile = dataFound[0].data;
                    console.log("2")
                }
                else {
                    // try {
                    //     self.fileCacheData.splice( self.fileCacheData.findIndex( v => { return v.filename == fileToOpen; } ), 1 );
                    // }
                    // catch(e){}
                    try {
                        
                        // var startOfToday = new Date();
                        // startOfToday.setUTCHours(0,0,0,0);
                        // var endOfToday = new Date();
                        // endOfToday.setUTCHours( 23, 59, 59, 999 );
                        
                        dataStringFromFile = fs.readFileSync( fileToOpen ).toString( "utf8");
                        
                        var dataSize =  dataStringFromFile.length;
                        while( self.fileCacheDataSizeLimit < (self.fileCacheDataSize + dataSize ) ) {
                            var s = self.fileCacheData.shift();

                            self.fileCacheDataSize -= s.size;
                            console.log("d")
                        }
                        
                        self.fileCacheDataSize += dataStringFromFile.length;
                        var a = {
                            mtime : stats.mtime.getTime(),
                            filename : fileToOpen,
                            data : dataStringFromFile,
                            size : dataSize
                        };
                        self.fileCacheData.push( a );
                        //console.log( dataStringFromFile );
                        //console.log( self.fileCacheDataSize, self.fileCacheData.length );
                    }
                    catch(e){
                        console.log( e );
                    }
                }
                // if( cb ) cb( dataStringFromFile );
                // resolve( dataStringFromFile );
            }
            return dataStringFromFile;
        }

        self._readDbCache = async function( startTime, endTime ) {
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
                                                self._readFileData( fileToOpen );
                                            } 
                                            catch(err) {}
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
                catch(e){
                }
                resolve([]);
            });
        }
        self._readDbCache( Date.now() - 86400000 * 30, Date.now() );
        //self._readFileData( "/home/aira/project/webServices/testserver/data/personverifyresult/" + "pvr_1683072000000_1683158399999.db" );
        //self._readFileData( "/home/aira/project/webServices/testserver/data/personverifyresult/" + "pvr_1683072000000_1683158399999.db" );
        
    };

    removeAllNow = async function() {
        const self = this;
        return new Promise((resolve) => {
            try {
                fs.rmdirSync( self.workingDBFolder, { recursive: true, force: true });
            } catch (err) {
            }
            resolve();
        });
    }

    readDb = async function( startTime, endTime, uuidList, cb ) {
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
                                            //let dataStringFromFile = fs.readFileSync( fileToOpen ).toString( "utf8");
                                            let dataStringFromFile = self._readFileData( fileToOpen );
                                            if( dataStringFromFile.length > 0 ) {
                                                while( "," == dataStringFromFile.charAt(0) ) dataStringFromFile = dataStringFromFile.substring(1);
                                                let dbDataObj = new TAFFY( JSON.parse( "[" + dataStringFromFile + "]" ) );
                                                let query = {
                                                    timestamp: { 
                                                        lt : endTime + 1,
                                                        gt : startTime - 1 
                                                    }
                                                };
                                                if( uuidList != null && uuidList.length >  0 ) {
                                                    query["uuid"] = uuidList;
                                                }
                                                let dataRecordset = dbDataObj( query );
                                                dataRecordset.each( function (data) {
                                                    //let data = JSON.parse(JSON.stringify(r));
                                                    if( data["___id"] ) delete data["___id"];
                                                    if( data["___s"] ) delete data["___s"];

                                                    try {
                                                        let photoToOpen = fileToOpen + "_photos/" + photoId + ".photo";
                                                        data["face_image"] = fs.readFileSync( photoToOpen ).toString( "utf8");
                                                    }
                                                    catch(e){}
                                                    dataArray.push( data);
                                                });
                                                dataRecordset = null
                                            }
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

    readDbNoImage = async function( startTime, endTime, uuidList, cb ) {
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
                                            //let dataStringFromFile = fs.readFileSync( fileToOpen ).toString( "utf8");
                                            let dataStringFromFile = self._readFileData( fileToOpen );
                                            if( dataStringFromFile.length > 0 ) {
                                                while( "," == dataStringFromFile.charAt(0) ) dataStringFromFile = dataStringFromFile.substring(1);
                                                let dbDataObj = new TAFFY( JSON.parse( "[" + dataStringFromFile + "]" ) );
                                                let query = {
                                                    timestamp: { 
                                                        lt : endTime + 1,
                                                        gt : startTime - 1 
                                                    }
                                                };
                                                if( uuidList != null && uuidList.length >  0 ) {
                                                    query["uuid"] = uuidList;
                                                }
                                                let dataRecordset = dbDataObj( query );
                                                dataRecordset.each( function (data) {
                                                    //let data = JSON.parse(JSON.stringify(r));
                                                    if( data["face_image"] ) delete data["face_image"];
                                                    if( data["___id"] ) delete data["___id"];
                                                    if( data["___s"] ) delete data["___s"];
                                                    data["face_image_id"] =  {
                                                        f : partsOfStr[0] + "_" + partsOfStr[1] + "_" + partsOfStr[2],
                                                        uuid : (data.verify_uuid ? data.verify_uuid : "")
                                                    };
                                                    //console.log( "face_img_url_param : ", data["face_img_url_param"] );
                                                    dataArray.push( data);
                                                });
                                                dataRecordset = null
                                            }
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

    readDbSync = async function( startTime, endTime, uuidList, limitAmount = 100 ) {
        const self = this;
        return new Promise((resolve) => {
            let cnt = 0;
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
                                            if( cnt < limitAmount ) {
                                                let fileToOpen =  self.workingDBFolder + "/" + file;
                                                // let dataStringFromFile = fs.readFileSync( fileToOpen ).toString( "utf8");
                                                let dataStringFromFile = self._readFileData( fileToOpen );
                                                if( dataStringFromFile.length > 0 ) {
                                                    while( "," == dataStringFromFile.charAt(0) ) dataStringFromFile = dataStringFromFile.substring(1);
                                                    let dbDataObj = new TAFFY( JSON.parse( "[" + dataStringFromFile + "]" ) );
                                                    let query = {
                                                        timestamp: { 
                                                            lt : endTime + 1,
                                                            gt : startTime - 1 
                                                        }
                                                    };
                                                    if( uuidList != null && uuidList.length >  0 ) {
                                                        query["uuid"] = uuidList;
                                                    }
                                                    let dataRecordset = dbDataObj( query );
                                                    dataRecordset.each( function (data) {
                                                        //let data = JSON.parse(JSON.stringify(r));
                                                        if( data["___id"] ) delete data["___id"];
                                                        if( data["___s"] ) delete data["___s"];
                                                        if( cnt++ < limitAmount ) {
                                                            try {
                                                                let photoToOpen = fileToOpen + "_photos/" + photoId + ".photo";
                                                                data["face_image"] = fs.readFileSync( photoToOpen ).toString( "utf8");
                                                            }
                                                            catch(e){}
                                                            dataArray.push( data);
                                                        }
                                                    });
                                                    dataRecordset = null;
                                                }
                                            }
                                        } 
                                        catch(err) {}
                                    }
                                }
                            }
                        });
                        resolve(dataArray);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch(e){
                resolve([]);
            }
        });
    }

    readVerifyPhoto = async function( fileId, photoId, cb ) {
        const self = this;
        return new Promise((resolve) => {
            let faceImage = "";
            try {
                let fileToOpen = self.workingDBFolder + "/" + fileId + ".db" + "_photos/" + photoId + ".photo";
                faceImage = fs.readFileSync( fileToOpen ).toString( "utf8");
            }
            catch(e){}
            if( cb ) cb( faceImage );
            resolve( faceImage );
        });
    }
}

module.exports = airaTabletLiteVerifyResultReader;
