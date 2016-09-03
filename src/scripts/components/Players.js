/**
 * Players
 */

var numConvert = require('number-to-words');
var Player = require('./Player');

module.exports = function(ctx, fireCallback, getTargetCallback) {

    var playerCount = 30;

    var players = [];

    var playerType = ['rebel', 'imperial'];

    var rebels = [];
    var imperials = [];

    playerControls = [];
    var playerControls = [{ up: 87, down: 83, left: 65, right: 68, shoot: 32 }];
    // var playerControls = [{ up: 87, down: 83, left: 65, right: 68, shoot: 32 }, { up: 38, down: 40, left: 37, right: 39, shoot: 13 }];

    for(var i = 0; i < playerCount; i++) {

        // Random Faction

        var j = i + 1;

        var rebelName = 'Red ' + numConvert.toWords(i);
        var imperialName = 'TIE ' + numConvert.toWords(i);

        var factionColor;

        var faction = {
            name: playerType[i % 2]
        };

        if(faction.name === 'rebel') {
            faction.color = '51, 204, 255';
            faction.playerName = rebelName;
        } else {
            faction.color = '255, 51, 0';
            faction.playerName = imperialName;
        }

        var player = new Player(ctx, faction, playerControls[i] === undefined ? null : playerControls[i], fireCallback, getTargetCallback);

        players.push(player);


    }

    function update() {

        for(var i = 0; i < playerCount; i++) {

            var player = players[i];
            player.update();

        }
    }

    function draw() {

        for(var i = 0; i < playerCount; i++) {

            var player = players[i];
            player.draw();

        }

    }

    function resize() {

        for(var i = 0; i < playerCount; i++) {

            var player = players[i];
            player.resize();

        }

    }

    function each(callback) {

        for(var i = 0; i < playerCount; i++) {

            callback(players[i], i);

        }

    }

    return {
        update: update,
        draw: draw,
        resize: resize,
        each: each
    }

}
