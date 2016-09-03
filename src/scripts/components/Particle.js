/**
 * Particle Component
 */

module.exports = function() {

    var attributes = {

        size: Math.random(),
        speed: Math.random() / 5,
        color: 'rgba(255, 255, 255,' + Math.random() + ')',

        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        vx: Math.random() * 20 - 10,
        vy: Math.random() * 20 - 10

    };

    return {
        attributes: attributes
    }

}
