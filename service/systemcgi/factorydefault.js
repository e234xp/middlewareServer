
"use strict";

const dataParser = require( "../../utility/dataParser" );
const fs = require( "fs" );
const path = require( "path" );
const httpRequest = require('request');

exports.call = function( req, res ) {
    // global.autolockdb( function() {
    //     let accountDbFiles = fs.readdirSync( global.dbAccountPath );
    //     for( let i = 0; i < accountDbFiles.length; i++ ) {
    //         let filename = path.join( global.dbAccountPath, accountDbFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };

    //     let dbFiles = fs.readdirSync( global.dbPath );
    //     for( let i = 0; i < dbFiles.length; i++ ) {
    //         let filename = path.join( global.dbPath, dbFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };
        
    //     let dbPhotoFolder = global.dbPath + "/dbPhoto"
    //     let dbPhotoFiles = fs.readdirSync( dbPhotoFolder );
    //     for( let i = 0; i < dbPhotoFiles.length; i++ ) {
    //         let filename = path.join( dbPhotoFolder, dbPhotoFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };

    //     let personLogFiles = fs.readdirSync( global.personVerifyResultPath );
    //     for( let i = 0; i < personLogFiles.length; i++ ) {
    //         let filename = path.join( global.personVerifyResultPath, personLogFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };

    //     let visitorLogFiles = fs.readdirSync( global.visitorVerifyResultPath );
    //     for( let i = 0; i < visitorLogFiles.length; i++ ) {
    //         let filename = path.join( global.visitorVerifyResultPath, visitorLogFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };
    //     let strangerLogFiles = fs.readdirSync( global.nonVerifyResultPath );
    //     for( let i = 0; i < strangerLogFiles.length; i++ ) {
    //         let filename = path.join( global.nonVerifyResultPath, strangerLogFiles[i] );
    //         let stat = fs.lstatSync( filename ); 
    //         if( stat.isDirectory() ) {}
    //         else {
    //             fs.unlinkSync( filename )
    //         };
    //     };

    //     res.send( { message : "ok" } );
    // });

    require('request')( {
        url: "http://127.0.0.1:8588/system/factorydefault",
        method: "POST",
        pool : {maxSockets: 10},
        time: true,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        },
        json: {} 
    }, function (error, response, body) {
        if( error ) res.status( 400 ).json( error );
        else res.send( body );
    });
}