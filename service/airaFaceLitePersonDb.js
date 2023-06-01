"use strict";
const fs = require("fs");
const path = require('path');
const writeToFile = require("write-to-file");
const TAFFY = require( 'taffy' );
const { uuid } = require('uuidv4');
//const myuuid = require('./../utility/myUuid');

class airaFaceLitePersonDb {
    constructor( workingFolder, filename, maintainTime = 864000000 ) {
        const self = this;
        self.maintainTime = maintainTime;
        self.firstRecord = false;
        self.workingDBFolder = workingFolder;
        self.dbfileName = workingFolder + "/" + filename;
        self.dbPhotoFolder = workingFolder + "/dbPhoto/"
        self.database = null;
        self.batchInsertIsBusy = false;

        self.lastRequestFlushTime = 0;
        self.needFlushCacheData = false;

        self.lockDb = async function( lock ) {
            try {
                if( lock ) fs.writeFileSync( self.dbfileName + ".lock", "lock" );
                else if (fs.existsSync(self.dbfileName + ".lock")) fs.unlinkSync( self.dbfileName + ".lock" )
                return true;
            }
            catch(e){
                if (fs.existsSync(self.dbfileName + ".lock")) fs.unlinkSync( self.dbfileName + ".lock" )
                return false;
            }
        };
        self.flushToFile = async function( noCache = false, cb ) {
            let ok = false;
            try {
                const now = Date.now();
                if( noCache ) {
                    self.lastRequestFlushTime = 1;
                    // self.needFlushCacheData = false;
                    // if( !fs.existsSync( self.workingDBFolder ) ) {
                    //     fs.mkdirSync( self.workingDBFolder );
                    // }
                    // const dataList = [];
                    // let dataRecordset = self.database( {} );
                    // dataRecordset.each( function (r) {
                    //     dataList.push(r);
                    // });
                    // await self.lockDb(true)
                    // await writeToFile( self.dbfileName, JSON.stringify( dataList ), {flag: "w+"} );
                    // await self.lockDb(false)
                }
                else {
                    self.lastRequestFlushTime = now;
                }
                ok = true;
            }
            catch(e) {await self.lockDb(false)}
            return new Promise((resolve) => {
                if( cb ) cb(ok);
                resolve( ok );
            });
        };

        self.initDb = async function() {
            try {
                const dbStr = fs.readFileSync( self.dbfileName ).toString( "utf8" );
                let dbData = JSON.parse( dbStr );
                self.database = new TAFFY( dbData );
            }
            catch(e) {
                self.database = new TAFFY( "[]" );
                self.flushToFile( true );
            }
        }
        self.initDb();
        self.lockDb(false)

        self.flushCacheDbService = async function( force = false, cb ) {
            try {
                if( force || self.lastRequestFlushTime != 0 && Date.now() > self.lastRequestFlushTime + 5000 ) {
                    self.lastRequestFlushTime = 0;
                    if( !fs.existsSync( self.workingDBFolder ) ) {
                        fs.mkdirSync( self.workingDBFolder );
                    }
                    const dataList = [];
                    let dataRecordset = self.database( {} );
                    dataRecordset.each( function (r) {
                        dataList.push(r);
                    });

                    await self.lockDb(true)
                    await writeToFile( self.dbfileName, JSON.stringify( dataList ), {flag: "w+"} );
                    await self.lockDb(false)
                }
            }
            catch(e) {
                // if( self.lastRequestFlushTime != 88 )
                //     self.lastRequestFlushTime = 88; // for retry
            }
            setTimeout( self.flushCacheDbService, 5000 );
            if( cb ) cb();
        }
        self.flushCacheDbService();

        self.maintainDb = async function() {
            try {
                const now = Date.now();
                const dbStr = fs.readFileSync( self.dbfileName ).toString( "utf8" );
                let dbData = JSON.parse( dbStr );
                const orgLen = dbData.length;
                dbData = dbData.filter( item => ( item.expire_date == 0 || (( item.expire_date + self.maintainTime) > now ) ) )
                if( orgLen != dbData.length ) {
                    self.database = new TAFFY( dbData );
                    self.flushToFile( true );
                }
            }
            catch(e) {
                self.database = new TAFFY( "[]" );
                self.flushToFile( true );
            }
            setTimeout( self.maintainDb, 600000 );
        }
        self.maintainDb();

        self.savePhoto = async function( uuid, registerPhoto, displayPhoto ) {
            try {
                if( !fs.existsSync( self.dbPhotoFolder ) ) {
                    fs.mkdirSync( self.dbPhotoFolder );
                }
                const registerPhotoFile = self.dbPhotoFolder + uuid + ".register";
                const displayPhotoFile = self.dbPhotoFolder + uuid + ".display";
                await writeToFile( registerPhotoFile, registerPhoto ? registerPhoto : "", {flag: "w+"} );
                await writeToFile( displayPhotoFile, displayPhoto ? displayPhoto : "", {flag: "w+"} );
            }
            catch(e) {}
        }

        self.readRegisterPhoto = function( uuid ) {
            let photo = "";
            try {
                const registerPhotoFile = self.dbPhotoFolder + uuid + ".register";
                //const displayPhotoFile = self.dbPhotoFolder + uuid + ".display";
                photo = fs.readFileSync( registerPhotoFile ).toString( "utf8" );
            }
            catch(e) {}
            return photo;
        }
        self.deletePhoto = function( uuid ) {
            const registerPhotoFile = self.dbPhotoFolder + uuid + ".register";
            const displayPhotoFile = self.dbPhotoFolder + uuid + ".display";
            try {
                fs.unlinkSync(displayPhotoFile, (error) => {});
            }
            catch(e) {}
            try {
                fs.unlinkSync(registerPhotoFile, (error) => {});
            }
            catch(e) {}
        }

        self.cleanupPhotoFolder = function() {
            if( fs.existsSync( self.dbPhotoFolder ) ) {
                fs.readdirSync( self.dbPhotoFolder ).forEach( function(entry) {
                    var entry_path = path.join( self.dbPhotoFolder, entry );
                    if( fs.lstatSync( entry_path ).isDirectory()) {
                        self.cleanupPhotoFolder( entry_path );
                    } else {
                        fs.unlinkSync( entry_path );
                    }
                });
                //fs.rmdirSync( self.dbPhotoFolder);
            }
        }

        self.readDisplayPhoto = function( uuid ) {
            let photo = "";
            try {
                //const registerPhotoFile = self.dbPhotoFolder + uuid + ".register";
                const displayPhotoFile = self.dbPhotoFolder + uuid + ".display";
                photo = fs.readFileSync( displayPhotoFile ).toString( "utf8" );
            }
            catch(e) {}
            return photo;
        }
    };

    lock = function() {
        const self = this;
        return self.lockDb(true);
    }
    unlock = function() {
        const self = this;
        return self.lockDb(false);
    }

    fetchPhoto = function( uuid ) {
        const self = this;
        const dataRet = {
            display_image : "",
            register_image : ""
        };
        try {
            if( uuid && uuid.length > 0 ) {
                dataRet.display_image = self.readDisplayPhoto( uuid );
                dataRet.register_image = self.readRegisterPhoto( uuid );
            }
        }
        catch(e) {}
        return dataRet;
        // return new Promise((resolve) => {
        //     if( cb ) cb( dataRet );
        //     resolve( dataRet );
        // });
    };

    deletePhoto = function( uuid ) {
        const self = this;
        self.deletePhoto( uuid );
    };

    find = async function( uuid, cb ) {
        const self = this;
        const dataList = [];
        try {
            let query = {};
            if( uuid && uuid.length > 0 ) {
                query["uuid"] = uuid;
            }
            let dataRecordset = self.database( query );
            dataRecordset.each( function (r) {
                dataList.push( JSON.parse( JSON.stringify(r) ) );
            } );
            dataRecordset = null;
        }
        catch(e) {
            
        }
        return new Promise((resolve) => {
            if( cb ) cb( dataList );
            resolve( dataList );
        });
    };

    findByPersonId = async function( personId, cb ) {
        const self = this;
        const dataList = [];
        try {
            let query = {};
            if( personId && personId.length > 0 ) {
                query["id"] = personId;
            }
            let dataRecordset = self.database( query );
            dataRecordset.each( function (r) {
                dataList.push( JSON.parse( JSON.stringify(r) ) );
            } );
            dataRecordset = null;
        }
        catch(e) {
            
        }
        return new Promise((resolve) => {
            if( cb ) cb( dataList );
            resolve( dataList );
        });
    };

    remove = async function( uuid, flush, cb ) {
        const self = this;
        let ok = false;
        try {
            self.deletePhoto( uuid );
            if( self.database( { uuid : uuid } ).remove() > 0 ) {
                if( flush ) ok = await self.flushToFile();
                else ok = true;
            }
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    removeAll = async function( flush, cb ) {
        const self = this;
        let ok = false;
        try {
            let dataRecordset = self.database({});
            if( dataRecordset.count() > 0 ) {
                dataRecordset.each( function (record) {
                    self.deletePhoto( record.uuid );
                });
            }
            if( self.database({}).remove() > 0 ) {
                if( flush ) ok = await self.flushToFile();
                else ok = true;
            }
        }
        catch(e) {
            console.log(e)
        }
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    removeAllNow = async function( cb ) {
        const self = this;
        let ok = false;
        try {
            let dataRecordset = self.database({});
            if( dataRecordset.count() > 0 ) {
                dataRecordset.each( function (record) {
                    self.deletePhoto( record.uuid );
                });
            }
            if( self.database({}).remove() > 0 ) {
                await self.flushCacheDbService( true );
            }
        }
        catch(e) {
        }
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    insert = async function( data, flush, cb ) {
        const self = this;
        const uuidStr = data.uuid ? data.uuid : uuid();
        //console.log( "uuidStr", uuidStr )
        const now = Date.now();
        let ok = false;
        try {
            let dispImage = null;
            if( data.display_image && data.display_image.length > 0 ) {
                dispImage = await global.resizeImage(data.display_image)
            }
            self.savePhoto( uuidStr, data.register_image ? data.register_image : "", dispImage ? dispImage.base64_image : "" );
            const dataToWrite = {
                uuid : uuidStr,
                id : data.id,
                name : data.name,
                card_facility_code : data.card_facility_code,
                card_number : data.card_number,
                group_list : data.group_list,
                assigned_group_list : data.assigned_group_list,
                extra_info : data.extra_info,
                // display_image : dispImage ? dispImage.base64_image : "",
                // register_image : data.register_image ? data.register_image : "",
                face_feature : data.face_feature,
                upper_face_feature : data.upper_face_feature,
                begin_date : data.begin_date,
                expire_date : data.expire_date,
                create_date : data.create_date ? data.create_date : now,
                last_modify_date : data.last_modify_date ? data.last_modify_date : now,
                last_modify_date_by_manager : data.last_modify_date_by_manager ? data.last_modify_date_by_manager : now
            };

            self.database.insert( dataToWrite );
            if( flush ) ok = await self.flushToFile();
            else ok = true;
        }
        catch(e){}
        return new Promise((resolve) => {
            if( cb ) cb( ok, uuidStr );
            resolve( { ok : ok , uuid : uuidStr } );
        });
    };


    count = async function( cb ) {
        const self = this;
        let c = 0;
        let s = false;
        try {
            c = self.database({}).count();
            s = true;
        }
        catch(e){}
        return new Promise((resolve) => {
            if( cb ) cb( s, c );
            resolve( { success : s, count : c } );
        });
    };

    update = async function( uuid, data, flush, cb ) {
        const self = this;
        let ok = false;
        try {
            let dispImage = null;
            if( data.display_image && data.display_image.length > 0 ) {
                dispImage = await global.resizeImage(data.display_image)
            }
            self.savePhoto( uuid, data.register_image ? data.register_image : "", dispImage ? dispImage.base64_image : "" );
            let dataRecordset = self.database( { uuid : uuid } );
            if( dataRecordset.count() > 0 ) {
                dataRecordset.each( function (r) {
                    let dataInDB = JSON.parse( JSON.stringify( r ));

                    if( data.display_image ) delete data["display_image"];
                    if( data.register_image ) delete data["register_image"];

                    let dataToUpdate = Object.assign({}, dataInDB, data );
                    self.database( { uuid : uuid } ).update( dataToUpdate );
                });
            }
            else {
                //console.log("uuid not found : ", uuid);
                const uuidStr = uuid ? uuid : uuid();
                const dataToWrite = {
                    uuid : uuidStr,
                    id : data.id,
                    name : data.name,
                    card_facility_code : data.card_facility_code,
                    card_number : data.card_number,
                    group_list : ["All Person"],
                    assigned_group_list : data.assigned_group_list,
                    extra_info : data.extra_info,
                    // display_image : dispImage ? dispImage.base64_image : "",
                    // register_image : data.register_image ? data.register_image : "",
                    face_feature : data.face_feature,
                    upper_face_feature : data.upper_face_feature,
                    begin_date : data.begin_date,
                    expire_date : data.expire_date,
                    create_date : data.create_date ? data.create_date : now,
                    last_modify_date : data.last_modify_date ? data.last_modify_date : now,
                    last_modify_date_by_manager : data.last_modify_date_by_manager ? data.last_modify_date_by_manager : now
                };
                self.database.insert( dataToWrite );
            }
            ok = flush ? await self.flushToFile() : true;
        }
        catch(e) {
        }
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    flush = async function( cb ) {
        const self = this;
        let ok = false;
        try {
            ok = await self.flushToFile();
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    addGroupList = async function( uuid, groupListToAdd , flush, cb ) {
        const self = this;
        let ok = false;
        try {
            if( groupListToAdd.length > 0 ) {
                let query = {};
                if( uuid && uuid.length > 0 ) {
                    query["uuid"] = uuid;
                }
                let dataRecordset = self.database( query );
                if( dataRecordset.count() > 0 ) {
                    dataRecordset.each( function (r) {
                        if( r.group_list ) r.group_list = r.group_list.concat( groupListToAdd );
                        else r.group_list = groupListToAdd;
                    });
                    if( flush ) ok = await self.flushToFile();
                    else ok = true;
                }
            }
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    removeGroupList = async function( uuid, groupListToRemove , flush, cb ) {
        const self = this;
        let ok = false;
        try {
            if( groupListToRemove.length > 0 ) {
                let query = {};
                if( uuid && uuid.length > 0 ) {
                    query["uuid"] = uuid;
                }
                let dataRecordset = self.database( query );
                if( dataRecordset.count() > 0 ) {
                    dataRecordset.each( function (r) {
                        if( r.group_list ) {
                            r.group_list = r.group_list.filter(item => !groupListToRemove.includes(item));
                        }
                    });
                    if( flush ) ok = await self.flushToFile();
                    else ok = true;
                }
            }
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };
//
    modifyCard = async function( uuid, cardNumber , flush, cb ) {
        const self = this;
        let ok = false;
        try {
            let query = {};
            if( uuid && uuid.length > 0 ) {
                query["uuid"] = uuid;
            }
            let dataRecordset = self.database( query );
            if( dataRecordset.count() > 0 ) {
                dataRecordset.each( function (r) {
                    r.card_number = cardNumber;
                });
                if( flush ) ok = await self.flushToFile();
                else ok = true;
            }
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };

    removeCardList = async function( uuid, cardListToRemove , flush, cb ) {
        const self = this;
        let ok = false;
        try {
            if( groupListToRemove.length > 0 ) {
                let query = {};
                if( uuid && uuid.length > 0 ) {
                    query["uuid"] = uuid;
                }
                let dataRecordset = self.database( query );
                if( dataRecordset.count() > 0 ) {
                    dataRecordset.each( function (r) {
                        if( r.card_number && r.card_number.length > 0 ) {
                            if( cardListToRemove.includes( r.card_number ) ) r.card_number = "";
                        }
                    });
                    if( flush ) ok = await self.flushToFile();
                    else ok = true;
                }
            }
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ok );
            resolve( ok );
        });
    };
}

module.exports = airaFaceLitePersonDb;
