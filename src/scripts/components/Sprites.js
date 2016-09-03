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
