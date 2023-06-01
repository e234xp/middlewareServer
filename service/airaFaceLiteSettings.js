"use strict";
const fs = require("fs");
const { uuid } = require("uuidv4");
const { setFlagsFromString } = require("v8");
const writeToFile = require("write-to-file");

class airaFaceLiteSettings {
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
            return new Promise((resolve) => {
                resolve(ok);
            });
        };

        self.flushToFile = async function( data, cb ) {
            let ok = false;
            let errorMsg = "";
            try {
                if( !fs.existsSync( self.workingDBFolder ) ) {
                    fs.mkdirSync( self.workingDBFolder );
                }
                await self.lockSettings( true );
                await writeToFile( self.dbfileName, JSON.stringify( data ), {flag: "w+"} );
                await self.lockSettings( false );
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
                system_password : "123456",
                enable_rtsp_camera : false,
                enable_intercom : true,
                rtsp_username : "root",
                rtsp_password : "pass",
                audio_alarm_volume : 0.1,
                face_detection_threshold : 0.6,
                anti_spoofing_score : 0.5, // disable = 0.0, lowest = 0.1 , middle = 0.5(default), higher = 0.9
                score_for_valid_face : 0.9,
                display_verify_result_time : 3000,
                show_profile_photo : true,
                have_to_wear_face_mask : false,
                face_mask_enhancement : false,
                enable_name_mask : false,
                temperature_unit_celsius : true,
                show_verify_indication : false,
                enable_clock_mode : false,
                enable_clock_in_function : true,
                enable_clock_out_function : true,
                ////////////////////////////////////////////
                ////////////////////////////////////////////
                relay_1_start_power : 1,
                relay_1_delay : 3000,
                relay_1_end_power : 0,
                relay_2_start_power : 1,
                relay_2_delay : 3000,
                relay_2_end_power : 0,
                support_wiegand_bits : 26,
                enable_stranger_card_id : false,
                stranger_card_id : "",
                access_control_schedule_list : [
                    {
                        uuid : uuid(),
                        name : "All The Time",
                        enable : true,
                        temperature_trigger_rule : 0,
                        access_control_type : "relay1", // "relay2" , "wiegand"
                        group_list : ["All Person","All Visitor"],
                        remarks : "default settings",
                        // fixed : true,
                        weekly_schedule : {
                            list : [ 
                                { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                            ]
                        },
                        specify_time : {list : []}
                    },
                    {
                        uuid : uuid(),
                        name : "All The Time",
                        enable : true,
                        temperature_trigger_rule : 0,
                        access_control_type : "relay2", // "relay2" , "wiegand"
                        group_list : ["All Person","All Visitor"],
                        remarks : "default settings",
                        // fixed : true,
                        weekly_schedule : {
                            list : [ 
                                { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                            ]
                        },
                        specify_time : {list : []}
                    },
                    {
                        uuid : uuid(),
                        name : "All The Time",
                        enable : true,
                        temperature_trigger_rule : 0,
                        access_control_type : "wiegand", // "relay2" , "wiegand"
                        group_list : ["All Person","All Visitor"],
                        remarks : "default settings",
                        // fixed : true,
                        weekly_schedule : {
                            list : [ 
                                { day_of_week : 0, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 1, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 2, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 3, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 4, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 5, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
                                { day_of_week : 6, hours_list :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] }
                            ]
                        },
                        specify_time : {list : []}
                    }
                ],
                ////////////////////////////////////////////
                ////////////////////////////////////////////
                enable_id_card : true,
                enable_two_factor_authentication : false,
                ////////////////////////////////////////////
                ////////////////////////////////////////////
                high_temperature : 37.5,
                high_temperature_no_pass : false,
                enable_high_temperature_sound_alert : true,
                high_temperature_sound_alert_schedule_list : [
                    // {
                    //     uuid : uuid(),
                    //     name : "All The Time",
                    //     enable : false,
                    //     group_list : ["All Person","All Visitor"],
                    //     // fixed : true,
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
                customize_verify_indication : {},
                ////////////////////////////////////////////
                ////////////////////////////////////////////
                // enable_high_temperature_trigger_relay_1 : false,
                // high_temperature_trigger_relay_1_start_power : 1,
                // high_temperature_trigger_relay_1_delay : 3000,
                // high_temperature_trigger_relay_1_end_power : 0,
                // high_temperature_trigger_relay_1_schedule_list : [],
                // enable_high_temperature_trigger_relay_2 : false,
                // high_temperature_trigger_relay_2_start_power : 1,
                // high_temperature_trigger_relay_2_delay : 3000,
                // high_temperature_trigger_relay_2_end_power : 0,
                // high_temperature_trigger_relay_2_schedule_list : [],
                ////////////////////////////////////////////
                ////////////////////////////////////////////
                customize_indicator_message : null,
                customize_clock_in_function_name : null,
                customize_clock_out_function_name : null,
                customize_verify_indication_success_text : null,
                customize_verify_indication_success_message_text : null,
                customize_verify_indication_fail_text : null,
                customize_verify_indication_fail_message_text : null,
                customize_clock_indication_success_text : null,
                customize_clock_success_message_text : null,
                customize_clock_indication_fail_text : null,
                customize_clock_fail_message_text : null,
                customize_stranger_display_text : null,
                customize_high_temperature_message : null
            }
        };

        self.readFromFile = async function( cb ) {
            let data = null;
            try {
                let dbStr = fs.readFileSync( self.dbfileName ).toString('utf8');
                data = JSON.parse( dbStr );
                if( data.access_control_schedule_list ) {
                    data.access_control_schedule_list.forEach( s => {
                        if( !s.uuid || s.uuid == "" ) {
                            s["uuid"] = uuid();
                        }
                    });
                }
                if( data.high_temperature_sound_alert_schedule_list ) {
                    data.high_temperature_sound_alert_schedule_list.forEach( s => {
                        if( !s.uuid || s.uuid == "" ) {
                            s["uuid"] = uuid();
                        }
                    });
                }
            }
            catch(e) {
                data = self.defaultSettings();
                self.flushToFile( data );
            }
            return new Promise((resolve) => {
                if( cb ) cb(data);
                resolve( data );
            });
        };

        self.readFromFile( function( data ) {
            self.lockSettings( false );
        })
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
            //const originaldata = await self.readFromFile();
            if( data.access_control_schedule_list ) {
                data.access_control_schedule_list.forEach( s => {
                    if( !s.uuid || s.uuid == "" ) {
                        s["uuid"] = uuid();
                    }
                });
            }
            if( data.high_temperature_sound_alert_schedule_list ) {
                data.high_temperature_sound_alert_schedule_list.forEach( s => {
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

module.exports = airaFaceLiteSettings;
