'use strict';

const IORedis = require( "ioredis" ); // "version": "4.17.3"
const kue = require( "kue" ); // "version": "0.11.6"

/*
const config = {
    server_type : "sentinel", // or single
    password : "aira",
    queue_or_topic_name : "name",
    // use for type single
    host : "",
    // use for type single
    port : 6379,
    // use for type sentinel
    sentinel_master : "mymaster",
    // use for type sentinel
    sentinels : [ 
        {
            host: '127.0.0.1',
            port: 26379
        }, {
            host: '127.0.0.1',
            port: 26380
        }, {
            host: '127.0.0.1',
            port: 26381
        }
    ]
};
*/

class RedisQueue {
    constructor( config ) {
        const self = this;
        self.lastPushError = "";
        self.lastPopError = "";
        self.callback = null;
        self.config = config;

        self.ioRedisClientPush= null;
        self.kueClientPush = null;

        self.ioRedisClientPop = null;
        self.kueClientPop = null;

        self.connectionOption = {};
        if( self.config.server_type === "single" ) {
            self.connectionOption = {
                port: self.config.port, // Redis port
                host: self.config.host, // Redis host
                family: 4, // 4 (IPv4) or 6 (IPv6)
                password: self.config.password,
                db: 0
            };
        }
        else if( self.config.server_type === "sentinel" ) {
            self.connectionOption = {
                sentinels: self.config.sentinels,
                name: self.config.sentinel_master,
                password: self.config.password,
                maxRetriesPerRequest : null
            };
        }

        self.stopPopping = function( cb ) {
            const self = this;
            if( self.kueClientPop ) {
                self.kueClientPop.shutdown( 0 , self.config.queue_or_topic_name, () => {
                    self.kueClientPop = null;
                    self.callback = null;
                    if( cb ) cb();
                });
            }
            else {
                if( cb ) cb();
            }
        };
    }
    async version() {
        return "v1.0.0"
    }

    async startPopString( numberOfDataForEachCallback, callback ) {
        const self = this;
        self.stopPopping( function() {
            if( callback ) {
                self.callback = callback;
                self.kueClientPop = kue.createQueue({
                    redis: {
                    createClientFactory: function () {
                            return new IORedis(self.connectionOption);
                        }
                    }
                });
                self.kueClientPop.on( 'error', function( err ) {
                    if( err ) self.lastPopError = `kue Pop : ${err}`;
                });
                self.kueClientPop.process( self.config.queue_or_topic_name, numberOfDataForEachCallback, function(job, ctx, done) {
                    if( self.callback ) {
                        self.callback( job.data );
                    }
                    done();
                });
            }
        })
    };

    async stopPopping() {
        const self = this;
        self.stopPopping();
    };

    async pushString( message, afterMs = 0, priority = 'high' ) {
        const self = this;
        if( self.kueClientPush == null ) {
            self.kueClientPush = kue.createQueue({
                redis: {
                createClientFactory: function () {
                        return new IORedis( self.connectionOption );
                    }
                }
            });
            self.kueClientPush.on( 'error', function( err ) {
                if( err ) self.lastPushError = `kue Push : ${err}`;
            })
        
        }
        self.kueClientPush.create( self.config.queue_or_topic_name, message ).delay( afterMs ).priority( priority ).save();
    };

    async send( message ) {
        const self = this;
        if( self.kueClientPush == null ) {
            self.kueClientPush = kue.createQueue({
                redis: {
                createClientFactory: function () {
                        return new IORedis( self.connectionOption );
                    }
                }
            });
            self.kueClientPush.on( 'error', function( err ) {
                if( err ) self.lastPushError = `kue Push : ${err}`;
            })
        
        }
        self.kueClientPush.create( self.config.queue_or_topic_name, message ).priority( 'high' ).save();
    };

    getLastError() {
        const self = this;
        return { push : self.lastPushError, pop : self.lastPopError };
    };
};


module.exports = RedisQueue;