'use strict';

exports.getStringFronLang = function( lang, key ) {
    if( lang == "en" ) {
        switch( key ) {
            case "time" : return "Time";
            case "name" : return "Name";
            case "id" : return "Id";
            case "card_number" : return "Card Number";
            case "group_list" : return "Group List";
            case "title" : return "Title";
            case "department" : return "Department";
            case "email" : return "Email";
            case "phone_number" : return "Phone Number";
            case "extension_number" : return "Extension Number";
            case "remarks" : return "Remarks";
            case "foreHead_temperature" : return "Temperature";
            case "is_high_temperature" : return "High Temperature";
            case "verify_mode" : return "Verify Mode";
            case "identity" : return "Identity";
            case "stranger" : return "Stranger";
            case "person" : return "Person";
            case "visitor" : return "Visitor";
            case "yes" : return "Yes";
            case "no" : return "No";
        }
    }
    else if( lang == "jp" ) {
        switch( key ) {
            case "time" : return "時間";
            case "name" : return "名前";
            case "id" : return "ID";
            case "card_number" : return "カード番号";
            case "group_list" : return "グループリスト";
            case "title" : return "タイトル";
            case "department" : return "部署";
            case "email" : return "Email";
            case "phone_number" : return "電話番号";
            case "extension_number" : return "内線番号";
            case "remarks" : return "備考";
            case "foreHead_temperature" : return "温度";
            case "is_high_temperature" : return "温度異常";
            case "verify_mode" : return "認証モード";
            case "identity" : return "識別";
            case "stranger" : return "未登録";
            case "person" : return "パーソン";
            case "visitor" : return "ビジター";
            case "yes" : return "はい";
            case "no" : return "いいえ";
        }
    }
    else {
        switch( key ) {
            case "time" : return "時間";
            case "name" : return "姓名";
            case "id" : return "編號";
            case "card_number" : return "卡號";
            case "group_list" : return "群組";
            case "title" : return "職稱";
            case "department" : return "部門";
            case "email" : return "信箱";
            case "phone_number" : return "電話";
            case "extension_number" : return "分機";
            case "remarks" : return "備註";
            case "foreHead_temperature" : return "額溫";
            case "is_high_temperature" : return "體溫過高";
            case "verify_mode" : return "辨識模式";
            case "identity" : return "身份別";
            case "stranger" : return "陌生人";
            case "person" : return "人員";
            case "visitor" : return "訪客";
            case "yes" : return "是";
            case "no" : return "否";
        }
    }
    return "";
};
