
"use strict";

const dataParser = require( "../../utility/dataParser" );
const lineSender = require( "../../utility/lineSender" );
const mailSender = require( "../../utility/mailSender" );
const httpSender = require( "../../utility/httpSender" );

function weekStartTime() {
    var now = new Date();
    var startDay = 0; //0=sunday, 1=monday etc.
    var d = now.getDay(); //get the current day
    var datStartOfWeek = new Date( now.valueOf() - (d<=0 ? 7-startDay:d-startDay)*86400000); //rewind to start day
    return new Date( datStartOfWeek.getFullYear(), datStartOfWeek.getMonth(), datStartOfWeek.getDate(), 0, 0, 0);
}

function scheduleIsValid( scheduleList, specifiedTimeList ) {
    let ok = false;
    const now = Date.now();
    if( scheduleList.list ) {
        const wkStartTime = weekStartTime();
        scheduleList.list.forEach( schedule => {
            const timeOfStartOfDay = wkStartTime.getTime() + (schedule.day_of_week * 86400000);
            schedule.hours_list.forEach( hour => {
                const startToCheck = timeOfStartOfDay + hour * 3600000;
                const endToCheck = timeOfStartOfDay + ((hour + 1) * 3600000) - 1;
                //console.log( timeOfStartOfDay, startToCheck, endToCheck, now )
                if( now >= startToCheck && now <= endToCheck ) ok = true;
            });
        });
    }
    if( !ok && specifiedTimeList.list ) {
        specifiedTimeList.list.forEach( specifiedTime => {
            if( now >= specifiedTime.start_time && now <= specifiedTime.end_time ) ok = true;
        });
    }
    return ok;
}

function generageDataFromSetting( origianlData, dataList ) {
    const data = {};
    try {
        if( dataList && origianlData ) {
            /*
            data_list : {
                show_identity : true,
                person : {
                    id : true,
                    name : true,
                    card_number : false,
                    group_list : true,
                    title : false,
                    department : false,
                    email : false,
                    phone_number : false,
                    extension_number : false,
                    remarks : false,
                },
                foreHead_temperature : true,
                is_high_temperature : true,
                display_image : "register"
            },
            */
            const person = dataList.person;
            // "extra_info":{"title":"","department":"","email":"jack.lee@aira.com.tw","phone_number":"","extension_number":"","remarks":""}
            if( person && origianlData.person ) {
                if( person.id === true ) data["id"] = origianlData.person.id;
                if( person.name === true ) data["name"] = origianlData.person.name;
                if( person.card_number === true ) data["card_number"] = origianlData.person.card_number;
                if( person.group_list === true ) data["group_list"] = origianlData.person.group_list;
                if( person.title === true ) data["title"] = origianlData.person.extra_info.title;
                if( person.department === true ) data["department"] = origianlData.person.extra_info.department;
                if( person.email === true ) data["email"] = origianlData.person.extra_info.email;
                if( person.phone_number === true ) data["phone_number"] = origianlData.person.extra_info.phone_number;
                if( person.extension_number === true ) data["extension_number"] = origianlData.person.extra_info.extension_number;
                if( person.remarks === true ) data["remarks"] = origianlData.person.extra_info.remarks;
            }

            if( origianlData.timestamp ) data["timestamp"] = origianlData.timestamp;
            else data["timestamp"] = Date.now();
            
            if( dataList.show_identity === true ) {
                if( origianlData.is_stranger === true ) data["identity"] = "stranger";
                else if( origianlData.is_person === true ) data["identity"] = "person";
                else data["identity"] = "visitor";
            }
            if( dataList.foreHead_temperature === true ) {
                data["foreHead_temperature"] = origianlData.foreHead_temperature;
            }
            if( dataList.is_high_temperature === true ) {
                data["is_high_temperature"] = origianlData.is_high_temperature;
            }
            switch( dataList.display_image ) {
                case "captured" : data["display_image"] = origianlData.face_image ? origianlData.face_image : ""; break;
                case "display" : data["display_image"] = origianlData.person && origianlData.person.display_image ? origianlData.person.display_image : ""; break;
                case "register" : data["display_image"] = origianlData.person && origianlData.person.register_image ? origianlData.person.register_image : ""; break;
                default : data["display_image"] = ""; break;
            }
        }
        // appendCustomData( data, httpAction.custom_data_list )
        // if( httpAction.custom_data_list && httpAction.custom_data_list.length > 0 ) {
        //     httpAction.custom_data_list.forEach( d => {
        //         if( d.field_key && d.field_data ) {
        //             newDataToSend[ d.field_key ] = d.field_data;
        //         }
        //     });
        // }
    }
    catch(e){}
    return data;
};

function generageJsonStringFromCustomData( origianlData, customDataString ) {
    let newCustomDataString = customDataString;
    try {
        if( newCustomDataString.length > 0 ) {
            //const person = dataList.person;
            if( origianlData.person ) {
                newCustomDataString = newCustomDataString.replace( /\"##PersonId##\"/gi, '"' + origianlData.person.id + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##PersonName##\"/gi, '"' + origianlData.person.name + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##CardNumber##\"/gi, '"' + origianlData.person.card_number + '"' );
                let groupListString = "[";
                if( origianlData.person.group_list.length > 0 ) {
                    groupListString += origianlData.person.group_list.toString();
                     origianlData.person.group_list.forEach( group => {
                         if( groupListString.length > 1 ) groupListString += ",";
                         groupListString += '"' + group + '"';
                    })
                }
                groupListString += "]";
                newCustomDataString = newCustomDataString.replace( /\"##Group##\"/gi, groupListString );

                newCustomDataString = newCustomDataString.replace( /\"##JobTitle##\"/gi, '"' + origianlData.person.title + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##Department##\"/gi, '"' + origianlData.person.extra_info.department + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##EmailAddress##\"/gi, '"' + origianlData.person.extra_info.email + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##PhoneNumber##\"/gi, '"' + origianlData.person.extra_info.phone_number + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##ExtensionNumber##\"/gi, '"' + origianlData.person.extra_info.extension_number + '"' );
                newCustomDataString = newCustomDataString.replace( /\"##Remarks##\"/gi, '"' + origianlData.person.extra_info.remarks + '"' );
            }

            if( origianlData.is_stranger === true ) {
                newCustomDataString = newCustomDataString.replace( /\"##IsStranger##\"/gi, "true" );
            }
            else {
                newCustomDataString = newCustomDataString.replace( /\"##IsStranger##\"/gi, "false" );
            }

            newCustomDataString = newCustomDataString.replace( /\"##VerifiedTimeStamp##\"/gi, '"' + origianlData.timestamp + '"' );
            newCustomDataString = newCustomDataString.replace( /\"##Temperature##\"/gi, origianlData.foreHead_temperature.toString() );
            newCustomDataString = newCustomDataString.replace( /\"##IsHighTemperature##\"/gi, origianlData.is_high_temperature.toString() );
            
            newCustomDataString = newCustomDataString.replace( /\"##CapturedPhoto##\"/gi, '"' + (origianlData.face_image ? origianlData.face_image : "") + '"' );
            newCustomDataString = newCustomDataString.replace( /\"##RegisterPhoto##\"/gi, '"' + (origianlData.person && origianlData.person.register_image ? origianlData.person.register_image : "") + '"' );
            newCustomDataString = newCustomDataString.replace( /\"##DisplayPhoto##\"/gi, '"' + (origianlData.person && origianlData.person.display_image ? origianlData.person.display_image : "") + '"' );
        }
        //data = JSON.parse(newCustomDataString);
    }
    catch(e){}
    return newCustomDataString;
};


function generageStringFromCustomData( origianlData, customDataString ) {
    let newCustomDataString = customDataString;
    try {
        if( newCustomDataString.length > 0 ) {
            //const person = dataList.person;
            if( origianlData.person ) {
                newCustomDataString = newCustomDataString.replace( /##PersonId##/gi, origianlData.person.id );
                newCustomDataString = newCustomDataString.replace( /##PersonName##/gi, origianlData.person.name );
                newCustomDataString = newCustomDataString.replace( /##CardNumber##/gi, origianlData.person.card_number );
                let groupListString = "";
                if( origianlData.person.group_list.length > 0 ) {
                    groupListString += origianlData.person.group_list.toString();
                     origianlData.person.group_list.forEach( group => {
                         if( groupListString.length > 1 ) groupListString += ",";
                         groupListString += group;
                    })
                }
                newCustomDataString = newCustomDataString.replace( /##Group##/gi, groupListString );

                newCustomDataString = newCustomDataString.replace( /##JobTitle##/gi, origianlData.person.title );
                newCustomDataString = newCustomDataString.replace( /##Department##/gi, origianlData.person.extra_info.department );
                newCustomDataString = newCustomDataString.replace( /##EmailAddress##/gi, origianlData.person.extra_info.email );
                newCustomDataString = newCustomDataString.replace( /##PhoneNumber##/gi, origianlData.person.extra_info.phone_number );
                newCustomDataString = newCustomDataString.replace( /##ExtensionNumber##/gi, origianlData.person.extra_info.extension_number );
                newCustomDataString = newCustomDataString.replace( /##Remarks##/gi, origianlData.person.extra_info.remarks );
            }

            if( origianlData.is_stranger === true ) {
                newCustomDataString = newCustomDataString.replace( /##IsStranger##/gi, "true" );
            }
            else {
                newCustomDataString = newCustomDataString.replace( /##IsStranger##/gi, "false" );
            }

            newCustomDataString = newCustomDataString.replace( /##VerifiedTimeStamp##/gi, origianlData.timestamp );
            newCustomDataString = newCustomDataString.replace( /##Temperature##/gi, origianlData.foreHead_temperature.toString() );
            newCustomDataString = newCustomDataString.replace( /##IsHighTemperature##/gi, origianlData.is_high_temperature.toString() );
            
            newCustomDataString = newCustomDataString.replace( /##CapturedPhoto##/gi, origianlData.face_image ? origianlData.face_image : "" );
            newCustomDataString = newCustomDataString.replace( /##RegisterPhoto##/gi, origianlData.person && origianlData.person.register_image ? origianlData.person.register_image : "" );
            newCustomDataString = newCustomDataString.replace( /##DisplayPhoto##/gi, origianlData.person && origianlData.person.display_image ? origianlData.person.display_image : "" );
        }
    }
    catch(e){}
    return newCustomDataString;
};


function generageUrlEncodedStringFromCustomData( origianlData, customDataString ) {
    let newCustomDataString = customDataString;
    try {
        if( newCustomDataString.length > 0 ) {
            //const person = dataList.person;
            if( origianlData.person ) {
                newCustomDataString = newCustomDataString.replace( /##PersonId##/gi, encodeURIComponent(origianlData.person.id) );
                newCustomDataString = newCustomDataString.replace( /##PersonName##/gi, encodeURIComponent(origianlData.person.name) );
                newCustomDataString = newCustomDataString.replace( /##CardNumber##/gi, encodeURIComponent(origianlData.person.card_number) );
                let groupListString = "";
                if( origianlData.person.group_list.length > 0 ) {
                    groupListString += origianlData.person.group_list.toString();
                     origianlData.person.group_list.forEach( group => {
                         if( groupListString.length > 1 ) groupListString += ",";
                         groupListString += group;
                    })
                }
                newCustomDataString = newCustomDataString.replace( /##Group##/gi, encodeURIComponent(groupListString) );

                newCustomDataString = newCustomDataString.replace( /##JobTitle##/gi, encodeURIComponent(origianlData.person.title) );
                newCustomDataString = newCustomDataString.replace( /##Department##/gi, encodeURIComponent(origianlData.person.extra_info.department) );
                newCustomDataString = newCustomDataString.replace( /##EmailAddress##/gi, encodeURIComponent(origianlData.person.extra_info.email) );
                newCustomDataString = newCustomDataString.replace( /##PhoneNumber##/gi, encodeURIComponent(origianlData.person.extra_info.phone_number) );
                newCustomDataString = newCustomDataString.replace( /##ExtensionNumber##/gi, encodeURIComponent(origianlData.person.extra_info.extension_number) );
                newCustomDataString = newCustomDataString.replace( /##Remarks##/gi, encodeURIComponent(origianlData.person.extra_info.remarks) );
            }

            if( origianlData.is_stranger === true ) {
                newCustomDataString = newCustomDataString.replace( /##IsStranger##/gi, "true" );
            }
            else {
                newCustomDataString = newCustomDataString.replace( /##IsStranger##/gi, "false" );
            }

            newCustomDataString = newCustomDataString.replace( /##VerifiedTimeStamp##/gi, encodeURIComponent(origianlData.timestamp) );
            newCustomDataString = newCustomDataString.replace( /##Temperature##/gi, encodeURIComponent(origianlData.foreHead_temperature.toString()) );
            newCustomDataString = newCustomDataString.replace( /##IsHighTemperature##/gi, encodeURIComponent(origianlData.is_high_temperature.toString()) );
            
            newCustomDataString = newCustomDataString.replace( /##CapturedPhoto##/gi, encodeURIComponent(origianlData.face_image ? origianlData.face_image : "") );
            newCustomDataString = newCustomDataString.replace( /##RegisterPhoto##/gi, encodeURIComponent(origianlData.person && origianlData.person.register_image ? origianlData.person.register_image : "") );
            newCustomDataString = newCustomDataString.replace( /##DisplayPhoto##/gi, encodeURIComponent(origianlData.person && origianlData.person.display_image ? origianlData.person.display_image : "") );
        }
    }
    catch(e){}
    return newCustomDataString;
};

exports.call = function( req, res ) {
    const reqData = dataParser.circularJsonParser( req.body );
    // {
    //     verify_mode : 0, // or 1 , 2
    //     face_image : "base64 jpg string",
    //     is_stranger : false, // or person or visitor
    //     is_person : false, // or visitor
    //     person : {
    //         id : "1",
    //         name : "",
    //         card_number : "",
    //         group_list :["All Person"],
    //         title : "",
    //         department : "",
    //         email : "",
    //         phone_number : "",
    //         extension_number : "",
    //         remarks : "",
    //         display_image : "",
    //         register_image : ""
    //     },
    //     foreHead_temperature : 36.0,
    //     foreHead_temperature_image : "base64 jpg string",
    //     is_high_temperature : false
    // }
    if( reqData ) {
        // console.log( "reqData : ", reqData );
        ///////////////////////////////////////////////////
        ///////////////// ws broadcast ////////////////////
        ///////////////////////////////////////////////////
        try { global.verifyResultReportService.broadcastMessage( JSON.stringify(reqData) );} catch(e){}
        try { global.verifyResultReportService_nonSsl.broadcastMessage( JSON.stringify(reqData) );} catch(e){}
        try {
            global.airaFaceLiteEventSettings.get( function( settings ) {
                if( settings ) {
                    ///////////////////////////////////////////////////
                    /////////////////      line      //////////////////
                    ///////////////////////////////////////////////////
                    if( settings.line_actions_list ) {
                        //const testToken = "1A0ap0hi2v76fFbpMJaOalMxhhwWKjo6ziqHG9ANwYC";
                        settings.line_actions_list.forEach( lineAction => {
                            if( lineAction.enable === true ) {
                                let triggerPass = true;
                                switch( lineAction.temperature_trigger_rule ) {
                                    case 1 : triggerPass = !reqData.is_high_temperature; break;
                                    case 2 : triggerPass = reqData.is_high_temperature; break;
                                }

                                let groupPass = false;
                                try {
                                    if( !lineAction.group_list || lineAction.group_list.length == 0 ) {
                                        if( !reqData.person || reqData.person.group_list.length == 0 ) {
                                            groupPass = true;
                                        }
                                    }
                                    else {
                                        const g = lineAction.group_list.filter( group => {
                                            if( reqData.person && reqData.person.group_list ) {
                                                const pglist = reqData.person.group_list.filter( pg => { return pg == group; });
                                                return (pglist.length > 0)
                                            }
                                            else return false;
                                        });
                                        groupPass = ( g.length > 0 );
                                    }
                                }
                                catch(e){}
                                if( triggerPass && groupPass && scheduleIsValid( lineAction.weekly_schedule ? lineAction.weekly_schedule : null, lineAction.specify_time ? lineAction.specify_time : null ) ) {
                                    const newDataToSend = generageDataFromSetting( reqData, lineAction.data_list );
                                    lineSender.go( lineAction.token, newDataToSend );
                                }
                            }
                        });
                    }
                    if( settings.mail_actions_list ) {
                        settings.mail_actions_list.forEach( mailAction => {
                            if( mailAction.enable === true ) {
                                let triggerPass = true;
                                switch( mailAction.temperature_trigger_rule ) {
                                    case 1 : triggerPass = !reqData.is_high_temperature; break;
                                    case 2 : triggerPass = reqData.is_high_temperature; break;
                                }

                                let groupPass = false;
                                try {
                                    if( !mailAction.group_list || mailAction.group_list.length == 0 ) {
                                        if( !reqData.person || reqData.person.group_list.length == 0 ) {
                                            groupPass = true;
                                        }
                                    }
                                    else {
                                        const g = mailAction.group_list.filter( group => {
                                            if( reqData.person && reqData.person.group_list ) {
                                                const pglist = reqData.person.group_list.filter( pg => { return pg == group; });
                                                return (pglist.length > 0)
                                            }
                                            else return false;
                                        });
                                        groupPass = ( g.length > 0 );
                                    }
                                }
                                catch(e){}
                                if( triggerPass && groupPass && scheduleIsValid( mailAction.weekly_schedule ? mailAction.weekly_schedule : null, mailAction.specify_time ? mailAction.specify_time : null ) ) {
                                    const newDataToSend = generageDataFromSetting( reqData, mailAction.data_list );
                                    mailSender.go( 
                                        mailAction.method, 
                                        mailAction.host, 
                                        mailAction.port, 
                                        mailAction.secure,
                                        mailAction.user, 
                                        mailAction.pass, 
                                        mailAction.from, 
                                        mailAction.to, 
                                        mailAction.cc, 
                                        mailAction.bcc, 
                                        mailAction.subject, 
                                        newDataToSend 
                                    )
                                }
                            }
                        });
                    }
                    if( settings.http_actions_list ) {
                        settings.http_actions_list.forEach( httpAction => {
                            if( httpAction.enable === true ) {
                                let triggerPass = true;
                                switch( httpAction.temperature_trigger_rule ) {
                                    case 1 : triggerPass = !reqData.is_high_temperature; break;
                                    case 2 : triggerPass = reqData.is_high_temperature; break;
                                }
                                //console.log( "triggerPass : ", triggerPass, reqData.is_high_temperature );

                                let groupPass = false;
                                try {
                                    if( !httpAction.group_list || httpAction.group_list.length == 0 ) {
                                        if( !reqData.person || reqData.person.group_list.length == 0 ) {
                                            groupPass = true;
                                        }
                                    }
                                    else {
                                        const g = httpAction.group_list.filter( group => {
                                            if( reqData.person && reqData.person.group_list ) {
                                                const pglist = reqData.person.group_list.filter( pg => { return pg == group; });
                                                return (pglist.length > 0)
                                            }
                                            else return false;
                                        });
                                        groupPass = ( g.length > 0 );
                                    }
                                }
                                catch(e){}
                                if( triggerPass && groupPass && scheduleIsValid( httpAction.weekly_schedule ? httpAction.weekly_schedule : null, httpAction.specify_time ? httpAction.specify_time : null ) ) {
                                    //const newDataToSend = generageDataFromSetting( reqData, httpAction.data_list );
                                    const methodType = httpAction.method ? httpAction.method.toUpperCase() : "POST";
                                    const customDataType = httpAction.data_type ? httpAction.data_type.toUpperCase() : "JSON";
                                    const customDataToSend = customDataType == "JSON" ? generageJsonStringFromCustomData( reqData, httpAction.custom_data ) : generageStringFromCustomData( reqData, httpAction.custom_data );
                                    //const reformUrl = generageStringFromCustomData( reqData, httpAction.url );
                                    const reformUrl = generageUrlEncodedStringFromCustomData( reqData, httpAction.url );

                                    //encodeURIComponent( urlChecked )
                                    //console.log( reqData, httpAction.custom_data );
                                    httpSender.go(  
                                        (methodType == "GET") ? methodType : "POST",
                                        httpAction.host,
                                        httpAction.port, 
                                        httpAction.https,
                                        httpAction.user, 
                                        httpAction.pass, 
                                        reformUrl,
                                        customDataType,
                                        customDataToSend
                                    );
                                }
                            }
                        });
                    }
                }
            });
        } catch(e) {}        
    }
    res.send( { message : "ok" } );
}
