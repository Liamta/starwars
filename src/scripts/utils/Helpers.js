/**
 * Helpers
 */

module.exports = {

    attributes: function(el, attrs) {

        for(var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }

    },

    distanceBetween: function(bodyA, bodyB) {

        var diffX = bodyA.x - bodyB.x;
        var diffY = bodyA.y - bodyB.y;

        return Math.sqrt(diffX * diffX + diffY * diffY);

    }
    
}
