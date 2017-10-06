/**
 * Particles
 */

var Particle = require('./Particle');

module.exports = function(ctx) {

    var width;
    var height;

    var particleCount = 100;
    var particles = [];

    for (var i = 0; i < particleCount; i++ ) {

        var particle = new Particle();

        particles.push(particle);

    }

    /**
     * Draw Particle
     */

    function draw() {

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);

        for (var j = 0; j < particleCount; j++ ) {

            var particle = particles[j];

            ctx.beginPath();

            ctx.fillStyle = particle.attributes.color;
            ctx.arc(particle.attributes.x, particle.attributes.y, particle.attributes.size, Math.PI * 2, false);

            ctx.fill();

        }

    }

    /**
     * Update moving values
     */

    function update() {

        for(var i = 0; i < particleCount; i++) {

            var particle = particles[i];

            particle.attributes.x += particle.attributes.vx * particle.attributes.speed / 10;
            particle.attributes.y += particle.attributes.vy * particle.attributes.speed / 10;

            if(particle.attributes.x < -50) {

                particle.attributes.x = width + 50;

            } else if (particle.attributes.x > width + 50) {

                particle.attributes.x = -50;

            }

            if(particle.attributes.y < -50) {

                particle.attributes.y = height + 50;

            } else if(particle.attributes.y > height + 50) {

                particle.attributes.y = -50;

            }

        }

    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    return {
        draw: draw,
        update: update,
        resize: resize
    }

}
