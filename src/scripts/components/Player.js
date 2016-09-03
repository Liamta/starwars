
/**
 * Player
 */

 var Helpers = require('../utils/Helpers');

module.exports = function(ctx, faction, controlSchema, fireCallback, getTargetCallback) {

    var faction = faction || {};
    var stageWidth, stageHeight;

    var attributes = {

        playerName: faction.playerName,

        health: 10,
        healthMax: 10,

        score: 0,

        lives: 1,

        isAlive: true,
        isHit: false,
        isAI: controlSchema === null,

        faction: faction.name,
        factionColor: faction.color,

        size: 0,

        width: 20,
        height: 19,

        x: window.innerWidth * .5,
        y: window.innerHeight * .5,

        vx: 0,
        vy: 0,

        speed: 0,
        speedMax: 5,
        thrust: 0.2,

        weaponDamage: 1,

        rotationSpeed: 0,
        rotationSpeedMax: 0.04,
        rotationThrust: 0.002,
        currentAngle: 0,

        weaponCoolDown: 0,
        maxCoolDown: 30,

        respawnTimer: 0

    };

    if (faction === 'imperial') {

        attributes.health = 10;
        attributes.rotationThrust = 0.002;
        attributes.weaponDamage = 2;

    } else {

        attributes.health = 15;
        attributes.weaponDamage = 2.5;

    }

    attributes.widthHalf = attributes.width / 2;
    attributes.heightHalf = attributes.height / 2;

    attributes.size = Math.max(attributes.widthHalf, attributes.heightHalf);

    // Player's interaction

    var interaction = {

        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false

    };

    // Assigning

    var image = new Image();

    if(faction.name === 'imperial') {

        image.src = '../img/imperial/tie_fighter_small.png';

    } else if (faction.name === 'rebel') {

        image.src = '../img/rebel/x_wing_small.png';

    } else {

        image.src = '../img/x_wing.png';

    }

    if (attributes.isAI) {

        attributes.target = null;

    } else {

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        function onKeyDown(event) {

            switch (event.keyCode) {

                case controlSchema.up:
                    interaction.up = true;
                    break;
                case controlSchema.down:
                    interaction.down = true;
                    break;
                case controlSchema.left:
                    interaction.left = true;
                    break;
                case controlSchema.right:
                    interaction.right = true;
                    break;
                case controlSchema.shoot:
                    interaction.shoot = true;
                    break;
            }

        }

        function onKeyUp(event) {

            switch (event.keyCode) {

                case controlSchema.up:
                    interaction.up = false;
                    break;
                case controlSchema.down:
                    interaction.down = false;
                    break;
                case controlSchema.left:
                    interaction.left = false;
                    break;
                case controlSchema.right:
                    interaction.right = false;
                    break;
                case controlSchema.shoot:
                    interaction.shoot = false;
            }
        }

    }

    function shoot() {

        return [attributes.x, attributes.y];

    }

    function killed() {

        attributes.isAlive = false;
        attributes.lives--;
        attributes.respawnTimer = 60 * 5;

    }

    function respawn() {

        attributes.isAlive = true;
        attributes.health = attributes.healthMax;
        attributes.y = Math.random() * stageHeight;

        if(attributes.faction === 'imperial') {

            attributes.x = Math.random() * stageWidth * .25;
            attributes.currentAngle = 0;

        } else {

            attributes.x = stageWidth * .75 + Math.random() * stageWidth * .25;
            attributes.currentAngle = Math.PI;

        }

        if(attributes.lives && attributes.lives <= 0) {

            attributes.isAlive = false;

        }

    }

    function draw() {

        if(attributes.isAlive) {

            ctx.translate(attributes.x, attributes.y);
            ctx.rotate(attributes.currentAngle);
            ctx.drawImage(image, -attributes.widthHalf, -attributes.heightHalf, attributes.width, attributes.height);
            ctx.rotate(-attributes.currentAngle);
            ctx.translate(-attributes.x, -attributes.y);

            if(!attributes.isAI) {

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.arc(attributes.x,  attributes.y,  attributes.size * 1.5, 0, Math.PI*2);
                ctx.stroke();

            }

            if (attributes.isHit) {

                ctx.strokeStyle = 'rgba(' + attributes.factionColor + ', 0.5)';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.arc(attributes.x,  attributes.y,  attributes.size * 1.5, 0, Math.PI*2);
                ctx.stroke();

                ctx.fillStyle = 'rgba(' + attributes.factionColor + ', 0.25)';
                ctx.fill();

                attributes.isHit = false;

            }

        }

    }

    function update() {

        if(attributes.isAlive) {

            if (attributes.isAI) {
                updateAI();
            }

            // Interaction

            if(interaction.left && attributes.rotationSpeed > -attributes.rotationSpeedMax) {

                attributes.rotationSpeed -= attributes.rotationThrust;

            }

            if(interaction.right && attributes.rotationSpeed < attributes.rotationSpeedMax) {

                attributes.rotationSpeed += attributes.rotationThrust;

            }

            if(!interaction.left && !interaction.right) {
                attributes.rotationSpeed *= .5;
            }

            attributes.speed *= .95;

            if(interaction.up && attributes.speed < attributes.speedMax) {

                attributes.speed += attributes.thrust;

            }

            if(interaction.down && attributes.speed > 0) {

                attributes.speed -= attributes.thrust*.1;

            }

            if(interaction.shoot && attributes.weaponCoolDown <= 0) {
                fireCallback(attributes);
                attributes.weaponCoolDown = attributes.maxCoolDown;
            }

            attributes.weaponCoolDown--;

            // Attributes

            attributes.currentAngle += attributes.rotationSpeed;

            if (attributes.currentAngle > Math.PI*2) {
                attributes.currentAngle -= Math.PI*2;
            }

            attributes.x += Math.cos(attributes.currentAngle) * attributes.speed;
            attributes.y += Math.sin(attributes.currentAngle) * attributes.speed;

            var widthAdjusted = attributes.width * 1.25;
            var heightAdjusted = attributes.height * 1.25;

            if(attributes.x < -widthAdjusted) {

                attributes.x = stageWidth + widthAdjusted;

            } else if (attributes.x > stageWidth + widthAdjusted) {

                attributes.x = -widthAdjusted;

            }

            if(attributes.y < -heightAdjusted) {

                attributes.y = stageHeight + heightAdjusted;

            } else if(attributes.y > stageHeight + heightAdjusted) {

                attributes.y = -heightAdjusted;

            }

        } else {

            attributes.respawnTimer--;

            if(attributes.respawnTimer <= 0) {

                respawn();

            }

        }

    }

    function updateAI() {

        interaction.shoot = interaction.left = interaction.right = false;

        if (attributes.target && attributes.target.attributes.isAlive && Math.random() > .01) {

            var distance = Helpers.distanceBetween(attributes, attributes.target.attributes);

            interaction.up = true;

            var angleToTarget = Math.atan2( attributes.target.attributes.y - attributes.y, attributes.target.attributes.x - attributes.x);
            var diff = attributes.currentAngle - angleToTarget;
            if (diff > Math.PI) {
                diff = -(Math.PI*2 - diff);
            }

            var deadZone = Math.PI * .01;

            if (diff > deadZone) {
                interaction.left = true;
            } else if(diff < -deadZone) {
                interaction.right = true;
            } else {
                interaction.shoot = true;
            }

        } else {

            // Select target
            attributes.target = getTargetCallback(api);

        }

    }

    function resize() {
        stageWidth = window.innerWidth;
        stageHeight = window.innerHeight;
    }

    var api = {
        attributes: attributes,
        draw: draw,
        update: update,
        resize: resize,
        killed: killed,
        respawn: respawn
    }

    return api;

}
