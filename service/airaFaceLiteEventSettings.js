"use strict";
const fs = require("fs");
const { uuid } = require("uuidv4");
const { setFlagsFromString } = require("v8");
const writeToFile = require("write-to-file");

class airaFaceLiteEventSettings {
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
                line_actions_list : [
                    // {
                    //     uuid : uuid(),
                    //     enable : true,
                    //     name : "All The Time",
                    //     remarks : "",
                    //     group_list : ["All Person","All Visitor"],
                    //     token : "1A0ap0hi2v76fFbpMJaOalMxhhwWKjo6ziqHG9ANwYC",
                    //     data_list : {
                    //         show_identity : true,
                    //         person : {
                    //             id : true,
                    //             name : true,
                    //             card_number : false,
                    //             group_list : true,
                    //             title : false,
                    //             department : false,
                    //             email : false,
                    //             phone_number : false,
                    //             extension_number : false,
                    //             remarks : false,
                    //         },
                    //         foreHead_temperature : true,
                    //         is_high_temperature : true,
                    //         display_image : "register"
                    //     },
                    //     weekly_schedule : {
                    //         list : [ 
                    //             { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                    //         ]
                    //     },
                    //     specify_time : {
                    //         list : [ { start_time : 0, end_time : 0 }]
                    //     } 
                    // }
                ],
                mail_actions_list : [
                    // {
                    //     uuid : uuid(),
                    //     enable : true,
                    //     name : "All The Time",
                    //     remarks : "",
                    //     group_list : ["All Person","All Visitor"],
                    //     method : "SMTP",
                    //     host : "smtp.mailtrap.io",
                    //     port : 2525, 
                    //     secure : false, 
                    //     user : "2d312db4a40a50", 
                    //     pass : "da438b20f6e537",
                    //     from : "80a4f85a43-c98b6d@inbox.mailtrap.io",
                    //     to : "ken.chan@aira.com.tw;ken650613@gmail.com", 
                    //     cc : "ken650613@yahoo.com.tw",
                    //     bcc : "",
                    //     subject : "test",
                    //     data_list : {
                    //         show_identity : true,
                    //         person : {
                    //             id : true,
                    //             name : true,
                    //             card_number : false,
                    //             group_list : true,
                    //             title : false,
                    //             department : false,
                    //             email : false,
                    //             phone_number : false,
                    //             extension_number : false,
                    //             remarks : false,
                    //         },
                    //         foreHead_temperature : true,
                    //         is_high_temperature : true,
                    //         display_image : "register"
                    //     },
                    //     weekly_schedule : {
                    //         list : [ 
                    //             { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                    //         ]
                    //     },
                    //     specify_time : {
                    //         list : [ { start_time : 0, end_time : 0 }]
                    //     } 
                    // }
                ],
                http_actions_list : [
                    // {
                    //     uuid : uuid(),
                    //     enable : true,
                    //     name : "All The Time",
                    //     remarks : "",
                    //     group_list : ["All Person","All Visitor"],
                    //     https : true,
                    //     host : "192.168.10.21",
                    //     port : 8080,
                    //     user : "admin", 
                    //     pass : "1234",
                    //     url : "/test",
                    //     data_list : {
                    //         show_identity : true,
                    //         person : {
                    //             id : true,
                    //             name : true,
                    //             card_number : false,
                    //             group_list : true,
                    //             title : false,
                    //             department : false,
                    //             email : false,
                    //             phone_number : false,
                    //             extension_number : false,
                    //             remarks : false,
                    //         },
                    //         foreHead_temperature : true,
                    //         is_high_temperature : true,
                    //         display_image : "register"
                    //     },
                    //     weekly_schedule : {
                    //         list : [ 
                    //             { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                    //             { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                    //         ]
                    //     },
                    //     specify_time : {
                    //         list : [ { start_time : 0, end_time : 0 }]
                    //     } 
                    // }
                ]
            }
        };

        self.readFromFile = async function( cb ) {
            let data = null;
            try {
                let dbStr = fs.readFileSync( self.dbfileName ).toString('utf8');
                data = JSON.parse( dbStr );
                if( data.line_actions_list ) {
                    data.line_actions_list.forEach( s => {
                        if( !s.uuid || s.uuid == "" ) {
                            s["uuid"] = uuid();
                        }
                    });
                }
                if( data.mail_actions_list ) {
                    data.mail_actions_list.forEach( s => {
                        if( !s.uuid || s.uuid == "" ) {
                            s["uuid"] = uuid();
                        }
                    });
                }
                if( data.http_actions_list ) {
                    data.http_actions_list.forEach( s => {
                        if( !s.uuid || s.uuid == "" ) {
                            s["uuid"] = uuid();
                        }
                    });
                }
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
            if( data.line_actions_list ) {
                data.line_actions_list.forEach( s => {
                    if( !s.uuid || s.uuid == "" ) {
                        s["uuid"] = uuid();
                    }
                });
            }
            if( data.mail_actions_list ) {
                data.mail_actions_list.forEach( s => {
                    if( !s.uuid || s.uuid == "" ) {
                        s["uuid"] = uuid();
                    }
                });
            }
            if( data.http_actions_list ) {
                data.http_actions_list.forEach( s => {
                    if( !s.uuid || s.uuid == "" ) {
                        s["uuid"] = uuid();
                    }
                });
            }
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

module.exports = airaFaceLiteEventSettings;
