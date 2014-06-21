/*** Planet.js ***/

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Circle  = require('famous/physics/bodies/Circle');

    var SurfaceParticle = require('classes/SurfaceParticle');

    /* a planet is a physics body */

    function Planet() {
        var options = {
            surface: new Surface({
                size: [100, 100],
                properties: {
                    // background: '#' + Math.floor(Math.random()*16777215).toString(16),
                    background: '#ED553B',
                    borderRadius: '50%',
                    border: '2px solid #222'
                }
            }),
            particle: new Circle({
                position: [
                    Math.random() * window.innerWidth / 2 + 200,
                    Math.random() * window.innerHeight / 2.5,
                    0
                ],
                velocity: [0, 0.2, 0]
            })
        };

        SurfaceParticle.call(this, options);
    }

    Planet.prototype = Object.create(SurfaceParticle.prototype);
    Planet.prototype.constructor = Planet;

    module.exports = Planet;
});