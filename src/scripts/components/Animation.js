/**
 * Animation
 */

module.exports = function(definition) {

    var api = {
        inUse: false,
        time: 0,
        definition: definition,
        play: play
    }

    function play() {

        api.time = 0;

    }

    return api;

}
