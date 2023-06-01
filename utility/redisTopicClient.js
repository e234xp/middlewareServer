'use strict';

const IORedis = require( "ioredis" ); // "version": "4.17.3"

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

class RedisTopic {
    constructor( config ) {
        const self = this;
        self.callback = null;
        self.config = config;

        self.subscriptionClient = null;
        self.lastSubscriptionError = "";

        self.publishClient = null;
        self.lastPublishError = "";

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

        self.stopMessageCallback = function() {
            const self = this;
            self.callback = null;
            if( self.subscriptionClient ) {
                self.subscriptionClient.unsubscribe( self.config.queue_or_topic_name, function (err, count) {
                    if( err ) {
                        self.lastSubscriptionError = `subscription : ${err}`;
                    }
                    else {
                        self.lastSubscriptionError = "";
                    }
                });
                self.subscriptionClient.quit();
            }
            self.subscriptionClient = null;
        };
    }
    async version() {
        return "v1.0.0"
    }

    setMessageStringCallback( callback ) {
        const self = this;
        self.callback = callback;
        if( callback ) {
            if( self.subscriptionClient == null ) {
                self.subscriptionClient = new IORedis(self.connectionOption);
                self.subscriptionClient.on("ready", function() { 
                    self.lastSubscriptionError = "";
                });
                self.subscriptionClient.on("connect", function() { 
                    self.lastSubscriptionError = "subscription : connecting";
                });
                self.subscriptionClient.on("reconnecting", function () { 
                    self.lastSubscriptionError = "reconnecting";
                });
                self.subscriptionClient.on("close", function() { 
                    self.lastSubscriptionError = "subscription : close";
                });
                self.subscriptionClient.on("error", function( error ) { 
                    self.lastSubscriptionError = `subscription : ${error}`;
                });
                self.subscriptionClient.on("end", function() { 
                    self.lastSubscriptionError = "subscription : end";
                });
                self.subscriptionClient.on("message", function (channel, message) {
                    if( self.callback ) {
                        //if( channel === self.config.queue_or_topic_name ) {
                            self.callback( message );
                        //}
                    }
                });
                self.subscriptionClient.subscribe( self.config.queue_or_topic_name, function (err, count) {
                    if( err ) {
                        self.lastSubscriptionError = `subscription : ${err}`;
                    }
                    else {
                        self.lastSubscriptionError = "";
                    }
                });
            }
        }
        else {
            sefl.stopMessageCallback()
        }
    };

    sendMessageString( message ) {
        const self = this;
        if( self.publishClient == null ) {
            self.publishClient = new IORedis(self.connectionOption);
            self.publishClient.on("ready", function() { 
                self.lastPublishError = "";
            });
            self.publishClient.on("connect", function() { 
                self.lastPublishError = "publish : connecting";
            });
            self.publishClient.on("reconnecting", function () { 
                self.lastPublishError = "publish : reconnecting";
            });
            self.publishClient.on("close", function() { 
                self.lastPublishError = "publish : close";
            });
            self.publishClient.on("error", function( error ) { 
                self.lastPublishError = `publish : ${error}`;
            });
            self.publishClient.on("end", function() { 
                self.lastPublishError = "publish : end";
            });
        }
        return self.publishClient.publish( self.config.queue_or_topic_name, message ).catch(error => {
            self.lastPublishError = `publish : ${error}`;
            return -1;
        });
    };

    send( message ) {
        const self = this;
        if( self.publishClient == null ) {
            self.publishClient = new IORedis(self.connectionOption);
            self.publishClient.on("ready", function() { 
                self.lastPublishError = "";
            });
            self.publishClient.on("connect", function() { 
                self.lastPublishError = "publish : connecting";
            });
            self.publishClient.on("reconnecting", function () { 
                self.lastPublishError = "publish : reconnecting";
            });
            self.publishClient.on("close", function() { 
                self.lastPublishError = "publish : close";
            });
            self.publishClient.on("error", function( error ) { 
                self.lastPublishError = `publish : ${error}`;
            });
            self.publishClient.on("end", function() { 
                self.lastPublishError = "publish : end";
            });
        }
        //console.log( self.config.queue_or_topic_name );
        return self.publishClient.publish( self.config.queue_or_topic_name, message ).catch(error => {
            self.lastPublishError = `publish : ${error}`;
            return -1;
        });
    };

    getLastError() {
        const self = this;
        return { publish : self.lastPublishError, subscription : self.lastSubscriptionError };
    };
};


module.exports = RedisTopic;