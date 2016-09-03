/**
 * Bullet Component
 */

module.exports = function(x, y, rotation, owner) {

    var attributes = {

        owner: owner,

        isAlive: true,

        damage: 1,

        size: 2,
        velocity: 15,
        color: owner.faction === 'rebel' ? 'rgba(255, 69, 0, 0.8)' : 'rgba(0, 204, 0, 0.8)',

        x: x,
        y: y,

        vx: 0,
        vy: 0

    };

    attributes.vx = Math.cos(rotation) * attributes.velocity;
    attributes.vy = Math.sin(rotation) * attributes.velocity;

    return {
        attributes: attributes
    }

}
