'use strict';

exports.removeItemFromArray = function( array, key, value ) {
    let removeIndex = array.map( function(item){ return eval( 'item.' + key ); }).indexOf( value );
    if( removeIndex > -1 ) {
        array.splice(removeIndex, 1);
    }
}