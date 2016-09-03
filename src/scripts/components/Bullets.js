
var Bullet = require('./Bullet');
var AudioManager = require('../utils/AudioManager');

module.exports = function(ctx) {

    var width;
    var height;

    var audioManager = new AudioManager();

    var bulletCount = 0;
    var bullets = [];

    function create(owner) {

        var bullet = new Bullet(owner.x, owner.y, owner.currentAngle, owner);

        bullets.push(bullet);

        bulletCount = bullets.length;

    }

    /**
     * Draw Particle
     */

    function draw() {

        for (var j = 0; j < bulletCount; j++ ) {

            var bullet = bullets[j];

            ctx.beginPath();

            ctx.strokeStyle = bullet.attributes.color;
            ctx.lineWidth = 2;
            ctx.moveTo(bullet.attributes.x, bullet.attributes.y);
            ctx.lineTo(bullet.attributes.x + bullet.attributes.vx * 1.6, bullet.attributes.y + bullet.attributes.vy * 1.6);
            ctx.stroke();

            // ctx.fillStyle = bullet.attributes.color;
            // ctx.arc(bullet.attributes.x, bullet.attributes.y, bullet.attributes.size, Math.PI * 2, false);
            //
            // ctx.fill();

        }

    }

    /**
     * Update moving values
     */

    function update() {

        for(var i = 0; i < bulletCount; i++) {

            var bullet = bullets[i];

            bullet.attributes.x += bullet.attributes.vx;
            bullet.attributes.y += bullet.attributes.vy;

            if(bullet.attributes.x < -50 || bullet.attributes.x > width + 50 || bullet.attributes.y < -50 || bullet.attributes.y > height + 50) {

                bullet.attributes.isAlive = false;

            }

        }

    }

    /**
     * Remove Bullets
     */

    function remove() {

        for(var i = bulletCount; i >  0; i--) {

            if(!bullets[i-1].attributes.isAlive) {

                bullets.splice(i-1, 1);
                bulletCount--;

            }

        }

    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    function each(callback) {

        for(var i = 0; i < bulletCount; i++) {

            callback(bullets[i], i);

        }

    }

    return {
        create: create,
        draw: draw,
        update: update,
        resize: resize,
        remove: remove,
        each: each
    }


}
