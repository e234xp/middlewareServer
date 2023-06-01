'use strict';
const { uuid } = require("uuidv4");
const dlc = require( "./dataLanguageConverter" );

function getNowFormatDate( specifiedTs ) {
    var date = specifiedTs ? new Date( specifiedTs ) : new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var strMonth = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (strMonth >= 1 && strMonth <= 9) strMonth = "0" + strMonth;
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    if (strHour >= 0 && strHour <= 9) strHour = "0" + strHour;
    if (strMin >= 0 && strMin <= 9) strMin = "0" + strMin;
    if (strSec >= 0 && strSec <= 9) strSec = "0" + strSec;
    var currentdate = date.getFullYear() + seperator1 + strMonth + seperator1 + strDate
            + " " + strHour + seperator2 + strMin
            + seperator2 + strSec;
    return currentdate;
}

async function getLang( cb ) {
    return new Promise((resolve) => {
        require('request')( {
            url: "http://127.0.0.1:8588/system/supportedlanguagelist",
            method: "POST",
            pool : {maxSockets: 10},
            time: true,
            timeout: 5000,
            headers: {
                "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
                "Pragma":"no-cache",
                'Content-Type': 'application/json'
            },
            json: {} 
        }, function (error, response, body) {
            let l = "zh";
            if( body ) {
                const langData = body;
                try {
                    const activeLangList = langData.list.filter( lang => { return lang.active === true; })
                    if( activeLangList.length > 0 ) {
                        l = activeLangList[0].language;
                    }
                }catch(e){}
            }
            if( cb ) cb( l );
            resolve( l );
        });
    });
}

let line_ImageRemaining = 1;
exports.go = async function( token, data ) {
    //const token = `Bearer 1A0ap0hi2v76fFbpMJaOalMxhhwWKjo6ziqHG9ANwYC`;
    try{
        let langInUse = global.checkLang();

        const notifyFormData= {
            message : "\n" + dlc.getStringFronLang(langInUse,"time") + " : " + getNowFormatDate( data.timestamp ) + "\n"
        };
        if( data.identity != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"identity") + " : " + dlc.getStringFronLang(langInUse,data.identity) + "\n";
        if( data.department != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"department") + " : " + data.department + "\n";
        if( data.title != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"title") + " : " + data.title + "\n";
        if( data.group_list != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"group_list") + " : " + data.group_list + "\n";
        if( data.id != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"id") + " : " + data.id + "\n";
        if( data.name != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"name") + " : " + data.name + "\n";
        if( data.card_number != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"card_number") + " : " + data.card_number + "\n";
        if( data.email != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"email") + " : " + data.email + "\n";
        if( data.phone_number != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"phone_number") + " : " + data.phone_number + "\n";
        if( data.extension_number != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"extension_number") + " : " + data.extension_number + "\n";
        if( data.remarks != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"remarks") + " : " + data.remarks + "\n";
        if( data.foreHead_temperature != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"foreHead_temperature") + " : " + data.foreHead_temperature + "\n";
        if( data.is_high_temperature != null ) notifyFormData.message += dlc.getStringFronLang(langInUse,"is_high_temperature") + " : " + dlc.getStringFronLang(langInUse, data.is_high_temperature ? "yes" : "no" ) + "\n";
        
        if( line_ImageRemaining > 0 && data.display_image && data.display_image.length > 0 ) {
            notifyFormData["imageFile"] = {
                value : Buffer.from( data.display_image, "base64"),
                options : {
                    "filename" : "airaface_" + uuid() + ".jpg",
                    "contentType" : "image/jpeg"
                }
            }
        }

        require( "request" )({
            url : "https://notify-api.line.me/api/notify",
            method : "POST",
            pool : { maxSockets : 10 },
            time : true,
            timeout : 3000,
            headers : {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "multipart/form-data"
            },
            formData : notifyFormData
        }, function ( error, response, body ) {

            global.globalSystemLog_info( "line action : token<" + token + "> [" + ( error ? error.toString() : "ok") + "]" );

            line_ImageRemaining = 1;
            if( response && response.headers ) {
                if( response.headers["x-ratelimit-imageremaining"] ) line_ImageRemaining = response.headers["x-ratelimit-imageremaining"];
                else if( response.headers["X-RateLimit-ImageRemaining"] ) line_ImageRemaining = response.headers["X-RateLimit-ImageRemaining"];
            }
        });
    }
    catch(e){
        line_ImageRemaining = 1;
    };
}
