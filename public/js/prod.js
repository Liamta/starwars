(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function (global){
!function(){"use strict";function e(e){return h.test(e)||u.test(e)?e+"th":a.test(e)?e.replace(a,"ieth"):d.test(e)?e.replace(d,t):e}function t(e,t){return v[t]}function n(e){var t=parseInt(e,10);if(!s(t))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");var n=String(t),r=n.charAt(n.length-1);return n+("1"===r?"st":"2"===r?"nd":"3"===r?"rd":"th")}function r(t,n){var r,i=parseInt(t,10);if(!s(i))throw new TypeError("Not a finite number: "+t+" ("+typeof t+")");return r=o(i),n?e(r):r}function o(e){var t,n,r=arguments[1];return 0===e?r?r.join(" ").replace(/,$/,""):"zero":(r||(r=[]),0>e&&(r.push("minus"),e=Math.abs(e)),20>e?(t=0,n=M[e]):y>e?(t=e%p,n=z[Math.floor(e/p)],t&&(n+="-"+M[t],t=0)):b>e?(t=e%y,n=o(Math.floor(e/y))+" hundred"):c>e?(t=e%b,n=o(Math.floor(e/b))+" thousand,"):g>e?(t=e%c,n=o(Math.floor(e/c))+" million,"):m>e?(t=e%g,n=o(Math.floor(e/g))+" billion,"):w>e?(t=e%m,n=o(Math.floor(e/m))+" trillion,"):x>=e&&(t=e%w,n=o(Math.floor(e/w))+" quadrillion,"),r.push(n),o(t,r))}function i(t){var n=r(t);return e(n)}var f="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this,l=s,s=Number.isFinite||function(e){return"number"==typeof e&&l(e)},h=/(hundred|thousand|(m|b|tr|quadr)illion)$/,u=/teen$/,a=/y$/,d=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,v={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"},p=10,y=100,b=1e3,c=1e6,g=1e9,m=1e12,w=1e15,x=9007199254740992,M=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],z=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],$={toOrdinal:n,toWords:r,toWordsOrdinal:i};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=$),exports.numberToWords=$):f.numberToWords=$}();
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(global, fn)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":4}],4:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require("oMfpAn"))
},{"oMfpAn":1}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){

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

},{"../utils/AudioManager":16,"./Bullet":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
/**
 * Particles
 */

var Particle = require('./Particle');

module.exports = function(ctx) {

    var width;
    var height;

    var particleCount = 750;
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

},{"./Particle":8}],10:[function(require,module,exports){

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

    }

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

},{"../utils/Helpers":17}],11:[function(require,module,exports){
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

},{"./Player":10,"number-to-words":2}],12:[function(require,module,exports){
/**
 * Spritsheet Generator
 */

var Animation = require('./Animation');

module.exports = function(ctx, definitions) {


    var definitions = definitions || [];
    var definitionsMap = {};

    var previousTime = 0;

    definitions.each(function(definition, index) {

        definitionsMap[definition.id] = definition;

        var image = new Image();

        image.addEventListener('load', function() {

            definition.width = image.width;
            definition.height = image.height;
            definition.colCount = definition.width / definition.size;
            definition.rowCount = definition.height / definition.size;
            definition.loaded = true;
            definition.framesTotal = (definition.width * definition.height) / (definition.size * definition.size);
            definition.duration = definition.framesTotal / definition.framerate * 1000;

            console.log(definition);

        });

        image.addEventListener('error', function(error) {

            console.warn('Can\'t find image source!', error.path[0]);

        });

        image.src = definition.src;
        definition.image = image;
        definition.width = null;
        definition.height = null;
        definition.loaded = false;
        definition.framePerUpdate = definition.framerate / 60;

        definition.pool = [];

        for(var i = 0; i < definition.count; i++) {

            definition.pool.push(new Animation(definition));

        }

    });

    function requestAnimation(id, x, y) {

        var definition = definitionsMap[id];

        if(definition === undefined) {
            console.warn('sprite.requestAnimation(No such definition!)', id);
        } else {

            var animation = false;

            definition.pool.each(function(item, index) {

                if(!item.inUse) {

                    animation = item;

                    return true;

                }

            });

            if(animation) {

                animation.inUse = true;
                animation.x = x;
                animation.y = y;
                animation.play(0);

            }

        }

    }

    function draw() {

        definitions.each(function(definition, index) {

            var frameRect = {
                x: 0,
                y: 0,
                width: definition.size,
                height: definition.size
            };

            var destRect = {
                x: 0,
                y: 0,
                width: definition.sizeDest,
                height: definition.sizeDest
            };

            definition.pool.each(function(animation) {

                if(animation.inUse) {

                    var clipRect;

                    var frame = Math.floor(animation.time / 1000 * animation.definition.framerate);

                    frameRect.x = (frame % animation.definition.colCount) * animation.definition.size;
                    frameRect.y = Math.floor(frame / animation.definition.colCount) * animation.definition.size;

                    destRect.x = animation.x - definition.sizeDest * 0.5;
                    destRect.y = animation.y - definition.sizeDest * 0.5;

                    ctx.drawImage(definition.image, frameRect.x, frameRect.y, frameRect.width, frameRect.height, destRect.x, destRect.y, destRect.width, destRect.height);

                }

            });

        });

    }

    function update(time) {

        var deltaTime = time - previousTime;

        previousTime = time;

        definitions.each(function(definition, index) {

            definition.pool.each(function(animation) {

                if(animation.inUse) {

                    animation.time += deltaTime;

                    if(animation.time >= animation.definition.duration)  {

                        animation.inUse = false;

                    }

                }

            });

        });

    }

    return {
        requestAnimation: requestAnimation,
        draw: draw,
        update: update
    };

};

},{"./Animation":5}],13:[function(require,module,exports){
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

},{"../utils/Helpers":17,"./Bullets":7,"./Particles":9,"./Players":11,"./Sprites":12,"raf":3}],14:[function(require,module,exports){
module.exports={
  "imperialLaser": {
    "src": "../audio/imperial/laser.wav",
    "id": "imperial"
},
  "rebelLaser": {
    "src": "../audio/imperial/laser.wav",
    "id": "rebel"
  }
}

},{}],15:[function(require,module,exports){
/**
 * App
 */

// Prototype functions

Array.prototype.each = function(callback) {

    for(var i = 0; i < this.length; i++) {

        if(callback(this[i], i)) {

            break;

        }

    }

}

// Components

var Stage = require('./components/Stage')();

// App

var container = document.getElementById('container');
container.appendChild(Stage.canvas);

window.addEventListener('resize', Stage.resize);

},{"./components/Stage":13}],16:[function(require,module,exports){
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

},{"../data/sounds.json":14}],17:[function(require,module,exports){
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

},{}]},{},[15])