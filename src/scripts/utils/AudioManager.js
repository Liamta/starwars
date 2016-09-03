/**
 * Audio api
 */

var audioSrc = require('../data/sounds.json');

module.exports = function() {

    var sounds = [];

    for(var obj in audioSrc) {

        if(audioSrc.hasOwnProperty(obj)) {

            var sound = audioSrc[obj];

            sounds.push(sound);

        }

    }

    return {
    }

}
