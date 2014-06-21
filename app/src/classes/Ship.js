/*** Ship.js ***/

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Circle  = require('famous/physics/bodies/Circle');

    var SurfaceParticle = require('classes/SurfaceParticle');

    /* a ship is a physics body */

    function Ship() {
        var options = {
            surface: new Surface({
                size: [30, 30],
                properties: {
                    background: '#272928',
                    borderRadius: '50%',
                    border: '2px solid #eee',
                    zIndex: 3
                }
            }),
            particle: new Circle({
                position: [
                    30,
                    window.innerHeight,
                    0
                ],
                velocity: [0.1, 0, 0]
            })
        };

        SurfaceParticle.call(this, options);
    }     

    Ship.prototype = Object.create(SurfaceParticle.prototype);
    Ship.prototype.constructor = Ship;

    module.exports = Ship;
});