/**
 * Stage Class
 */

var raf = require('raf');
var Helpers = require('../utils/Helpers');
var Particles = require('./Particles');
var Players = require('./Players');
var Bullets = require('./Bullets');
var Sprites = require('./Sprites');

module.exports = function() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    Helpers.attributes(canvas, {
        width: width,
        height: height,
        style: 'margin: 0; display: block;'
    });

    var particles = new Particles(ctx);
    var players = new Players(ctx, fireCallback, getTargetCallback);
    var bullets = new Bullets(ctx);
    var sprites = new Sprites(ctx, [
        {
            id: "expolsion",
            src: "/img/sprites/explosion.png",
            size: 64,
            sizeDest: 32,
            count: 20,
            framerate: 60
        }
    ]);

    var score = {
        rebel: 0,
        imperial: 0
    };

    resize();
    respawn();
    frame();

    /**
     * Fire Callback
     */

    function fireCallback(player) {

        bullets.create(player);

    }

    /**
     * Get Target Callback
     */

    function getTargetCallback(playerA) {

        var distance = 0;
        var closestTarget = null;

        players.each(function(playerB, index) {

            if (playerA.attributes.faction !== playerB.attributes.faction && playerB.attributes.isAlive) {

                var d = Helpers.distanceBetween(playerA.attributes, playerB.attributes);

                if (closestTarget === null || d < distance) {
                    closestTarget = playerB;
                    distance = d;
                }

            }

        });

        return closestTarget;

    }

    /**
     * Resize
     */

    function resize() {

        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        particles.resize();
        players.resize();
        bullets.resize();

    }

    function respawn() {
        players.each(function(player) {
            player.respawn();
        })
    }

    /**
     * Frame animation
     */

    function frame(time) {

        // Update Methods

        particles.update();
        players.update();
        bullets.update();
        sprites.update(time);

        collisionDetection();

        bullets.remove();

        // Draw Methods

        particles.draw();
        bullets.draw();
        players.draw();
        sprites.draw();

        drawScore();

        raf(frame);

    }

    function collisionDetection() {

        players.each(function(player, index) {

            if(player.attributes.isAlive) {

                bullets.each(function(bullet, index) {

                    if(player.attributes.faction !== bullet.attributes.owner.faction) {

                        var distance = Helpers.distanceBetween(player.attributes, bullet.attributes);

                        if(distance < player.attributes.size + bullet.attributes.size) {

                            bullet.attributes.isAlive = false;

                            player.attributes.health -= bullet.attributes.owner.weaponDamage;

                            player.attributes.isHit = true;

                            if (player.attributes.health <= 0) {

                                sprites.requestAnimation('expolsion', player.attributes.x, player.attributes.y);

                                player.killed();
                                score[bullet.attributes.owner.faction]++;
                                bullet.attributes.owner.score++;

                            }

                        }


                    }

                });

            }

        });

    }

    function drawScore() {

        ctx.textBaseline = 'bottom';

        ctx.fillStyle = 'rgba(51, 204, 255, 0.5)';
        ctx.fillText('Rebel: ' + score.rebel, 10, 20);

        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'rgba(255, 51, 0, 0.5)';
        ctx.fillText('Imperial: ' + score.imperial, 120, 20);

    }

    return {
        canvas: canvas,
        resize: resize
    }

}
