'use strict';

const crypto = require('crypto');
const algorithm = 'aes-128-cbc';
//const key = Buffer.from( 'AIRA@#ABCDEFGHIJKLMNOPQRSTUVWXYZ' ); // for 256 bits
const key = Buffer.from( 'AIRACLOUDSERVICE' ); // for 128 bits
const iv = Buffer.from( '0123456789ABCDEF' );

exports.encryption = function( text ) {
    let cipher = crypto.createCipheriv( algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

exports.decription = function( text ) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv( algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}