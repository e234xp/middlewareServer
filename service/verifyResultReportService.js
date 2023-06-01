"use strict";

const SocketServer = require('ws').Server

class verifyResultReportService {
    constructor( server, uriPath ) {
        const self = this;

        self.wsServer = new SocketServer({
            path : uriPath,
            server : server
        });

        self.broadcast = function( msg ) {
            self.wsServer.clients.forEach( function each( client ) {
                try {
                    client.send( msg );
                }
                catch(e){}
            });
        };

        self.connectedClients = new Map();
        self.wsServer.on( "connection", ws => {
            //console.log('Client connected')
            const this_stream_id = Array.from( self.connectedClients.values() ).length;
            self.connectedClients.set( this_stream_id, ws );
            ws.on( "close", () => {
                //console.log('Close client connection')
                self.connectedClients.delete( this_stream_id );
            });
            ws.is_alive = true;
            ws.on('pong', () => { 
                ws.is_alive = true; } );
        })

        setInterval( function ping() {
            Array.from( self.connectedClients.values()).forEach(function each( client ) {
                if( !client.is_alive ) { client.terminate(); return; }
                client.is_alive = false;
                client.ping();
            });
        }, 10000 );
    };

    broadcastMessage = async function( message ) {
        const self = this;
        self.broadcast( message );
    }
}

module.exports = verifyResultReportService;
