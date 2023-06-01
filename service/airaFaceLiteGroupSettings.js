"use strict";
const fs = require("fs");
const { setFlagsFromString } = require("v8");
const writeToFile = require("write-to-file");
const { uuid } = require('uuidv4');

class airaFaceLiteGroupSettings {
    constructor( workingFolder, filename ) {
        const self = this;
        self.firstRecord = false;
        self.workingDBFolder = workingFolder;
        self.dbfileName = workingFolder + "/" + filename ;

        self.lockSettings = async function( lock ) {
            let ok = true;
            try {
                if( lock ) fs.writeFileSync( self.dbfileName + ".lock", "lock" );
                else if (fs.existsSync(self.dbfileName + ".lock")) fs.unlinkSync( self.dbfileName + ".lock" )

            }
            catch(e){
                if (fs.existsSync(self.dbfileName + ".lock")) fs.unlinkSync( self.dbfileName + ".lock" )
                ok = false;
            }
            return ok;
        };

        self.flushToFile = async function( data, cb ) {
            let ok = false;
            let errorMsg = "";
            try {
                if( !fs.existsSync( self.workingDBFolder ) ) {
                    fs.mkdirSync( self.workingDBFolder );
                }
                self.lockSettings( true );
                await writeToFile( self.dbfileName, JSON.stringify( data ), {flag: "w+"} );
                self.lockSettings( false );
                ok = true;
            }
            catch(e) {
                await self.lockSettings( false );
                errorMsg = e.toString()
            }
            
            return new Promise((resolve) => {
                if( cb ) cb(ok , errorMsg);
                resolve( { ok : ok, message : errorMsg } );
            });
        }

        self.defaultSettings = function() {
            return {
                group_list : [
                    { 
                        uuid : uuid(),
                        name : "All Person",
                        remarks : "",
                        fixed : true,
                        no_edit : true,
                        create_date : Date.now()
                    },
                    { 
                        uuid : uuid(),
                        name : "All Visitor",
                        remarks : "",
                        fixed : true,
                        no_edit : true,
                        create_date : Date.now()
                    }
                ],
            }
        };

        self.readFromFile = async function( cb ) {
            let data = null;
            try {
                let dbStr = fs.readFileSync( self.dbfileName ).toString('utf8');
                data = JSON.parse( dbStr );
            }
            catch(e) {
                data = self.defaultSettings();
            }
            return new Promise((resolve) => {
                if( cb ) cb(data);
                resolve( data );
            });
        };

        self.readFromFile( function( data ) {
            self.flushToFile( data );
            self.lockSettings( false );
        });
    };

    lock = function() {
        const self = this;
        return self.lockSettings( true );
    }

    unlock = function() {
        const self = this;
        return self.lockSettings( false );
    }

    get = async function( cb ) {
        const self = this;
        const data = await self.readFromFile();
        return new Promise((resolve) => {
            if( cb ) cb( data );
            resolve( data );
        });
    };

    set = async function( data, cb ) {
        const self = this;
        let ret = {};
        try {
            ret = await self.flushToFile(data);
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ret.ok, ret.message );
            resolve( ret );
        });
    };

    reset = async function( cb ) {
        const self = this;
        let ret = {};
        try {
            ret = await self.flushToFile( self.defaultSettings() );
        }
        catch(e) {}
        return new Promise((resolve) => {
            if( cb ) cb( ret.ok, ret.message );
            resolve( ret );
        });
    };
}

module.exports = airaFaceLiteGroupSettings;
