"use strict";
const { resolve } = require('path');
const httpRequest = require('request');
const edgeDeviceService = require("../service/edgeDeviceService");
class edgeDeviceServiceHandler {
    constructor() {
        const self = this;
        self._edgeDeviceService = null;
        self.init = async function( settings, rootPath ) {
            self._edgeDeviceService = new edgeDeviceService( settings.manager_host, settings.manager_port, settings.manager_token_key, rootPath, settings.manager_enable );
            if( settings.manager_enable ) {
                self._edgeDeviceService.OnRequireDeviceInfo ( async function() {
                    return new Promise( (resolve) => {
                        var httpsParam = Object.assign( {}, {
                            method : "POST",
                            timeout : 5000,
                            pool : {maxSockets: 10},
                            rejectUnauthorized : false,
                            requestCert : true,
                            time : true,
                        });
                        httpsParam["url"] = `http://${global.localhost}/system/info`;
                        httpsParam["headers"] = {
                            "Content-Type" : "application/json"
                        };
                        httpsParam["json"] = {};
                        httpRequest( httpsParam, function (error, response, body) {
                            if( error ) { resolve( null ); }
                            else {
                                if( body.message === "ok" && body ) resolve( body );
                                else resolve( null );
                            }
                        });
                    })
                });
                self._edgeDeviceService.OnReportedToTenant( async function( success, ts ) {

                });
                self._edgeDeviceService.OnCleanupPersonDatabase( async function() {
                    if( global.globalSystemLog_info ) global.globalSystemLog_info( "manager cleanup person db.");

                    global.airaFaceLitePersonDb.removeAllNow();
                });
                
                self._edgeDeviceService.OnRequireCurrentPersonList( async function() {
                    let currentPersonList = [];
                    var personList = await global.airaFaceLitePersonDb.find("");
                    if( personList ) personList.forEach( person => {
                        currentPersonList.push({
                            person_uuid : person.uuid,
                            last_modify_date : (person.last_modify_date_by_manager ? person.last_modify_date_by_manager : 0)
                        });
                    });
                    return new Promise((resolve) => {
                        resolve( currentPersonList );
                    });
                });
                
                self._edgeDeviceService.OnRequireVerifyResult( async function( startTime, endTime, amount ) {
                    let resultListToSend = null;
                    const listFromDb = await global.airaTabletLitePersonVerifyResultReader.readDbSync( startTime, endTime, null, amount );
                    if( listFromDb ) {
                        resultListToSend = [];
                        listFromDb.forEach( rec => {
                            var verifyModeConverted = 0;
                            switch( rec.verify_mode ) {
                                case 1 : verifyModeConverted = 0; break;
                                case 2 : verifyModeConverted = 0; break;
                                case 3 : verifyModeConverted = 1; break;
                                case 4 : verifyModeConverted = 2; break;
                            };
                            resultListToSend.push({
                                verify_uuid : rec.verify_uuid,
                                target_score : rec.target_score,
                                verify_score : rec.verify_score,
                                timestamp : rec.timestamp,
                                high_temperature : rec.high_temperature,
                                temperature : rec.temperature,
                                verify_mode : verifyModeConverted, //  0 pass-mode, 1 clock-in, 2 clock-out, 3, 4
                                person_uuid : rec.uuid,
                                captured_image : rec.face_image ? rec.face_image : ""
                            })
                        });
                    }
                    return new Promise((resolve) => {
                        resolve( resultListToSend );
                    });
                });
                
                self._edgeDeviceService.OnRequireNonVerifyResult( async function( startTime, endTime, amount ) {
                    let resultListToSend = null;
                    const listFromDb = await global.airaTabletLiteNonVerifyResultReader.readDbSync( startTime, endTime, null, amount );
                    if( listFromDb ) {
                        resultListToSend = [];
                        listFromDb.forEach( rec => {
                            resultListToSend.push({
                                verify_uuid : rec.verify_uuid,
                                target_score : rec.target_score,
                                verify_score : rec.verify_score,
                                timestamp : rec.timestamp,
                                high_temperature : rec.high_temperature,
                                temperature : rec.temperature,
                                card_number : rec.card_number,
                                captured_image : rec.face_image ? rec.face_image : ""
                            })
                        });
                    }
                    return new Promise((resolve) => {
                        resolve( resultListToSend );
                    });
                });
                
                self._edgeDeviceService.OnPersonDataHaveToChange( async function( action, personUuid, personData, lastRecord ) {
                    
                    var dataToWrite = personData != null ? {
                        id : personData.id ? personData.id : "",
                        name : personData.name ? personData.name : "",
                        card_facility_code : personData.card_facility_code ? personData.card_facility_code : "",
                        card_number : personData.card_number ? personData.card_number : "",
                        assigned_group_list : personData.assigned_group_list ? personData.assigned_group_list : [],
                        extra_info : {
                            title : personData.extra_info ? personData.extra_info.title : "",
                            department : personData.extra_info ? personData.extra_info.department : "",
                            email: personData.extra_info ? personData.extra_info.email : "",
                            phone_number: personData.extra_info ? personData.extra_info.phone_number : "",
                            extension_number: personData.extra_info ? personData.extra_info.extension_number : ""
                        },
                        display_image : personData.display_image ? personData.display_image : "",
                        register_image : "",
                        face_feature : "",
                        begin_date : personData.begin_date ? personData.begin_date : 0,
                        expire_date : personData.expire_date ? personData.expire_date : 0,
                        create_date : personData.create_date ? personData.create_date : 0,
                        last_modify_date_by_manager : personData.last_modify_date ? personData.last_modify_date : 0
                    } : {};
                    switch( action ) {
                        case "add" : {
                            
                            dataToWrite["last_modify_date"] = personData.last_modify_date;
                            dataToWrite["uuid"] = personUuid;

                            if( personData.register_image ) {
                                var ff = await global.engineGenerateFaceFeature( personData.register_image );
                                dataToWrite["face_feature"] = ff.face_feature ? ff.face_feature : "";
                                dataToWrite["register_image"] = ff.face_image ? ff.face_image : "";
                            }
                            //console.log("add person end ", personData.register_image.length, dataToWrite["register_image"].length, dataToWrite["face_feature"].length );
                            await global.airaFaceLitePersonDb.update( personUuid, dataToWrite, false );
                        } break;
                        case "update" : {
                            //console.log("update person : ", personUuid );
                            if( personData.register_image ) {
                                var ff = await global.engineGenerateFaceFeature( personData.register_image );
                                dataToWrite["face_feature"] = ff.face_feature ? ff.face_feature : "";
                                dataToWrite["register_image"] = ff.face_image ? ff.face_image : "";
                            }
                            await global.airaFaceLitePersonDb.update( personUuid, dataToWrite, false );
                        } break;
                        case "delete" : {
                            //console.log("delete person : ", personUuid );
                            await global.airaFaceLitePersonDb.remove( personUuid, false );
                        } break;
                    }
                
                    if( lastRecord ) {
                        global.airaFaceLitePersonDb.flush();
                    }
                    return new Promise( resolve => {
                        resolve();
                    });
                });
                self._edgeDeviceService.start();
            }
        }
    }

    run = async function ( rootPath ) {
        const self = this;
        var settings = await global.airaFaceLiteManagerSettings.get();
        //console.log( settings, rootPath);
        self.init( settings, rootPath );
    };
}

module.exports = edgeDeviceServiceHandler;
