/**
 * App
 */

// Prototype functions

Array.prototype.each = function(callback) {

    for(var i = 0; i < this.length; i++) {

        if(callback(this[i], i)) { break; }

    }

};

// Components
var Stage = require('./components/Stage')();

// App
var container = document.getElementById('container');
container.appendChild(Stage.canvas);

window.addEventListener('resize', Stage.resize);
