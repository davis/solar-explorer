/*** Star.js ***/

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Circle  = require('famous/physics/bodies/Circle');

    var DraggableSurfaceParticle = require('classes/DraggableSurfaceParticle');

    /*  a star has:
     *  - a .particle which is the physics body
     *  - a .surface which is the renderable
     *  - a bunch of syncs and listeners for dragging
     */ 

    function Star() {
        var options = {
            surface: new Surface({
                size: [20, 20],
                properties: {
                    background: '#F2B134',
                    borderRadius: '50%',
                    border: '2px solid #222',
                    zIndex: 1
                }
            }),
            particle: new Circle({
                position: [
                    window.innerWidth / 2,
                    window.innerHeight / 2.5,
                    0
                ]
            }),
            throwable: false
        };

        DraggableSurfaceParticle.call(this, options);
    }

    Star.prototype = Object.create(DraggableSurfaceParticle.prototype);
    Star.prototype.constructor = Star;

    module.exports = Star;
});  